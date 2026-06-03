export function applyXpAward({
	currentXp,
	earnedXp,
}: {
	currentXp: number;
	earnedXp: number;
}) {
	return {
		xp: currentXp + Math.max(earnedXp, 0),
	};
}
