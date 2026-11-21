import { cn } from "../utils/cn";

export default function SectionHeading({ eyebrow, title, description, align = "left", className }) {
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
      {description && (
        <p className="mt-4 text-balance text-base leading-relaxed text-ink-500 dark:text-ink-300">
          {description}
        </p>
      )}
    </div>
  );
}
