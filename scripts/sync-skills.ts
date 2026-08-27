import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { skills } from "../prisma/skills";

/**
 * Replaces the whole skills table with the list in prisma/skills.ts, without
 * touching any other table. Use this after editing that file:
 *
 *   npx tsx scripts/sync-skills.ts
 *
 * Unlike `prisma db seed`, this leaves your projects, achievements, blog posts,
 * and messages alone.
 */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const before = await prisma.skill.count();
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({ data: skills });
  console.log(`Skills synced: ${before} replaced with ${skills.length}.`);
  await prisma.$disconnect();
}

main();
