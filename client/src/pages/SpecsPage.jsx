import { useId, useState } from "react";
import { motion } from "motion/react";
import { Cpu, Download, Gauge, HardDrive, MemoryStick, Monitor, MonitorCog } from "lucide-react";
import clsx from "clsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { Button } from "../components/ui/Button";

// Based on Riot's published PC requirements; check playvalorant.com for the latest.
const TIERS = [
  {
    id: "min",
    name: "Minimum",
    fps: "30 FPS",
    cpu: "Intel Core 2 Duo E8400 / AMD Athlon 200GE",
    gpu: "Intel HD 4000 / Radeon R5 200",
    ram: "4 GB",
    vram: "1 GB",
  },
  {
    id: "rec",
    name: "Recommended",
    fps: "60 FPS",
    cpu: "Intel i3-4150 / Ryzen 3 1200",
    gpu: "GeForce GT 730 / Radeon R7 240",
    ram: "4 GB",
    vram: "1 GB",
    featured: true,
  },
  {
    id: "high",
    name: "High-end",
    fps: "144+ FPS",
    cpu: "Intel i5-9400F / Ryzen 5 2600X",
    gpu: "GTX 1050 Ti / Radeon R7 370",
    ram: "4 GB",
    vram: "1 GB",
  },
];

const ROWS = [
  { key: "cpu", label: "Processor", icon: Cpu },
  { key: "gpu", label: "Graphics", icon: Monitor },
  { key: "ram", label: "Memory", icon: MemoryStick },
  { key: "vram", label: "VRAM", icon: HardDrive },
];

const CHECKER = {
  cpu: {
    label: "Processor",
    options: ["Older dual-core (pre-2015)", "Quad-core (i3 / Ryzen 3)", "6-core or better (i5 / Ryzen 5+)"],
  },
  gpu: {
    label: "Graphics",
    options: ["Integrated graphics", "Entry dedicated (GT 730 class)", "GTX 1050 Ti class or better"],
  },
  ram: { label: "Memory", options: ["Under 4 GB", "4–7 GB", "8 GB or more"] },
};

const VERDICTS = [
  { label: "Below minimum", detail: "VALORANT may not run reliably on this setup.", fps: "< 30" },
  { label: "Playable", detail: "Expect around 30 FPS on low settings.", fps: "~30" },
  { label: "Smooth", detail: "Expect a steady 60 FPS on medium settings.", fps: "~60" },
  { label: "Competitive", detail: "High refresh rates (144+ FPS) are within reach.", fps: "144+" },
];

export default function SpecsPage() {
  useDocumentTitle("PC specs");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 lg:pt-36">
      <SectionHeading
        as="h1"
        eyebrow="PC specs"
        title={
          <>
            Can you <span className="text-brand">run it?</span>
          </>
        }
        description="VALORANT is built to run on a wide range of hardware. Compare the requirements, or use the checker to estimate your performance."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier, index) => (
          <Reveal key={tier.id} delay={index * 0.1}>
            <article
              className={clsx(
                "relative h-full overflow-hidden border bg-surface p-6 clip-corner",
                tier.featured ? "border-brand" : "border-line",
              )}
            >
              {tier.featured && (
                <span className="absolute top-0 right-0 bg-brand px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white uppercase">
                  Most players
                </span>
              )}
              <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">{tier.name}</p>
              <p className="mt-1 font-display text-5xl text-brand">{tier.fps}</p>
              <dl className="mt-6 space-y-4">
                {ROWS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
                    <div>
                      <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{label}</dt>
                      <dd className="font-medium">{tier[key]}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-4 grid gap-4 border border-line bg-surface p-6 text-sm sm:grid-cols-3">
        <p className="flex gap-3">
          <MonitorCog className="size-5 shrink-0 text-brand" />
          <span>
            <strong className="block">Operating system</strong>
            <span className="text-muted">Windows 10 (64-bit) or Windows 11</span>
          </span>
        </p>
        <p className="flex gap-3">
          <HardDrive className="size-5 shrink-0 text-brand" />
          <span>
            <strong className="block">Storage</strong>
            <span className="text-muted">Around 50 GB of free space, SSD recommended</span>
          </span>
        </p>
        <p className="flex gap-3">
          <Gauge className="size-5 shrink-0 text-brand" />
          <span>
            <strong className="block">Windows 11 note</strong>
            <span className="text-muted">Riot Vanguard requires TPM 2.0 and Secure Boot</span>
          </span>
        </p>
      </Reveal>

      <PerformanceChecker />
    </div>
  );
}

function PerformanceChecker() {
  const [answers, setAnswers] = useState({ cpu: 1, gpu: 1, ram: 1 });

  // The weakest component bottlenecks the system; a strong CPU + GPU unlocks the top tier.
  const weakest = Math.min(answers.cpu, answers.gpu, answers.ram);
  const score = answers.ram === 0 ? 0 : weakest === 2 ? 3 : weakest + 1;
  const verdict = VERDICTS[score];

  return (
    <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1fr]">
      <div>
        <h2 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Performance checker</h2>
        <p className="mt-3 text-muted">Pick the closest match for each part. It's a rough estimate, not a benchmark.</p>
        <div className="mt-8 space-y-6">
          {Object.entries(CHECKER).map(([key, { label, options }]) => (
            <OptionGroup
              key={key}
              label={label}
              options={options}
              value={answers[key]}
              onChange={(value) => setAnswers((current) => ({ ...current, [key]: value }))}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center overflow-hidden border border-line bg-surface p-10 text-center clip-corner-lg">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <Meter score={score} />
        <motion.div key={score} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative" aria-live="polite">
          <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Estimated · {verdict.fps} FPS</p>
          <p className={clsx("mt-1 font-display text-5xl uppercase", score === 0 ? "text-brand" : "text-fg")}>{verdict.label}</p>
          <p className="mt-2 text-muted">{verdict.detail}</p>
        </motion.div>
        <Button as="a" href="https://playvalorant.com/download/" target="_blank" rel="noreferrer" className="relative mt-8">
          <Download className="size-4" /> Download VALORANT
        </Button>
      </div>
    </section>
  );
}

function OptionGroup({ label, options, value, onChange }) {
  const id = useId();
  return (
    <fieldset>
      <legend className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{label}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {options.map((option, index) => (
          <label
            key={option}
            className={clsx(
              "flex items-center border p-3 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand",
              value === index ? "border-brand bg-brand/10 font-semibold" : "border-line hover:border-line-strong",
            )}
          >
            <input
              type="radio"
              name={id}
              className="sr-only"
              checked={value === index}
              onChange={() => onChange(index)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Meter({ score }) {
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const progress = (score + 1) / VERDICTS.length;

  return (
    <svg viewBox="0 0 200 110" className="relative mb-4 w-56" aria-hidden>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line-strong)" strokeWidth="10" />
      <motion.path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="10"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      />
    </svg>
  );
}
