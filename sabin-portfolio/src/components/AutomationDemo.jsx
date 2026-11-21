import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Illustrative sample data only. Not a real site and not real results.
const ROWS = [
  { name: "Sample item 01", price: "12.00", stock: "In stock" },
  { name: "Sample item 02", price: "8.50", stock: "In stock" },
  { name: "Sample item 03", price: "21.00", stock: "Low" },
  { name: "Sample item 04", price: "5.25", stock: "In stock" },
  { name: "Sample item 05", price: "14.90", stock: "Out" },
];

export default function AutomationDemo() {
  const [ref, inView] = useInView("0px");
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(reduced ? ROWS.length : 0);
  const [run, setRun] = useState(1);

  useEffect(() => {
    if (reduced || !inView) return;
    if (step >= ROWS.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1000);
    return () => clearTimeout(t);
  }, [step, inView, reduced, run]);

  const replay = () => { setStep(0); setRun((r) => r + 1); };
  const done = step >= ROWS.length;

  return (
    <div ref={ref} className="grid gap-5 lg:grid-cols-2">
      {/* animated browser window */}
      <div className="glass neon-border overflow-hidden rounded-xl">
        <div className="flex items-center gap-2 border-b border-ink-300/15 px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </span>
          <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-ink-100/70 px-3 py-1 font-mono text-[11px] text-ink-500 dark:bg-ink-900/70">https://sample-site.example/products</span>
        </div>
        <div className="p-4">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Sample product table being scraped</caption>
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                <th className="pb-2 font-medium">Item</th><th className="pb-2 font-medium">Price</th><th className="pb-2 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => {
                const extracted = i < step;
                const active = i === step && !done;
                return (
                  <tr key={r.name} className={`border-t border-ink-300/10 transition-colors duration-300 ${active ? "bg-cyan-400/15" : extracted ? "bg-brand-500/[0.06]" : ""}`}>
                    <td className="py-2 pr-2 text-ink-800 dark:text-slate-100">{r.name}</td>
                    <td className="py-2 pr-2 font-mono text-ink-600 dark:text-slate-300">{r.price}</td>
                    <td className="py-2 font-mono text-xs text-ink-500 dark:text-slate-400">{r.stock}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* terminal output */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-[0_0_50px_-20px_rgba(34,211,238,0.5)]">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
          <span className="font-mono text-[11px] text-ink-300">scraper.py — output</span>
          <button type="button" onClick={replay} className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-cyan-300 hover:border-cyan-300/50">
            {done ? <RotateCcw size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />} {done ? "Replay" : "Restart"}
          </button>
        </div>
        <div className="min-h-[15rem] space-y-1.5 p-4 font-mono text-[12px] leading-relaxed" aria-live="off">
          <p className="text-brand-300">$ python scraper.py --target sample-site</p>
          <p className="text-slate-400">[browser] launching headless Chromium…</p>
          {step >= 0 && <p className="text-slate-400">[browser] loaded /products</p>}
          {ROWS.slice(0, step).map((r, i) => (
            <p key={r.name} className="text-slate-200">
              <span className="text-green-400">[ok]</span> row {i + 1} → {`{"name":"${r.name}","price":${r.price}}`}
            </p>
          ))}
          {done ? (
            <>
              <p className="text-slate-400">[pandas] cleaned {ROWS.length} rows, dropped 0 duplicates</p>
              <p className="text-green-400">[done] saved → output.xlsx</p>
            </>
          ) : (
            <span className="inline-block h-3.5 w-2 animate-blink bg-cyan-300" aria-hidden="true" />
          )}
        </div>
      </div>
      <p className="text-xs text-ink-400 lg:col-span-2">Illustrative demo with sample data. It shows the shape of a browser automation → extraction → processing → output run, not a real site or real results.</p>
    </div>
  );
}
