import { Suspense, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { CalendarDays, Heart, Package, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useResource } from "../hooks/useResource";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Button } from "../components/ui/Button";
import { Reveal } from "../components/ui/Reveal";
import { AnimatedNumber } from "../components/ui/AnimatedNumber";
import { EmptyState, Skeleton } from "../components/ui/Feedback";
import { TierBadge } from "../components/ui/Badges";
import { VPAmount } from "../components/ui/VPAmount";
import { DailyRewardButton } from "../components/DailyReward";

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

export default function ProfilePage() {
  const { user } = useAuth();
  useDocumentTitle(user.username);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 lg:pt-36">
      <Reveal className="relative overflow-hidden border border-line bg-surface clip-corner-lg">
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="absolute -top-24 -left-24 size-72 rounded-full bg-brand/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-center">
          <motion.div
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
            className="grid size-24 shrink-0 place-items-center bg-brand font-display text-6xl text-white uppercase clip-corner"
          >
            {user.username[0]}
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs tracking-[0.25em] text-brand uppercase">// Player profile</p>
            <h1 className="mt-1 truncate font-display text-5xl tracking-wide uppercase sm:text-6xl">{user.username}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span>{user.email}</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" /> Joined {dateFormat.format(new Date(user.createdAt))}
              </span>
            </p>
          </div>
          <div className="w-full lg:w-72">
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Balance</p>
            <VPAmount value={user.valorantPoints} animated className="font-display text-4xl" iconClassName="size-7" />
            <DailyRewardButton size="sm" className="mt-3" />
          </div>
        </div>
      </Reveal>

      <Suspense fallback={<Skeleton className="mt-8 h-24" />}>
        <Stats />
      </Suspense>

      <Suspense fallback={<Skeleton className="mt-12 h-32" />}>
        <FavoriteAgents />
      </Suspense>

      <Suspense fallback={<Skeleton className="mt-12 h-80" />}>
        <Collection />
      </Suspense>
    </div>
  );
}

function Stats() {
  const { user } = useAuth();
  const { items, totalSpent } = useResource("/users/me/collection");

  const stats = [
    { label: "Items owned", value: items.length },
    { label: "VP spent", value: totalSpent },
    { label: "Skins", value: items.filter((item) => item.type === "skin").length },
    { label: "Favourite agents", value: user.favoriteAgents.length },
  ];

  return (
    <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-bg p-5">
          <dt className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{label}</dt>
          <dd className="mt-1 font-display text-4xl">
            <AnimatedNumber value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FavoriteAgents() {
  const { user } = useAuth();
  const { agents } = useResource("/agents");
  const favorites = agents.filter((agent) => user.favoriteAgents.includes(agent.id));

  return (
    <section className="mt-14">
      <h2 className="flex items-center gap-4 font-display text-3xl tracking-wide uppercase">
        Favourite agents <span className="h-px flex-1 bg-line" />
      </h2>
      {favorites.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={Heart}
          title="No favourites yet"
          message="Tap the heart on any agent to pin them here."
          action={
            <Button as={Link} to="/agents" variant="outline" size="sm">
              Browse agents
            </Button>
          }
        />
      ) : (
        <ul className="mt-6 flex flex-wrap gap-3">
          {favorites.map((agent, index) => (
            <motion.li
              key={agent.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/agents?agent=${agent.id}`}
                className="group flex items-center gap-3 border border-line bg-surface py-2 pr-5 pl-2 transition hover:border-brand"
              >
                <span className="size-12 overflow-hidden" style={{ background: agent.accent }}>
                  <img
                    src={agent.portrait}
                    alt=""
                    className="size-full origin-top scale-150 object-cover object-top transition-transform group-hover:scale-[1.7]"
                  />
                </span>
                <span>
                  <span className="block font-display text-xl uppercase">{agent.name}</span>
                  <span className="block font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{agent.role}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "skin", label: "Skins" },
  { id: "card", label: "Cards" },
];

function Collection() {
  const { items } = useResource("/users/me/collection");
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? items : items.filter((item) => item.type === filter);

  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="font-display text-3xl tracking-wide uppercase">Collection</h2>
        <span className="h-px flex-1 bg-line" />
        <LayoutGroup id="collection-filter">
          <div className="flex gap-1" role="tablist" aria-label="Filter collection">
            {FILTERS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={filter === id}
                onClick={() => setFilter(id)}
                className={clsx(
                  "relative h-9 px-4 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                  filter === id ? "text-white" : "text-muted hover:text-fg",
                )}
              >
                {filter === id && (
                  <motion.span layoutId="collection-pill" className="absolute inset-0 -z-10 bg-brand clip-corner-sm" />
                )}
                {label}
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {items.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={Package}
          title="Your collection is empty"
          message="Spend your VP in the daily store. New offers every day."
          action={
            <Button as={Link} to="/store" size="sm">
              <ShoppingBag className="size-4" /> Visit store
            </Button>
          }
        />
      ) : (
        <motion.ul layout className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative flex flex-col overflow-hidden border border-line bg-surface clip-corner"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: item.tier ? `var(--color-tier-${item.tier})` : "var(--color-brand)" }}
                />
                <div className={clsx("grid place-items-center p-4", item.type === "card" ? "h-64" : "h-36")}>
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className={clsx(
                      "object-contain transition-transform duration-500 group-hover:scale-110",
                      item.type === "card" ? "max-h-56" : "max-h-20 w-[85%]",
                    )}
                  />
                </div>
                <div className="mt-auto border-t border-line p-3">
                  {item.tier ? (
                    <TierBadge tier={item.tier} />
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.2em] text-brand uppercase">Player card</span>
                  )}
                  <p className="mt-1 truncate text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 flex items-center justify-between text-xs text-muted">
                    <span>{dateFormat.format(new Date(item.purchasedAt))}</span>
                    <VPAmount value={item.pricePaid} iconClassName="size-3" className="font-normal" />
                  </p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}
