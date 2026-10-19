import { Component } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { Button } from "./Button";

export function Spinner({ className }) {
  return (
    <span className={clsx("relative inline-block size-10", className)} role="status" aria-label="Loading">
      <span className="absolute inset-0 animate-spin border-2 border-line border-t-brand [animation-duration:0.8s]" />
      <span className="absolute inset-2.5 animate-spin border-2 border-line border-b-brand [animation-direction:reverse]" />
    </span>
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <Spinner />
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={clsx("animate-pulse bg-surface-2", className)} aria-hidden />;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, className }) {
  return (
    <div className={clsx("mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center", className)} role="alert">
      <div className="grid size-14 place-items-center bg-brand/10 text-brand clip-corner-sm">
        <TriangleAlert className="size-7" />
      </div>
      <h2 className="mt-5 font-display text-3xl tracking-wide uppercase">{title}</h2>
      {message && <p className="mt-2 text-muted">{message}</p>}
      {onRetry && (
        <Button className="mt-6" variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" /> Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action, className }) {
  return (
    <div className={clsx("flex flex-col items-center border border-dashed border-line-strong px-6 py-14 text-center", className)}>
      {Icon && <Icon className="size-9 text-muted" aria-hidden />}
      <h3 className="mt-4 font-display text-2xl tracking-wide uppercase">{title}</h3>
      {message && <p className="mt-2 max-w-sm text-sm text-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Catches render errors (including rejected use() promises) and offers a retry. */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return this.props.fallback ? (
        this.props.fallback({ error: this.state.error, reset: this.reset })
      ) : (
        <ErrorState message={this.state.error.message} onRetry={this.reset} />
      );
    }
    return this.props.children;
  }
}
