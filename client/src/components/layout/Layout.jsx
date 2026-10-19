import { Suspense, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "./Effects";
import { ErrorBoundary, PageLoader } from "../ui/Feedback";

/**
 * Keeps rendering the route it was mounted with. Without this, the exiting page in
 * <AnimatePresence> would immediately re-render as the *new* route mid-animation.
 */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-20 bg-brand px-4 py-2 font-semibold text-white transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: "instant" })}>
        <motion.main
          key={pathname}
          id="main"
          className="min-h-[100dvh]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } }}
        >
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <FrozenOutlet />
            </Suspense>
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </>
  );
}
