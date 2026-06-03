import { applyOrderRouteProgress } from "./order-route-progress";

describe("applyOrderRouteProgress", () => {
	it("marks a pending route client as sale and increments visited and sales", () => {
		expect(
			applyOrderRouteProgress({
				currentStatus: "pendente",
				visitedClients: 1,
				salesMade: 0,
				targetStatus: "venda_realizada",
			}),
		).toEqual({
			status: "venda_realizada",
			visitedClients: 2,
			salesMade: 1,
			changed: true,
		});
	});

	it("marks a visited route client as sale and increments only sales", () => {
		expect(
			applyOrderRouteProgress({
				currentStatus: "visitado",
				visitedClients: 2,
				salesMade: 0,
				targetStatus: "venda_realizada",
			}),
		).toEqual({
			status: "venda_realizada",
			visitedClients: 2,
			salesMade: 1,
			changed: true,
		});
	});

	it("does not double-count an already completed sale", () => {
		expect(
			applyOrderRouteProgress({
				currentStatus: "venda_realizada",
				visitedClients: 2,
				salesMade: 1,
				targetStatus: "venda_realizada",
			}),
		).toEqual({
			status: "venda_realizada",
			visitedClients: 2,
			salesMade: 1,
			changed: false,
		});
	});

	it("turns a sale cancellation into a visited stop and decrements sales", () => {
		expect(
			applyOrderRouteProgress({
				currentStatus: "venda_realizada",
				visitedClients: 2,
				salesMade: 1,
				targetStatus: "visitado",
			}),
		).toEqual({
			status: "visitado",
			visitedClients: 2,
			salesMade: 0,
			changed: true,
		});
	});
});
