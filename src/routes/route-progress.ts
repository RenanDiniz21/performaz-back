type RouteClientStatus =
	| "pendente"
	| "visitado"
	| "venda_realizada"
	| "sem_venda";

type RouteClientVisitProgressInput = {
	currentStatus: RouteClientStatus;
	targetStatus: RouteClientStatus;
	visitedClients: number;
	salesMade: number;
};

export function applyRouteClientVisitProgress({
	currentStatus,
	targetStatus,
	visitedClients,
	salesMade,
}: RouteClientVisitProgressInput) {
	if (currentStatus === targetStatus) {
		return {
			status: targetStatus,
			visitedClients,
			salesMade,
			changed: false,
		};
	}

	const wasVisited = currentStatus !== "pendente";
	const willBeVisited = targetStatus !== "pendente";
	const wasSale = currentStatus === "venda_realizada";
	const willBeSale = targetStatus === "venda_realizada";

	return {
		status: targetStatus,
		visitedClients: Math.max(
			0,
			visitedClients + Number(willBeVisited) - Number(wasVisited),
		),
		salesMade: Math.max(0, salesMade + Number(willBeSale) - Number(wasSale)),
		changed: true,
	};
}
