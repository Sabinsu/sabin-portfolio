import { GraduationCap, BookOpen } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import Journey from "../components/Journey";
import { education } from "../data/experience";

export default function Education() {
  return (
    <section id="education" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Education">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="Room 08 · Education Center" title="Academic background" />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {education.map((item, i) => {
            const Icon = item.status === "completed" ? GraduationCap : BookOpen;
            return (
              <Reveal
                key={item.degree}
                delay={i * 0.06}
                className="flex gap-4 rounded-xl border border-ink-300/15 bg-white p-6 dark:bg-ink-850/60 backdrop-blur-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-brand-500 dark:text-brand-400">
                    {item.period}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-ink-900 dark:text-white">
                    {item.degree}
                  </h3>
                  {item.institution && (
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{item.institution}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
        <Journey />
      </div>
    </section>
  );
}
