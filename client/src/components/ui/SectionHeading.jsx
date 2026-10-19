import clsx from "clsx";
import { Reveal } from "./Reveal";

/** Page/section title with the mono "// 01" eyebrow used across the site. */
export function SectionHeading({ index, eyebrow, title, description, align = "left", as: Heading = "h2", className, children }) {
  return (
    <Reveal className={clsx("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={clsx("flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-brand uppercase", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-brand" aria-hidden />
        {index && <span>{index}</span>}
        {eyebrow}
      </p>
      <Heading className="mt-4 font-display text-5xl leading-[0.95] tracking-wide uppercase sm:text-6xl lg:text-7xl">
        {title}
      </Heading>
      {description && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      {children}
    </Reveal>
  );
}
