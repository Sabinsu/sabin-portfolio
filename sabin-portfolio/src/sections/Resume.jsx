import { Download, ExternalLink } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";
import { profile } from "../data/profile";
import { experience, education } from "../data/experience";
import { skillCategories } from "../data/skills";
import { track } from "../utils/analytics";

export default function Resume() {
  const job = experience[0];
  return (
    <section id="resume" className="scroll-mt-20 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Resume">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="Resume" title="Take the details with you" description="A one-page PDF with my experience, skills and education." />
        </Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr]">
          <Reveal className="space-y-5">
            <div className="glass neon-border rounded-xl p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-300">sabin-subedi-resume.pdf</p>
              <p className="mt-2 text-sm text-ink-600 dark:text-slate-300">One page · {job.role} · {education.length} education entries · always matches this site.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={profile.resumeUrl} download onClick={() => track("resume_download", "panel")} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                  <Download size={16} aria-hidden="true" /> Download PDF
                </a>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-ink-300/30 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:border-brand-500 dark:text-slate-200">
                  <ExternalLink size={16} aria-hidden="true" /> Open in new tab
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Tilt max={4} className="mx-auto max-w-md">
              {/* Visual preview. Always paper-white like the real PDF. */}
              <div className="rounded-lg bg-white p-6 text-[11px] leading-snug text-slate-800 shadow-2xl ring-1 ring-black/5" aria-label="Resume preview">
                <p className="font-display text-lg font-bold text-slate-900">{profile.name}</p>
                <p className="font-semibold uppercase tracking-wide text-brand-500">Software Developer · Automation Engineer · Team Leader</p>
                <p className="mt-1 text-slate-500">{profile.location} · {profile.email}</p>
                <hr className="my-3 border-brand-500" />
                <p className="font-bold text-slate-900">EXPERIENCE</p>
                <p className="mt-1 font-semibold">{job.role} — {job.company} <span className="font-normal text-slate-500">({job.period})</span></p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
                  {job.points.slice(0, 4).map((p) => <li key={p}>{p}</li>)}
                </ul>
                <p className="mt-3 font-bold text-slate-900">SKILLS</p>
                <ul className="mt-1 space-y-0.5 text-slate-600">
                  {skillCategories.filter((c) => ["automation", "backend", "cloud"].includes(c.id)).map((c) => (
                    <li key={c.id}><span className="font-semibold text-slate-800">{c.title}:</span> {c.skills.map((s) => s.name).join(", ")}</li>
                  ))}
                </ul>
                <p className="mt-3 font-bold text-slate-900">EDUCATION</p>
                {education.map((e) => <p key={e.degree} className="mt-0.5 text-slate-600">{e.degree}, {e.period}</p>)}
              </div>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
