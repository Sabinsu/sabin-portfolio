import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const FROM = {
  up: { opacity: 0, y: 18 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.92, y: 10 },
};

/**
 * Lightweight scroll-reveal wrapper. Animates once when it enters the viewport;
 * fully inert when prefers-reduced-motion is set.
 */
export default function Reveal({ children, delay = 0, className, as = "div", from = "up", y }) {
  const reducedMotion = usePrefersReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      initial={y !== undefined ? { opacity: 0, y } : FROM[from] || FROM.up}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}
