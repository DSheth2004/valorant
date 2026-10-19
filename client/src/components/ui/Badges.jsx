import clsx from "clsx";
import { Crosshair, Eye, Shield, Swords } from "lucide-react";

const TIER_STYLES = {
  select: "text-tier-select",
  deluxe: "text-tier-deluxe",
  premium: "text-tier-premium",
  exclusive: "text-tier-exclusive",
  ultra: "text-tier-ultra",
};

export function TierBadge({ tier, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase",
        TIER_STYLES[tier],
        className,
      )}
    >
      <span className="size-2 rotate-45 bg-current" aria-hidden />
      {tier}
    </span>
  );
}

export const ROLE_ICONS = {
  duelist: Swords,
  controller: Eye,
  initiator: Crosshair,
  sentinel: Shield,
};

export function RoleBadge({ role, className }) {
  const Icon = ROLE_ICONS[role] ?? Swords;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] uppercase", className)}>
      <Icon className="size-3.5" aria-hidden />
      {role}
    </span>
  );
}
