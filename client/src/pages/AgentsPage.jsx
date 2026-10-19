import { Suspense, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Heart, MapPin } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useResource } from "../hooks/useResource";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { userApi } from "../lib/api";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ROLE_ICONS, RoleBadge } from "../components/ui/Badges";
import { Skeleton } from "../components/ui/Feedback";

export default function AgentsPage() {
  useDocumentTitle("Agents");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 lg:pt-36">
      <SectionHeading
        as="h1"
        eyebrow="Agents"
        title={
          <>
            Choose your <span className="text-brand">agent</span>
          </>
        }
        description="Every agent brings a unique kit of abilities. Filter by role, pick an agent, and inspect each ability."
      />
      <Suspense fallback={<AgentsSkeleton />}>
        <AgentExplorer />
      </Suspense>
    </div>
  );
}

function AgentsSkeleton() {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr]">
      <Skeleton className="h-[520px]" />
      <Skeleton className="h-[620px]" />
    </div>
  );
}

function AgentExplorer() {
  const { roles, agents } = useResource("/agents");
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState("all");

  const selected = agents.find((agent) => agent.id === searchParams.get("agent")) ?? agents[0];
  const visible = role === "all" ? agents : agents.filter((agent) => agent.role === role);

  const selectAgent = (id) => setSearchParams({ agent: id }, { replace: true, preventScrollReset: true });

  return (
    <div className="mt-12">
      <LayoutGroup id="role-filter">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Filter by role">
          {[{ id: "all", name: "All" }, ...roles].map(({ id, name }) => {
            const Icon = ROLE_ICONS[id];
            const active = role === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setRole(id);
                  if (id !== "all" && selected.role !== id) {
                    selectAgent(agents.find((agent) => agent.role === id).id);
                  }
                }}
                className={clsx(
                  "relative flex h-10 shrink-0 items-center gap-2 px-4 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                  active ? "text-white" : "text-muted hover:text-fg",
                )}
              >
                {active && (
                  <motion.span layoutId="role-pill" className="absolute inset-0 -z-10 bg-brand clip-corner-sm" />
                )}
                {Icon && <Icon className="size-4" />}
                {name}
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      {role !== "all" && (
        <p className="mt-3 text-sm text-muted">{roles.find((r) => r.id === role)?.description}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <motion.ul layout className="grid h-fit grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((agent) => (
              <motion.li
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  type="button"
                  onClick={() => selectAgent(agent.id)}
                  aria-pressed={agent.id === selected.id}
                  className={clsx(
                    "group relative block aspect-square w-full overflow-hidden border-2 transition-colors",
                    agent.id === selected.id ? "border-brand" : "border-transparent hover:border-line-strong",
                  )}
                  style={{ background: `linear-gradient(160deg, ${agent.accent}aa, transparent)` }}
                >
                  <img
                    src={agent.icon}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent px-1 pt-4 pb-1 text-center text-[11px] font-semibold tracking-wider text-cream uppercase">
                    {agent.name}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence mode="wait">
          <AgentDetail key={selected.id} agent={selected} />
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgentDetail({ agent }) {
  const [activeKey, setActiveKey] = useState(agent.abilities[0].key);
  const ability = agent.abilities.find((a) => a.key === activeKey);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="relative isolate overflow-hidden border border-line bg-surface clip-corner-lg"
    >
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{ background: `radial-gradient(circle at 75% 35%, ${agent.accent}, transparent 60%)` }}
        aria-hidden
      />
      <motion.span
        aria-hidden
        className="mask-icon pointer-events-none absolute inset-y-0 right-[6%] -z-10 w-[45%] text-fg [mask-position:right_center]"
        style={{ maskImage: `url(${agent.background})` }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.08, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="grid md:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
            <RoleBadge role={agent.role} className="text-brand" />
            <h2 className="mt-2 font-display text-6xl tracking-wide uppercase sm:text-7xl">{agent.name}</h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-4" /> {agent.origin}
            </p>
            <p className="mt-5 leading-relaxed text-muted">{agent.bio}</p>
            <FavoriteButton agent={agent} />
          </motion.div>

          <div className="mt-auto pt-10">
            <h3 className="font-mono text-xs tracking-[0.25em] text-muted uppercase">Abilities</h3>
            <div className="mt-3 grid grid-cols-4 gap-2" role="tablist" aria-label={`${agent.name} abilities`}>
              {agent.abilities.map(({ key, name, icon }) => {
                const active = key === activeKey;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`${key}: ${name}`}
                    onClick={() => setActiveKey(key)}
                    onMouseEnter={() => setActiveKey(key)}
                    className={clsx(
                      "group relative flex aspect-square flex-col items-center justify-center gap-1 border transition-all",
                      active ? "border-brand bg-brand/10 text-brand" : "border-line text-fg hover:border-line-strong",
                    )}
                  >
                    <span className="absolute top-1 left-1.5 font-mono text-[10px] text-muted">{key}</span>
                    <span
                      className="mask-icon size-9 transition-transform group-hover:scale-110 sm:size-11"
                      style={{ maskImage: `url(${icon})` }}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={ability.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-4 min-h-32 border-l-2 border-brand bg-bg/60 p-4"
              >
                <p className="font-mono text-[10px] tracking-[0.25em] text-brand uppercase">
                  {ability.slot} · {ability.key}
                </p>
                <p className="mt-1 font-display text-2xl tracking-wide uppercase">{ability.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{ability.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="relative order-first flex min-h-[340px] items-end justify-center md:order-last md:min-h-[620px]"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={agent.portrait}
            alt={agent.name}
            className="absolute bottom-0 h-full max-h-[620px] w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

function FavoriteButton({ agent }) {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const isFavorite = user?.favoriteAgents.includes(agent.id) ?? false;

  const toggle = async () => {
    if (!user) {
      toast.info("Sign in to save favourites", "Your favourite agents appear on your profile.");
      navigate("/login", { state: { from: `/agents?agent=${agent.id}` } });
      return;
    }
    setPending(true);
    // Optimistic update: flip immediately, roll back if the request fails.
    const previous = user;
    setUser({
      ...user,
      favoriteAgents: isFavorite ? user.favoriteAgents.filter((id) => id !== agent.id) : [...user.favoriteAgents, agent.id],
    });
    try {
      const { user: updated } = await (isFavorite ? userApi.removeFavorite(agent.id) : userApi.addFavorite(agent.id));
      setUser(updated);
    } catch (error) {
      setUser(previous);
      toast.error("Couldn't update favourites", error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={isFavorite}
        className={clsx(
          "flex h-10 items-center gap-2 border px-4 text-xs font-semibold tracking-[0.15em] uppercase transition",
          isFavorite ? "border-brand bg-brand text-white" : "border-line-strong hover:border-brand hover:text-brand",
        )}
      >
        <motion.span key={String(isFavorite)} initial={{ scale: 0.5 }} animate={{ scale: [1.4, 1] }}>
          <Heart className={clsx("size-4", isFavorite && "fill-current")} />
        </motion.span>
        {isFavorite ? "Favourite" : "Add to favourites"}
      </button>
      {isFavorite && (
        <Link to="/profile" className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
          View on profile
        </Link>
      )}
    </div>
  );
}
