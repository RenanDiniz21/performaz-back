import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import type { CreateOrderDto } from "./dto/order.dto";

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

		const [order] = await this.db
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

		const items = await this.db
			.insert(schema.orderItems)
			.values(itemsToInsert)
			.returning();

		// Update client stats
		await this.db
			.update(schema.clients)
			.set({
				totalOrders: schema.clients.totalOrders,
				lastOrderDate: new Date(),
			})
			.where(eq(schema.clients.id, dto.clientId));

		return { ...order, items };
	}

	async updateStatus(
		id: string,
		status: "pendente" | "confirmado" | "cancelado",
	) {
		await this.findOne(id);
		const [order] = await this.db
			.update(schema.orders)
			.set({ status, updatedAt: new Date() })
			.where(eq(schema.orders.id, id))
			.returning();
		return order;
	}
}
