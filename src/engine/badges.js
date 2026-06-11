// Pure function: given current state snapshot, returns array of badge IDs to award
export function computeBadgesToAward(state, event) {
  const toAward = [];
  const has = (id) => state.badges.includes(id);
  const add = (id) => { if (!has(id)) toAward.push(id); };

  const { stepIdx, stepResult, phase, problem, scores, completed,
          daysPracticed, stepStreak, xp, newLevel, clarifyRatio } = event;

  if (stepIdx === 0 && stepResult)                        add("first_step");
  if (stepResult?.score === 10 && phase === "edge")       add("edge_master");
  if (stepResult?.score === 10 && phase === "tradeoff")   add("tradeoff_king");
  if (stepResult?.passed && stepStreak >= 5)              add("streak_5");
  if (clarifyRatio >= 0.8)                               add("clarifier");
  if (event.dryrunCorrect)                               add("dry_runner");
  if (event.pushbackCorrect)                             add("pushback_ace");
  if (event.followupCorrect)                             add("followup_ace");
  if (event.problemComplete) {
    add("first_problem");
    const pct = event.finalPct;
    if (pct >= 80)                                       add("interview_ready");
    if (problem?.difficulty === "Hard")                  add("hard_solver");
    if (event.simMode)                                   add("sim_survivor");
    const donePatterns = new Set(
      Object.keys(completed)
        .map(id => event.allProblems?.find(p => p.id === id)?.pattern)
        .filter(Boolean)
    );
    donePatterns.add(problem?.pattern);
    if (donePatterns.size >= 3)                          add("pattern_master");
    const doneCount = Object.keys(completed).length + 1;
    if (doneCount >= 10)                                 add("problem_10");
    if (doneCount >= 25)                                 add("problem_25");
  }
  if (daysPracticed?.length >= 3)                        add("week_streak");
  if (newLevel >= 3)                                     add("level_3");
  if (newLevel >= 5)                                     add("level_5");
  if (newLevel >= 7)                                     add("level_7");

  return toAward;
}
