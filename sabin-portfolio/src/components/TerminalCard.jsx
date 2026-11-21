import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const LINES = [
  { prompt: "$", text: "Automation.init()", status: "ok" },
  { prompt: "$", text: "Scraper.run(target=site)", status: "ok" },
  { prompt: "$", text: "Data.process(pandas)", status: "ok" },
  { prompt: "$", text: "Team.lead(sprint=current)", status: "ok" },
  { prompt: "$", text: "System.deploy(env=aws)", status: "pending" },
];

export default function TerminalCard() {
  const reducedMotion = usePrefersReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? LINES.length : 0);

  useEffect(() => {
    if (reducedMotion || visibleCount >= LINES.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 480);
    return () => clearTimeout(timer);
  }, [visibleCount, reducedMotion]);

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-ink-300/15 bg-ink-900 shadow-[0_0_60px_-15px_rgba(47,111,237,0.35)]">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" aria-hidden="true" />
        <span className="ml-3 font-mono text-[11px] text-ink-300">automation.py — session</span>
      </div>

      <div className="space-y-3 p-5 font-mono text-[13px] leading-relaxed">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <div key={line.text} className="flex items-start gap-2">
            <span className="text-brand-400">{line.prompt}</span>
            <span className="text-slate-200">{line.text}</span>
            {i < visibleCount - 1 || (i === visibleCount - 1 && visibleCount === LINES.length) ? (
              <StatusDot status={line.status} />
            ) : null}
          </div>
        ))}
        {visibleCount < LINES.length && (
          <span className="inline-block h-4 w-2 animate-blink bg-brand-400" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  return (
    <span
      className={`ml-auto mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
        status === "ok" ? "bg-green-400" : "bg-yellow-400"
      }`}
      aria-hidden="true"
    />
  );
}
