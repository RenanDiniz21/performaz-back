export const XP_PER_ORDER = 50;

type ClientOrderStats = {
	totalOrders: number;
	totalRevenue: number;
};

type VendorOrderStats = {
	totalSales: number;
	totalRevenue: number;
	xp: number;
};

type ApplyOrderStatsInput = {
	orderTotal: number;
	client: ClientOrderStats;
	vendor: VendorOrderStats;
};

type OrderStatus = "pendente" | "confirmado" | "cancelado";

type ApplyOrderStatusTransitionInput = ApplyOrderStatsInput & {
	fromStatus: OrderStatus;
	toStatus: OrderStatus;
};

export function applyOrderStats({
	orderTotal,
	client,
	vendor,
}: ApplyOrderStatsInput) {
	return {
		client: {
			totalOrders: client.totalOrders + 1,
			totalRevenue: client.totalRevenue + orderTotal,
		},
		vendor: {
			totalSales: vendor.totalSales + 1,
			totalRevenue: vendor.totalRevenue + orderTotal,
			xp: vendor.xp + XP_PER_ORDER,
		},
		xpEarned: XP_PER_ORDER,
	};
}

export function isReportableOrderStatus(status: OrderStatus) {
	return status !== "cancelado";
}

export function applyOrderStatusTransition({
	orderTotal,
	fromStatus,
	toStatus,
	client,
	vendor,
}: ApplyOrderStatusTransitionInput) {
	const fromReportable = isReportableOrderStatus(fromStatus);
	const toReportable = isReportableOrderStatus(toStatus);
	const multiplier = Number(toReportable) - Number(fromReportable);

	if (multiplier === 0) {
		return { client, vendor, xpEarned: 0, changed: false };
	}

	return {
		client: {
			totalOrders: client.totalOrders + multiplier,
			totalRevenue: client.totalRevenue + orderTotal * multiplier,
		},
		vendor: {
			totalSales: vendor.totalSales + multiplier,
			totalRevenue: vendor.totalRevenue + orderTotal * multiplier,
			xp: vendor.xp + XP_PER_ORDER * multiplier,
		},
		xpEarned: XP_PER_ORDER * multiplier,
		changed: true,
	};
}
