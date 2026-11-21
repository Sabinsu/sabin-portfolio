import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { profile } from "../data/profile";

export default function PrivacyModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("privacy:open", onOpen);
    return () => window.removeEventListener("privacy:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl p-6 text-sm leading-relaxed text-ink-600 dark:text-slate-300 sm:p-8"
      >
        <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close privacy notice" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-ink-300/25 hover:text-brand-500">
          <X size={16} aria-hidden="true" />
        </button>
        <h2 id="privacy-title" className="font-display text-xl font-semibold text-ink-900 dark:text-white">Privacy notice</h2>
        <div className="mt-4 space-y-4">
          <section>
            <h3 className="font-semibold text-ink-900 dark:text-white">What is collected</h3>
            <p>When you register: your name, mobile number, your consent, a timestamp, and the page / referring site. Nothing is collected silently, and your visit is not identified automatically.</p>
          </section>
          <section>
            <h3 className="font-semibold text-ink-900 dark:text-white">Why</h3>
            <p>So {profile.name} can respond to enquiries and understand which professionals are visiting the portfolio.</p>
          </section>
          <section>
            <h3 className="font-semibold text-ink-900 dark:text-white">Where it goes</h3>
            <p>Your details are emailed to {profile.name} through a transactional email provider (Resend) and may be kept in a secure database for up to 90 days, after which they are automatically deleted. The site is hosted on Vercel. Copies in the email inbox are deleted on request.</p>
          </section>
          <section>
            <h3 className="font-semibold text-ink-900 dark:text-white">AI assistant</h3>
            <p>Messages you send to the assistant are processed by an AI provider through a secure server to generate replies. Please don&apos;t share sensitive personal information in the chat. Voice features use your browser&apos;s built-in speech services.</p>
          </section>
          <section>
            <h3 className="font-semibold text-ink-900 dark:text-white">Analytics</h3>
            <p>Anonymous analytics (page views, sections viewed, project clicks, referrer host, device type) run only if you accept the analytics prompt. No cookies, no tracking IDs.</p>
          </section>
          <section>
            <h3 className="font-semibold text-ink-900 dark:text-white">Your rights</h3>
            <p>To see or delete your data, email <a className="text-brand-500 underline" href={profile.social.email}>{profile.email}</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
