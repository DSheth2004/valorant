import { Suspense, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown, MapPin, Play, Timer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useResource } from "../hooks/useResource";
import { useCountdown } from "../hooks/useCountdown";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Button } from "../components/ui/Button";
import { Reveal, stagger } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { AnimatedNumber } from "../components/ui/AnimatedNumber";
import { RoleBadge } from "../components/ui/Badges";
import { ErrorBoundary, Skeleton } from "../components/ui/Feedback";
import { VPAmount } from "../components/ui/VPAmount";

const HERO_VIDEO = "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/409ab2fc369ba5e1fe50bac10c6676d7d1365a9f.mp4";
const FEATURE_VIDEO = "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/f6ccf20dfe3f6a24ea9216bb8afaaa66740c715d.mp4";
const DOWNLOAD_URL = "https://playvalorant.com/download/";

export default function HomePage() {
  useDocumentTitle();

  return (
    <>
      <Hero />
      <Marquee />
      <AboutSection />
      <SectionBoundary fallback={<Skeleton className="mx-auto my-24 h-[520px] max-w-7xl" />}>
        <AgentsShowcase />
      </SectionBoundary>
      <SectionBoundary fallback={<Skeleton className="mx-auto my-24 h-96 max-w-7xl" />}>
        <MapsShowcase />
      </SectionBoundary>
      <SectionBoundary fallback={<Skeleton className="mx-auto my-24 h-80 max-w-7xl" />}>
        <StoreTeaser />
      </SectionBoundary>
      <JoinBanner />
    </>
  );
}

/** Sections fail independently, so one bad request never blanks the whole landing page. */
function SectionBoundary({ fallback, children }) {
  return (
    <ErrorBoundary fallback={() => null}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function SplitText({ text, delay = 0 }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-cream">
      <motion.video
        className="absolute inset-0 -z-20 size-full object-cover"
        style={{ scale: videoScale }}
        src={HERO_VIDEO}
        poster="/assets/brand/agents-lineup.webp"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40 [--grid-line:rgb(236_232_225/0.06)]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8 lg:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-brand uppercase"
        >
          <span className="h-px w-10 bg-brand" /> 5v5 character-based tactical shooter
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(4rem,14vw,11rem)] leading-[0.85] tracking-tight uppercase">
          <SplitText text="Defy" delay={0.3} />
          <span className="flex items-baseline gap-[0.2em]">
            <SplitText text="the" delay={0.42} />
            <span className="text-brand">
              <SplitText text="limits" delay={0.54} />
            </span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex max-w-2xl flex-col gap-8"
        >
          <p className="text-lg leading-relaxed text-cream/80 sm:text-xl">
            Blend your style and experience on a global, competitive stage. Thirteen rounds to attack and defend
            using sharp gunplay and tactical abilities.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button as={Link} to="/agents" size="lg">
              Meet the agents <ArrowRight className="size-5" />
            </Button>
            <Button
              as="a"
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="outline"
              className="border-cream/40 text-cream before:bg-cream hover:text-ink"
            >
              <Play className="size-4 fill-current" /> Play free
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cream/60 uppercase sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        Scroll
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

function Marquee() {
  const words = ["Defy the limits", "Agents", "Maps", "Arsenal", "Daily store", "Ranked ready"];
  const row = [...words, ...words];
  return (
    <div className="relative z-10 -mt-6 -rotate-1 overflow-hidden bg-brand py-4 text-white shadow-xl shadow-brand/20">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap hover:[animation-play-state:paused]" aria-hidden>
        {[...row, ...row].map((word, index) => (
          <span key={index} className="flex items-center gap-10 font-display text-2xl tracking-wider uppercase sm:text-3xl">
            {word}
            <span className="size-2.5 rotate-45 bg-white" />
          </span>
        ))}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative mx-auto grid max-w-7xl scroll-mt-24 items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
      <div>
        <SectionHeading
          index="01"
          eyebrow="We are Valorant"
          title={
            <>
              Creativity is your <span className="text-brand">greatest weapon</span>
            </>
          }
          description="More than guns and bullets, you'll choose an agent armed with adaptive, swift and lethal abilities that create opportunities to let your gunplay shine. No two agents play alike, just as no two highlight reels look the same."
        />
        <Suspense fallback={<Skeleton className="mt-10 h-24" />}>
          <ErrorBoundary fallback={() => null}>
            <ContentStats />
          </ErrorBoundary>
        </Suspense>
      </div>

      <Reveal direction="left" className="relative">
        <div className="absolute -inset-3 -z-10 border border-brand/40 clip-corner-lg" aria-hidden />
        <video
          className="aspect-video w-full object-cover clip-corner-lg"
          src={FEATURE_VIDEO}
          poster="/assets/brand/agents-lineup.webp"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Valorant gameplay montage"
        />
        <span className="absolute -bottom-4 left-6 bg-brand px-3 py-1 font-mono text-xs tracking-[0.2em] text-white uppercase">
          Gameplay
        </span>
      </Reveal>
    </section>
  );
}

function ContentStats() {
  const { agents } = useResource("/agents");
  const { maps } = useResource("/maps");
  const { weapons } = useResource("/weapons");
  const skins = weapons.reduce((total, weapon) => total + weapon.skins.length, 0);

  const stats = [
    { label: "Agents", value: agents.length },
    { label: "Maps", value: maps.length },
    { label: "Weapons", value: weapons.length },
    { label: "Skins", value: skins },
  ];

  return (
    <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
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

function AgentsShowcase() {
  const { agents } = useResource("/agents");
  const featured = agents.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading index="02" eyebrow="Your agents" title="Pick your playstyle" />
        <Button as={Link} to="/agents" variant="outline">
          All agents <ArrowRight className="size-4" />
        </Button>
      </div>

      <motion.ul
        className="mt-12 flex h-[460px] snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none md:overflow-visible"
        variants={stagger.container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {featured.map((agent) => (
          <motion.li
            key={agent.id}
            variants={stagger.item}
            className="group relative min-w-[72%] snap-start overflow-hidden transition-[flex-grow] duration-500 ease-out sm:min-w-[40%] md:min-w-0 md:flex-1 md:hover:flex-[3]"
          >
            <Link to={`/agents?agent=${agent.id}`} className="block size-full" aria-label={`View ${agent.name}`}>
              <div
                className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `linear-gradient(160deg, ${agent.accent}, #0f1923 85%)` }}
              />
              <img
                src={agent.portrait}
                alt=""
                loading="lazy"
                className="absolute inset-x-0 bottom-0 mx-auto h-[92%] object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5 pt-16 text-cream">
                <RoleBadge role={agent.role} className="text-cream/70" />
                <p className="mt-1 font-display text-3xl tracking-wide uppercase">{agent.name}</p>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function MapsShowcase() {
  const { maps } = useResource("/maps");

  return (
    <section className="relative overflow-hidden border-y border-line bg-surface py-24">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            index="03"
            eyebrow="Your maps"
            title="Fight around the world"
            description="Each map is a playground to showcase your creative thinking, purpose-built for team strategies, spectacular plays and clutch moments."
          />
          <Button as={Link} to="/maps" variant="outline">
            All maps <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {maps.slice(0, 3).map((map, index) => (
            <Reveal key={map.id} delay={index * 0.1}>
              <Link to="/maps" className="group relative block aspect-[4/5] overflow-hidden clip-corner-lg md:aspect-[3/4]">
                <img
                  src={map.image}
                  alt={map.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="flex items-center gap-1.5 font-mono text-xs tracking-[0.2em] text-cream/70 uppercase">
                    <MapPin className="size-3.5" /> {map.location}
                  </p>
                  <p className="mt-1 font-display text-5xl tracking-wide uppercase">{map.name}</p>
                  <span className="mt-3 block h-0.5 w-0 bg-brand transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreTeaser() {
  const store = useResource("/store");
  const { label } = useCountdown(store.refreshesAt);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden border border-line bg-surface clip-corner-lg">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-brand/20 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-brand uppercase">// 04 Daily store</p>
            <h2 className="mt-4 font-display text-5xl uppercase sm:text-6xl">Today's offers</h2>
            <p className="mt-4 text-muted">
              Four featured skins rotate every day at midnight UTC. Grab them before they're gone.
            </p>
            <p className="mt-6 flex items-center gap-3 font-mono text-2xl tabular-nums">
              <Timer className="size-6 text-brand" /> {label}
            </p>
            <Button as={Link} to="/store" className="mt-8">
              Open store <ArrowRight className="size-4" />
            </Button>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {store.skins.map((skin) => (
              <li
                key={skin.id}
                className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden border border-line bg-bg p-4"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: `var(--color-tier-${skin.tier})` }}
                  aria-hidden
                />
                <img
                  src={skin.image}
                  alt={skin.name}
                  loading="lazy"
                  className="mx-auto my-auto max-h-[60%] w-[85%] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                />
                <div className="flex items-end justify-between gap-2 text-xs">
                  <span className="truncate font-semibold">{skin.name}</span>
                  <VPAmount value={skin.price} className="shrink-0 text-muted" iconClassName="size-3" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function JoinBanner() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return null;

  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 text-cream">
      <img
        src="/assets/brand/agents-lineup.webp"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover opacity-50"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-xl font-display text-6xl leading-[0.9] uppercase sm:text-7xl">
          Join the <span className="text-brand">protocol</span>
        </h2>
        <p className="mt-5 max-w-md text-lg text-cream/80">
          Create a free account to get 5,000 VP, claim a daily reward and start building your collection.
        </p>
        <Button as={Link} to="/login?mode=register" size="lg" className="mt-8">
          Create account <ArrowRight className="size-5" />
        </Button>
      </Reveal>
    </section>
  );
}
