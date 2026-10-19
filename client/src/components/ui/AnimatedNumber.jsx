import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";

const format = (value) => Math.round(value).toLocaleString("en-US");

/** Counts up to `value` when scrolled into view, and tweens smoothly whenever it changes. */
export function AnimatedNumber({ value, duration = 1.2, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const display = useTransform(count, format);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [count, value, inView, duration]);

  return (
    <motion.span ref={ref} className={className} aria-label={format(value)}>
      {display}
    </motion.span>
  );
}
