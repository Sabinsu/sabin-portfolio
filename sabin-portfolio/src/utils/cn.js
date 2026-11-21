/** Tiny classNames joiner — avoids pulling in a dependency for this alone. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
