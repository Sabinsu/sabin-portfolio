import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Short branded intro, shown once per browser session. */
export default function LoadingScreen({ onDone }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const duration = reduced ? 150 : 1100;
    const start = performance.now();
    let raf;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        setTimeout(onDone, reduced ? 0 : 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduced]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950 transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      <div className="holo-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 font-display text-3xl font-bold text-white glow-blue">
        S
        <span className="absolute inset-0 rounded-2xl border border-cyan-300/60" style={{ animation: "pulse-ring 1.4s ease-out infinite" }} aria-hidden="true" />
      </div>
      <p className="relative mt-6 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Initializing digital universe</p>
      <div className="relative mt-4 h-0.5 w-48 overflow-hidden rounded bg-white/10" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-300" style={{ width: `${progress * 100}%` }} />
      </div>
      <span className="sr-only">Loading portfolio</span>
    </div>
  );
}
