import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";

try {
  await connectDB();
  console.log(`✅ MongoDB connected (${env.mongoUri.replace(/\/\/.*@/, "//***@")})`);
} catch (error) {
  // Keep serving: content routes work without a database, and DB routes return 503.
  console.error(`❌ MongoDB connection failed: ${error.message}`);
  console.error("   Is MongoDB running? See README → Local setup.");
}

const server = app.listen(env.port, () => {
  console.log(`🚀 API listening on http://localhost:${env.port}/api`);
});

async function shutdown(signal) {
  console.log(`\n${signal} received, shutting down…`);
  server.close();
  await disconnectDB().catch(() => {});
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
