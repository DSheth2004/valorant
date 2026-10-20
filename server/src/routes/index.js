import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import Joi from "joi";
import { env } from "../config/env.js";
import { connectDB, getDatabaseState } from "../config/db.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.schemas.js";
import * as auth from "../controllers/auth.controller.js";
import * as content from "../controllers/content.controller.js";
import * as store from "../controllers/store.controller.js";
import * as users from "../controllers/user.controller.js";

const router = Router();

/** Ensures a database connection before handlers that need one. */
async function requireDatabase(_req, _res, next) {
  await connectDB();
  next();
}

// Note: limits are per serverless instance on Vercel. For strict global limits,
// back this with a shared store such as Redis.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => env.isTest,
  message: { message: "Too many attempts. Please wait a few minutes and try again.", code: "RATE_LIMITED" },
});

// Browsers revalidate every time (a cheap 304 via ETag) so catalog changes show up
// immediately; the CDN still caches between deploys, and each deploy purges it.
const cacheStatic = (_req, res, next) => {
  res.set("Cache-Control", "public, max-age=0, must-revalidate, s-maxage=3600, stale-while-revalidate=86400");
  next();
};

// ---- Health ----------------------------------------------------------------
router.get("/health", async (_req, res) => {
  let database = "connected";
  try {
    await connectDB();
  } catch {
    database = getDatabaseState();
  }
  res.status(database === "connected" ? 200 : 503).json({
    status: database === "connected" ? "ok" : "degraded",
    database,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ---- Game content (static, cacheable, no DB) --------------------------------
router.get("/agents", cacheStatic, content.listAgents);
router.get("/agents/:id", cacheStatic, content.getAgent);
router.get("/maps", cacheStatic, content.listMaps);
router.get("/maps/:id", cacheStatic, content.getMap);
router.get("/weapons", cacheStatic, content.listWeapons);
router.get("/weapons/:id", cacheStatic, content.getWeapon);

// ---- Auth --------------------------------------------------------------------
router.post("/auth/register", authLimiter, validateBody(registerSchema), requireDatabase, auth.register);
router.post("/auth/login", authLimiter, validateBody(loginSchema), requireDatabase, auth.login);
router.post("/auth/logout", auth.logout);
router.get("/auth/me", requireDatabase, optionalAuth, auth.me);

// ---- Store -------------------------------------------------------------------
router.get("/store", store.getStorefront);
router.post(
  "/store/purchases",
  requireDatabase,
  requireAuth,
  validateBody(Joi.object({ itemId: Joi.string().max(100).required() })),
  store.purchaseItem,
);

// ---- Current user ------------------------------------------------------------
router.use("/users/me", requireDatabase, requireAuth);
router.get("/users/me/collection", users.getCollection);
router.post("/users/me/daily-reward", users.claimDailyReward);
router.put("/users/me/favorites/:agentId", users.addFavoriteAgent);
router.delete("/users/me/favorites/:agentId", users.removeFavoriteAgent);

export default router;
