import clsx from "clsx";
import { AnimatedNumber } from "./AnimatedNumber";

/** A Valorant Points amount with the VP icon. Set `animated` to count up/down on change. */
export function VPAmount({ value, animated = false, className, iconClassName = "size-4" }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 font-semibold tabular-nums", className)}>
      <span
        aria-hidden
        className={clsx("mask-icon inline-block shrink-0", iconClassName)}
        style={{ maskImage: "url(/assets/brand/vp.webp)" }}
      />
      {animated ? <AnimatedNumber value={value} duration={0.8} /> : value.toLocaleString("en-US")}
      <span className="sr-only">VP</span>
    </span>
  );
}
