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

  r.onresult = (e) => {
    let finalText = "", interimText = "";
    for (let i = 0; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
      else interimText += e.results[i][0].transcript;
    }
    onResult({ finalText, interimText });
  };

  r.onerror = (e) => {
    const msg = e.error === "not-allowed" ? "Microphone permission denied."
              : e.error === "no-speech"   ? "No speech detected. Try again."
              : "Voice error — try again.";
    onError(msg);
  };

  r.onend = () => onEnd();

  return r;
}
