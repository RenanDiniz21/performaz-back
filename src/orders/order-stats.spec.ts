import { applyOrderStats, applyOrderStatusTransition } from "./order-stats";

describe("applyOrderStats", () => {
	it("increments client and vendor totals and awards sale XP", () => {
		const result = applyOrderStats({
			orderTotal: 1250.5,
			client: { totalOrders: 2, totalRevenue: 3000 },
			vendor: { totalSales: 4, totalRevenue: 10000, xp: 2450 },
		});

		expect(result).toEqual({
			client: { totalOrders: 3, totalRevenue: 4250.5 },
			vendor: { totalSales: 5, totalRevenue: 11250.5, xp: 2500 },
			xpEarned: 50,
		});
	});
});

describe("applyOrderStatusTransition", () => {
	const currentStats = {
		client: { totalOrders: 3, totalRevenue: 4250.5 },
		vendor: { totalSales: 5, totalRevenue: 11250.5, xp: 2500 },
	};

	it("subtracts totals and sale XP when an order is canceled", () => {
		const result = applyOrderStatusTransition({
			orderTotal: 1250.5,
			fromStatus: "pendente",
			toStatus: "cancelado",
			...currentStats,
		});

		expect(result).toEqual({
			client: { totalOrders: 2, totalRevenue: 3000 },
			vendor: { totalSales: 4, totalRevenue: 10000, xp: 2450 },
			xpEarned: -50,
			changed: true,
		});
	});

	it("does not double-count when a pending order is confirmed", () => {
		const result = applyOrderStatusTransition({
			orderTotal: 1250.5,
			fromStatus: "pendente",
			toStatus: "confirmado",
			...currentStats,
		});

		expect(result).toEqual({
			...currentStats,
			xpEarned: 0,
			changed: false,
		});
	});

	it("restores totals and sale XP when a canceled order becomes reportable", () => {
		const result = applyOrderStatusTransition({
			orderTotal: 1250.5,
			fromStatus: "cancelado",
			toStatus: "confirmado",
			client: { totalOrders: 2, totalRevenue: 3000 },
			vendor: { totalSales: 4, totalRevenue: 10000, xp: 2450 },
		});

		expect(result).toEqual({
			client: { totalOrders: 3, totalRevenue: 4250.5 },
			vendor: { totalSales: 5, totalRevenue: 11250.5, xp: 2500 },
			xpEarned: 50,
			changed: true,
		});
	});
});
