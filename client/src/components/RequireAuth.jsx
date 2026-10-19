import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./ui/Feedback";

/** Renders children for signed-in users; otherwise redirects to /login and comes back after. */
export function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoader />;
  if (status === "guest") return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
