import { useEffect, useRef, useState } from "react";
import { Bot, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { cn } from "../utils/cn";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "automation", label: "Automation Lab" },
  { id: "ai-lab", label: "AI Lab" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
const ids = navItems.map((i) => i.id);

const openAssistant = () => window.dispatchEvent(new CustomEvent("assistant:open"));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const activeId = useActiveSection(ids);
  const progress = useScrollProgress();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    const onKeyDown = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("mousedown", onClickOutside); document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  return (
    <header className="sticky top-2 z-40 px-2 sm:px-4" ref={menuRef}>
      <div className="glass-strong relative mx-auto max-w-7xl overflow-hidden rounded-2xl shadow-lg">
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand-500 to-cyan-400 transition-[width] duration-150" style={{ width: `${progress}%` }} aria-hidden="true" />
        <div className="flex h-14 items-center justify-between px-3 sm:px-5">
          <a href="#home" className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white glow-blue">S</span>
            Sabin
          </a>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeId === item.id ? "page" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  activeId === item.id ? "text-brand-600 dark:text-cyan-300" : "text-ink-500 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <button type="button" onClick={openAssistant} className="flex items-center gap-2 rounded-lg border border-cyan-400/50 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-400/10 dark:text-cyan-300">
              <Bot size={16} aria-hidden="true" /> Ask AI
            </button>
            <SoundToggle />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <button type="button" onClick={openAssistant} aria-label="Ask the AI assistant" className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/50 text-cyan-700 dark:text-cyan-300">
              <Bot size={18} aria-hidden="true" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-300/25 text-ink-700 dark:text-slate-200"
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="max-h-[75vh] overflow-y-auto border-t border-ink-300/15 px-4 py-3 xl:hidden">
            <nav className="grid grid-cols-2 gap-1" aria-label="Mobile">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={activeId === item.id ? "page" : undefined}
                  className={cn("flex min-h-12 items-center rounded-md px-3 text-sm font-medium hover:bg-ink-100/60 dark:hover:bg-ink-800", activeId === item.id ? "text-brand-600 dark:text-cyan-300" : "text-ink-700 dark:text-slate-200")}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-ink-300/15 pt-3">
              <span className="text-xs uppercase tracking-widest text-ink-400">Interface sounds</span>
              <SoundToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
