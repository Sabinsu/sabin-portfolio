import { useId, useState } from "react";
import { Plus } from "lucide-react";

/**
 * A card that looks like a closed box. Tap / click / press Enter to lift the lid
 * and reveal more information. Works with touch, mouse and keyboard.
 */
export default function OpenBox({ icon: Icon, badge, title, summary, items = [], footer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  const toggle = () => {
    setOpen((v) => !v);
    try { navigator.vibrate?.(12); } catch { /* haptics unsupported */ }
  };

  return (
    <div className="ob glass rounded-xl" data-open={open}>
      <span className="ob-lid" aria-hidden="true" />
      <span className="ob-glow" aria-hidden="true" />
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="relative z-[1] flex w-full items-start gap-4 rounded-xl p-5 pt-6 text-left active:scale-[0.99]"
      >
        {Icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 dark:text-cyan-300">
            <Icon size={20} aria-hidden="true" />
          </span>
        )}
        {badge && <span className="mt-0.5 font-mono text-sm text-brand-500 dark:text-cyan-300">{badge}</span>}
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-semibold text-ink-900 dark:text-white">{title}</span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-500 dark:text-ink-300">{summary}</span>
          <span className="ob-hint mt-2 inline-block font-mono text-[11px] uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
            {open ? "Tap to close" : "Tap to open"}
          </span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/50 text-cyan-600 dark:text-cyan-300">
          <Plus size={18} className="ob-plus" aria-hidden="true" />
        </span>
      </button>

      <div id={panelId} role="region" aria-label={`${title} details`} className="ob-content relative z-[1]" aria-hidden={!open} inert={!open}>
        <div>
          <ul className="space-y-2 px-5 pb-5">
            {items.map((text, i) => (
              <li key={text} className="ob-item flex items-start gap-3 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-3.5 py-2.5 text-sm text-ink-700 dark:text-slate-200" style={{ "--i": i }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                {text}
              </li>
            ))}
            {footer && (
              <li className="ob-item px-1 pt-1" style={{ "--i": items.length }}>
                {footer}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
