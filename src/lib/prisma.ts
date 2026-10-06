import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Matches the connection-layer failures Neon's free tier produces when its
// compute is asleep or still waking up — e.g. P1017 "Server has closed the
// connection", or "Authentication timed out" (Postgres/PgBouncer code
// 08P01) when opening a fresh connection races the compute's wake-up. These
// happen at connect time, before any command reaches the database, so
// retrying is safe — nothing partial could have run.
const TRANSIENT_CONNECTION_ERROR = /connection|authentication|timed? ?out|ECONNRESET|ETIMEDOUT|EPIPE/i;

function isTransientConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return TRANSIENT_CONNECTION_ERROR.test(message);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPrismaClient() {
  const adapter = new PrismaPg(
    {
      connectionString: process.env.DATABASE_URL,
      // Neon suspends its free-tier compute after a few minutes idle. The pg
      // Pool doesn't check whether a cached idle connection is still alive
      // before handing it back, so a query made after the app sat idle
      // (overnight, a long dev session) can get a socket the server already
      // closed — surfaces as Prisma P1017 "Server has closed the connection".
      // Evicting idle connections well inside that suspend window forces a
      // fresh, working connection instead of a stale one.
      idleTimeoutMillis: 10_000,
      max: 10,
    },
    {
      // A pooled client dropping while idle (the same Neon auto-suspend
      // above) otherwise surfaces as an uncaught 'error' event on the pg
      // Pool, which crashes the whole process — not just the query that hit
      // it. Logging and swallowing it here lets the next query open a fresh
      // connection instead.
      onPoolError: (err) => console.error("[prisma] pool error (recovered):", err.message),
      onConnectionError: (err) =>
        console.error("[prisma] connection error (recovered):", err.message),
    }
  );

  const client = new PrismaClient({ adapter });

  // Belt and braces on top of idleTimeoutMillis above: even a *fresh*
  // connection attempt can lose the race against Neon's compute waking up
  // from suspend and time out mid-handshake. That failure is a coin flip
  // timing issue, not a real problem with the query — a moment later the
  // compute is awake and the exact same request succeeds. Retrying here
  // means a visitor never sees that as a crashed page.
  return client.$extends({
    query: {
      async $allOperations({ args, query }) {
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            if (attempt === maxAttempts || !isTransientConnectionError(error)) {
              throw error;
            }
            console.error(
              `[prisma] transient connection error, retrying (attempt ${attempt}/${maxAttempts}):`,
              error instanceof Error ? error.message : error
            );
            await sleep(attempt * 400);
          }
        }
        // Unreachable — the loop above always either returns or throws.
        throw new Error("unreachable");
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
