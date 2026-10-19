import { HttpError } from "../utils/HttpError.js";
import { env } from "../config/env.js";

const DATABASE_ERRORS = new Set([
  "MongooseServerSelectionError",
  "MongoServerSelectionError",
  "MongoNetworkError",
  "MongoNotConnectedError",
]);

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`, { code: "NOT_FOUND" }));
}

// Express recognises error handlers by their four-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      code: err.code,
      details: err.details,
      ...err.meta,
    });
  }

  // Unique index violation, e.g. a username or email that is already taken.
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? err.keyValue ?? { value: 1 })[0];
    const message = `That ${field} is already taken`;
    return res.status(409).json({ message, code: "DUPLICATE", details: { [field]: message } });
  }

  if (DATABASE_ERRORS.has(err?.name)) {
    console.error("Database unavailable:", err.message);
    return res.status(503).json({
      message: "Database is unavailable. Please try again shortly.",
      code: "DATABASE_UNAVAILABLE",
    });
  }

  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must be valid JSON", code: "INVALID_JSON" });
  }

  console.error(err);
  return res.status(500).json({
    message: "Something went wrong. Please try again.",
    code: "INTERNAL_ERROR",
    ...(env.isProduction ? {} : { stack: err?.stack }),
  });
}
