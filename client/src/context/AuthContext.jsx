import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, invalidateResource } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "authenticated" | "guest"

  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then(({ user }) => {
        if (cancelled) return;
        setUser(user);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!cancelled) setStatus("guest");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback((nextUser) => {
    setUser(nextUser);
    setStatus("authenticated");
  }, []);

  const login = useCallback(async (credentials) => signIn((await authApi.login(credentials)).user), [signIn]);
  const register = useCallback(async (details) => signIn((await authApi.register(details)).user), [signIn]);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    invalidateResource("/users/me/collection");
    setUser(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === "authenticated", login, register, logout, setUser }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
