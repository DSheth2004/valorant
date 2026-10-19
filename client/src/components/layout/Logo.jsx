import { Link } from "react-router";
import clsx from "clsx";

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={clsx("text-brand", className)} aria-hidden>
      <path d="M6 14 L30 50 L30 35 L16 14 Z" fill="currentColor" />
      <path d="M58 14 L36 47 L36 32 L48 14 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }) {
  return (
    <Link to="/" className={clsx("group flex items-center gap-2", className)} aria-label="Valorant Hub home">
      <LogoMark className="size-9 transition-transform duration-500 group-hover:rotate-[360deg]" />
      <span className="font-display text-xl leading-none tracking-[0.08em] uppercase">
        Valorant<span className="text-brand">Hub</span>
      </span>
    </Link>
  );
}
