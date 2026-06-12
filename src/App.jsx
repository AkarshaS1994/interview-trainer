import { useState, useEffect, useCallback } from "react";
import { HomeScreen } from "./screens/HomeScreen.jsx";
import { ProblemScreen } from "./screens/ProblemScreen.jsx";
import { ResultsScreen } from "./screens/ResultsScreen.jsx";
import { Toast } from "./components/Toast.jsx";
import { ALL_PROBLEMS } from "./data/index.js";
import { BADGES } from "./data/badges.js";
import { loadPersisted, savePersisted } from "./engine/storage.js";
import { computeLevel, getLevelUpMessage } from "./engine/levels.js";

const INITIAL_STATE = {
  xp: 0,
  badges: [],
  completed: {},
  patternStats: {},
  daysPracticed: [],
  stepStreak: 0,
  sessionHistory: [],
  notes: {},
};

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [screen, setScreen] = useState("home");
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeScores, setActiveScores] = useState({});
  const [simMode, setSimMode] = useState(false);
  const [toast, setToast] = useState(null);

  // Load persisted state on mount
  useEffect(() => {
    const saved = loadPersisted();
    if (saved) setState(prev => ({ ...prev, ...saved }));
  }, []);

  // Save on state change
  useEffect(() => { savePersisted(state); }, [state]);

  const showToast = useCallback((msg, color = "#6366f1") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleXP = useCallback((amount) => {
    setState(prev => {
      const oldXp = prev.xp;
      const newXp = oldXp + amount;
      const levelUp = getLevelUpMessage(oldXp, newXp);
      if (levelUp.leveledUp) {
        setTimeout(() => {
          showToast(`🎉 Level Up! → ${levelUp.label}${levelUp.unlocked ? " · " + levelUp.unlocked : ""}`, "#a78bfa");
        }, 500);
      }
      return { ...prev, xp: newXp };
    });
  }, [showToast]);

  const handleAward = useCallback((badgeId) => {
    setState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) setTimeout(() => showToast(`🏅 ${badge.emoji} ${badge.label} unlocked!`, "#a78bfa"), 200);
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, [showToast]);

  const startProblem = useCallback((problem, sim = false) => {
    setActiveProblem(problem);
    setActiveScores({});
    setSimMode(sim);
    const today = new Date().toDateString();
    setState(prev => ({
      ...prev,
      daysPracticed: prev.daysPracticed.includes(today) ? prev.daysPracticed : [...prev.daysPracticed, today],
    }));
    setScreen("problem");
  }, []);

  const handleComplete = useCallback((problemId, pct, scores) => {
    setActiveScores(scores);
    setState(prev => {
      const pat = activeProblem?.pattern;
      const patternStats = { ...prev.patternStats };
      if (pat) {
        const cur = patternStats[pat] || { exposure: 0, correct: 0 };
        patternStats[pat] = { exposure: cur.exposure + 1, correct: cur.correct + (pct >= 60 ? 1 : 0) };
      }
      const entry = {
        id: problemId,
        title: activeProblem?.title,
        pattern: pat,
        difficulty: activeProblem?.difficulty,
        score: pct,
        timestamp: Date.now(),
        date: new Date().toDateString(),
      };
      return {
        ...prev,
        completed: { ...prev.completed, [problemId]: { score: pct, timestamp: Date.now(), date: new Date().toDateString() } },
        patternStats,
        sessionHistory: [entry, ...(prev.sessionHistory || [])].slice(0, 20),
      };
    });
    setScreen("results");
  }, [activeProblem]);

  const handleNote = useCallback((problemId, text) => {
    setState(prev => ({ ...prev, notes: { ...prev.notes, [problemId]: text } }));
  }, []);

  return (
    <div>
      <Toast toast={toast} />
      {screen === "home" && (
        <HomeScreen state={state} problems={ALL_PROBLEMS} onStart={startProblem} />
      )}
      {screen === "problem" && activeProblem && (
        <ProblemScreen
          problem={activeProblem}
          simMode={simMode}
          state={state}
          onComplete={handleComplete}
          onBack={() => setScreen("home")}
          onAward={handleAward}
          onXP={handleXP}
          onToast={showToast}
        />
      )}
      {screen === "results" && activeProblem && (
        <ResultsScreen
          problem={activeProblem}
          scores={activeScores}
          completed={state.completed}
          simMode={simMode}
          note={state.notes?.[activeProblem.id] || ""}
          onNote={handleNote}
          onRetry={() => startProblem(activeProblem, simMode)}
          onHome={() => setScreen("home")}
        />
      )}
    </div>
  );
}
