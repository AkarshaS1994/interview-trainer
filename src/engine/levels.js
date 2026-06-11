import { LEVEL_GATES } from "../data/constants.js";

export function computeLevel(xp) {
  let level = 1;
  for (const [lvl, gate] of Object.entries(LEVEL_GATES)) {
    if (xp >= gate.xp) level = Number(lvl);
  }
  const gate = LEVEL_GATES[level];
  const nextLevel = Math.min(level + 1, 7);
  const nextGate = LEVEL_GATES[nextLevel];
  return {
    level,
    label: gate.label,
    color: gate.color,
    xpCurrent: xp - gate.xp,
    xpNeeded: nextGate.xp - gate.xp,
    unlockedDifficulties: gate.unlocksDiff,
  };
}

export function isProblemUnlocked(problem, xp) {
  const { unlockedDifficulties } = computeLevel(xp);
  return unlockedDifficulties.includes(problem.difficulty);
}

export function getLevelUpMessage(oldXp, newXp) {
  const oldLevel = computeLevel(oldXp).level;
  const newLevel = computeLevel(newXp).level;
  if (newLevel > oldLevel) {
    const gate = LEVEL_GATES[newLevel];
    const unlocked = newLevel === 3 ? "Medium problems unlocked! 🎉" :
                     newLevel === 5 ? "Hard problems unlocked! 🔥" : "";
    return { leveledUp: true, newLevel, label: gate.label, unlocked };
  }
  return { leveledUp: false };
}
