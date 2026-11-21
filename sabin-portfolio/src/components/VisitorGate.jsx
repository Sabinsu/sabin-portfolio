import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { COUNTRY_CODES, markRegistered } from "../utils/visitor";
import { openPrivacy } from "../utils/privacy";

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u;

export default function VisitorGate({ onEnter }) {
  const [name, setName] = useState("");
  const [cc, setCc] = useState("+977");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | unavailable | error
  const [message, setMessage] = useState("");
  const [shownAt] = useState(() => Date.now());
  const dialogRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keep keyboard focus inside the dialog.
  const onKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const nodes = dialogRef.current?.querySelectorAll("a[href],button:not([disabled]),input:not([tabindex='-1']),select");
    if (!nodes?.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const validate = () => {
    const errs = {};
    const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
    if (!NAME_RE.test(name.trim())) errs.name = "Please enter your full name (letters only, at least 2 characters).";
    if (digits.length < 6 || cc.replace("+", "").length + digits.length > 15) errs.phone = "Enter a valid mobile number without the country code.";
    if (!consent) errs.consent = "Please tick the consent box to continue.";
    setErrors(errs);
    return { ok: Object.keys(errs).length === 0, digits };
  };

  const enter = () => { markRegistered(); onEnter(); };

  const submit = async (e) => {
    e.preventDefault();
    const { ok, digits } = validate();
    if (!ok || status === "loading") return;
    setStatus("loading");
    setMessage("");
    let host = "direct";
    try { host = document.referrer ? new URL(document.referrer).hostname : "direct"; } catch { /* ignore */ }
    try {
      const res = await fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `${cc}${digits}`,
          consent: true,
          website,
          elapsed: Date.now() - shownAt,
          page: window.location.pathname,
          referrer: host,
        }),
      });
      if (res.ok) {
        setStatus("success");
        markRegistered();
        setTimeout(onEnter, 1600);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 400) {
        setStatus("idle");
        setErrors({
          name: data.error === "invalid_name" ? "That name doesn't look valid." : undefined,
          phone: data.error === "invalid_phone" ? "That number doesn't look valid." : undefined,
          consent: data.error === "consent_required" ? "Consent is required." : undefined,
        });
      } else if (res.status === 429) {
        setStatus("error");
        setMessage("Too many attempts. Please wait a while and try again.");
      } else {
        setStatus("unavailable");
        setMessage("The registration service isn't available right now, so your details were NOT sent. You can still explore the portfolio.");
      }
    } catch {
      setStatus("unavailable");
      setMessage("Couldn't reach the registration service, so your details were NOT sent. You can still explore the portfolio.");
    }
  };

  const field = "w-full rounded-lg border bg-white/80 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-cyan-400 dark:bg-ink-900/70 dark:text-white";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink-950/85 p-4 backdrop-blur-md" onKeyDown={onKeyDown}>
      <div className="holo-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-sub"
        className="glass-strong neon-border relative my-auto w-full max-w-md rounded-2xl p-6 shadow-2xl glow-blue sm:p-8"
      >
        {status === "success" ? (
          <div className="py-10 text-center" role="status">
            <CheckCircle2 size={56} className="mx-auto text-cyan-300" style={{ animation: "fade-up .5s both" }} aria-hidden="true" />
            <h2 className="mt-5 font-display text-2xl font-semibold text-ink-900 dark:text-white">Welcome, {name.trim().split(" ")[0]}!</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">Entering Sabin&apos;s Digital Universe…</p>
          </div>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-500 dark:text-cyan-300">Visitor registration</p>
            <h2 id="gate-title" className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-white sm:text-3xl">
              Welcome to <span className="text-gradient">Sabin&apos;s Digital Universe</span>
            </h2>
            <p id="gate-sub" className="mt-2 text-sm text-ink-500 dark:text-ink-300">Before exploring, please introduce yourself.</p>

            <form onSubmit={submit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="gate-name" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-slate-200">Full name</label>
                <input id="gate-name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? "gate-name-err" : undefined}
                  className={`${field} ${errors.name ? "border-red-400" : "border-ink-300/25"}`} />
                {errors.name && <p id="gate-name-err" className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="gate-phone" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-slate-200">Mobile number</label>
                <div className="flex gap-2">
                  <select aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)} className={`${field} w-28 shrink-0 border-ink-300/25 px-2`}>
                    {COUNTRY_CODES.map((c) => <option key={c.code + c.label} value={c.code}>{c.label}</option>)}
                  </select>
                  <input id="gate-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))} type="tel" inputMode="tel" autoComplete="tel-national" maxLength={16}
                    aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "gate-phone-err" : undefined}
                    className={`${field} min-w-0 ${errors.phone ? "border-red-400" : "border-ink-300/25"}`} />
                </div>
                {errors.phone && <p id="gate-phone-err" className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* honeypot: hidden from people, visible to naive bots */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ink-600 dark:text-slate-300">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
                    aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "gate-consent-err" : undefined} />
                  <span>I agree that my name and mobile number are sent to Sabin so he can respond to enquiries and understand professional visitors. They are kept for up to 90 days.</span>
                </label>
                {errors.consent && <p id="gate-consent-err" className="mt-1 text-xs text-red-500">{errors.consent}</p>}
              </div>

              {(status === "unavailable" || status === "error") && (
                <p role="alert" className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-700 dark:text-amber-200">{message}</p>
              )}

              {status === "unavailable" ? (
                <button type="button" onClick={enter} className="w-full rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
                  Continue without registering
                </button>
              ) : (
                <button type="submit" disabled={status === "loading"} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-70">
                  {status === "loading" ? (<><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Registering…</>) : "Continue"}
                </button>
              )}

              <p className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-400">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
                <span>We only collect what you enter here. <button type="button" onClick={openPrivacy} className="underline hover:text-brand-500">Read the privacy notice</button>.</span>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
