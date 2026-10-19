import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import clsx from "clsx";

const ToastContext = createContext(null);

const VARIANTS = {
  success: { icon: CircleCheck, accent: "text-emerald-400" },
  error: { icon: CircleAlert, accent: "text-brand" },
  info: { icon: Info, accent: "text-sky-400" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const show = useCallback(
    (variant, title, description) => {
      const id = ++nextId.current;
      setToasts((current) => [...current.slice(-3), { id, variant, title, description }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (title, description) => show("success", title, description),
      error: (title, description) => show("error", title, description),
      info: (title, description) => show("info", title, description),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-3 sm:left-auto sm:w-96"
      >
        <AnimatePresence initial={false}>
          {toasts.map(({ id, variant, title, description }) => {
            const { icon: Icon, accent } = VARIANTS[variant];
            return (
              <motion.div
                key={id}
                layout
                role="status"
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden border border-line bg-surface/95 p-4 shadow-2xl shadow-black/20 backdrop-blur clip-corner-sm"
              >
                <Icon className={clsx("mt-0.5 size-5 shrink-0", accent)} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{title}</p>
                  {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(id)}
                  className="text-muted transition hover:text-fg"
                  aria-label="Dismiss notification"
                >
                  <X className="size-4" />
                </button>
                <motion.span
                  className={clsx("absolute bottom-0 left-0 h-0.5 bg-current", accent)}
                  initial={{ width: "100%" }}
                  animate={{ width: 0 }}
                  transition={{ duration: 4.5, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
