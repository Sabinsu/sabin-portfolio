import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { experience, education } from "../data/experience";
import { skillCategories } from "../data/skills";
import { projects } from "../data/projects";
import { track } from "../utils/analytics";

const BANNER = [
  { t: "Sabin's terminal · type 'help' to see commands" },
];

const out = (...lines) => lines.map((l) => (typeof l === "string" ? { t: l } : l));
const link = (t, href) => ({ t, href });

const COMMANDS = {
  help: () => out(
    "Available commands:",
    "  about       who I am",
    "  skills      my tech stack",
    "  projects    featured work",
    "  experience  where I work",
    "  education   my studies",
    "  contact     how to reach me",
    "  resume      download my resume",
    "  ask <q>     ask the AI assistant",
    "  clear       clear the screen"
  ),
  about: () => out(
    `${profile.name}: ${profile.role}`,
    profile.positioning.join(" · "),
    `Based in ${profile.location}.`
  ),
  whoami: () => out("visitor — welcome to Sabin's Digital Universe."),
  skills: () => skillCategories.map((c) => ({ t: `${c.title.padEnd(18)} ${c.skills.map((s) => s.name).join(", ")}` })),
  projects: () => projects.flatMap((p) => out(`${p.title} — ${p.tech.join(", ")}`, link("  live demo → " + p.links.demo, p.links.demo), link("  source    → " + p.links.github, p.links.github))),
  experience: () => experience.flatMap((j) => out(`${j.role} @ ${j.company} (${j.period})`, ...j.points.slice(0, 4).map((p) => `  • ${p}`))),
  education: () => education.map((e) => ({ t: `${e.degree}${e.institution ? " — " + e.institution : ""} (${e.period})` })),
  contact: () => out(
    link(`email    ${profile.email}`, profile.social.email),
    `phone    ${profile.phone}`,
    link("linkedin " + profile.social.linkedin, profile.social.linkedin),
    link("github   " + profile.social.github, profile.social.github)
  ),
  resume: () => { track("resume_download", "terminal"); return out(link("↓ Download resume (PDF)", profile.resumeUrl)); },
  ls: () => out("about.txt  skills.json  projects/  experience.log  resume.pdf  contact.md"),
  neofetch: () => out(
    `${profile.name}`,
    "-------------------",
    "Role:     Team Leader & Automation Engineer",
    "Company:  AutoLab Technologies Pvt. Ltd.",
    "Focus:    Automation · Web Scraping · Backend",
    "Stack:    Python, FastAPI, Selenium, Playwright, React",
    "Status:   open to opportunities"
  ),
  coffee: () => out("☕ Brewing… Sabin runs on Python and coffee. (Probably.)"),
  sudo: (args) => (args.join(" ") === "hire sabin"
    ? out("[sudo] password accepted. Excellent decision.", link("Starting the conversation → #contact", "#contact"))
    : out("sudo: permission denied. Try: sudo hire sabin")),
};

export default function InteractiveTerminal() {
  const [lines, setLines] = useState(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const boxRef = useRef(null);

  useEffect(() => { boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight }); }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const [name, ...args] = cmd.split(/\s+/);
    const key = name.toLowerCase();
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);
    if (key === "clear") { setLines([]); return; }
    let result;
    if (key === "ask") {
      const q = args.join(" ");
      window.dispatchEvent(new CustomEvent("assistant:open", { detail: q ? { question: q } : {} }));
      result = out(q ? `Asking the assistant: "${q}"…` : "Opening the assistant. Usage: ask <question>");
    } else if (COMMANDS[key]) {
      result = COMMANDS[key](args);
    } else {
      result = out(`command not found: ${name}. Type 'help'.`);
    }
    setLines((l) => [...l, { t: `$ ${cmd}`, cmd: true }, ...result]);
  };

  const onKey = (e) => {
    if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(history.length - 1, hIdx + 1); setHIdx(i); setValue(history[i] ?? ""); }
    if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(-1, hIdx - 1); setHIdx(i); setValue(i === -1 ? "" : history[i]); }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-[0_0_60px_-20px_rgba(34,211,238,0.5)]">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" aria-hidden="true" />
        <span className="ml-3 font-mono text-[11px] text-ink-300">sabin@portfolio ~ </span>
      </div>
      <div ref={boxRef} className="h-72 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-slate-200 sm:h-80" role="log" aria-live="polite" onClick={() => document.getElementById("terminal-input")?.focus()}>
        {lines.map((l, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${l.cmd ? "text-cyan-300" : ""}`}>
            {l.href ? <a href={l.href} {...(l.href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="text-brand-300 underline">{l.t}</a> : l.t}
          </p>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }} className="mt-1 flex items-center gap-2">
          <label htmlFor="terminal-input" className="text-cyan-300">$</label>
          <input id="terminal-input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Terminal command" className="min-w-0 flex-1 bg-transparent text-base text-slate-100 outline-none sm:text-[12.5px]" />
        </form>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-white/5 p-3">
        {["help", "about", "skills", "projects", "experience", "contact", "resume"].map((c) => (
          <button key={c} type="button" onClick={() => run(c)} className="min-h-10 rounded-md border border-white/10 px-3.5 py-2 font-mono text-xs text-cyan-300 hover:border-cyan-300/50 active:bg-cyan-400/10">{c}</button>
        ))}
      </div>
    </div>
  );
}
