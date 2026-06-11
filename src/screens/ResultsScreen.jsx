import { ProgressBar } from "../components/ProgressBar.jsx";

const DIFF_COLOR = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };

export function ResultsScreen({ problem, scores, completed, simMode, onRetry, onHome }) {
  const pct = completed[problem.id]?.score ?? 0;
  const grade = pct >= 80
    ? { label: "Interview Ready", color: "#22c55e", emoji: "🎯" }
    : pct >= 55
    ? { label: "Developing", color: "#f59e0b", emoji: "📈" }
    : { label: "Keep Practicing", color: "#ef4444", emoji: "🔁" };

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui,sans-serif", padding: "24px 16px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{grade.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9" }}>{problem.title}</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: grade.color, margin: "12px 0 4px" }}>{pct}%</div>
        <div style={{ fontSize: 14, color: grade.color, fontWeight: 700 }}>{grade.label}</div>
        <div style={{ margin: "12px auto", maxWidth: 200 }}>
          <ProgressBar value={pct} color={grade.color} height={8} />
        </div>
        {simMode && <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>⏱ Simulation Mode</div>}
      </div>

      {/* Full flow summary */}
      <div style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
          Full Interview Flow
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #1a1a2e" }}>
          <span style={{ fontSize: 16 }}>❓</span>
          <span style={{ flex: 1, fontSize: 12, color: "#94a3b8" }}>Clarifying Questions</span>
          <span style={{ fontSize: 11, color: "#22c55e" }}>✓</span>
        </div>
        {problem.steps.map(s => {
          const sc = scores[s.id] ?? 0;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <span style={{ fontSize: 16 }}>{s.emoji}</span>
              <span style={{ flex: 1, fontSize: 12, color: "#94a3b8" }}>{s.label}</span>
              <div style={{ width: 60 }}>
                <ProgressBar value={sc} max={10} color={sc >= 7 ? "#22c55e" : sc >= 4 ? "#f59e0b" : "#ef4444"} height={5} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: sc >= 7 ? "#22c55e" : sc >= 4 ? "#f59e0b" : "#ef4444", width: 32, textAlign: "right" }}>{sc}/10</span>
            </div>
          );
        })}
        {[["🔢","Dry Run"],["💪","Pushback"],["🚀","Follow-up"]].map(([emoji, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, paddingTop: 6, borderTop: "1px solid #1a1a2e" }}>
            <span style={{ fontSize: 16 }}>{emoji}</span>
            <span style={{ flex: 1, fontSize: 12, color: "#94a3b8" }}>{label}</span>
            <span style={{ fontSize: 11, color: "#475569" }}>MCQ ✓</span>
          </div>
        ))}
      </div>

      {/* Ideal solution */}
      <div style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          Ideal: {problem.solution.approach}
        </div>
        {problem.solution.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
            <span style={{ color: "#6366f1", fontWeight: 700, minWidth: 16, fontSize: 13 }}>{i + 1}.</span>
            <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#475569" }}>Time: <strong style={{ color: "#a5b4fc" }}>{problem.solution.time}</strong></span>
          <span style={{ fontSize: 12, color: "#475569" }}>Space: <strong style={{ color: "#a5b4fc" }}>{problem.solution.space}</strong></span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onRetry} style={{ flex: 1, padding: "13px", background: "#1e1e2e", color: "#a5b4fc", border: "1px solid #2d2d4e", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Retry
        </button>
        <button onClick={onHome} style={{ flex: 1, padding: "13px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          More Problems →
        </button>
      </div>
    </div>
  );
}
