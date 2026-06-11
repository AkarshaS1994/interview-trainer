import { ARRAY_PROBLEMS } from "./problems/arrays.js";
import { TREE_PROBLEMS } from "./problems/trees.js";
import { GRAPH_PROBLEMS } from "./problems/graphs.js";
import { HEAP_PROBLEMS } from "./problems/heap.js";
import { DP_PROBLEMS } from "./problems/dp.js";
import { SLIDING_WINDOW_PROBLEMS } from "./problems/slidingWindow.js";
import { BACKTRACKING_PROBLEMS } from "./problems/backtracking.js";

export const ALL_PROBLEMS = [
  ...ARRAY_PROBLEMS,
  ...SLIDING_WINDOW_PROBLEMS,
  ...TREE_PROBLEMS,
  ...GRAPH_PROBLEMS,
  ...HEAP_PROBLEMS,
  ...DP_PROBLEMS,
  ...BACKTRACKING_PROBLEMS,
];

// Validate schema at startup (dev only)
if (import.meta.env?.DEV) {
  const REQUIRED_FIELDS = ["id","title","difficulty","pattern","companies","minLevel",
    "description","example","hints","clarify","steps","dryrun","pushback","followup","solution"];
  const REQUIRED_STEP_FIELDS = ["id","label","emoji","prompt","why"];
  ALL_PROBLEMS.forEach(p => {
    REQUIRED_FIELDS.forEach(f => {
      if (p[f] === undefined) console.warn(`Problem ${p.id} missing field: ${f}`);
    });
    if (p.hints?.length !== 3) console.warn(`Problem ${p.id} should have exactly 3 hints`);
    p.steps?.forEach(s => {
      REQUIRED_STEP_FIELDS.forEach(f => {
        if (s[f] === undefined) console.warn(`Problem ${p.id} step ${s.id} missing: ${f}`);
      });
    });
  });
  console.log(`✓ Loaded ${ALL_PROBLEMS.length} problems`);
}

export { ARRAY_PROBLEMS, TREE_PROBLEMS, GRAPH_PROBLEMS, HEAP_PROBLEMS, DP_PROBLEMS, SLIDING_WINDOW_PROBLEMS, BACKTRACKING_PROBLEMS };
