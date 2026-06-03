import { isReportableOrderStatus } from "../orders/order-stats";

type DashboardVendor = {
	id: string;
	name: string;
	status: string;
	totalRevenue: number;
	xp: number;
	level: number;
};

type DashboardOrder = {
	total: number;
	status: "pendente" | "confirmado" | "cancelado";
};

type DashboardGoal = {
	current: number;
	target: number;
};

type BuildDashboardKpisInput = {
	vendors: DashboardVendor[];
	orders: DashboardOrder[];
	goals: DashboardGoal[];
};

export function buildDashboardKpis({
	vendors,
	orders,
	goals,
}: BuildDashboardKpisInput) {
	const activeVendors = vendors.filter((v) => v.status === "ativo").length;
	const reportableOrders = orders.filter((o) =>
		isReportableOrderStatus(o.status),
	);
	const totalRevenue = reportableOrders.reduce((sum, o) => sum + o.total, 0);
	const totalSales = reportableOrders.length;
	const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

	const goalsWithProgress = goals.map((g) => g.current / g.target);
	const goalAchievement =
		goalsWithProgress.length > 0
			? (goalsWithProgress.reduce((a, b) => a + b, 0) /
					goalsWithProgress.length) *
				100
			: 0;

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
