export default function TimelineItem({ title, subtitle, period, description, points, isLast }) {
  return (
    <li className="relative pl-10">
      <span
        className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-500 bg-white dark:bg-ink-900"
        aria-hidden="true"
      />
      {!isLast && (
        <span
          className="absolute left-[7px] top-6 h-[calc(100%+1.5rem)] w-px bg-ink-300/25"
          aria-hidden="true"
        />
      )}
      <div className="pb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-500 dark:text-brand-400">
          {period}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm font-medium text-ink-500 dark:text-ink-300">{subtitle}</p>
        )}
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500 dark:text-ink-300">
            {description}
          </p>
        )}
        {points && points.length > 0 && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
