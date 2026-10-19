import { motion } from "motion/react";

const OFFSETS = { up: { y: 40 }, down: { y: -40 }, left: { x: 60 }, right: { x: -60 }, none: {} };

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({ as = "div", direction = "up", delay = 0, className, children, ...props }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...OFFSETS[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}

/** Variants for staggering a list of children, used with <motion.ul variants={stagger.container}>. */
export const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },
};
