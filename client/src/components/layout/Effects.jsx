import { useEffect, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring } from "motion/react";

/** Thin brand-coloured bar showing how far down the page the user has scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand" style={{ scaleX }} />;
}

const supportsCustomCursor = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A ring that trails the system cursor and grows over interactive elements.
 * Only on mouse/trackpad devices; it never replaces the native cursor.
 */
export function CustomCursor() {
  const [enabled] = useState(supportsCustomCursor);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setHovering(Boolean(event.target.closest?.("a, button, [role='button'], input, select, textarea, label")));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200] rounded-full border-2 border-brand mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: hovering ? 44 : 22,
        height: hovering ? 44 : 22,
        opacity: visible ? 1 : 0,
        backgroundColor: hovering ? "rgba(255, 70, 85, 0.15)" : "rgba(255, 70, 85, 0)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  );
}
