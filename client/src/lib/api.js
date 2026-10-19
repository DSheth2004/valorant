const API_BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

export class ApiError extends Error {
  constructor(message, { status = 0, code, details, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details ?? {};
    this.data = data ?? {};
  }
}

export async function request(path, { method = "GET", body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      signal,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Can't reach the server. Check your connection and try again.", { code: "NETWORK" });
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message ?? `Request failed (${response.status})`, {
      status: response.status,
      code: data.code,
      details: data.details,
      data,
    });
  }
  return data;
}

// Promise cache for React 19's use(): one in-flight request per path, shared by every
// component that reads it. Failed requests are evicted so an error boundary can retry.
const resourceCache = new Map();

export function fetchResource(path) {
  if (!resourceCache.has(path)) {
    const promise = request(path);
    promise.catch(() => resourceCache.delete(path));
    resourceCache.set(path, promise);
  }
  return resourceCache.get(path);
}

export function invalidateResource(path) {
  resourceCache.delete(path);
}

export const authApi = {
  me: () => request("/auth/me"),
  login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
  register: (details) => request("/auth/register", { method: "POST", body: details }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

export const storeApi = {
  purchase: (itemId) => request("/store/purchases", { method: "POST", body: { itemId } }),
};

export const userApi = {
  claimDailyReward: () => request("/users/me/daily-reward", { method: "POST" }),
  addFavorite: (agentId) => request(`/users/me/favorites/${agentId}`, { method: "PUT" }),
  removeFavorite: (agentId) => request(`/users/me/favorites/${agentId}`, { method: "DELETE" }),
};
