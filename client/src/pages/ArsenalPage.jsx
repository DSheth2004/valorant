import { Suspense, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check, Coins, Layers, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useResource } from "../hooks/useResource";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Feedback";
import { TierBadge } from "../components/ui/Badges";
import { VPAmount } from "../components/ui/VPAmount";
import { Button } from "../components/ui/Button";

export default function ArsenalPage() {
  useDocumentTitle("Arsenal");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 lg:pt-36">
      <SectionHeading
        as="h1"
        eyebrow="Arsenal"
        title={
          <>
            Gear up for <span className="text-brand">the round</span>
          </>
        }
        description="Every weapon in the buy menu, with cost, damage and wall penetration. Open a weapon to browse its skins."
      />
      <Suspense fallback={<ArsenalSkeleton />}>
        <WeaponBrowser />
      </Suspense>
    </div>
  );
}

function ArsenalSkeleton() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-56" />
      ))}
    </div>
  );
}

function WeaponBrowser() {
  const { categories, weapons } = useResource("/weapons");
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState(null);

  const visibleCategories = category === "all" ? categories : categories.filter((c) => c.id === category);
  const openWeapon = weapons.find((weapon) => weapon.id === openId);

  return (
    <>
      <LayoutGroup id="weapon-filter">
        <div className="mt-12 flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Filter by category">
          {[{ id: "all", name: "All" }, ...categories].map(({ id, name }) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(id)}
                className={clsx(
                  "relative h-10 shrink-0 px-4 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                  active ? "text-white" : "text-muted hover:text-fg",
                )}
              >
                {active && <motion.span layoutId="weapon-pill" className="absolute inset-0 -z-10 bg-brand clip-corner-sm" />}
                {name}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-8 space-y-14"
        >
          {visibleCategories.map(({ id, name }) => (
            <section key={id} aria-labelledby={`category-${id}`}>
              <h2 id={`category-${id}`} className="flex items-center gap-4 font-display text-3xl tracking-wide uppercase">
                {name}
                <span className="h-px flex-1 bg-line" />
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {weapons
                  .filter((weapon) => weapon.category === id)
                  .map((weapon, index) => (
                    <motion.li
                      key={weapon.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <WeaponCard weapon={weapon} onOpen={() => setOpenId(weapon.id)} />
                    </motion.li>
                  ))}
              </ul>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      <Modal open={Boolean(openWeapon)} onClose={() => setOpenId(null)} title={openWeapon?.name} size="lg">
        {openWeapon && (
          <Suspense fallback={<Skeleton className="h-[560px]" />}>
            <WeaponDetail weapon={openWeapon} />
          </Suspense>
        )}
      </Modal>
    </>
  );
}

function WeaponCard({ weapon, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-56 w-full flex-col overflow-hidden border border-line bg-surface p-5 text-left transition-colors hover:border-brand/60 clip-corner"
    >
      <div className="absolute inset-0 bg-grid opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
      <div className="relative flex items-start justify-between">
        <h3 className="font-display text-2xl tracking-wide uppercase">{weapon.name}</h3>
        {weapon.stats && (
          <span className="flex items-center gap-1 font-mono text-xs text-muted">
            <Coins className="size-3.5" /> {weapon.stats.cost.toLocaleString()}
          </span>
        )}
      </div>
      <img
        src={weapon.image}
        alt=""
        loading="lazy"
        className="relative m-auto max-h-24 w-[85%] object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 dark:brightness-125"
      />
      <p className="relative flex items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-muted uppercase">
        <Layers className="size-3.5" /> {weapon.skins.length} {weapon.skins.length === 1 ? "skin" : "skins"}
      </p>
    </button>
  );
}

const MAX_DAMAGE = 255;

function WeaponDetail({ weapon }) {
  const { user } = useAuth();
  const store = useResource("/store");
  const [selectedId, setSelectedId] = useState("default");

  const owned = new Set(user?.inventory.map((item) => item.itemId));
  const inStore = new Set(store.skins.map((skin) => skin.id));
  const selected = weapon.skins.find((skin) => skin.id === selectedId);
  const { stats } = weapon;

  return (
    <div>
      <div className="relative grid min-h-72 place-items-center overflow-hidden bg-bg px-6 py-12 sm:min-h-80">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        {selected && (
          <div
            className="absolute inset-0 opacity-25"
            style={{ background: `radial-gradient(circle at 50% 60%, var(--color-tier-${selected.tier}), transparent 65%)` }}
            aria-hidden
          />
        )}
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedId}
            src={selected?.image ?? weapon.image}
            alt={selected?.name ?? weapon.name}
            className="relative max-h-56 w-[80%] max-w-2xl object-contain drop-shadow-2xl"
            initial={{ opacity: 0, x: 60, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>

      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-brand uppercase">{weapon.category.replace("-", " ")}</p>
          <h3 className="mt-1 font-display text-5xl tracking-wide uppercase">{selected?.name ?? weapon.name}</h3>
          {selected && (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <TierBadge tier={selected.tier} />
              <VPAmount value={selected.price} className="text-sm" />
              {owned.has(selected.id) ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <Check className="size-4" /> Owned
                </span>
              ) : (
                inStore.has(selected.id) && (
                  <Button as={Link} to="/store" size="sm">
                    <ShoppingBag className="size-4" /> In today's store
                  </Button>
                )
              )}
            </div>
          )}

          {stats ? (
            <div className="mt-8 space-y-6">
              <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Cost", stats.cost.toLocaleString()],
                  ["Magazine", stats.magazine],
                  ["Fire rate", `${stats.fireRate}/s`],
                  ["Penetration", stats.penetration],
                ].map(([label, value]) => (
                  <div key={label} className="bg-surface p-3">
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{label}</dt>
                    <dd className="mt-1 font-semibold capitalize">{value}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Damage (close range)</p>
                <ul className="mt-3 space-y-3">
                  {Object.entries(stats.damage).map(([zone, value], index) => (
                    <li key={zone} className="grid grid-cols-[48px_1fr_40px] items-center gap-3 text-sm">
                      <span className="capitalize text-muted">{zone}</span>
                      <span className="h-2 overflow-hidden bg-surface-2">
                        <motion.span
                          className="block h-full bg-brand"
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / MAX_DAMAGE) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                      <span className="text-right font-mono tabular-nums">{value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted">Approximate values; balance changes between patches.</p>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-muted">Your trusty knife. Free, silent, and always equipped.</p>
          )}
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Skins · {weapon.skins.length + 1}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[{ id: "default", name: "Standard", image: weapon.image }, ...weapon.skins].map((skin) => {
              const active = skin.id === selectedId;
              return (
                <li key={skin.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(skin.id)}
                    aria-pressed={active}
                    className={clsx(
                      "relative flex h-24 w-full flex-col justify-between overflow-hidden border bg-bg p-2 text-left transition",
                      active ? "border-brand" : "border-line hover:border-line-strong",
                    )}
                  >
                    {skin.tier && (
                      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: `var(--color-tier-${skin.tier})` }} />
                    )}
                    <img src={skin.image} alt="" loading="lazy" className="mx-auto max-h-12 w-[85%] object-contain" />
                    <span className="flex items-center justify-between gap-1 text-[11px] font-semibold">
                      <span className="truncate">{skin.collection ?? skin.name}</span>
                      {owned.has(skin.id) && <Check className="size-3.5 shrink-0 text-emerald-500" aria-label="Owned" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
