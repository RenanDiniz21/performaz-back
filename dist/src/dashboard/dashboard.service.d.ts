import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
export declare class DashboardService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    getKPIs(): Promise<{
        totalRevenue: number;
        totalSales: number;
        activeVendors: number;
        avgTicket: number;
        goalAchievement: number;
        topVendors: {
            id: string;
            name: string;
            revenue: number;
            xp: number;
            level: number;
        }[];
    }>;
    getDailyRevenue(days?: number): Promise<{
        revenue: number;
        sales: number;
        date: string;
    }[]>;
}
