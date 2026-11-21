import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { getConsent, setConsent } from "../utils/analytics";
import { openPrivacy } from "../utils/privacy";

export default function ConsentBanner({ active }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active || getConsent() !== null) return;
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [active]);

  if (!visible) return null;
  const choose = (v) => { setConsent(v); setVisible(false); };

  return (
    <div role="region" aria-label="Analytics consent" className="glass-strong safe-bottom fixed inset-x-3 bottom-[7.5rem] z-40 rounded-xl p-4 text-sm shadow-xl sm:inset-x-auto sm:bottom-4 sm:left-5 sm:max-w-xs sm:text-xs">
      <p className="flex items-center gap-2 font-semibold text-ink-900 dark:text-white"><BarChart3 size={14} className="text-cyan-400" aria-hidden="true" /> Anonymous analytics?</p>
      <p className="mt-1.5 leading-relaxed text-ink-500 dark:text-ink-300">Help Sabin understand what's useful: page views, sections and project clicks. No cookies, no personal data.{" "}
        <button type="button" onClick={openPrivacy} className="underline hover:text-brand-500">Details</button></p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("granted")} className="min-h-11 flex-1 rounded-md bg-brand-500 px-4 font-semibold text-white hover:bg-brand-600 sm:min-h-0 sm:flex-none sm:px-3 sm:py-1.5">Allow</button>
        <button type="button" onClick={() => choose("denied")} className="min-h-11 flex-1 rounded-md border border-ink-300/30 px-4 font-semibold text-ink-600 hover:border-brand-500 dark:text-slate-300 sm:min-h-0 sm:flex-none sm:px-3 sm:py-1.5">No thanks</button>
      </div>
    </div>
  );
}
