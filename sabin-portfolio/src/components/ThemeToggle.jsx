import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="relative flex h-11 w-11 xl:h-10 xl:w-10 items-center justify-center rounded-lg border border-ink-300/25 text-ink-500 transition-colors hover:border-brand-500/50 hover:text-brand-500 dark:text-ink-300 dark:hover:text-brand-400"
    >
      <Sun size={18} strokeWidth={1.75} className="block dark:hidden" aria-hidden="true" />
      <Moon size={18} strokeWidth={1.75} className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}
