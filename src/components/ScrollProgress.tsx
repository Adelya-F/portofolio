"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gradient bar under the navbar that fills with scroll position. Purely
 * decorative feedback — framer's scroll progress is 0..1 either way, so
 * reduced motion only needs to skip the smoothing spring, not the bar itself.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent via-accent-hover to-accent"
    />
  );
}
