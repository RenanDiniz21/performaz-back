type GoalType = "receita" | "vendas" | "visitas";

type ApplyGoalProgressInput = {
	type: GoalType;
	current: number;
	orderTotal: number;
	multiplier: number;
};

export function applyGoalProgress({
	type,
	current,
	orderTotal,
	multiplier,
}: ApplyGoalProgressInput) {
	const delta =
		type === "receita" ? orderTotal * multiplier : type === "vendas" ? multiplier : 0;

	return Math.max(0, Math.round((current + delta) * 100) / 100);
}
