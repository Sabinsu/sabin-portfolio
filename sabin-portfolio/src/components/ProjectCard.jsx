import { track } from "../utils/analytics";
import { ArrowUpRight, Github } from "lucide-react";

export default function ProjectCard({ project, onOpenDetails }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ink-300/15 bg-white transition-colors hover:border-brand-500/40 dark:bg-ink-850/60 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onOpenDetails(project)}
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-ink-100 text-left dark:bg-ink-800"
        aria-label={`View details for ${project.title}`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            width={1200}
            height={675}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="font-mono text-xs text-ink-400">Project preview</span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-md bg-brand-500/10 px-2 py-1 font-mono text-[11px] text-brand-600 dark:text-brand-300"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3">
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("project_click", project.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Live Demo
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("project_click", project.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300/25 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-500/50 hover:text-brand-500 dark:text-slate-200"
            >
              <Github size={14} aria-hidden="true" />
              GitHub
            </a>
          )}
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="ml-auto text-sm font-medium text-ink-500 underline-offset-4 hover:text-brand-500 hover:underline dark:text-ink-300"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
