import { lazy, Suspense, useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { hasWebGL, isSmallScreen } from "../utils/webgl";

const BackgroundScene = lazy(() => import("./three/BackgroundScene"));

/**
 * Mounts the heavy 3D background only after the page is idle, only when WebGL
 * is available and the visitor hasn't asked for reduced motion. Otherwise the
 * CSS ambient gradient + holographic grid act as the fallback.
 */
export default function SceneBackground() {
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced || !hasWebGL()) return;
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <>
      <div className="ambient-bg" aria-hidden="true" />
      <div className="holo-grid pointer-events-none fixed inset-x-0 top-0 -z-10 h-[70vh] opacity-60" aria-hidden="true" />
      {ready && (
        <Suspense fallback={null}>
          <BackgroundScene isDark={theme === "dark"} lite={isSmallScreen()} />
        </Suspense>
      )}
    </>
  );
}
