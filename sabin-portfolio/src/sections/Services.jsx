import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import OpenBox from "../components/OpenBox";
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

        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.number} delay={i * 0.05} from="scale">
              <OpenBox badge={service.number} title={service.title} summary={service.description} items={service.details} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
