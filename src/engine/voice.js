export function isVoiceSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognition({ onResult, onEnd, onError }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const r = new SR();
  r.continuous = true;
  r.interimResults = true;
  r.lang = "en-US";

  // Accumulate finalized text across the whole session in closure.
  // Only process NEW results using e.resultIndex to avoid re-reading old ones.
  let finalTranscript = "";

  r.onresult = (e) => {
    let interimText = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript + " ";
      } else {
        interimText += e.results[i][0].transcript;
      }
    }
    onResult({ finalText: finalTranscript, interimText });
  };

  r.onerror = (e) => {
    const msg = e.error === "not-allowed" ? "Microphone permission denied."
              : e.error === "no-speech"   ? "No speech detected. Try again."
              : "Voice error — try again.";
    onError(msg);
  };

  // Pass accumulated final transcript to onEnd so component can clean up interim markers.
  r.onend = () => onEnd(finalTranscript);

  return r;
}
