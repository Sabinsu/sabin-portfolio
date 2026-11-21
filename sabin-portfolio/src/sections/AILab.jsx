import { lazy, Suspense } from "react";
import { Bot, Database, FlaskConical } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";

const NeuralNetCanvas = lazy(() => import("../components/NeuralNetCanvas"));

const panels = [
  {
    badge: "Demonstrated",
    tone: "text-emerald-600 dark:text-emerald-300 border-emerald-400/40 bg-emerald-400/10",
    icon: Database,
    title: "Data & automation foundations",
    items: [
      "Structured data collection with Selenium, SeleniumBase and Playwright",
      "Cleaning and processing data with Pandas and OpenPyXL",
      "Backend services and task queues with FastAPI, Redis and Celery",
    ],
  },
  {
    badge: "Built into this site",
    tone: "text-cyan-600 dark:text-cyan-300 border-cyan-400/40 bg-cyan-400/10",
    icon: Bot,
    title: "AI assistant integration",
    items: [
      "A chatbot answering from verified profile data through a secure serverless API",
      "Rule-based FAQ fallback when no AI key is configured",
      "Voice input and replies using browser speech APIs",
    ],
  },
  {
    badge: "Exploring",
    tone: "text-violet-600 dark:text-violet-300 border-violet-400/40 bg-violet-400/10",
    icon: FlaskConical,
    title: "Areas of interest, not job experience",
    items: [
      "Machine learning fundamentals",
      "LLM-assisted, more intelligent automation workflows",
      "Neural network concepts (visualised alongside)",
    ],
  },
];

export default function AILab() {
  return (
    <section id="ai-lab" className="scroll-mt-20 border-t border-ink-300/10 py-20 sm:py-28" aria-label="AI and machine learning lab">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 03 · AI & ML Lab"
            title="Where automation meets AI"
            description="An honest map of what I've done, what's built into this site, and what I'm still exploring. I don't claim professional machine-learning experience."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-4">
            {panels.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <Tilt max={4}>
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink-900 dark:text-white">
                        <p.icon size={18} className="text-brand-500 dark:text-cyan-300" aria-hidden="true" /> {p.title}
                      </h3>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${p.tone}`}>{p.badge}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {p.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm text-ink-600 dark:text-slate-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />{it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <Suspense fallback={<div className="glass h-80 rounded-xl" aria-hidden="true" />}>
              <NeuralNetCanvas />
            </Suspense>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
