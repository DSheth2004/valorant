import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import apiRouter from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  // Behind Vercel's proxy, so req.ip (used by the rate limiter) reads X-Forwarded-For.
  app.set("trust proxy", 1);

  app.use(helmet());
  if (env.clientOrigins.length > 0) {
    app.use(cors({ origin: env.clientOrigins, credentials: true }));
  }
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  if (!env.isTest) app.use(morgan(env.isProduction ? "combined" : "dev"));

  app.use("/api", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp();
