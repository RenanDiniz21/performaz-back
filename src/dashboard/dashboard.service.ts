import { Inject, Injectable } from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";

@Injectable()
export class DashboardService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async getKPIs() {
		const [vendors, orders, goals] = await Promise.all([
			this.db.select().from(schema.vendors),
			this.db.select().from(schema.orders),
			this.db.select().from(schema.goals),
		]);

		const activeVendors = vendors.filter((v) => v.status === "ativo").length;
		const confirmedOrders = orders.filter((o) => o.status === "confirmado");
		const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
		const totalSales = confirmedOrders.length;
		const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

		const goalsWithProgress = goals.map((g) => g.current / g.target);
		const goalAchievement =
			goalsWithProgress.length > 0
				? (goalsWithProgress.reduce((a, b) => a + b, 0) /
						goalsWithProgress.length) *
					100
				: 0;

		// Get top vendors for ranking
		const topVendors = vendors
			.sort((a, b) => b.totalRevenue - a.totalRevenue)
			.slice(0, 5)
			.map((v) => ({
				id: v.id,
				name: v.name,
				revenue: v.totalRevenue,
				xp: v.xp,
				level: v.level,
			}));

		return {
			totalRevenue,
			totalSales,
			activeVendors,
			avgTicket,
			goalAchievement: Math.round(goalAchievement * 10) / 10,
			topVendors,
		};
	}

	async getDailyRevenue(days = 10) {
		const orders = await this.db
			.select()
			.from(schema.orders)
			.where(eq(schema.orders.status, "confirmado"));

		const revenueByDay: Record<string, { revenue: number; sales: number }> = {};
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const key = d.toISOString().split("T")[0];
			revenueByDay[key] = { revenue: 0, sales: 0 };
		}

		for (const order of orders) {
			const key = order.createdAt.toISOString().split("T")[0];
			if (key in revenueByDay) {
				revenueByDay[key].revenue += order.total;
				revenueByDay[key].sales += 1;
			}
		}

		return Object.entries(revenueByDay).map(([date, data]) => ({
			date,
			...data,
		}));
	}
}
