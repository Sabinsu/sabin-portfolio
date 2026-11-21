import { useEffect, useRef, useState } from "react";

/** Returns [ref, inView]. Used to mount/unmount heavy canvases only near the viewport. */
export function useInView(rootMargin = "200px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
