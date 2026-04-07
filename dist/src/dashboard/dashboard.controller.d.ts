import type { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    kpis(): Promise<{
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
    revenue(days?: string): Promise<{
        revenue: number;
        sales: number;
        date: string;
    }[]>;
}
