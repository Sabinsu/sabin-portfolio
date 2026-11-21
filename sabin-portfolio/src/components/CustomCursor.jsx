import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Subtle glowing cursor ring for desktop. The native cursor stays visible. */
export default function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let x = -100, y = -100, rx = -100, ry = -100, scale = 1, raf;
    const interactive = "a,button,[role='button'],input,textarea,select,label,summary";
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      scale = e.target instanceof Element && e.target.closest(interactive) ? 1.7 : 1;
    };
    const tick = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px,${y - 3}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 17}px,${ry - 17}px,0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[120] hidden [@media(pointer:fine)]:block" aria-hidden="true">
      <div ref={ring} className="absolute left-0 top-0 h-[34px] w-[34px] rounded-full border border-cyan-400/60 transition-[scale] duration-150" style={{ transform: "translate3d(-100px,-100px,0)" }} />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ transform: "translate3d(-100px,-100px,0)" }} />
    </div>
  );
}
