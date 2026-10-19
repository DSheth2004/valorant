import { motion, useScroll, useSpring } from "motion/react";

/** Thin brand-coloured bar showing how far down the page the user has scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand" style={{ scaleX }} />;
}
