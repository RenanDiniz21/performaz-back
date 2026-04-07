import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";

@Injectable()
export class GamificationService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async getLeaderboard(
		metric: "xp" | "revenue" = "xp",
		period: "diario" | "semanal" | "mensal" = "mensal",
	) {
		const vendors = await this.db
			.select({
				id: schema.vendors.id,
				name: schema.vendors.name,
				avatar: schema.vendors.avatar,
				region: schema.vendors.region,
				xp: schema.vendors.xp,
				level: schema.vendors.level,
				totalRevenue: schema.vendors.totalRevenue,
				totalSales: schema.vendors.totalSales,
			})
			.from(schema.vendors)
			.where(eq(schema.vendors.status, "ativo"));

		return vendors.sort((a, b) =>
			metric === "xp" ? b.xp - a.xp : b.totalRevenue - a.totalRevenue,
		);
	}

	async getVendorStats(vendorId: string) {
		const [vendor] = await this.db
			.select()
			.from(schema.vendors)
			.where(eq(schema.vendors.id, vendorId));

		const achievements = await this.db
			.select({
				achievement: schema.achievements,
				unlockedAt: schema.vendorAchievements.unlockedAt,
			})
			.from(schema.vendorAchievements)
			.innerJoin(
				schema.achievements,
				eq(schema.vendorAchievements.achievementId, schema.achievements.id),
			)
			.where(eq(schema.vendorAchievements.vendorId, vendorId));

		const xpHistory = await this.db
			.select()
			.from(schema.xpActivities)
			.where(eq(schema.xpActivities.vendorId, vendorId))
			.orderBy(desc(schema.xpActivities.createdAt))
			.limit(50);

		return {
			vendor,
			achievements: achievements.map((a) => ({
				...a.achievement,
				unlockedAt: a.unlockedAt,
			})),
			xpHistory,
		};
	}

	async getAllAchievements() {
		return this.db.select().from(schema.achievements);
	}

	async updateVendorLocation(vendorId: string, lat: number, lng: number) {
		const existing = await this.db
			.select()
			.from(schema.vendorLocations)
			.where(eq(schema.vendorLocations.vendorId, vendorId));

		if (existing.length) {
			await this.db
				.update(schema.vendorLocations)
				.set({ lat, lng, updatedAt: new Date() })
				.where(eq(schema.vendorLocations.vendorId, vendorId));
		} else {
			await this.db
				.insert(schema.vendorLocations)
				.values({ vendorId, lat, lng });
		}
		return { success: true };
	}

	async getAllVendorLocations() {
		return this.db
			.select({
				vendorId: schema.vendorLocations.vendorId,
				lat: schema.vendorLocations.lat,
				lng: schema.vendorLocations.lng,
				updatedAt: schema.vendorLocations.updatedAt,
				name: schema.vendors.name,
				avatar: schema.vendors.avatar,
				status: schema.vendors.status,
			})
			.from(schema.vendorLocations)
			.innerJoin(
				schema.vendors,
				eq(schema.vendorLocations.vendorId, schema.vendors.id),
			);
	}
}
