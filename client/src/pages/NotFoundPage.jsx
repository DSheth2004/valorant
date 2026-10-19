import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  useDocumentTitle("Page not found");

  return (
    <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-4 pt-20 text-center">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <motion.p
        aria-hidden
        className="pointer-events-none absolute font-display text-[40vw] leading-none text-stroke select-none"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        404
      </motion.p>
      <div className="relative">
        <p className="font-mono text-xs tracking-[0.3em] text-brand uppercase">// Spike detonated</p>
        <h1 className="mt-4 font-display text-6xl uppercase sm:text-8xl">Round lost</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you're looking for doesn't exist or was moved. Regroup and head back to base.
        </p>
        <Button as={Link} to="/" size="lg" className="mt-8">
          <ArrowLeft className="size-5" /> Back to base
        </Button>
      </div>
    </div>
  );
}
