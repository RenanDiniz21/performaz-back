import { applyGoalProgress } from "./goal-progress";

describe("applyGoalProgress", () => {
	it("increments sales and revenue goals for a reportable order", () => {
		expect(applyGoalProgress({ type: "vendas", current: 20, orderTotal: 6999.8, multiplier: 1 })).toBe(21);
		expect(applyGoalProgress({ type: "receita", current: 30000, orderTotal: 6999.8, multiplier: 1 })).toBe(36999.8);
	});

	it("decrements sales and revenue goals when an order stops being reportable", () => {
		expect(applyGoalProgress({ type: "vendas", current: 21, orderTotal: 6999.8, multiplier: -1 })).toBe(20);
		expect(applyGoalProgress({ type: "receita", current: 36999.8, orderTotal: 6999.8, multiplier: -1 })).toBe(30000);
	});

	it("does not let goal progress go below zero", () => {
		expect(applyGoalProgress({ type: "vendas", current: 0, orderTotal: 6999.8, multiplier: -1 })).toBe(0);
		expect(applyGoalProgress({ type: "receita", current: 100, orderTotal: 6999.8, multiplier: -1 })).toBe(0);
	});
});
