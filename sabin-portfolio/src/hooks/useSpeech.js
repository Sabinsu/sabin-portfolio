import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

export const sttSupported = !!SpeechRecognition;
export const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

/** Browser speech synthesis (TTS) + speech recognition (STT). Both optional. */
export function useSpeech({ onResult, onError }) {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const cb = useRef({ onResult, onError });
  useEffect(() => { cb.current = { onResult, onError }; });

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    if (!ttsSupported || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/https?:\/\/\S+/g, "link"));
    utter.lang = "en-US";
    utter.rate = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    stopSpeaking();
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => cb.current.onResult?.(e.results[0][0].transcript);
    rec.onerror = (e) => {
      setListening(false);
      cb.current.onError?.(e.error === "not-allowed" ? "Microphone permission was denied." : "I couldn't hear that. Please try again.");
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [stopSpeaking]);

  useEffect(
    () => () => {
      if (ttsSupported) window.speechSynthesis.cancel();
      recRef.current?.abort?.();
    },
    []
  );

  return { speaking, listening, speak, stopSpeaking, startListening, stopListening };
}
