import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";
import { VPAmount } from "../ui/VPAmount";

export const NAV_LINKS = [
  { to: "/agents", label: "Agents" },
  { to: "/maps", label: "Maps" },
  { to: "/arsenal", label: "Arsenal" },
  { to: "/store", label: "Store" },
  { to: "/specs", label: "Specs" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the mobile menu on navigation (state adjusted during render, no effect needed).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  // On the home page the navbar floats over a dark video, so keep it light until scrolled.
  const overHero = pathname === "/" && !scrolled && !menuOpen;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-300",
        overHero ? "border-transparent bg-transparent text-cream" : "border-b border-line bg-bg/80 text-fg backdrop-blur-xl",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:h-20 lg:px-8" aria-label="Main">
        <Logo />

        <ul className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "relative block px-4 py-2 text-sm font-semibold tracking-[0.14em] uppercase transition-colors",
                    isActive ? "text-brand" : "opacity-80 hover:opacity-100",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-brand"
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <AccountArea />
          <button
            type="button"
            className="grid size-10 place-items-center border border-current/20 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} />
    </header>
  );
}

function AccountArea() {
  const { status, user } = useAuth();

  if (status === "loading") return <div className="hidden h-10 w-28 animate-pulse bg-current/10 sm:block" />;

  if (!user) {
    return (
      <Button as={Link} to="/login" size="sm" className="hidden sm:inline-flex">
        Sign in
      </Button>
    );
  }

  return (
    <>
      <Link
        to="/store"
        className="hidden h-10 items-center border border-current/20 px-3 text-sm transition hover:border-brand sm:flex"
        title="Your VP balance"
      >
        <VPAmount value={user.valorantPoints} animated />
      </Link>
      <UserMenu />
    </>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => !ref.current?.contains(event.target) && setOpen(false);
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.info("Signed out", "See you next match.");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 border border-current/20 pr-2 pl-1 transition hover:border-brand"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid size-8 place-items-center bg-brand font-display text-lg text-white uppercase">
          {user.username[0]}
        </span>
        <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} />
        <span className="sr-only">Account menu</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-60 origin-top-right border border-line bg-surface text-fg shadow-2xl clip-corner-sm"
          >
            <div className="border-b border-line p-4">
              <p className="truncate font-semibold">{user.username}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
              <VPAmount value={user.valorantPoints} className="mt-2 text-sm sm:hidden" />
            </div>
            <Link
              role="menuitem"
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-surface-2"
            >
              <User className="size-4" /> Profile & collection
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-brand transition hover:bg-surface-2"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ open }) {
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-line bg-bg text-fg lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.ul
            className="flex flex-col px-6 py-8"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
          >
            {[...NAV_LINKS, user ? { to: "/profile", label: "Profile" } : { to: "/login", label: "Sign in" }].map(
              ({ to, label }, index) => (
                <motion.li
                  key={to}
                  variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
                  className="border-b border-line"
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      clsx("flex items-baseline gap-4 py-4 font-display text-4xl uppercase", isActive && "text-brand")
                    }
                  >
                    <span className="font-mono text-xs text-muted">0{index + 1}</span>
                    {label}
                  </NavLink>
                </motion.li>
              ),
            )}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
