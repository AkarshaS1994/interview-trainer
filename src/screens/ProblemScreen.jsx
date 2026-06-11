import { useState, useRef, useEffect } from "react";
import { ProblemCard } from "../components/ProblemCard.jsx";
import { PhaseBar } from "../components/PhaseBar.jsx";
import { MCQBlock } from "../components/MCQBlock.jsx";
import { VoiceInput } from "../components/VoiceInput.jsx";
import { scoreStep } from "../engine/scorer.js";
import { computeBadgesToAward } from "../engine/badges.js";

export function ProblemScreen({ problem, simMode, state, onComplete, onBack, onAward, onXP, onToast }) {
  const [phase, setPhase] = useState("clarify");
  const [stepIdx, setStepIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [input, setInput] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [whyChoice, setWhyChoice] = useState(null);
  const [whySubmitted, setWhySubmitted] = useState(false);
  const [clarifyChecked, setClarifyChecked] = useState([]);
  const [clarifySubmitted, setClarifySubmitted] = useState(false);
  const [specialChoice, setSpecialChoice] = useState(null);
  const [specialSubmitted, setSpecialSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(simMode ? 150 : 0);
  const [timerActive, setTimerActive] = useState(simMode);
  const timerRef = useRef(null);

  const step = phase === "steps" ? problem.steps[stepIdx] : null;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor = timeLeft > 90 ? "#22c55e" : timeLeft > 45 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) { if (timeLeft <= 0 && timerActive) { setTimerActive(false); onToast("⏰ Time's up!", "#ef4444"); setSubmitted(true); } return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  const resetTimer = () => { if (simMode) { setTimeLeft(150); setTimerActive(true); } };

  const submitClarify = () => {
    setClarifySubmitted(true);
    const must = problem.clarify.mustAsk;
    const hits = must.filter(i => clarifyChecked.includes(i)).length;
    const ratio = hits / must.length;
    const gained = ratio >= 0.8 ? 8 : ratio >= 0.5 ? 5 : 2;
    onXP(gained);
    if (ratio >= 0.8) { onAward("clarifier"); onToast(`✓ Great questions! +${gained} XP`, "#22c55e"); }
    else onToast(`Missed some key questions. +${gained} XP`, "#f59e0b");
  };

  const submitStep = () => {
    if (!input.trim() || submitted) return;
    clearTimeout(timerRef.current); setTimerActive(false);
    const result = scoreStep(input, step.id);
    const newScores = { ...scores, [step.id]: result.score };
    setScores(newScores);
    setFeedbacks(prev => ({ ...prev, [step.id]: result.feedback }));
    setSubmitted(true);
    onXP(result.score);
    const newStreak = result.passed ? state.stepStreak + 1 : 0;
    // badges
    const newBadges = computeBadgesToAward(state, { stepIdx, stepResult: result, phase: step.id, problem, scores: newScores, completed: state.completed, daysPracticed: state.daysPracticed, stepStreak: newStreak });
    newBadges.forEach(b => onAward(b));
  };

  const submitWhy = () => {
    if (whyChoice === null) return;
    const ok = whyChoice === step.why.correct;
    if (ok) { onXP(3); onToast("✓ Correct reasoning! +3 XP", "#22c55e"); }
    else onToast(`✗ ${step.why.explanation}`, "#f59e0b");
    setWhySubmitted(true);
  };

  const nextStep = () => {
    const isLast = stepIdx === problem.steps.length - 1;
    if (isLast) { setPhase("dryrun"); setSpecialChoice(null); setSpecialSubmitted(false); }
    else {
      setStepIdx(prev => prev + 1);
      setInput(""); setHintsShown(0); setSubmitted(false);
      setWhyChoice(null); setWhySubmitted(false);
      resetTimer();
    }
  };

  const submitSpecial = () => {
    if (specialChoice === null) return;
    const data = phase === "dryrun" ? problem.dryrun : phase === "pushback" ? problem.pushback : problem.followup;
    const ok = specialChoice === data.correct;
    if (ok) { onXP(5); onToast("✓ Correct! +5 XP", "#22c55e"); }
    else onToast(`✗ ${data.explanation}`, "#f59e0b");
    if (ok && phase === "dryrun") onAward("dry_runner");
    if (ok && phase === "pushback") onAward("pushback_ace");
    if (ok && phase === "followup") onAward("followup_ace");
    setSpecialSubmitted(true);
  };

  const advancePhase = () => {
    setSpecialChoice(null); setSpecialSubmitted(false);
    if (phase === "dryrun") setPhase("pushback");
    else if (phase === "pushback") setPhase("followup");
    else if (phase === "followup") {
      const allScores = problem.steps.reduce((acc, s) => ({ ...acc, [s.id]: scores[s.id] ?? 0 }), {});
      const total = Object.values(allScores).reduce((a, b) => a + b, 0);
      const pct = Math.round((total / (problem.steps.length * 10)) * 100);
      const newBadges = computeBadgesToAward(state, {
        problemComplete: true, finalPct: pct, problem, scores: allScores,
        completed: state.completed, daysPracticed: state.daysPracticed,
        simMode, allProblems: null,
      });
      newBadges.forEach(b => onAward(b));
      onComplete(problem.id, pct, allScores);
    }
  };

  const phaseLabel = { clarify: "Clarifying Questions", steps: step ? `Step ${stepIdx + 1}/${problem.steps.length}` : "Steps", dryrun: "Dry Run", pushback: "Interviewer Pushback", followup: "Follow-up Variant" }[phase];

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", color: "#e2e8f0", fontFamily: "system-ui,sans-serif", paddingBottom: 100 }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1a1a2e", position: "sticky", top: 0, background: "#07070f", zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, cursor: "pointer", padding: "6px 10px 6px 0" }}>← Back</button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {simMode && <span style={{ fontSize: 13, fontWeight: 800, color: timerColor, background: "#1a0000", padding: "4px 10px", borderRadius: 8, border: `1px solid ${timerColor}40` }}>⏱ {mins}:{secs.toString().padStart(2, "0")}</span>}
          <span style={{ fontSize: 11, color: "#475569", background: "#111118", padding: "3px 9px", borderRadius: 8 }}>{phaseLabel}</span>
        </div>
      </div>

      <PhaseBar currentPhase={phase} />

      <div style={{ padding: "0 16px" }}>
        <ProblemCard problem={problem} />

        {/* ── CLARIFY ── */}
        {phase === "clarify" && (
          <div style={{ background: "#111118", border: "1px solid #3d3d6e", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>❓</span>
              <div>
                <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Before You Solve</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Clarifying Questions</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14, lineHeight: 1.6 }}>
              Real interviewers expect you to ask questions before coding. Select every question you'd ask:
            </div>
            {problem.clarify.options.map((opt, i) => {
              const checked = clarifyChecked.includes(i);
              const isMust = problem.clarify.mustAsk.includes(i);
              let bg = "#0a0a14", border = "#1e1e2e", col = "#94a3b8";
              if (clarifySubmitted) {
                if (isMust && checked) { bg = "#052e16"; border = "#22c55e50"; col = "#22c55e"; }
                else if (isMust && !checked) { bg = "#1c0000"; border = "#ef444450"; col = "#ef4444"; }
                else if (!isMust && checked) { bg = "#1c1400"; border = "#f59e0b50"; col = "#f59e0b"; }
              } else if (checked) { bg = "#1a1a3e"; border = "#6366f1"; col = "#a5b4fc"; }
              return (
                <button key={i} onClick={() => { if (!clarifySubmitted) setClarifyChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); }} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, width: "100%", textAlign: "left",
                  background: bg, border: `1px solid ${border}`, borderRadius: 8,
                  padding: "10px 12px", marginBottom: 7, color: col, fontSize: 13,
                  cursor: clarifySubmitted ? "default" : "pointer", lineHeight: 1.5,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{checked ? "☑" : "☐"}</span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {clarifySubmitted && isMust && <span style={{ marginLeft: "auto", fontSize: 11, flexShrink: 0, color: checked ? "#22c55e" : "#ef4444" }}>{checked ? "✓ Key" : "✗ Missed"}</span>}
                </button>
              );
            })}
            {clarifySubmitted && (
              <div style={{ background: "#0a0f18", border: "1px solid #1e3a5e", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12 }}>
                💡 {problem.clarify.explanation}
              </div>
            )}
            {!clarifySubmitted
              ? <button onClick={submitClarify} disabled={clarifyChecked.length === 0} style={{ width: "100%", padding: "13px", background: clarifyChecked.length > 0 ? "#6366f1" : "#1e1e2e", color: clarifyChecked.length > 0 ? "#fff" : "#334155", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: clarifyChecked.length > 0 ? "pointer" : "default" }}>Submit Questions</button>
              : <button onClick={() => setPhase("steps")} style={{ width: "100%", padding: "13px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Start Solving →</button>
            }
          </div>
        )}

        {/* ── STEPS ── */}
        {phase === "steps" && step && (
          <div style={{ background: "#111118", border: `1px solid ${submitted ? "#2d2d4e" : "#3d3d6e"}`, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{step.emoji}</span>
              <div>
                <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Step {stepIdx + 1} of {problem.steps.length}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{step.label}</div>
              </div>
            </div>
            {/* Step dots */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {problem.steps.map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < stepIdx ? "#22c55e" : i === stepIdx ? "#6366f1" : "#1e1e2e", transition: "all 0.3s" }} />)}
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 12 }}>{step.prompt}</div>

            {/* Hints */}
            {!simMode && !submitted && (
              <div style={{ marginBottom: 10 }}>
                {[...Array(hintsShown)].map((_, i) => (
                  <div key={i} style={{ background: "#0d0d1e", border: "1px solid #1e1e3e", borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontSize: 12, color: "#94a3b8", display: "flex", gap: 8 }}>
                    <span style={{ color: "#6366f1" }}>💡</span>{problem.hints[i]}
                  </div>
                ))}
                {hintsShown < 3 && (
                  <button onClick={() => setHintsShown(h => h + 1)} style={{ background: "none", border: "1px dashed #2d2d4e", color: "#6366f1", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>
                    Hint ({3 - hintsShown} left)
                  </button>
                )}
              </div>
            )}

            {/* Answer input */}
            {!whySubmitted && (
              <>
                <VoiceInput value={input} onChange={setInput} disabled={submitted} />
                {!submitted && (
                  <button onClick={submitStep} disabled={!input.trim()} style={{
                    marginTop: 10, width: "100%", padding: "13px",
                    background: input.trim() ? "#6366f1" : "#1e1e2e",
                    color: input.trim() ? "#fff" : "#334155",
                    border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15,
                    cursor: input.trim() ? "pointer" : "default",
                  }}>Submit Answer</button>
                )}
              </>
            )}

            {/* Feedback */}
            {submitted && !whySubmitted && (() => {
              const sc = scores[step.id] ?? 0;
              return (
                <div style={{ marginTop: 10, background: sc >= 7 ? "#052e16" : sc >= 4 ? "#1c1400" : "#1c0000", border: `1px solid ${sc >= 7 ? "#22c55e30" : sc >= 4 ? "#f59e0b30" : "#ef444430"}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: sc >= 7 ? "#22c55e" : sc >= 4 ? "#f59e0b" : "#ef4444", fontSize: 14 }}>
                      {sc >= 7 ? "✓ Strong" : sc >= 4 ? "~ Partial" : "✗ Needs depth"}
                    </span>
                    <span style={{ color: "#94a3b8", fontWeight: 700 }}>{sc}/10</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{feedbacks[step.id]}</div>
                </div>
              );
            })()}

            {/* Why challenge */}
            {submitted && !whySubmitted && step.why && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🤔 Why? — Interviewer Challenge</div>
                <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, marginBottom: 12 }}>{step.why.question}</div>
                {step.why.options.map((opt, i) => {
                  let bg = "#0a0a18", border = "#1e1e2e", col = "#94a3b8";
                  if (whySubmitted) { if (i === step.why.correct) { bg = "#052e16"; border = "#22c55e50"; col = "#22c55e"; } else if (i === whyChoice && i !== step.why.correct) { bg = "#1c0000"; border = "#ef444450"; col = "#ef4444"; } }
                  else if (i === whyChoice) { bg = "#1a1a3e"; border = "#6366f1"; col = "#a5b4fc"; }
                  return <button key={i} onClick={() => !whySubmitted && setWhyChoice(i)} style={{ display: "block", width: "100%", textAlign: "left", background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 7, color: col, fontSize: 13, cursor: whySubmitted ? "default" : "pointer", lineHeight: 1.5 }}>{String.fromCharCode(65 + i)}. {opt}</button>;
                })}
                {!whySubmitted
                  ? <button onClick={submitWhy} disabled={whyChoice === null} style={{ width: "100%", padding: "11px", background: whyChoice !== null ? "#3b82f6" : "#1e1e2e", color: whyChoice !== null ? "#fff" : "#334155", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: whyChoice !== null ? "pointer" : "default" }}>Confirm</button>
                  : null
                }
              </div>
            )}

            {/* Next step button */}
            {whySubmitted && (
              <button onClick={nextStep} style={{ width: "100%", marginTop: 12, padding: "14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                {stepIdx === problem.steps.length - 1 ? "Dry Run →" : "Next Step →"}
              </button>
            )}
          </div>
        )}

        {/* ── DRY RUN ── */}
        {phase === "dryrun" && (
          <div>
            <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700, marginBottom: 10 }}>🔢 Trace Through — Dry Run</div>
            <MCQBlock data={problem.dryrun} choice={specialChoice} setChoice={setSpecialChoice} submitted={specialSubmitted} onSubmit={submitSpecial} onNext={advancePhase} nextLabel="Interviewer Pushback →" accentColor="#22c55e" />
          </div>
        )}

        {/* ── PUSHBACK ── */}
        {phase === "pushback" && (
          <div>
            <div style={{ background: "#1a0800", border: "1px solid #f59e0b30", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#f59e0b", lineHeight: 1.6 }}>
              🎤 Interviewer says: "{problem.pushback.challenge}"
            </div>
            <MCQBlock data={problem.pushback} choice={specialChoice} setChoice={setSpecialChoice} submitted={specialSubmitted} onSubmit={submitSpecial} onNext={advancePhase} nextLabel="Follow-up Question →" accentColor="#f59e0b" />
          </div>
        )}

        {/* ── FOLLOWUP ── */}
        {phase === "followup" && (
          <div>
            <div style={{ background: "#0d0a1e", border: "1px solid #a78bfa30", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#a78bfa", lineHeight: 1.6 }}>
              🚀 Every Meta interview ends with a twist. How would you adapt?
            </div>
            <MCQBlock data={problem.followup} choice={specialChoice} setChoice={setSpecialChoice} submitted={specialSubmitted} onSubmit={submitSpecial} onNext={advancePhase} nextLabel="See Results →" accentColor="#a78bfa" />
          </div>
        )}
      </div>
    </div>
  );
}
