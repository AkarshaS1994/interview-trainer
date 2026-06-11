export function ProgressBar({ value, max = 100, color = "#6366f1", height = 6 }) {
  return (
    <div style={{ background: "#1e1e2e", borderRadius: height, height, overflow: "hidden" }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, (value / max) * 100))}%`,
        height: "100%", background: color, borderRadius: height,
        transition: "width 0.5s ease",
      }} />
    </div>
  );
}
