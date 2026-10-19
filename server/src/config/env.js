const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";

const DEV_JWT_SECRET = "dev-only-insecure-secret-change-me";

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

export const env = Object.freeze({
  nodeEnv,
  isProduction,
  isTest: nodeEnv === "test",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/valorant-hub",
  jwtSecret: process.env.JWT_SECRET ?? DEV_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  // Only needed when the client is served from a different origin than the API.
  clientOrigins: (process.env.CLIENT_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});
