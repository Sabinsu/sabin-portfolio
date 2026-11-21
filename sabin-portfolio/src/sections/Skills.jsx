import SectionHeading from "../components/SectionHeading";
import SkillCard from "../components/SkillCard";
import Reveal from "../components/Reveal";
import { skillCategories } from "../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Skills">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 06 · Skills Center"
            title="Technologies I work with"
            description="Organized by what they're for, not ranked by invented percentages."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => (
            <Reveal key={category.id} delay={i * 0.05}>
              <SkillCard category={category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
