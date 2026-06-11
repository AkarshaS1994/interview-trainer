export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const PATTERNS = [
  "Arrays", "Linked List", "Sliding Window", "Two Pointers",
  "Stack / Queue", "Binary Search", "Trees", "Graphs",
  "Heap", "Trie", "Union-Find", "DP", "Greedy", "Intervals", "Backtracking", "Bit Manipulation",
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

export const DSA_TAXONOMY = [
  {
    id: "ds",
    label: "Data Structures",
    emoji: "🏗️",
    color: "#6366f1",
    description: "How data is organized and accessed in memory",
    types: [
      { id: "arrays",      label: "Arrays",       emoji: "📋", patterns: ["Arrays", "Sliding Window", "Two Pointers"], description: "Contiguous memory · sliding window · two-pointer techniques" },
      { id: "linked-list", label: "Linked List",   emoji: "🔗", patterns: ["Linked List"],               description: "Nodes with pointers · fast insert/delete · runner technique" },
      { id: "stack-queue", label: "Stack & Queue", emoji: "📚", patterns: ["Stack / Queue"],              description: "LIFO/FIFO · monotonic stack · BFS queue patterns" },
      { id: "trees",       label: "Trees",         emoji: "🌳", patterns: ["Trees"],                      description: "Hierarchical · BST · DFS/BFS · path problems · serialization" },
      { id: "graphs",      label: "Graphs",        emoji: "🕸️", patterns: ["Graphs", "Union-Find"],       description: "Nodes & edges · BFS/DFS · topological sort · connected components" },
      { id: "heap",        label: "Heap",          emoji: "⛰️", patterns: ["Heap"],                      description: "Priority queue · top-K elements · streaming median · merge K" },
      { id: "trie",        label: "Trie",          emoji: "🌲", patterns: ["Trie"],                       description: "Prefix tree · autocomplete · word search · IP routing" },
    ],
  },
  {
    id: "algo",
    label: "Algorithms",
    emoji: "⚡",
    color: "#f59e0b",
    description: "Techniques for solving problems efficiently",
    types: [
      { id: "binary-search", label: "Binary Search",       emoji: "🔍", patterns: ["Binary Search"], description: "Logarithmic search · sorted arrays · search spaces · monotonic functions" },
      { id: "dp",            label: "Dynamic Programming", emoji: "📊", patterns: ["DP"],            description: "Overlapping subproblems · memoization · bottom-up tables · optimal substructure" },
      { id: "greedy",        label: "Greedy",              emoji: "💰", patterns: ["Greedy", "Intervals"], description: "Local optimal choice · interval scheduling · activity selection" },
      { id: "backtracking",  label: "Backtracking",        emoji: "🔄", patterns: ["Backtracking"],  description: "Exhaustive search with pruning · subsets · permutations · constraint satisfaction" },
      { id: "bit-manip",     label: "Bit Manipulation",    emoji: "💡", patterns: ["Bit Manipulation"], description: "XOR tricks · bit masking · Hamming weight · single number" },
    ],
  },
];
