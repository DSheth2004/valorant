import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/HttpError.js";

export const AUTH_COOKIE = "vh_session";

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/",
});

export function issueSession(res, user) {
  const token = jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  const { exp } = jwt.decode(token);
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), expires: new Date(exp * 1000) });
}

export function clearSession(res) {
  res.clearCookie(AUTH_COOKIE, cookieOptions());
}

function readToken(req) {
  const header = req.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.[AUTH_COOKIE];
}

/**
 * Attaches req.user when a valid session is present, but lets guests through.
 * Used by the session probe so signed-out visitors don't trigger 401s.
 */
export async function optionalAuth(req, res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const { sub } = jwt.verify(token, env.jwtSecret);
      req.user = await User.findById(sub);
    } catch {
      clearSession(res);
    }
    if (!req.user) clearSession(res);
  }
  next();
}

/** Rejects the request with 401 unless it carries a valid session for an existing user. */
export async function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) throw new HttpError(401, "Please sign in to continue", { code: "UNAUTHENTICATED" });

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    clearSession(res);
    throw new HttpError(401, "Your session has expired. Please sign in again", { code: "SESSION_EXPIRED" });
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    clearSession(res);
    throw new HttpError(401, "Account not found", { code: "UNAUTHENTICATED" });
  }

  req.user = user;
  next();
}
