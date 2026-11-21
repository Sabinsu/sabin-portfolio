import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 left-4 z-30 sm:left-6 flex h-11 w-11 items-center justify-center rounded-full border border-ink-300/25 bg-white text-ink-700 shadow-lg transition-colors hover:border-brand-500/50 hover:text-brand-500 dark:bg-ink-800 dark:text-slate-200"
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
