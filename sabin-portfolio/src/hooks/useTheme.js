import { useCallback, useSyncExternalStore } from "react";

// Shared theme store so every component (toggle, 3D scene, ...) stays in sync.
const listeners = new Set();

function getSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function getServerSnapshot() {
  return "dark";
}
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function setThemeValue(next) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* storage unavailable: theme just won't persist */
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggleTheme = useCallback(() => {
    setThemeValue(getSnapshot() === "dark" ? "light" : "dark");
  }, []);
  return { theme, toggleTheme };
}
