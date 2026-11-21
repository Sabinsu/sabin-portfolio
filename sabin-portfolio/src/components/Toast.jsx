import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ message, type = "success", onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const Icon = type === "error" ? XCircle : CheckCircle2;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-ink-300/20 bg-white px-4 py-3 text-sm font-medium text-ink-900 shadow-xl dark:bg-ink-800 dark:text-white"
    >
      <Icon
        size={16}
        className={type === "error" ? "text-red-500" : "text-brand-500"}
        aria-hidden="true"
      />
      {message}
    </div>
  );
}
