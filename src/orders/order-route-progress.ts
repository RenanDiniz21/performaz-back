type RouteClientStatus =
	| "pendente"
	| "visitado"
	| "venda_realizada"
	| "sem_venda";

type ApplyOrderRouteProgressInput = {
	currentStatus: RouteClientStatus;
	targetStatus: "visitado" | "venda_realizada";
	visitedClients: number;
	salesMade: number;
};

export function applyOrderRouteProgress({
	currentStatus,
	targetStatus,
	visitedClients,
	salesMade,
}: ApplyOrderRouteProgressInput) {
	if (currentStatus === targetStatus) {
		return {
			status: targetStatus,
			visitedClients,
			salesMade,
			changed: false,
		};
	}

	const wasVisited = currentStatus !== "pendente";
	const wasSale = currentStatus === "venda_realizada";
	const willBeSale = targetStatus === "venda_realizada";

	return {
		status: targetStatus,
		visitedClients: visitedClients + 1 - Number(wasVisited),
		salesMade: Math.max(0, salesMade + Number(willBeSale) - Number(wasSale)),
		changed: true,
	};
}
