const KEYWORDS = {
  understand:  ["input","output","constraint","return","index","array","string","integer","target","what","given","describe","node","linked","cycle","prefix","interval","sorted"],
  brute:       ["loop","nested","every","pair","check","naive","O(n","brute","scan","all","each","try","traverse","compare","enumerate"],
  pattern:     ["hash","map","window","pointer","stack","tree","graph","dp","greedy","sort","set","binary","sliding","two","queue","heap","trie","union","find","parent","rank","slow","fast","floyd","monotone","prefix"],
  algorithm:   ["step","first","then","next","store","check","return","update","init","while","for","if","each","when","pop","push","iterate","merge","split","union","compress","path","left","right","mid"],
  tradeoff:    ["tradeoff","trade","prefer","choose","because","vs","versus","better","worse","space","time","pick","when","practical","cost","benefit","amortized","recursive","iterative","stack","overhead"],
  complexity:  ["O(","time","space","linear","log","constant","O(1","O(n","complexity","worst","average","amortized","alpha","inverse","ackermann"],
  edge:        ["empty","null","single","duplicate","negative","zero","large","equal","same","one","none","all","overflow","boundary","cycle","self","loop","disconnected","balanced"],
};

// Step-specific coaching shown when answer is partial or weak
const COACHING = {
  understand:  "Restate the input/output, name the data structure, and walk through a concrete example.",
  brute:       "Describe the naive approach step by step, state its time complexity, and explain why it's too slow.",
  pattern:     "Name the exact pattern (e.g. 'two pointers', 'sliding window', 'hashmap') and explain in one sentence why it fits.",
  algorithm:   "Walk through initialization, the loop logic, and what you return — like pseudocode spoken aloud.",
  tradeoff:    "Compare time vs. space with Big-O values and explain what you'd pick in a real interview and why.",
  complexity:  "State time complexity AND space complexity with a one-line justification for each.",
  edge:        "List at least two concrete edge cases with example inputs (e.g. empty array, single element, duplicates).",
};

// Convert spoken Big O phrases into notation so keyword matching works.
// e.g. "o of n" → "O(n)", "big o of n squared" → "O(n^2)"
function normalizeForScoring(text) {
  return text
    .replace(/\b(?:big\s+)?o(?:h)?\s+(?:of\s+)?n\s+squared\b/gi,  "O(n^2) O(n²)")
    .replace(/\b(?:big\s+)?o(?:h)?\s+(?:of\s+)?n\s+log\s+n\b/gi,  "O(n log n) O(nlogn)")
    .replace(/\b(?:big\s+)?o(?:h)?\s+(?:of\s+)?log\s+n\b/gi,      "O(log n) O(logn)")
    .replace(/\b(?:big\s+)?o(?:h)?\s+(?:of\s+)?m\s*n\b/gi,        "O(mn) O(m*n)")
    .replace(/\b(?:big\s+)?o(?:h)?\s+(?:of\s+)?n\b/gi,            "O(n)")
    .replace(/\b(?:big\s+)?o(?:h)?\s+(?:of\s+)?(?:1|one)\b/gi,    "O(1)")
    .replace(/\border\s+(?:of\s+)?n\s+squared\b/gi,               "O(n^2)")
    .replace(/\border\s+(?:of\s+)?n\s+log\s+n\b/gi,               "O(n log n)")
    .replace(/\border\s+(?:of\s+)?log\s+n\b/gi,                   "O(log n)")
    .replace(/\border\s+(?:of\s+)?n\b/gi,                         "O(n)")
    .replace(/\border\s+(?:of\s+)?(?:1|one)\b/gi,                 "O(1)")
    // "n squared" without explicit O — still useful for keywords like "n^2"
    .replace(/\bn\s+squared\b/gi, "n^2 n²")
    // two-word variants that keywords check as single strings
    .replace(/\bhash\s+map\b/gi,      "hash map hashmap")
    .replace(/\btwo\s+pointer\b/gi,   "two pointer two pointers")
    .replace(/\bunion\s+find\b/gi,    "union find union-find");
}

export function scoreStep(text, stepId, problem = null) {
  if (!text || typeof text !== "string") {
    return { score: 0, passed: false, feedback: "No answer provided.", matched: [], topMissed: [] };
  }
  const normalized = normalizeForScoring(text);
  const lower = normalized.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 10) {
    return { score: 0, passed: false, feedback: "Too brief — explain your reasoning fully. Think out loud.", matched: [], topMissed: [] };
  }

  const kws = problem?.keywords?.[stepId] || KEYWORDS[stepId] || KEYWORDS.understand;
  const matched = kws.filter(k => lower.includes(k.toLowerCase()));
  const missed   = kws.filter(k => !lower.includes(k.toLowerCase()));
  const topMissed = missed.slice(0, 5);
  const ratio = matched.length / Math.max(kws.length, 1);

  const coaching = COACHING[stepId] || "Be more specific and technical in your explanation.";

  if (ratio >= 0.40) return { score: 10, passed: true,  feedback: "Strong answer — you hit the key concepts.", matched, topMissed };
  if (ratio >= 0.22) return { score: 7,  passed: true,  feedback: coaching, matched, topMissed };
  if (ratio >= 0.10) return { score: 4,  passed: false, feedback: coaching, matched, topMissed };
  return                    { score: 1,  passed: false, feedback: coaching, matched, topMissed };
}
