// onSelect(i) fires immediately when an option is clicked — no separate confirm step.
export function MCQBlock({ data, choice, submitted, onSelect, onNext, nextLabel = "Continue →", accentColor = "#6366f1" }) {
  return (
    <div style={{ background: "#0d1a2e", border: "1px solid #1e3a5e", borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.6, marginBottom: 12 }}>
        {data.question}
      </div>
      {data.options.map((opt, i) => {
        let bg = "#0a0a18", border = "#1e1e2e", col = "#94a3b8", icon = null;
        if (submitted) {
          if (i === data.correct) { bg = "#052e16"; border = "#22c55e50"; col = "#22c55e"; icon = "✓"; }
          else if (i === choice && i !== data.correct) { bg = "#1c0000"; border = "#ef444450"; col = "#ef4444"; icon = "✗"; }
        }
        return (
          <button key={i} onClick={() => !submitted && onSelect(i)} style={{
            display: "flex", alignItems: "flex-start", gap: 8, width: "100%", textAlign: "left",
            background: bg, border: `1px solid ${border}`, borderRadius: 8,
            padding: "10px 12px", marginBottom: 7, color: col, fontSize: 13,
            cursor: submitted ? "default" : "pointer", lineHeight: 1.5,
          }}>
            <span style={{ flexShrink: 0, fontWeight: 700, minWidth: 18 }}>
              {submitted && icon ? icon : String.fromCharCode(65 + i) + "."}
            </span>
            <span style={{ flex: 1 }}>{opt}</span>
          </button>
        );
      })}
      {submitted && (
        <div style={{
          fontSize: 13, color: "#c7d2e8", background: "#070d18",
          border: "1px solid #1e3a5e", borderRadius: 8, padding: "12px 14px",
          marginBottom: 12, lineHeight: 1.7,
        }}>
          <span style={{ color: "#60a5fa", fontWeight: 700 }}>💡 Explanation: </span>
          {data.explanation}
        </div>
      )}
      {submitted && (
        <button onClick={onNext} style={{
          width: "100%", padding: "13px", background: "#6366f1",
          color: "#fff", border: "none", borderRadius: 10,
          fontWeight: 800, fontSize: 15, cursor: "pointer",
        }}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
