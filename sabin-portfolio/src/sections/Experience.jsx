import SectionHeading from "../components/SectionHeading";
import TimelineItem from "../components/TimelineItem";
import Reveal from "../components/Reveal";
import { experience } from "../data/experience";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Experience">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 07 · Experience"
            title="Where I've put this to work"
          />
        </Reveal>

        <Reveal>
          <ol className="max-w-3xl">
            {experience.map((job, i) => (
              <TimelineItem
                key={job.company}
                title={job.role}
                subtitle={job.company}
                period={job.period}
                description={job.summary}
                points={job.points}
                isLast={i === experience.length - 1}
              />
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
