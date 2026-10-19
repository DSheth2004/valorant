import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, CircleCheck, Lock, Timer, Wallet } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useResource } from "../hooks/useResource";
import { useCountdown } from "../hooks/useCountdown";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { invalidateResource, storeApi } from "../lib/api";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Feedback";
import { TierBadge } from "../components/ui/Badges";
import { VPAmount } from "../components/ui/VPAmount";
import { DailyRewardButton } from "../components/DailyReward";

export default function StorePage() {
  useDocumentTitle("Store");
  const [, setRotation] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 lg:pt-36">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_380px]">
        <SectionHeading
          as="h1"
          eyebrow="Store"
          title={
            <>
              Daily <span className="text-brand">offers</span>
            </>
          }
          description="A fresh selection of skins and player cards every day at 00:00 UTC. Prices and balances are verified on the server."
        />
        <WalletPanel />
      </div>

      <Suspense fallback={<StoreSkeleton />}>
        <Storefront onRotate={() => setRotation((n) => n + 1)} />
      </Suspense>
    </div>
  );
}

function WalletPanel() {
  const { user, status } = useAuth();

  if (status === "loading") return <Skeleton className="h-36" />;

  if (!user) {
    return (
      <div className="border border-line bg-surface p-6 clip-corner">
        <p className="flex items-center gap-2 font-semibold">
          <Lock className="size-4 text-brand" /> Sign in to shop
        </p>
        <p className="mt-1 text-sm text-muted">New accounts start with 5,000 VP.</p>
        <Button as={Link} to="/login" state={{ from: "/store" }} size="sm" className="mt-4">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-line bg-surface p-6 clip-corner">
      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        <Wallet className="size-4" /> Your balance
      </p>
      <VPAmount value={user.valorantPoints} animated className="mt-1 font-display text-4xl" iconClassName="size-7" />
      <DailyRewardButton size="sm" className="mt-4" />
    </div>
  );
}

function StoreSkeleton() {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-80" />
      ))}
    </div>
  );
}

function Storefront({ onRotate }) {
  const store = useResource("/store");
  const { label } = useCountdown(store.refreshesAt);
  const [selected, setSelected] = useState(null);

  // When the rotation expires, drop the cached response and re-render to fetch the new one.
  useEffect(() => {
    const delay = new Date(store.refreshesAt).getTime() - Date.now() + 1000;
    const timer = setTimeout(() => {
      invalidateResource("/store");
      onRotate();
    }, Math.max(delay, 0));
    return () => clearTimeout(timer);
  }, [store.refreshesAt, onRotate]);

  return (
    <>
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <h2 className="font-display text-3xl tracking-wide uppercase">Featured skins</h2>
        <p className="flex items-center gap-2 font-mono text-sm text-muted">
          <Timer className="size-4 text-brand" /> Refreshes in <span className="text-fg tabular-nums">{label}</span>
        </p>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {store.skins.map((skin, index) => (
          <motion.li
            key={skin.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
          >
            <OfferCard item={skin} onSelect={() => setSelected(skin)} />
          </motion.li>
        ))}
      </ul>

      <h2 className="mt-16 border-y border-line py-4 font-display text-3xl tracking-wide uppercase">Player cards</h2>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {store.cards.map((card, index) => (
          <motion.li
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <OfferCard item={card} variant="card" onSelect={() => setSelected(card)} />
          </motion.li>
        ))}
      </ul>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name} size="sm">
        {selected && <PurchaseDialog item={selected} onDone={() => setSelected(null)} />}
      </Modal>
    </>
  );
}

function OfferCard({ item, variant = "skin", onSelect }) {
  const { user } = useAuth();
  const owned = user?.inventory.some((entry) => entry.itemId === item.id);
  const accent = item.tier ? `var(--color-tier-${item.tier})` : "var(--color-brand)";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={clsx(
        "group relative flex w-full flex-col overflow-hidden border border-line bg-surface text-left clip-corner",
        variant === "skin" ? "h-80" : "h-[26rem]",
      )}
    >
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accent}, transparent 70%)` }}
        aria-hidden
      />
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} aria-hidden />

      <div className="relative flex flex-1 items-center justify-center p-6">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className={clsx(
            "object-contain transition-transform duration-500 ease-out group-hover:scale-110",
            variant === "skin" ? "max-h-28 w-[90%] group-hover:-rotate-6" : "max-h-72",
          )}
        />
      </div>

      <div className="relative border-t border-line bg-bg/70 p-4 backdrop-blur">
        {item.tier && <TierBadge tier={item.tier} />}
        <p className="mt-1 truncate font-semibold">{item.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <VPAmount value={item.price} />
          {owned ? (
            <span className="flex items-center gap-1 text-xs font-semibold tracking-wider text-emerald-500 uppercase">
              <Check className="size-4" /> Owned
            </span>
          ) : (
            <span className="text-xs font-semibold tracking-[0.15em] text-brand uppercase opacity-0 transition group-hover:opacity-100">
              Buy →
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function PurchaseDialog({ item, onDone }) {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [state, setState] = useState("idle"); // idle | pending | success

  const owned = user?.inventory.some((entry) => entry.itemId === item.id);
  const balanceAfter = (user?.valorantPoints ?? 0) - item.price;

  const purchase = async () => {
    setState("pending");
    try {
      const { user: updated } = await storeApi.purchase(item.id);
      setUser(updated);
      invalidateResource("/users/me/collection");
      setState("success");
      toast.success("Purchase complete", `${item.name} was added to your collection.`);
    } catch (error) {
      setState("idle");
      toast.error("Purchase failed", error.message);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <CircleCheck className="size-16 text-emerald-500" />
            </motion.span>
            <h3 className="mt-4 font-display text-3xl uppercase">It's yours</h3>
            <p className="mt-1 text-muted">{item.name} is now in your collection.</p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={onDone}>
                Keep shopping
              </Button>
              <Button as={Link} to="/profile" onClick={onDone}>
                View collection
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="confirm" exit={{ opacity: 0, scale: 0.95 }}>
            <p className="font-mono text-[11px] tracking-[0.2em] text-brand uppercase">Confirm purchase</p>
            <div className="my-6 grid h-48 place-items-center bg-bg">
              <img src={item.image} alt={item.name} className="max-h-40 w-4/5 object-contain" />
            </div>
            {item.tier && <TierBadge tier={item.tier} />}
            <h3 className="mt-1 font-display text-3xl tracking-wide uppercase">{item.name}</h3>

            {!user ? (
              <div className="mt-6">
                <p className="text-muted">Sign in to buy this item. New accounts start with 5,000 VP.</p>
                <Button className="mt-4 w-full" onClick={() => navigate("/login", { state: { from: "/store" } })}>
                  Sign in to buy
                </Button>
              </div>
            ) : owned ? (
              <p className="mt-6 flex items-center gap-2 font-semibold text-emerald-500">
                <Check className="size-5" /> You already own this item
              </p>
            ) : (
              <>
                <dl className="mt-6 space-y-2 border-y border-line py-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Price</dt>
                    <dd><VPAmount value={item.price} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Balance after</dt>
                    <dd className={clsx(balanceAfter < 0 && "text-brand")}>
                      <VPAmount value={balanceAfter} />
                    </dd>
                  </div>
                </dl>
                {balanceAfter < 0 && (
                  <p className="mt-3 text-sm text-brand">
                    You need {Math.abs(balanceAfter).toLocaleString()} more VP. Claim your daily reward to top up.
                  </p>
                )}
                <Button
                  className="mt-6 w-full"
                  onClick={purchase}
                  loading={state === "pending"}
                  disabled={balanceAfter < 0}
                >
                  Buy for {item.price.toLocaleString()} VP
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
