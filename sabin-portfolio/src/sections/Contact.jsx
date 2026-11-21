import { useState } from "react";
import { Briefcase, Copy, Check, FileText, Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import Toast from "../components/Toast";
import { profile } from "../data/profile";

const initialForm = { name: "", email: "", message: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Enter your name.";
  if (!form.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.message.trim()) errors.message = "Enter a message.";
  else if (form.message.trim().length < 10) errors.message = "Message should be at least 10 characters.";
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      if (res.ok) {
        setStatus("success");
        setToast({ type: "success", message: "Message sent. Thanks for reaching out!" });
        setForm(initialForm);
        return;
      }
      setStatus("error");
      setToast({
        type: "error",
        message:
          res.status === 503 ? "The contact form isn't connected yet. Please email me directly."
          : res.status === 429 ? "Too many messages. Please try again later."
          : "Couldn't send your message. Please email me directly.",
      });
    } catch {
      setStatus("error");
      setToast({ type: "error", message: "Network error. Please email me directly." });
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — link still works */
    }
  };

  return (
    <section id="contact" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Contact">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 09 · Contact & Connect"
            title="Let's build something useful"
            description="Have a project, an automation problem, or an open role? Send a message or reach out directly."
          />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-4">
            <ContactRow icon={Mail} label="Email" value={profile.email} href={profile.social.email}>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-300/25 text-ink-400 hover:text-brand-500"
              >
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              </button>
            </ContactRow>
            {profile.phone && (
              <ContactRow icon={Phone} label="Phone" value={profile.phone} href={`tel:${profile.phone.replace(/\s+/g, "")}`} />
            )}
            <ContactRow icon={Linkedin} label="LinkedIn" value="Connect on LinkedIn" href={profile.social.linkedin} external />
            <ContactRow icon={FileText} label="Resume" value="Download PDF" href={profile.resumeUrl} />
            <ContactRow icon={Github} label="GitHub" value="@Sabinsu" href={profile.social.github} external />
            <a
              href={`${profile.social.email}?subject=${encodeURIComponent("Professional enquiry")}&body=${encodeURIComponent("Hi Sabin,\n\nI'd like to discuss ")}`}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 px-4 py-2.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-400/10 dark:text-cyan-300"
            >
              <Briefcase size={16} aria-hidden="true" /> Send a professional enquiry
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-describedby="form-status">
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
              </div>
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                label="Message"
                name="message"
                as="textarea"
                rows={5}
                value={form.message}
                onChange={handleChange}
                error={errors.message}
              />

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send Message"}
                {status !== "submitting" && <Send size={15} aria-hidden="true" />}
              </button>
              <p id="form-status" className="sr-only" role="status">
                {status === "submitting" && "Sending your message"}
                {status === "success" && "Message sent successfully"}
                {status === "error" && "There was a problem sending your message"}
              </p>
            </form>
          </Reveal>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
    </section>
  );
}

function ContactRow({ icon: Icon, label, value, href, external, children }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-ink-300/15 bg-white p-4 dark:bg-ink-850/60 backdrop-blur-sm">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="truncate text-sm font-medium text-ink-900 hover:text-brand-500 dark:text-white"
        >
          {value}
        </a>
      </div>
      {children}
    </div>
  );
}

function Field({ label, name, error, as = "input", ...props }) {
  const Tag = as;
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-slate-200">
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full rounded-lg border border-ink-300/25 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500 dark:bg-ink-900 dark:text-white"
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
