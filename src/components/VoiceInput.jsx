import { useState, useRef, useEffect } from "react";
import { createRecognition, isVoiceSupported } from "../engine/voice.js";

export function VoiceInput({ value, onChange, disabled, placeholder }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [supported] = useState(() => isVoiceSupported());
  const recognitionRef = useRef(null);
  // Save whatever text existed before recording started so we can prepend it.
  const baseTextRef = useRef("");

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    setError(null);
    // Capture current text as the base; voice transcript is appended after it.
    baseTextRef.current = value ? value.trimEnd() : "";

    const r = createRecognition({
      onResult: ({ finalText, interimText }) => {
        const base = baseTextRef.current;
        // Replace the whole value each time: base + accumulated finals + live interim marker.
        onChange(
          (base ? base + " " : "") +
          finalText +
          (interimText ? `[… ${interimText}]` : "")
        );
      },
      onEnd: (finalText) => {
        setListening(false);
        const base = baseTextRef.current;
        // Strip interim marker and set final clean value.
        onChange(((base ? base + " " : "") + finalText).trimEnd());
      },
      onError: (msg) => {
        setListening(false);
        setError(msg);
      },
    });

    if (!r) { setError("Voice not supported on this browser."); return; }
    recognitionRef.current = r;
    r.start();
    setListening(true);
  };

  const stop = () => { recognitionRef.current?.stop(); setListening(false); };
  VoiceInput.stop = stop;

  return (
    <div>
      {!disabled && supported && (
        <button onClick={toggle} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "9px 16px",
          borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 8,
          background: listening ? "#1c0000" : "#1a1a2e",
          color: listening ? "#ef4444" : "#a5b4fc",
          fontWeight: 700, fontSize: 13,
          boxShadow: listening ? "0 0 0 2px #ef444440" : "none",
        }}>
          <span style={{ fontSize: 18 }}>{listening ? "⏹" : "🎙️"}</span>
          {listening ? "Stop Recording" : "Speak Your Answer"}
        </button>
      )}
      {listening && (
        <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 6 }}>
          ● Recording — tap Stop when done
        </div>
      )}
      {error && (
        <div style={{ fontSize: 12, color: "#f59e0b", background: "#1c1400", border: "1px solid #f59e0b30", borderRadius: 8, padding: "7px 10px", marginBottom: 8 }}>
          ⚠️ {error}
        </div>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={supported ? "Tap 🎙️ to speak, or type your reasoning…" : (placeholder || "Type your reasoning…")}
        style={{
          width: "100%", minHeight: 110,
          background: listening ? "#0a0d14" : "#0a0a14",
          border: `1px solid ${listening ? "#ef444460" : disabled ? "#1e1e2e" : "#3d3d5e"}`,
          borderRadius: 10, color: "#e2e8f0", fontSize: 14, padding: "12px",
          resize: "vertical", fontFamily: "inherit", lineHeight: 1.6,
          boxSizing: "border-box", outline: "none",
        }}
      />
    </div>
  );
}
