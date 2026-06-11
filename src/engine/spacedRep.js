// Returns problems due for review based on score and days since last attempt
export function getDueForReview(completed, problems) {
  const now = Date.now();
  return problems.filter(p => {
    const c = completed[p.id];
    if (!c || c.score >= 80) return false;            // not started or mastered
    const daysSince = (now - (c.timestamp || 0)) / 86400000;
    if (c.score < 40)  return daysSince >= 1;         // failed: retry next day
    if (c.score < 65)  return daysSince >= 2;         // partial: retry in 2 days
    return daysSince >= 4;                            // decent: retry in 4 days
  });
}

// Returns a score indicating how much a problem needs practice
export function getPracticeUrgency(completed, problemId) {
  const c = completed[problemId];
  if (!c) return 0;                    // never done
  const days = (Date.now() - (c.timestamp || 0)) / 86400000;
  return Math.max(0, (1 - c.score / 100) * days);
}
