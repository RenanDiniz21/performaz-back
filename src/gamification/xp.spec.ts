import { applyXpAward } from "./xp";

describe("applyXpAward", () => {
	it("adds earned XP to the vendor total", () => {
		expect(applyXpAward({ currentXp: 2450, earnedXp: 10 })).toEqual({
			xp: 2460,
		});
	});

	it("does not allow negative XP awards to reduce totals", () => {
		expect(applyXpAward({ currentXp: 2450, earnedXp: -50 })).toEqual({
			xp: 2450,
		});
	});
});
