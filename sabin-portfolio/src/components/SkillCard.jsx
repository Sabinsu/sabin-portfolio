import { cn } from "../utils/cn";

export default function SkillCard({ category }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-colors",
        category.featured
          ? "border-brand-500/40 bg-brand-500/[0.04] dark:bg-brand-500/[0.06]"
          : "border-ink-300/15 bg-white dark:bg-ink-850/60 backdrop-blur-sm"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">
          {category.title}
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
          {category.note}
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <li
            key={skill.name}
            className="rounded-md border border-ink-300/20 bg-ink-50/60 px-3 py-1.5 text-sm text-ink-700 dark:border-ink-600/40 dark:bg-ink-800/60 dark:text-slate-200"
          >
            {skill.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
