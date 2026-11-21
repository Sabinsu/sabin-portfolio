import { lazy, Suspense, useRef, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { hasWebGL, isSmallScreen } from "../utils/webgl";

const AerospaceScene = lazy(() => import("../components/three/AerospaceScene"));

const INFO = {
  planet: "A ringed planet with a moon on a tilted orbit. Drag to spin the system.",
  station: "A space station with a rotating habitat ring and solar panels, circling the planet.",
  spacecraft: "A spacecraft flying a looping elliptical path around the system.",
};

export default function Aerospace() {
  const [ref, inView] = useInView("150px");
  const reduced = usePrefersReducedMotion();
  const rotation = useRef({ x: 0.15, y: 0 });
  const drag = useRef(null);
  const [selected, setSelected] = useState(null);
  const canRender = !reduced && hasWebGL();

  const down = (e) => { drag.current = { x: e.clientX, y: e.clientY }; };
  const move = (e) => {
    if (!drag.current) return;
    rotation.current.y += (e.clientX - drag.current.x) * 0.01;
    rotation.current.x = Math.max(-0.7, Math.min(0.7, rotation.current.x + (e.clientY - drag.current.y) * 0.005));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const up = () => { drag.current = null; };

  return (
    <section id="aerospace" className="scroll-mt-20 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Aerospace exploration zone">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 04 · Aerospace Zone"
            title="A little room for exploration"
            description="A visual playground that reflects my curiosity about technology and innovation. Drag to rotate, and click the objects."
          />
        </Reveal>

        <Reveal>
          <div
            ref={ref}
            className="glass neon-border relative h-[22rem] overflow-hidden rounded-2xl sm:h-[28rem]"
            style={{ touchAction: "pan-y" }}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
          >
            {canRender && inView ? (
              <Suspense fallback={null}>
                <AerospaceScene rotation={rotation} onSelect={setSelected} lite={isSmallScreen()} />
              </Suspense>
            ) : (
              <div className="flex h-full items-center justify-center" aria-hidden="true">
                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-brand-600 to-brand-900 shadow-[0_0_80px_-10px_rgba(47,111,237,0.7)]" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent p-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-300">
                {selected ? selected : "Drag · Click objects"}
              </p>
              <p className="mt-1 text-sm text-slate-200" aria-live="polite">
                {selected ? INFO[selected] : "Planet, station and spacecraft are interactive."}
              </p>
            </div>
          </div>
        </Reveal>
        {!canRender && (
          <p className="mt-3 text-xs text-ink-400">The interactive 3D view is disabled (reduced motion or no WebGL support).</p>
        )}
      </div>
    </section>
  );
}
