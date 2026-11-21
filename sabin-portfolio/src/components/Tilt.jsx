import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { isCoarsePointer } from "../utils/webgl";

/** 3D tilt-on-hover wrapper (desktop pointers only). */
export default function Tilt({ children, max = 7, className = "" }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const enabled = !reduced && !isCoarsePointer();

  if (!enabled) return <div className={className}>{children}</div>;

  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={className} style={{ transition: "transform 160ms ease-out", willChange: "transform" }}>
      {children}
    </div>
  );
}
