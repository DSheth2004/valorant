import { useId, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check, CircleAlert, Eye, EyeOff, Gift, Heart, Package, Wallet } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PASSWORD_RULES, validateAuthForm } from "../lib/validation";
import { Button } from "../components/ui/Button";

const PERKS = [
  { icon: Wallet, text: "5,000 VP starting balance" },
  { icon: Gift, text: "500 VP daily login reward" },
  { icon: Package, text: "Build a collection from the daily store" },
  { icon: Heart, text: "Save your favourite agents" },
];

export default function AuthPage() {
  const { status, login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  const redirectTo = location.state?.from ?? "/profile";

  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useDocumentTitle(mode === "register" ? "Create account" : "Sign in");

  if (status === "authenticated" && !submitting) return <Navigate to={redirectTo} replace />;

  const switchMode = (next) => {
    setErrors({});
    setFormError("");
    setSearchParams(next === "register" ? { mode: "register" } : {}, { replace: true, state: location.state });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationErrors = validateAuthForm(values, mode);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (mode === "register") {
        await register({ username: values.username.trim(), email: values.email.trim(), password: values.password });
        toast.success(`Welcome, ${values.username.trim()}!`, "5,000 VP has been added to your wallet.");
      } else {
        await login({ email: values.email.trim(), password: values.password });
        toast.success("Welcome back", "You're signed in.");
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors(error.details ?? {});
      if (!error.details || Object.keys(error.details).length === 0) setFormError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      <aside className="relative isolate hidden overflow-hidden bg-ink text-cream lg:block">
        <motion.img
          src="/assets/brand/agents-lineup.webp"
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="flex h-full flex-col justify-end p-12 pb-16 xl:p-16">
          <p className="font-mono text-xs tracking-[0.3em] text-brand uppercase">// Join the protocol</p>
          <h2 className="mt-4 font-display text-7xl leading-[0.9] uppercase">
            Your loadout <br /> <span className="text-brand">awaits</span>
          </h2>
          <ul className="mt-10 space-y-4">
            {PERKS.map(({ icon: Icon, text }, index) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 text-cream/85"
              >
                <span className="grid size-9 place-items-center border border-cream/20">
                  <Icon className="size-4 text-brand" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex items-center justify-center px-4 pt-28 pb-16 sm:px-6 lg:pt-24">
        <div className="w-full max-w-md">
          <LayoutGroup id="auth-tabs">
            <div className="grid grid-cols-2 border border-line p-1" role="tablist" aria-label="Account">
              {[
                ["login", "Sign in"],
                ["register", "Create account"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={mode === id}
                  onClick={() => switchMode(id)}
                  className={clsx(
                    "relative h-11 text-xs font-semibold tracking-[0.15em] uppercase transition-colors",
                    mode === id ? "text-white" : "text-muted hover:text-fg",
                  )}
                >
                  {mode === id && <motion.span layoutId="auth-pill" className="absolute inset-0 -z-10 bg-brand" />}
                  {label}
                </button>
              ))}
            </div>
          </LayoutGroup>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "register" ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "register" ? -30 : 30 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="mt-10 font-display text-5xl tracking-wide uppercase">
                {mode === "register" ? "Create account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-muted">
                {mode === "register"
                  ? "Sign up in seconds and get 5,000 VP to spend."
                  : "Sign in to access your wallet and collection."}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <AnimatePresence>
                  {formError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="flex items-start gap-2 border-l-2 border-brand bg-brand/10 p-3 text-sm"
                    >
                      <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand" /> {formError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {mode === "register" && (
                  <Field
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={values.username}
                    onChange={handleChange}
                    error={errors.username}
                  />
                )}
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <PasswordField
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  showRules={mode === "register"}
                />

                <Button type="submit" size="lg" className="w-full" loading={submitting}>
                  {mode === "register" ? "Create account" : "Sign in"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                {mode === "register" ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "register" ? "login" : "register")}
                  className="font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {mode === "register" ? "Sign in" : "Create an account"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, error, className, children, ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            "h-12 w-full border bg-surface px-4 text-fg transition outline-none placeholder:text-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20",
            error ? "border-brand" : "border-line-strong",
            children && "pr-12",
          )}
          {...inputProps}
        />
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-sm text-brand"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PasswordField({ value, showRules, ...props }) {
  const [visible, setVisible] = useState(false);
  const passed = PASSWORD_RULES.filter((rule) => rule.test(value)).length;

  return (
    <div>
      <Field label="Password" name="password" type={visible ? "text" : "password"} value={value} {...props}>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted transition hover:text-fg"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </Field>

      {showRules && (
        <div className="mt-3">
          <div className="flex gap-1" aria-hidden>
            {PASSWORD_RULES.map((rule, index) => (
              <span key={rule.id} className="h-1 flex-1 overflow-hidden bg-surface-2">
                <motion.span
                  className={clsx("block h-full", passed === PASSWORD_RULES.length ? "bg-emerald-500" : "bg-brand")}
                  animate={{ width: index < passed ? "100%" : "0%" }}
                  transition={{ duration: 0.25 }}
                />
              </span>
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(value);
              return (
                <li key={rule.id} className={clsx("flex items-center gap-1.5 transition-colors", ok ? "text-emerald-500" : "text-muted")}>
                  <motion.span animate={{ scale: ok ? [1.4, 1] : 1 }} className="grid size-3.5 place-items-center">
                    {ok ? <Check className="size-3.5" /> : <span className="size-1 rounded-full bg-current" />}
                  </motion.span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
