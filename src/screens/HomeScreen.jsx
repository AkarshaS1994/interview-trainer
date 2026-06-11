import { useState } from "react";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { BADGES } from "../data/badges.js";
import { PATTERNS } from "../data/constants.js";
import { computeLevel } from "../engine/levels.js";
import { getDueForReview } from "../engine/spacedRep.js";

const DIFF_COLOR = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
const DIFF_BG    = { Easy: "#052e16", Medium: "#1c1400", Hard: "#1c0000" };

export function HomeScreen({ state, problems, onStart }) {
  const [tab, setTab] = useState("problems");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterPattern, setFilterPattern] = useState("All");

  const { xp, badges, completed, patternStats, daysPracticed, stepStreak } = state;
  const lvl = computeLevel(xp);
  const due = getDueForReview(completed, problems);

  const patternList = [...new Set(problems.map(p => p.pattern))].sort();

  // Only show problems unlocked at current level
  const unlocked = problems.filter(p => lvl.unlockedDifficulties.includes(p.difficulty));
  const filtered = unlocked.filter(p =>
    (filterDiff === "All" || p.difficulty === filterDiff) &&
    (filterPattern === "All" || p.pattern === filterPattern)
  );

  const weakestPattern = (() => {
    let worst = null, worstAcc = 2;
    Object.entries(patternStats).forEach(([pat, s]) => {
      if (s.exposure > 0) { const a = s.correct / s.exposure; if (a < worstAcc) { worstAcc = a; worst = pat; } }
    });
    return worst;
  })();

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui,sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#0f0f1e,#07070f)", padding: "28px 20px 16px", borderBottom: "1px solid #1a1a2e" }}>
        <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
          Meta Interview Trainer
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.1 }}>Think Like a Senior Engineer 🚀</div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
          {unlocked.length} problems unlocked · {problems.length - unlocked.length > 0 ? `${problems.length - unlocked.length} locked` : "all unlocked"}
        </div>

        {/* Level + XP */}
        <div style={{ marginTop: 14, background: "#111118", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: lvl.color }}>Level {lvl.level} · {lvl.label}</span>
            <span style={{ fontSize: 12, color: "#475569" }}>{xp} XP</span>
          </div>
          <ProgressBar value={lvl.xpCurrent} max={lvl.xpNeeded} color={lvl.color} />
          {lvl.level < 7 && (
            <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>
              {lvl.xpNeeded - lvl.xpCurrent} XP to Level {lvl.level + 1}
              {lvl.level === 2 && " · Unlocks Medium problems"}
              {lvl.level === 4 && " · Unlocks Hard problems"}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a2e", background: "#07070f", position: "sticky", top: 0, zIndex: 10 }}>
        {[["problems","Problems"],["progress","Progress"],["simulate","Simulate"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "13px 0", background: "none", border: "none",
            color: tab === id ? "#a5b4fc" : "#475569",
            fontWeight: tab === id ? 700 : 400, fontSize: 13,
            borderBottom: `2px solid ${tab === id ? "#6366f1" : "transparent"}`,
            cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "14px 16px 0" }}>

        {/* ── PROBLEMS TAB ── */}
        {tab === "problems" && <>
          {/* Spaced repetition banner */}
          {due.length > 0 && (
            <div style={{ background: "#1a1000", border: "1px solid #f59e0b30", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                📅 Due for Review
              </div>
              <div style={{ fontSize: 13, color: "#e2e8f0", marginBottom: 8 }}>
                {due.length} problem{due.length > 1 ? "s" : ""} ready — spaced repetition
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {due.slice(0, 3).map(p => (
                  <button key={p.id} onClick={() => onStart(p)} style={{
                    background: "#f59e0b20", border: "1px solid #f59e0b40",
                    borderRadius: 8, padding: "5px 10px", color: "#f59e0b", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{p.title}</button>
                ))}
              </div>
            </div>
          )}

          {/* Locked difficulty notice */}
          {problems.length > unlocked.length && (
            <div style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#475569" }}>
                🔒 {lvl.level < 3 ? "Reach Level 3 to unlock Medium problems" : "Reach Level 5 to unlock Hard problems"}
              </div>
            </div>
          )}

          {/* Weakest pattern suggestion */}
          {weakestPattern && (
            <div style={{ background: "#1a0a2e", border: "1px solid #6366f130", borderRadius: 12, padding: "12px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Recommended</div>
                <div style={{ fontSize: 13, color: "#e2e8f0", marginTop: 2 }}>Practice <strong style={{ color: "#a5b4fc" }}>{weakestPattern}</strong></div>
              </div>
              <button onClick={() => setFilterPattern(weakestPattern)} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Filter</button>
            </div>
          )}

          {/* Difficulty filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10, overflowX: "auto", paddingBottom: 4 }}>
            {["All", "Easy", "Medium", "Hard"].map(d => (
              <button key={d} onClick={() => setFilterDiff(d)} style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                border: `1px solid ${filterDiff === d ? (DIFF_COLOR[d] || "#6366f1") : "#1e1e2e"}`,
                background: filterDiff === d ? (DIFF_BG[d] || "#1a1a2e") : "#111118",
                color: filterDiff === d ? (DIFF_COLOR[d] || "#a5b4fc") : "#475569",
                fontSize: 12, fontWeight: 600,
              }}>{d}</button>
            ))}
          </div>

          {/* Pattern filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
            {["All", ...patternList].map(p => (
              <button key={p} onClick={() => setFilterPattern(p)} style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: 20, cursor: "pointer",
                border: `1px solid ${filterPattern === p ? "#6366f1" : "#1e1e2e"}`,
                background: filterPattern === p ? "#1a1a2e" : "#111118",
                color: filterPattern === p ? "#a5b4fc" : "#475569",
                fontSize: 11, fontWeight: 600,
              }}>{p}</button>
            ))}
          </div>

          {/* Problem list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(p => {
              const done = completed[p.id];
              const isDue = due.find(x => x.id === p.id);
              return (
                <div key={p.id} onClick={() => onStart(p)} style={{
                  background: "#111118",
                  border: `1px solid ${done ? (isDue ? "#f59e0b20" : "#22c55e20") : "#1a1a2e"}`,
                  borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                        <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15 }}>{p.title}</span>
                        {done && <span style={{ fontSize: 11, color: done.score >= 80 ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>✓ {done.score}%</span>}
                        {isDue && <span style={{ fontSize: 10, color: "#f59e0b", background: "#1a1000", border: "1px solid #f59e0b40", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>Review</span>}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}>{p.difficulty}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: "#1e1e3e", color: "#818cf8" }}>{p.pattern}</span>
                        {p.companies.slice(0, 2).map(c => <span key={c} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "#0f1015", color: "#475569" }}>{c}</span>)}
                      </div>
                    </div>
                    <span style={{ color: "#2d2d4e", fontSize: 18, marginLeft: 8 }}>›</span>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#334155", fontSize: 14 }}>
                No problems match these filters.
              </div>
            )}
          </div>
        </>}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Problems Done", value: Object.keys(completed).length, sub: `of ${problems.length}`, icon: "✅" },
              { label: "Total XP", value: xp, sub: lvl.label, icon: "⚡" },
              { label: "Step Streak", value: stepStreak, sub: "correct in a row", icon: "🔥" },
              { label: "Days Practiced", value: daysPracticed.length, sub: "days total", icon: "📅" },
            ].map(s => (
              <div key={s.label} style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: lvl.color, marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "#334155" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Badges</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {BADGES.map(b => (
                <div key={b.id} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  padding: "10px 4px", borderRadius: 10,
                  background: badges.includes(b.id) ? "#1a1a2e" : "#0d0d14",
                  border: `1px solid ${badges.includes(b.id) ? "#6366f130" : "transparent"}`,
                  opacity: badges.includes(b.id) ? 1 : 0.3,
                }}>
                  <span style={{ fontSize: 20 }}>{b.emoji}</span>
                  <span style={{ fontSize: 9, color: badges.includes(b.id) ? "#a5b4fc" : "#334155", textAlign: "center", fontWeight: 600 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern mastery */}
          <div style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pattern Mastery</div>
            {patternList.map(pat => {
              const s = patternStats[pat] || { exposure: 0, correct: 0 };
              const acc = s.exposure > 0 ? Math.round((s.correct / s.exposure) * 100) : null;
              return (
                <div key={pat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                  <span style={{ width: 110, fontSize: 11, color: s.exposure > 0 ? "#94a3b8" : "#2d2d4e", flexShrink: 0 }}>{pat}</span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar value={acc ?? 0} color={acc === null ? "#1e1e2e" : acc >= 70 ? "#22c55e" : acc >= 40 ? "#f59e0b" : "#ef4444"} />
                  </div>
                  <span style={{ width: 30, fontSize: 10, color: "#475569", textAlign: "right", flexShrink: 0 }}>{acc !== null ? `${acc}%` : "—"}</span>
                </div>
              );
            })}
          </div>
        </>}

        {/* ── SIMULATE TAB ── */}
        {tab === "simulate" && <>
          <div style={{ background: "#1a0000", border: "1px solid #ef444430", borderRadius: 12, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", marginBottom: 6 }}>⚠️ Interview Simulation Mode</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>
              • 2.5 min timer per step{"\n"}• No hints{"\n"}• Full flow: Clarify → Steps → Dry Run → Pushback → Follow-up
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Choose a problem
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {unlocked.map(p => (
              <div key={p.id} onClick={() => onStart(p, true)} style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: DIFF_BG[p.difficulty], color: DIFF_COLOR[p.difficulty] }}>{p.difficulty}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: "#1e1e3e", color: "#818cf8" }}>{p.pattern}</span>
                    </div>
                  </div>
                  <span style={{ color: "#ef4444", fontSize: 16 }}>▶</span>
                </div>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}
