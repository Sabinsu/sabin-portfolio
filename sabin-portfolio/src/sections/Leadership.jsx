import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { leadership } from "../data/services";

export default function Leadership() {
  return (
    <section
      id="leadership"
      className="scroll-mt-16 border-t border-ink-300/10 bg-ink-50/40 py-20 dark:bg-ink-850/40 sm:py-28"
      aria-label="Leadership"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 07 · Leadership"
            title="Leading as Team Leader at AutoLab Technologies"
            description="Technical leadership stays hands-on here — I write the automation and lead the team."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.05}
              className="rounded-xl border border-ink-300/15 bg-white p-6 dark:bg-ink-900"
            >
              <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
