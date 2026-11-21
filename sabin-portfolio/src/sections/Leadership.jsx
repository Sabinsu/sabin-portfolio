import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import OpenBox from "../components/OpenBox";
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

        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} from={i % 2 ? "right" : "left"}>
              <OpenBox title={item.title} summary={item.description} items={item.details} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
