const PHASES = ["clarify", "steps", "dryrun", "pushback", "followup"];
const PHASE_COLORS = { clarify: "#6366f1", steps: "#6366f1", dryrun: "#22c55e", pushback: "#f59e0b", followup: "#a78bfa" };

export function PhaseBar({ currentPhase }) {
  const currentIdx = PHASES.indexOf(currentPhase);
  return (
    <div style={{ display: "flex", gap: 3, padding: "8px 16px" }}>
      {PHASES.map((ph, i) => (
        <div key={ph} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i < currentIdx ? "#22c55e" : ph === currentPhase ? PHASE_COLORS[ph] : "#1e1e2e",
          transition: "all 0.3s",
        }} />
      ))}
    </div>
  );
}
