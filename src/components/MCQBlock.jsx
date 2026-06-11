export function MCQBlock({ data, choice, setChoice, submitted, onSubmit, onNext, nextLabel = "Continue →", accentColor = "#6366f1" }) {
  return (
    <div style={{ background: "#0d1a2e", border: "1px solid #1e3a5e", borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, lineHeight: 1.6, marginBottom: 12 }}>
        {data.question}
      </div>
      {data.options.map((opt, i) => {
        let bg = "#0a0a18", border = "#1e1e2e", col = "#94a3b8";
        if (submitted) {
          if (i === data.correct) { bg = "#052e16"; border = "#22c55e50"; col = "#22c55e"; }
          else if (i === choice && i !== data.correct) { bg = "#1c0000"; border = "#ef444450"; col = "#ef4444"; }
        } else if (i === choice) { bg = "#1a1a3e"; border = accentColor; col = "#a5b4fc"; }
        return (
          <button key={i} onClick={() => !submitted && setChoice(i)} style={{
            display: "block", width: "100%", textAlign: "left",
            background: bg, border: `1px solid ${border}`, borderRadius: 8,
            padding: "10px 12px", marginBottom: 7, color: col, fontSize: 13,
            cursor: submitted ? "default" : "pointer", lineHeight: 1.5,
          }}>
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        );
      })}
      {submitted && (
        <div style={{
          fontSize: 12, color: "#94a3b8", background: "#0a0f18",
          border: "1px solid #1e3a5e", borderRadius: 8, padding: "10px 12px",
          marginBottom: 10, lineHeight: 1.6,
        }}>
          💡 {data.explanation}
        </div>
      )}
      {!submitted
        ? <button onClick={onSubmit} disabled={choice === null} style={{
            width: "100%", padding: "12px", border: "none", borderRadius: 10,
            background: choice !== null ? accentColor : "#1e1e2e",
            color: choice !== null ? "#fff" : "#334155",
            fontWeight: 800, fontSize: 14, cursor: choice !== null ? "pointer" : "default",
          }}>
            {choice !== null ? "Confirm Answer" : "Select an option"}
          </button>
        : <button onClick={onNext} style={{
            width: "100%", padding: "13px", background: "#6366f1",
            color: "#fff", border: "none", borderRadius: 10,
            fontWeight: 800, fontSize: 15, cursor: "pointer",
          }}>
            {nextLabel}
          </button>
      }
    </div>
  );
}
