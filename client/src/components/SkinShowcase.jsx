import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Image as ImageIcon, Play, VideoOff } from "lucide-react";
import clsx from "clsx";
import { Spinner } from "./ui/Feedback";

/**
 * Shows a skin's render plus its in-game showcase videos (one per upgrade level:
 * VFX, reload animation, finisher…). Videos stream from Riot's CDN and only load
 * when the user picks a level.
 */
export function SkinShowcase({ skin, className, stageClassName, imageClassName, tabsClassName, renderBackdrop }) {
  const videos = skin.videos ?? [];
  const [active, setActive] = useState(null); // null = render image, otherwise a video level
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const video = videos.find((entry) => entry.level === active);

  const select = (level) => {
    setActive(level);
    setFailed(false);
    setLoading(level !== null);
  };

  return (
    <div className={className}>
      <div className={clsx("relative overflow-hidden bg-bg", stageClassName)}>
        {renderBackdrop}
        <AnimatePresence mode="wait" initial={false}>
          {video && !failed ? (
            <motion.div
              key={video.url}
              className="absolute inset-0 bg-ink"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <video
                key={video.url}
                src={video.url}
                className="size-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="auto"
                onCanPlay={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setFailed(true);
                }}
                aria-label={`${skin.name}: ${video.label} showcase`}
              />
              {loading && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/40">
                  <Spinner />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="render"
              className="absolute inset-0 grid place-items-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.img
                src={skin.image}
                alt={skin.name}
                className={clsx("relative object-contain drop-shadow-2xl", imageClassName)}
                initial={{ opacity: 0, x: 60, rotate: -4 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              {!failed && videos.length > 0 && (
                <motion.button
                  type="button"
                  onClick={() => select(videos[videos.length - 1].level)}
                  className="group absolute right-4 bottom-4 flex items-center gap-2.5 bg-brand py-2 pr-4 pl-2 text-xs font-semibold tracking-[0.15em] text-white uppercase shadow-lg shadow-brand/30 clip-corner-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="relative grid size-7 place-items-center bg-white/15">
                    <span className="absolute inset-0 animate-ping bg-white/25 [animation-duration:1.8s]" aria-hidden />
                    <Play className="size-3.5 fill-current" />
                  </span>
                  Watch in-game
                  <span className="font-mono text-[10px] opacity-75">{videos[videos.length - 1].label}</span>
                </motion.button>
              )}
              {failed && (
                <p className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-ink/80 px-3 py-1.5 text-xs text-cream">
                  <VideoOff className="size-4" /> Video unavailable right now
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {videos.length > 0 && (
        <LayoutGroup id={`showcase-${skin.id}`}>
          <div
            className={clsx("mt-3 flex flex-wrap gap-1.5", tabsClassName)}
            role="tablist"
            aria-label={`${skin.name} showcase`}
          >
            {[{ level: null, label: "Render" }, ...videos].map(({ level, label }) => {
              const selected = active === level;
              return (
                <button
                  key={level ?? "render"}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => select(level)}
                  className={clsx(
                    "relative flex h-8 items-center gap-1.5 border px-3 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors",
                    selected ? "border-brand text-white" : "border-line text-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="showcase-pill"
                      className="absolute inset-0 -z-10 bg-brand"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  {level === null ? <ImageIcon className="size-3.5" /> : <Play className="size-3 fill-current" />}
                  {level !== null && <span className="font-mono opacity-70">L{level}</span>}
                  {label}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      )}
    </div>
  );
}
