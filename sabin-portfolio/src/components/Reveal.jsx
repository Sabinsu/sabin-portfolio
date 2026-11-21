import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Lightweight scroll-reveal wrapper. Animates once when it enters the
 * viewport; fully inert when prefers-reduced-motion is set.
 */
export default function Reveal({ children, delay = 0, className, as = "div", y = 18 }) {
  const reducedMotion = usePrefersReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}
