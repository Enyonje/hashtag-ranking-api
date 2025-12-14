const WEIGHTS = { popularity: 0.45, competition: 0.25, velocity: 0.7 };

export function computeCompositeScore(popularity: number, competition: number, velocity: number) {
  const popularityNorm = popularity / 100;
  const competitionNorm = 1 - competition / 100;
  const velocityNorm = (velocity + 1) / 2;
  const score = WEIGHTS.popularity * popularityNorm + WEIGHTS.competition * competitionNorm + WEIGHTS.velocity * velocityNorm;
  return Math.round(score * 100);
}