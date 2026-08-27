import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
