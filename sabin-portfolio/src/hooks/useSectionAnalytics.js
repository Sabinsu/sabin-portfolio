import { useEffect } from "react";
import { track } from "../utils/analytics";

/** Reports each section once per page load when it becomes visible (only if consent was given). */
export function useSectionAnalytics(ids, enabled) {
  useEffect(() => {
    if (!enabled) return;
    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !seen.has(e.target.id)) { seen.add(e.target.id); track("section", e.target.id); }
      }),
      { threshold: 0.4 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [ids, enabled]);
}
