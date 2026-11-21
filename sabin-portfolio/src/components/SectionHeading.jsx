import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function SectionHeading({ eyebrow, title, description, align = "left", className }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={cn("mb-12 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-500 dark:text-brand-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <motion.span
        aria-hidden="true"
        className={cn("mt-4 block h-0.5 w-20 origin-left rounded bg-gradient-to-r from-brand-500 to-cyan-400", align === "center" && "mx-auto")}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
      {description && (
        <p className="mt-4 text-balance text-base leading-relaxed text-ink-500 dark:text-ink-300">
          {description}
        </p>
      )}
    </div>
  );
}
