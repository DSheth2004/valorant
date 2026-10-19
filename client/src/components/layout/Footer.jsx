import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import { NAV_LINKS } from "./Navbar";
import { LogoMark } from "./Logo";

const STACK = ["React 19", "Vite", "Tailwind CSS", "Motion", "Express 5", "MongoDB", "JWT", "Vercel"];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="size-10" />
            <span className="font-display text-2xl tracking-[0.08em] uppercase">
              Valorant<span className="text-brand">Hub</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A full-stack fan hub for VALORANT. Explore agents, maps and weapons, then sign in to shop the daily store
            with your own VP wallet.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <li key={tech} className="border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs tracking-[0.25em] text-brand uppercase">Explore</h2>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-muted transition hover:text-fg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs tracking-[0.25em] text-brand uppercase">Account</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/login" className="text-muted transition hover:text-fg">Sign in / Register</Link>
            </li>
            <li>
              <Link to="/profile" className="text-muted transition hover:text-fg">Profile & collection</Link>
            </li>
            <li>
              <a
                href="https://playvalorant.com/download/"
                target="_blank"
                rel="noreferrer"
                className="text-muted transition hover:text-fg"
              >
                Download VALORANT ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-muted sm:px-6 md:flex-row md:items-center lg:px-8">
          <p className="max-w-3xl leading-relaxed">
            Built by Dhrumil Sheth. Valorant Hub is a fan project and isn't endorsed by Riot Games. It doesn't reflect the
            views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.
            Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex shrink-0 items-center gap-2 font-mono tracking-[0.2em] uppercase transition hover:text-brand md:ml-auto"
          >
            Back to top <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
