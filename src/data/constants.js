export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const PATTERNS = [
  "Arrays", "Linked List", "Sliding Window", "Two Pointers",
  "Stack / Queue", "Binary Search", "Trees", "Graphs",
  "Heap", "Trie", "Union-Find", "DP", "Greedy", "Intervals", "Backtracking",
];

export const COMPANIES = ["Meta", "Amazon", "Google", "NVIDIA"];

export const STEP_IDS = ["understand", "brute", "pattern", "algorithm", "tradeoff", "complexity", "edge"];

export const DIFF_COLOR = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
export const DIFF_BG    = { Easy: "#052e16", Medium: "#1c1400", Hard: "#1c0000" };

export const PHASE_ORDER = ["clarify", "steps", "dryrun", "pushback", "followup"];

// XP thresholds per level
export const LEVEL_GATES = {
  1: { label: "Beginner",        xp: 0,   unlocksDiff: ["Easy"],                       color: "#94a3b8" },
  2: { label: "Learner",         xp: 50,  unlocksDiff: ["Easy"],                       color: "#60a5fa" },
  3: { label: "Junior Solver",   xp: 120, unlocksDiff: ["Easy", "Medium"],             color: "#34d399" },
  4: { label: "Intermediate",    xp: 250, unlocksDiff: ["Easy", "Medium"],             color: "#a78bfa" },
  5: { label: "Advanced",        xp: 450, unlocksDiff: ["Easy", "Medium", "Hard"],     color: "#f59e0b" },
  6: { label: "Interview Ready", xp: 700, unlocksDiff: ["Easy", "Medium", "Hard"],     color: "#f472b6" },
  7: { label: "Senior Thinker",  xp: 1000,unlocksDiff: ["Easy", "Medium", "Hard"],     color: "#ef4444" },
};

export const STORAGE_KEY = "interview_trainer_v4";
