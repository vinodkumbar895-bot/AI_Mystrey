export function calculateScore(correct: boolean, reviewedCount: number, evidenceCount: number, hintsUsed: number) {
  const accusationPoints = correct ? 60 : 0;
  const evidencePoints = evidenceCount > 0 ? Math.floor(25 * Math.min(reviewedCount, evidenceCount) / evidenceCount) : 0;
  const hintPoints = hintsUsed === 0 ? 15 : hintsUsed === 1 ? 10 : hintsUsed === 2 ? 5 : 0;
  return { accusationPoints, evidencePoints, hintPoints, score: accusationPoints + evidencePoints + hintPoints };
}

