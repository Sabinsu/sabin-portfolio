import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";
import { track } from "../utils/analytics";
import { projects } from "../data/projects";

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section id="projects" className="scroll-mt-16 border-t border-ink-300/10 py-20 sm:py-28" aria-label="Featured projects">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Room 05 · Project Gallery"
            title="Featured projects"
            description="A selection of what I've built. More is on GitHub."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <Tilt>
                <ProjectCard project={project} onOpenDetails={(pr) => { track("project_click", pr.id); setActiveProject(pr); }} />
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
