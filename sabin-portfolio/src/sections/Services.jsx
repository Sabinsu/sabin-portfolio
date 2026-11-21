import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { services } from "../data/services";

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Services">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="How I can help"
            description="Focused around automation and full-stack development."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              key={service.number}
              delay={i * 0.05}
              className="group rounded-xl border border-ink-300/15 bg-white p-6 transition-colors hover:border-brand-500/40 dark:bg-ink-850/60 backdrop-blur-sm"
            >
              <span className="font-mono text-sm text-brand-500 dark:text-brand-400">
                {service.number}
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-ink-900 dark:text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
                {service.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
