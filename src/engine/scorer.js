const KEYWORDS = {
  understand:  ["input","output","constraint","return","index","array","string","integer","target","what","given","describe"],
  brute:       ["loop","nested","every","pair","check","naive","O(n","brute","scan","all","each","try"],
  pattern:     ["hash","map","window","pointer","stack","tree","graph","dp","greedy","sort","set","binary","sliding","two","queue","heap","trie"],
  algorithm:   ["step","first","then","next","store","check","return","update","init","while","for","if","each","when","pop","push","iterate"],
  tradeoff:    ["tradeoff","trade","prefer","choose","because","vs","versus","better","worse","space","time","pick","when","practical","cost","benefit"],
  complexity:  ["O(","time","space","linear","log","constant","O(1","O(n","complexity","worst","average","amortized"],
  edge:        ["empty","null","single","duplicate","negative","zero","large","equal","same","one","none","all","overflow","boundary"],
};

export function scoreStep(text, stepId) {
  if (!text || typeof text !== "string") return { score: 0, passed: false, feedback: "No answer provided." };
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 10) return { score: 0, passed: false, feedback: "Too brief — explain your reasoning fully. Think out loud." };

  const kws = KEYWORDS[stepId] || KEYWORDS.understand;
  const matched = kws.filter(k => lower.includes(k.toLowerCase()));
  const ratio = matched.length / Math.max(kws.length, 1);

  if (ratio >= 0.40) return { score: 10, passed: true,  feedback: "Strong reasoning. Key concepts well covered." };
  if (ratio >= 0.22) return { score: 7,  passed: true,  feedback: `Good start. Go deeper on the ${stepId} aspect.` };
  if (ratio >= 0.10) return { score: 4,  passed: false, feedback: `Partial. Be more specific about ${stepId}.` };
  return                     { score: 1,  passed: false, feedback: `Needs more depth. Think carefully about: ${stepId}.` };
}
