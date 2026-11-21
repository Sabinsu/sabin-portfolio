import { useSyncExternalStore } from "react";

// Sound is OFF by default and only plays after the visitor turns it on.
let enabled = false;
try { enabled = localStorage.getItem("sound-enabled") === "1"; } catch { /* ignore */ }
let ctx = null;
const listeners = new Set();

export function useSoundEnabled() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => enabled,
    () => false
  );
}

export function toggleSound() {
  enabled = !enabled;
  try { localStorage.setItem("sound-enabled", enabled ? "1" : "0"); } catch { /* ignore */ }
  listeners.forEach((l) => l());
  if (enabled) blip(660);
}

export function blip(freq = 520, duration = 0.07) {
  if (!enabled) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch { /* audio unavailable */ }
}
