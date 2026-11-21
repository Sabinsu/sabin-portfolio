import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, X } from "lucide-react";

function ProjectModalInner({ project, onClose }) {
  const closeRef = useRef(null);
  const [shot, setShot] = useState(0);
  const touchX = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      const n = project.gallery?.length || 0;
      if (n > 1 && e.key === "ArrowRight") setShot((i) => (i + 1) % n);
      if (n > 1 && e.key === "ArrowLeft") setShot((i) => (i - 1 + n) % n);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [project, onClose]);

  const cs = project.caseStudy || {};

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-ink-300/15 bg-white p-6 shadow-2xl dark:bg-ink-900 neon-border sm:p-8"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-lg border border-ink-300/25 text-ink-500 hover:border-brand-500/50 hover:text-brand-500 dark:text-ink-300"
          >
            <X size={16} aria-hidden="true" />
          </button>

          <p className="font-mono text-xs uppercase tracking-widest text-brand-500 dark:text-brand-400">
            Project
          </p>
          <h3
            id="project-modal-title"
            className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-white"
          >
            {project.title}
          </h3>

          {project.gallery?.length > 0 && (
            <div className="mt-5" aria-label="Project screenshots">
              <figure
                className="relative overflow-hidden rounded-xl border border-ink-300/15 bg-ink-900"
                onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  if (touchX.current === null) return;
                  const dx = e.changedTouches[0].clientX - touchX.current;
                  touchX.current = null;
                  const n = project.gallery.length;
                  if (Math.abs(dx) > 40) setShot((i) => (dx < 0 ? (i + 1) % n : (i - 1 + n) % n));
                }}
              >
                <img
                  key={project.gallery[shot].src}
                  src={project.gallery[shot].src}
                  alt={project.gallery[shot].caption}
                  className="aspect-video w-full object-cover object-top"
                  style={{ animation: "fade-up .35s both" }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent px-4 pb-3 pt-8 text-xs text-slate-200">
                  {project.gallery[shot].caption} · {shot + 1}/{project.gallery.length}
                </figcaption>
                {project.gallery.length > 1 && (
                  <>
                    <button type="button" aria-label="Previous screenshot" onClick={() => setShot((i) => (i - 1 + project.gallery.length) % project.gallery.length)} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/70 text-white hover:bg-brand-500">
                      <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Next screenshot" onClick={() => setShot((i) => (i + 1) % project.gallery.length)} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950/70 text-white hover:bg-brand-500">
                      <ChevronRight size={18} aria-hidden="true" />
                    </button>
                  </>
                )}
              </figure>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {project.gallery.map((s, i) => (
                  <button key={s.caption} type="button" onClick={() => setShot(i)} aria-label={`Show screenshot: ${s.caption}`} aria-current={i === shot} className={`w-24 shrink-0 overflow-hidden rounded-md border-2 ${i === shot ? "border-cyan-400" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={s.src} alt="" loading="lazy" className="aspect-video w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-5">
            <DetailBlock label="Overview" text={cs.overview} />
            <DetailBlock label="Problem" text={cs.problem} />
            <DetailBlock label="Solution" text={cs.solution} />
            {cs.process?.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-400">Development process</p>
                <ol className="space-y-1.5">
                  {cs.process.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm text-ink-600 dark:text-ink-300">
                      <span className="font-mono text-cyan-500">{String(i + 1).padStart(2, "0")}</span>{step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <DetailBlock label="Challenges" text={cs.challenges} />
            <DetailBlock label="Outcome" text={cs.outcome} />

            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-400">
                Technology
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-md bg-brand-500/10 px-2 py-1 font-mono text-[11px] text-brand-600 dark:text-brand-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {project.features?.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-400">
                  Features
                </p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink-300/15 pt-6">
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Live Demo <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300/25 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-brand-500/50 hover:text-brand-500 dark:text-slate-200"
              >
                <Github size={14} aria-hidden="true" /> GitHub
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function DetailBlock({ label, text }) {
  if (!text) return null;
  return (
    <div>
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-ink-400">{label}</p>
      <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">{text}</p>
    </div>
  );
}

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;
  return <ProjectModalInner key={project.id} project={project} onClose={onClose} />;
}
