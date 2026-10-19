import mongoose from "mongoose";
import { env } from "./env.js";

// Serverless functions are re-invoked in warm containers, so the connection is
// cached on globalThis to avoid opening a new pool on every request.
const cache = (globalThis.__mongoose ??= { conn: null, promise: null });

export async function connectDB(uri = env.mongoUri) {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        // Fail fast instead of silently queueing queries while disconnected.
        bufferCommands: false,
      })
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  cache.conn = null;
  cache.promise = null;
}

const STATES = ["disconnected", "connected", "connecting", "disconnecting"];

export const getDatabaseState = () => STATES[mongoose.connection.readyState] ?? "unknown";
