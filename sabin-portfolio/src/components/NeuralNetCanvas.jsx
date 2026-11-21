import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const LAYERS = [3, 5, 5, 2];
const NAMES = ["Input layer", "Hidden layer 1", "Hidden layer 2", "Output layer"];
const INFO = [
  "Input neurons receive raw features, such as numbers extracted from data.",
  "Hidden neurons combine weighted inputs and apply an activation function.",
  "Deeper hidden layers build more abstract combinations of earlier signals.",
  "Output neurons turn the final signals into a prediction or score.",
];

/** Concept visualisation of a feed-forward network. NOT a trained model. */
export default function NeuralNetCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [inViewRef, inView] = useInView("0px");
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null);
  const wave = useRef(-1);
  const sel = useRef(null);
  useEffect(() => { sel.current = selected; });

  const layout = useCallback((w, h) => {
    const pad = 36;
    return LAYERS.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: pad + (li * (w - pad * 2)) / (LAYERS.length - 1), y: (h / (n + 1)) * (i + 1) })));
  }, []);

  const draw = useCallback((t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // canvas unavailable: the text description below still works
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr, h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const nodes = layout(w, h);
    const wv = wave.current;
    // edges
    for (let l = 0; l < nodes.length - 1; l++) {
      const glow = wv >= 0 ? Math.max(0, 1 - Math.abs(wv - (l + 0.5)) / 0.8) : 0;
      nodes[l].forEach((a, ai) => nodes[l + 1].forEach((b, bi) => {
        const isSel = sel.current && ((sel.current.l === l && sel.current.i === ai) || (sel.current.l === l + 1 && sel.current.i === bi));
        ctx.strokeStyle = isSel ? "rgba(34,211,238,0.85)" : `rgba(85,144,253,${0.16 + glow * 0.6})`;
        ctx.lineWidth = isSel ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }));
    }
    // nodes
    nodes.forEach((layer, l) => layer.forEach((p, i) => {
      const glow = wv >= 0 ? Math.max(0, 1 - Math.abs(wv - l) / 0.7) : 0;
      const idle = reduced ? 0 : (Math.sin(t / 700 + l * 1.3 + i) + 1) * 0.12;
      const isSel = sel.current && sel.current.l === l && sel.current.i === i;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isSel ? 10 : 7 + glow * 3, 0, Math.PI * 2);
      ctx.fillStyle = isSel ? "#22d3ee" : `rgba(34,211,238,${0.45 + idle + glow * 0.5})`;
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 6 + glow * 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    }));
  }, [layout, reduced]);

  // sizing
  useEffect(() => {
    const el = wrapRef.current, canvas = canvasRef.current;
    if (!el || !canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = el.clientWidth, h = Math.max(220, Math.min(300, w * 0.6));
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      draw(performance.now());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [draw]);

  // animation loop (only while visible)
  useEffect(() => {
    if (!inView) return;
    let raf;
    const loop = (t) => {
      if (wave.current >= 0) {
        wave.current += 0.025;
        if (wave.current > LAYERS.length) wave.current = -1;
      }
      draw(t);
      if (!reduced || wave.current >= 0) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, draw, reduced]);

  const pick = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const nodes = layout(r.width, r.height);
    let best = null, bd = 18;
    nodes.forEach((layer, l) => layer.forEach((p, i) => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = { l, i }; } }));
    setSelected(best);
    if (!reduced) draw(performance.now());
    else draw(0);
  };

  const run = () => {
    wave.current = 0;
    if (reduced) { wave.current = 1.5; draw(0); setTimeout(() => { wave.current = -1; draw(0); }, 800); }
  };

  return (
    <div ref={(n) => { wrapRef.current = n; inViewRef.current = n; }} className="glass neon-border rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 pb-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-400">Interactive neural network (concept)</p>
        <button type="button" onClick={run} className="flex items-center gap-1.5 rounded-md border border-cyan-400/40 px-3 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-400/10 dark:text-cyan-300">
          <Play size={12} aria-hidden="true" /> Run signal
        </button>
      </div>
      <canvas ref={canvasRef} onPointerDown={pick} role="img" aria-label="Feed-forward neural network with four layers. Click a neuron to learn what its layer does." className="w-full cursor-pointer touch-pan-y" />
      <p className="mt-3 min-h-[2.75rem] text-sm text-ink-600 dark:text-slate-300" aria-live="polite">
        {selected ? <><strong className="text-ink-900 dark:text-white">{NAMES[selected.l]} · neuron {selected.i + 1}.</strong> {INFO[selected.l]}</> : "Click any neuron to see what its layer does, or press Run signal."}
      </p>
      <p className="text-[11px] text-ink-400">Illustrative visual of how a network works. This is not a trained model.</p>
    </div>
  );
}
