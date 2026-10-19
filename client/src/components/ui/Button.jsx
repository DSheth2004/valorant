import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand text-white before:bg-ink hover:text-white dark:before:bg-cream dark:hover:text-ink clip-corner",
  outline: "border border-line-strong text-fg before:bg-fg hover:text-bg clip-corner",
  ghost: "text-fg hover:bg-surface-2",
};

const SIZES = {
  sm: "h-9 gap-1.5 px-4 text-xs",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-14 gap-2.5 px-8 text-sm sm:text-base",
};

/**
 * Valorant-style button with a colour sweep on hover. Pass `as={Link}` to render a router link.
 */
export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) {
  const isButton = Component === "button";
  return (
    <Component
      className={clsx(
        "relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold tracking-[0.12em] uppercase transition-colors duration-300 select-none",
        "before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...(isButton ? { type: props.type ?? "button", disabled: disabled || loading } : { "aria-disabled": disabled || undefined })}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </Component>
  );
}
