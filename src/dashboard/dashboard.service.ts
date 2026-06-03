import { Inject, Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../db/db.module";
import * as schema from "../db/schema";
import { isReportableOrderStatus } from "../orders/order-stats";
import { buildDashboardKpis } from "./dashboard-metrics";

@Injectable()
export class DashboardService {
	constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

	async getKPIs() {
		const [vendors, orders, goals] = await Promise.all([
			this.db.select().from(schema.vendors),
			this.db.select().from(schema.orders),
			this.db.select().from(schema.goals),
		]);

		return buildDashboardKpis({ vendors, orders, goals });
	}

	async getDailyRevenue(days = 10) {
		const orders = await this.db
			.select()
			.from(schema.orders)
			.where(sql`${schema.orders.status} != 'cancelado'`);

		const revenueByDay: Record<string, { revenue: number; sales: number }> = {};
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const key = d.toISOString().split("T")[0];
			revenueByDay[key] = { revenue: 0, sales: 0 };
		}

		for (const order of orders) {
			if (!isReportableOrderStatus(order.status)) continue;
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
