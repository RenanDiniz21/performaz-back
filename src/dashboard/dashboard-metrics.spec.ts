import { buildDashboardKpis } from "./dashboard-metrics";

describe("buildDashboardKpis", () => {
	it("counts pending and confirmed orders as reportable sales", () => {
		const result = buildDashboardKpis({
			vendors: [
				{
					id: "v1",
					name: "Carlos",
					status: "ativo",
					totalRevenue: 500,
					xp: 100,
					level: 2,
				},
				{
					id: "v2",
					name: "Ana",
					status: "inativo",
					totalRevenue: 900,
					xp: 200,
					level: 3,
				},
			],
			orders: [
				{ total: 100, status: "pendente" },
				{ total: 200, status: "confirmado" },
				{ total: 300, status: "cancelado" },
			],
			goals: [{ current: 5, target: 10 }],
		});

		expect(result.totalRevenue).toBe(300);
		expect(result.totalSales).toBe(2);
		expect(result.avgTicket).toBe(150);
		expect(result.activeVendors).toBe(1);
		expect(result.goalAchievement).toBe(50);
	});
});
