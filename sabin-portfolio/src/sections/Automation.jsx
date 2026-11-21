import { ArrowRight, ArrowDown } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import AutomationDemo from "../components/AutomationDemo";
import { automationWorkflow, automationSkills } from "../data/services";

export default function Automation() {
  return (
    <section
      id="automation"
      className="scroll-mt-16 border-t border-ink-300/10 bg-ink-50/40 py-20 dark:bg-ink-850/40 sm:py-28"
      aria-label="Automation expertise"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 02 · Automation Lab"
            title="Automation & web scraping expertise"
            description="This is the center of my work — turning manual, repetitive processes into reliable automated systems."
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <ul className="flex flex-wrap gap-2" aria-label="Automation skills">
              {automationSkills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-brand-500/25 bg-brand-500/5 px-3 py-1.5 font-mono text-xs text-brand-600 dark:text-brand-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-500 dark:text-ink-300">
              Every pipeline follows the same shape: drive the browser, pull the data out
              reliably, clean and structure it, then hand it off — whether that's storage,
              a report, or another automated step downstream.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ol
              className="flex flex-col gap-0 rounded-xl border border-ink-300/15 bg-white p-2 dark:bg-ink-900 sm:flex-row sm:items-stretch sm:overflow-x-auto"
              aria-label="Automation workflow steps"
            >
              {automationWorkflow.map((item, i) => (
                <li key={item.step} className="flex flex-1 items-center sm:flex-col">
                  <div className="flex flex-1 flex-col justify-center rounded-lg p-4 text-center">
                    <span className="font-mono text-[11px] text-brand-500 dark:text-brand-400">
                      0{i + 1}
                    </span>
                    <p className="mt-1 font-display text-sm font-semibold text-ink-900 dark:text-white">
                      {item.step}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-ink-400">{item.description}</p>
                  </div>
                  {i < automationWorkflow.length - 1 && (
                    <span className="hidden shrink-0 items-center justify-center px-1 text-ink-300 sm:flex" aria-hidden="true">
                      <ArrowRight size={16} />
                    </span>
                  )}
                  {i < automationWorkflow.length - 1 && (
                    <span className="flex shrink-0 items-center justify-center py-1 text-ink-300 sm:hidden" aria-hidden="true">
                      <ArrowDown size={16} />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <Reveal className="mt-14"><AutomationDemo /></Reveal>
      </div>
    </section>
  );
}
