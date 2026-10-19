import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import clsx from "clsx";

/**
 * Accessible modal dialog: renders in a portal, traps scroll, closes on Escape or backdrop
 * click, moves focus inside on open and restores it on close.
 */
export function Modal({ open, onClose, title, children, className, size = "md" }) {
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") trapFocus(event, panelRef.current);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            className={clsx(
              "relative max-h-[92dvh] w-full overflow-y-auto border border-line bg-surface shadow-2xl outline-none sm:clip-corner-lg",
              size === "lg" ? "sm:max-w-5xl" : size === "sm" ? "sm:max-w-md" : "sm:max-w-2xl",
              className,
            )}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 grid size-10 place-items-center bg-bg/60 text-fg backdrop-blur transition hover:bg-brand hover:text-white"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
            {title && (
              <h2 id={titleId} className="sr-only">
                {title}
              </h2>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function trapFocus(event, container) {
  if (!container) return;
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
