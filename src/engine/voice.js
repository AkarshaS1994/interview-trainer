export function isVoiceSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognition({ onResult, onEnd, onError }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  let finalTranscript = "";
  let active = true;
  let instance = null;

  function launch() {
    const r = new SR();
    // continuous=false avoids the browser bug where the same interim results
    // are re-emitted in a loop. We restart manually on each onend instead.
    r.continuous = false;
    r.interimResults = true;
    r.lang = "en-US";

    r.onresult = (e) => {
      let interimText = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript + " ";
        } else {
          interimText += e.results[i][0].transcript;
        }
      }
      onResult({ finalText: finalTranscript.trimEnd(), interimText });
    };

    r.onerror = (e) => {
      if (e.error === "no-speech") {
        // Restart silently on timeout — user just paused
        if (active) launch();
        return;
      }
      active = false;
      const msg =
        e.error === "not-allowed"
          ? "Microphone permission denied."
          : "Voice error — try again.";
      onError(msg);
    };

    r.onend = () => {
      if (active) {
        launch(); // keep recording until user explicitly stops
      } else {
        onEnd(finalTranscript.trimEnd());
      }
    };

    instance = r;
    r.start();
  }

  launch();

  return {
    stop() {
      active = false;
      try {
        instance?.stop();
      } catch (_) {}
    },
  };
}
