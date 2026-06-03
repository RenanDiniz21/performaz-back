import { applyRouteClientVisitProgress } from "./route-progress";

describe("applyRouteClientVisitProgress", () => {
	it("increments visited count when a pending stop becomes no-sale", () => {
		expect(
			applyRouteClientVisitProgress({
				currentStatus: "pendente",
				targetStatus: "sem_venda",
				visitedClients: 1,
				salesMade: 0,
			}),
		).toEqual({
			status: "sem_venda",
			visitedClients: 2,
			salesMade: 0,
			changed: true,
		});
	});

	it("does not double-count a stop already marked no-sale", () => {
		expect(
			applyRouteClientVisitProgress({
				currentStatus: "sem_venda",
				targetStatus: "sem_venda",
				visitedClients: 2,
				salesMade: 0,
			}),
		).toEqual({
			status: "sem_venda",
			visitedClients: 2,
			salesMade: 0,
			changed: false,
		});
	});

	it("keeps visited count when a visited stop becomes no-sale", () => {
		expect(
			applyRouteClientVisitProgress({
				currentStatus: "visitado",
				targetStatus: "sem_venda",
				visitedClients: 2,
				salesMade: 0,
			}),
		).toEqual({
			status: "sem_venda",
			visitedClients: 2,
			salesMade: 0,
			changed: true,
		});
	});

	it("removes a sale from route totals when a sale stop becomes no-sale", () => {
		expect(
			applyRouteClientVisitProgress({
				currentStatus: "venda_realizada",
				targetStatus: "sem_venda",
				visitedClients: 2,
				salesMade: 1,
			}),
		).toEqual({
			status: "sem_venda",
			visitedClients: 2,
			salesMade: 0,
			changed: true,
		});
	});
});
