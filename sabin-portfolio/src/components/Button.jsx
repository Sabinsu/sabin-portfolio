import { cn } from "../utils/cn";

const variants = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-[0_0_0_1px_rgba(47,111,237,0.4)] hover:shadow-[0_0_24px_-4px_rgba(47,111,237,0.55)]",
  outline:
    "border border-ink-300/30 text-ink-900 dark:text-white hover:border-brand-500/60 hover:text-brand-600 dark:hover:text-brand-300",
  ghost: "text-ink-900 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
        "transition-all duration-200 ease-out active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
