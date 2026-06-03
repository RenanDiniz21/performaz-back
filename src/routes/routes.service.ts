import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import { applyXpAward } from "../gamification/xp";
import type {
	CheckInDto,
	CreateRouteDto,
	VisitNoSaleDto,
} from "./dto/route.dto";
import { applyRouteClientVisitProgress } from "./route-progress";

const XP_CHECKIN = 10;
const XP_SALE = 50;

@Injectable()
export class RoutesService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async findAll(vendorId?: string, date?: string) {
		const rows = await this.db.select().from(schema.routes);
		return rows.filter(
			(r) =>
				(!vendorId || r.vendorId === vendorId) &&
				(!date || r.date.toISOString().startsWith(date)),
		);
	}

	async findOne(id: string) {
		const [route] = await this.db
			.select()
			.from(schema.routes)
			.where(eq(schema.routes.id, id));
		if (!route) throw new NotFoundException("Rota não encontrada");
		const clients = await this.db
			.select()
			.from(schema.routeClients)
			.where(eq(schema.routeClients.routeId, id));
		return { ...route, clients };
	}

	async create(dto: CreateRouteDto) {
		const [route] = await this.db
			.insert(schema.routes)
			.values({
				vendorId: dto.vendorId,
				date: new Date(dto.date),
				totalClients: dto.clients.length,
			})
			.returning();

		const clientRows = dto.clients.map((c) => ({
			routeId: route.id,
			clientId: c.clientId,
			order: c.order,
		}));
		const clients = await this.db
			.insert(schema.routeClients)
			.values(clientRows)
			.returning();

		return { ...route, clients };
	}

	async checkIn(routeId: string, dto: CheckInDto) {
		const [routeClient] = await this.db
			.select()
			.from(schema.routeClients)
			.where(
				and(
					eq(schema.routeClients.routeId, routeId),
					eq(schema.routeClients.clientId, dto.clientId),
				),
			);
		if (!routeClient)
			throw new NotFoundException("Cliente não encontrado na rota");

		// Update route client status
		await this.db
			.update(schema.routeClients)
			.set({ status: "visitado", checkInTime: new Date() })
			.where(eq(schema.routeClients.id, routeClient.id));

		// Record check-in
		await this.db.insert(schema.checkIns).values({
			vendorId: (await this.findOne(routeId)).vendorId,
			clientId: dto.clientId,
			lat: dto.lat,
			lng: dto.lng,
			photoUrl: dto.photoUrl,
			notes: dto.notes,
		});

		// Award XP
		const route = await this.db
			.select()
			.from(schema.routes)
			.where(eq(schema.routes.id, routeId));
		const vendorId = route[0].vendorId;
		await this.awardXp(
			vendorId,
			XP_CHECKIN,
			"checkin",
			`Check-in: ${dto.clientId}`,
		);

		// Update route visited count
		const visited = await this.db
			.select()
			.from(schema.routeClients)
			.where(and(eq(schema.routeClients.routeId, routeId)));
		const visitedCount = visited.filter((c) => c.status !== "pendente").length;
		await this.db
			.update(schema.routes)
			.set({ visitedClients: visitedCount, updatedAt: new Date() })
			.where(eq(schema.routes.id, routeId));

		return { success: true, xpEarned: XP_CHECKIN };
	}

	async registerNoSale(routeId: string, dto: VisitNoSaleDto) {
		await this.db.transaction(async (tx) => {
			const [routeClient] = await tx
				.select()
				.from(schema.routeClients)
				.where(
					and(
						eq(schema.routeClients.routeId, routeId),
						eq(schema.routeClients.clientId, dto.clientId),
					),
				);
			if (!routeClient)
				throw new NotFoundException("Cliente não encontrado na rota");

			const [route] = await tx
				.select({
					visitedClients: schema.routes.visitedClients,
					salesMade: schema.routes.salesMade,
				})
				.from(schema.routes)
				.where(eq(schema.routes.id, routeId));
			if (!route) throw new NotFoundException("Rota nao encontrada");

			const progress = applyRouteClientVisitProgress({
				currentStatus: routeClient.status,
				targetStatus: "sem_venda",
				visitedClients: route.visitedClients,
				salesMade: route.salesMade,
			});

			await tx
				.update(schema.routeClients)
				.set({
					status: progress.status,
					visitReason: dto.visitReason,
					checkInTime: new Date(),
				})
				.where(eq(schema.routeClients.id, routeClient.id));

			if (progress.changed) {
				await tx
					.update(schema.routes)
					.set({
						visitedClients: progress.visitedClients,
						salesMade: progress.salesMade,
						updatedAt: new Date(),
					})
					.where(eq(schema.routes.id, routeId));
			}
		});

		return { success: true };
	}

	async updateClientOrder(
		routeId: string,
		clients: { clientId: string; order: number }[],
	) {
		await this.findOne(routeId);
		for (const { clientId, order } of clients) {
			await this.db
				.update(schema.routeClients)
				.set({ order })
				.where(
					and(
						eq(schema.routeClients.routeId, routeId),
						eq(schema.routeClients.clientId, clientId),
					),
				);
		}
		return this.findOne(routeId);
	}

	private async awardXp(
		vendorId: string,
		xp: number,
		type: "checkin" | "venda" | "meta_atingida" | "conquista",
		description: string,
	) {
		const [vendor] = await this.db
			.select({ xp: schema.vendors.xp })
			.from(schema.vendors)
			.where(eq(schema.vendors.id, vendorId));

		const xpUpdate = applyXpAward({
			currentXp: vendor?.xp ?? 0,
			earnedXp: xp,
		});

		await Promise.all([
			this.db
				.update(schema.vendors)
				.set(xpUpdate)
				.where(eq(schema.vendors.id, vendorId)),
			this.db
				.insert(schema.xpActivities)
				.values({ vendorId, type, description, xpEarned: xp }),
		]);
	}
}
