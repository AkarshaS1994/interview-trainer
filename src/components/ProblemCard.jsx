const DIFF_COLOR = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
const DIFF_BG    = { Easy: "#052e16", Medium: "#1c1400", Hard: "#1c0000" };

export function ProblemCard({ problem }) {
  return (
    <div style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: DIFF_BG[problem.difficulty], color: DIFF_COLOR[problem.difficulty] }}>
          {problem.difficulty}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: "#1e1e3e", color: "#818cf8" }}>
          {problem.pattern}
        </span>
      </div>
      <div style={{ fontWeight: 800, color: "#f1f5f9", fontSize: 16, marginBottom: 6 }}>{problem.title}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 10 }}>{problem.description}</div>
      <div style={{ background: "#0a0a14", borderRadius: 8, padding: "10px 12px", fontFamily: "monospace", fontSize: 12 }}>
        <div style={{ color: "#475569", fontSize: 10, marginBottom: 3 }}>EXAMPLE</div>
        <div style={{ color: "#94a3b8" }}>Input: <span style={{ color: "#a5b4fc" }}>{problem.example.input}</span></div>
        <div style={{ color: "#94a3b8", marginTop: 3 }}>Output: <span style={{ color: "#22c55e" }}>{problem.example.output}</span></div>
      </div>
    </div>
  );
}
