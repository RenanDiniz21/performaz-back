import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import { applyGoalProgress } from "../goals/goal-progress";
import type { CreateOrderDto } from "./dto/order.dto";
import { applyOrderRouteProgress } from "./order-route-progress";
import { applyOrderStats, applyOrderStatusTransition } from "./order-stats";

@Injectable()
export class OrdersService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll(vendorId?: string, clientId?: string) {
		const query = this.db.select().from(schema.orders);
		// Drizzle doesn't compose .where() dynamically cleanly, so filter post-query for now
		const results = await query;
		return results.filter(
			(o) =>
				(!vendorId || o.vendorId === vendorId) &&
				(!clientId || o.clientId === clientId),
		);
	}

	async findOne(id: string) {
		const [order] = await this.db
			.select()
			.from(schema.orders)
			.where(eq(schema.orders.id, id));
		if (!order) throw new NotFoundException("Pedido não encontrado");
		const items = await this.db
			.select()
			.from(schema.orderItems)
			.where(eq(schema.orderItems.orderId, id));
		return { ...order, items };
	}

	async create(dto: CreateOrderDto) {
		const total = dto.items.reduce(
			(sum, i) => sum + i.quantity * i.unitPrice,
			0,
		);

		return this.db.transaction(async (tx) => {
			const [client] = await tx
				.select({
					totalOrders: schema.clients.totalOrders,
					totalRevenue: schema.clients.totalRevenue,
				})
				.from(schema.clients)
				.where(eq(schema.clients.id, dto.clientId));

			if (!client) throw new NotFoundException("Cliente nao encontrado");

			const [vendor] = await tx
				.select({
					totalSales: schema.vendors.totalSales,
					totalRevenue: schema.vendors.totalRevenue,
					xp: schema.vendors.xp,
				})
				.from(schema.vendors)
				.where(eq(schema.vendors.id, dto.vendorId));

			if (!vendor) throw new NotFoundException("Vendedor nao encontrado");

			const [order] = await tx
				.insert(schema.orders)
				.values({
					vendorId: dto.vendorId,
					clientId: dto.clientId,
					notes: dto.notes,
					total,
				})
				.returning();

			const itemsToInsert = dto.items.map((i) => ({
				orderId: order.id,
				productId: i.productId,
				quantity: i.quantity,
				unitPrice: i.unitPrice,
				subtotal: i.quantity * i.unitPrice,
			}));

			const items = await tx
				.insert(schema.orderItems)
				.values(itemsToInsert)
				.returning();

			const stats = applyOrderStats({ orderTotal: total, client, vendor });
			const now = new Date();

			await tx
				.update(schema.clients)
				.set({
					totalOrders: stats.client.totalOrders,
					totalRevenue: stats.client.totalRevenue,
					lastOrderDate: now,
					status: "venda_realizada",
					updatedAt: now,
				})
				.where(eq(schema.clients.id, dto.clientId));

			await tx
				.update(schema.vendors)
				.set({
					totalSales: stats.vendor.totalSales,
					totalRevenue: stats.vendor.totalRevenue,
					xp: stats.vendor.xp,
					updatedAt: now,
				})
				.where(eq(schema.vendors.id, dto.vendorId));

			await this.updateOrderGoals(tx, {
				vendorId: dto.vendorId,
				orderDate: order.createdAt,
				orderTotal: total,
				multiplier: 1,
			});

			await this.updateRouteProgressForOrder(tx, {
				vendorId: dto.vendorId,
				clientId: dto.clientId,
				orderDate: order.createdAt,
				targetStatus: "venda_realizada",
			});

			await tx.insert(schema.xpActivities).values({
				type: "venda",
				description: `Venda: ${order.id}`,
				xpEarned: stats.xpEarned,
				vendorId: dto.vendorId,
			});

			return { ...order, items };
		});
	}

	async updateStatus(
		id: string,
		status: "pendente" | "confirmado" | "cancelado",
	) {
		return this.db.transaction(async (tx) => {
			const [existingOrder] = await tx
				.select()
				.from(schema.orders)
				.where(eq(schema.orders.id, id));

			if (!existingOrder) throw new NotFoundException("Pedido nao encontrado");

			const [client] = await tx
				.select({
					totalOrders: schema.clients.totalOrders,
					totalRevenue: schema.clients.totalRevenue,
				})
				.from(schema.clients)
				.where(eq(schema.clients.id, existingOrder.clientId));

			if (!client) throw new NotFoundException("Cliente nao encontrado");

			const [vendor] = await tx
				.select({
					totalSales: schema.vendors.totalSales,
					totalRevenue: schema.vendors.totalRevenue,
					xp: schema.vendors.xp,
				})
				.from(schema.vendors)
				.where(eq(schema.vendors.id, existingOrder.vendorId));

			if (!vendor) throw new NotFoundException("Vendedor nao encontrado");

			const transition = applyOrderStatusTransition({
				orderTotal: existingOrder.total,
				fromStatus: existingOrder.status,
				toStatus: status,
				client,
				vendor,
			});
			const now = new Date();

			const [order] = await tx
				.update(schema.orders)
				.set({ status, updatedAt: now })
				.where(eq(schema.orders.id, id))
				.returning();

			if (transition.changed) {
				await tx
					.update(schema.clients)
					.set({
						totalOrders: transition.client.totalOrders,
						totalRevenue: transition.client.totalRevenue,
						updatedAt: now,
					})
					.where(eq(schema.clients.id, existingOrder.clientId));

				await tx
					.update(schema.vendors)
					.set({
						totalSales: transition.vendor.totalSales,
						totalRevenue: transition.vendor.totalRevenue,
						xp: transition.vendor.xp,
						updatedAt: now,
					})
					.where(eq(schema.vendors.id, existingOrder.vendorId));

				await this.updateOrderGoals(tx, {
					vendorId: existingOrder.vendorId,
					orderDate: existingOrder.createdAt,
					orderTotal: existingOrder.total,
					multiplier: transition.xpEarned > 0 ? 1 : -1,
				});

				await this.updateRouteProgressForOrder(tx, {
					vendorId: existingOrder.vendorId,
					clientId: existingOrder.clientId,
					orderDate: existingOrder.createdAt,
					targetStatus:
						transition.xpEarned > 0 ? "venda_realizada" : "visitado",
				});

				await tx.insert(schema.xpActivities).values({
					type: "venda",
					description:
						transition.xpEarned > 0
							? `Reativacao de venda: ${order.id}`
							: `Cancelamento de venda: ${order.id}`,
					xpEarned: transition.xpEarned,
					vendorId: existingOrder.vendorId,
				});
			}

			return order;
		});
	}

	private async updateOrderGoals(
		db: any,
		{
			vendorId,
			orderDate,
			orderTotal,
			multiplier,
		}: {
			vendorId: string;
			orderDate: Date;
			orderTotal: number;
			multiplier: number;
		},
	) {
		const goals = await db
			.select()
			.from(schema.goals)
			.where(eq(schema.goals.vendorId, vendorId));

		const activeOrderGoals = goals.filter(
			(goal) =>
				(goal.type === "vendas" || goal.type === "receita") &&
				goal.startDate <= orderDate &&
				goal.endDate >= orderDate,
		);

		const now = new Date();
		for (const goal of activeOrderGoals) {
			await db
				.update(schema.goals)
				.set({
					current: applyGoalProgress({
						type: goal.type,
						current: goal.current,
						orderTotal,
						multiplier,
					}),
					updatedAt: now,
				})
				.where(eq(schema.goals.id, goal.id));
		}
	}

	private async updateRouteProgressForOrder(
		db: any,
		{
			vendorId,
			clientId,
			orderDate,
			targetStatus,
		}: {
			vendorId: string;
			clientId: string;
			orderDate: Date;
			targetStatus: "visitado" | "venda_realizada";
		},
	) {
		const routes = await db
			.select()
			.from(schema.routes)
			.where(eq(schema.routes.vendorId, vendorId));
		const route = routes.find((row: typeof schema.routes.$inferSelect) =>
			isSameRouteDate(row.date, orderDate),
		);

		if (!route) return;

		const routeClients = await db
			.select()
			.from(schema.routeClients)
			.where(eq(schema.routeClients.routeId, route.id));
		const routeClient = routeClients.find(
			(row: typeof schema.routeClients.$inferSelect) =>
				row.clientId === clientId,
		);

		if (!routeClient) return;

		const progress = applyOrderRouteProgress({
			currentStatus: routeClient.status,
			targetStatus,
			visitedClients: route.visitedClients,
			salesMade: route.salesMade,
		});

		if (!progress.changed) return;

		const now = new Date();
		await Promise.all([
			db
				.update(schema.routeClients)
				.set({ status: progress.status })
				.where(eq(schema.routeClients.id, routeClient.id)),
			db
				.update(schema.routes)
				.set({
					visitedClients: progress.visitedClients,
					salesMade: progress.salesMade,
					updatedAt: now,
				})
				.where(eq(schema.routes.id, route.id)),
		]);
	}
}

function isSameRouteDate(a: Date, b: Date) {
	return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}
