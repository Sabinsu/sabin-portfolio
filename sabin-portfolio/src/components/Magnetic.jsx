import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { isCoarsePointer } from "../utils/webgl";

/** Pulls its child slightly toward the cursor. */
export default function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  if (reduced || isCoarsePointer()) return <span className="inline-block">{children}</span>;

  const move = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${dx}px,${dy}px,0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = "translate3d(0,0,0)"; };

  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={leave} className="inline-block" style={{ transition: "transform 180ms ease-out" }}>
      {children}
    </span>
  );
}
