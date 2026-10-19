import { Suspense, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useResource } from "../hooks/useResource";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Feedback";

export default function MapsPage() {
  useDocumentTitle("Maps");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 lg:pt-36">
      <SectionHeading
        as="h1"
        eyebrow="Maps"
        title={
          <>
            Fight around <span className="text-brand">the world</span>
          </>
        }
        description="Every map is built for team strategy, spectacular plays and clutch moments. Pick one to see its layout, signature mechanic and the agents that shine there."
      />
      <Suspense fallback={<MapsSkeleton />}>
        <MapGrid />
      </Suspense>
    </div>
  );
}

function MapsSkeleton() {
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="aspect-video" />
      ))}
    </div>
  );
}

function MapGrid() {
  const { maps } = useResource("/maps");
  const [openId, setOpenId] = useState(null);
  const openMap = maps.find((map) => map.id === openId);

  return (
    <>
      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {maps.map((map, index) => (
          <motion.li
            key={map.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={clsx(
              // Alternating 4/2 and 2/4 column spans create an editorial rhythm on desktop.
              index === maps.length - 1 && maps.length % 2 === 1
                ? "md:col-span-2 lg:col-span-6"
                : index % 4 === 0 || index % 4 === 3
                  ? "lg:col-span-4"
                  : "lg:col-span-2",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(map.id)}
              className="group relative block aspect-video w-full overflow-hidden text-left clip-corner-lg lg:aspect-auto lg:h-80"
            >
              <img
                src={map.image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cream">
                <div>
                  <p className="flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] text-cream/70 uppercase">
                    <MapPin className="size-3.5" /> {map.location}
                  </p>
                  <h2 className="mt-1 font-display text-5xl tracking-wide uppercase">{map.name}</h2>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {map.sites.map((site) => (
                    <span key={site} className="grid size-8 place-items-center border border-cream/30 font-mono text-xs">
                      {site}
                    </span>
                  ))}
                  <span className="grid size-10 translate-x-2 place-items-center bg-brand opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>

      <Modal open={Boolean(openMap)} onClose={() => setOpenId(null)} title={openMap?.name} size="lg">
        {openMap && (
          <Suspense fallback={<Skeleton className="h-[480px]" />}>
            <MapDetail map={openMap} />
          </Suspense>
        )}
      </Modal>
    </>
  );
}

function MapDetail({ map }) {
  const { agents } = useResource("/agents");
  const recommended = map.recommendedAgents.map((id) => agents.find((agent) => agent.id === id)).filter(Boolean);

  return (
    <div>
      <div className="relative aspect-[21/9] overflow-hidden">
        <motion.img
          src={map.image}
          alt={map.name}
          className="size-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] text-brand uppercase">
            <MapPin className="size-3.5" /> {map.location}
          </p>
          <h3 className="mt-2 font-display text-6xl tracking-wide uppercase">{map.name}</h3>
          <p className="mt-4 leading-relaxed text-muted">{map.description}</p>
        </div>

        <dl className="space-y-6">
          <div>
            <dt className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Bomb sites</dt>
            <dd className="mt-2 flex gap-2">
              {map.sites.map((site) => (
                <span key={site} className="grid size-11 place-items-center bg-brand font-display text-xl text-white">
                  {site}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Signature mechanic</dt>
            <dd className="mt-2 flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-brand" /> {map.feature}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Strong picks</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {recommended.map((agent) => (
                <Link
                  key={agent.id}
                  to={`/agents?agent=${agent.id}`}
                  className="group flex items-center gap-2 border border-line py-1 pr-3 pl-1 transition hover:border-brand"
                >
                  <span className="size-8 overflow-hidden" style={{ background: agent.accent }}>
                    <img src={agent.portrait} alt="" className="size-full origin-top scale-150 object-cover object-top" />
                  </span>
                  <span className="text-sm font-semibold">{agent.name}</span>
                </Link>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
