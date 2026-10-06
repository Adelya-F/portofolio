import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import sharp from "sharp";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { projectSchema, projectUpdateSchema } from "../src/lib/validation";
import { projectsToAdd } from "./projects-to-add";

/**
 * Adds or updates the projects listed in scripts/projects-to-add.ts:
 *
 *   npx tsx scripts/add-projects.ts            # preview, changes nothing
 *   npx tsx scripts/add-projects.ts --apply    # write to the database
 *
 * The public site reads projects from the database on every request, so the
 * result is live immediately — no redeploy needed.
 */
const apply = process.argv.includes("--apply");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MEDIA_URL_PATTERN = /^\/api\/media\/([a-z0-9]+)$/i;

/** Same treatment the admin Upload button gives a screenshot. */
async function uploadLocalImage(path: string): Promise<string> {
  const data = await sharp(readFileSync(path))
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const media = await prisma.media.create({
    data: {
      filename: basename(path).replace(/\.[^.]+$/, "") + ".webp",
      contentType: "image/webp",
      size: data.length,
      data: new Uint8Array(data),
    },
    select: { id: true },
  });
  return `/api/media/${media.id}`;
}

async function deleteMediaIfUnused(url: string | null) {
  const id = url?.match(MEDIA_URL_PATTERN)?.[1];
  if (!id || !url) return;
  const [projects, posts] = await Promise.all([
    prisma.project.count({ where: { imageUrl: url } }),
    prisma.blogPost.count({ where: { coverImage: url } }),
  ]);
  if (projects + posts === 0) await prisma.media.deleteMany({ where: { id } });
}

async function main() {
  if (projectsToAdd.length === 0) {
    console.log("scripts/projects-to-add.ts is empty — nothing to do.");
    return;
  }

  const existing = await prisma.project.findMany({
    select: { slug: true, imageUrl: true, order: true },
  });
  const bySlug = new Map(existing.map((p) => [p.slug, p]));
  let nextOrder = Math.max(0, ...existing.map((p) => p.order)) + 1;

  for (const { image, ...input } of projectsToAdd) {
    const current = bySlug.get(input.slug);
    const isLocalFile = !!image && !/^https?:\/\//.test(image) && !image.startsWith("/");

    if (isLocalFile && !existsSync(image)) {
      throw new Error(`${input.slug}: image file not found: ${image}`);
    }

    const fields: Record<string, unknown> = { ...input };
    if (image !== undefined) {
      // Placeholder so validation passes; replaced by the real upload below.
      fields.imageUrl = isLocalFile ? "/api/media/pending" : image;
    }

    // An existing project is only patched: fields left out of the list keep
    // their current values (a reorder does not need the descriptions again).
    // A new project needs every required field.
    if (!current) fields.order ??= nextOrder++;
    const parsed = (current ? projectUpdateSchema : projectSchema).safeParse(fields);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new Error(`${input.slug}: ${issue.path.join(".")}: ${issue.message}`);
    }
    // The schemas fill defaults (empty tags, featured: false, ...) for missing
    // keys — on a patch those would overwrite real data, so keep only the keys
    // that were actually listed.
    const data: Record<string, unknown> = Object.fromEntries(
      Object.entries(parsed.data).filter(([key]) => key in fields)
    );

    const changes = Object.keys(data).filter((key) => key !== "slug").join(", ");
    console.log(
      `${apply ? "" : "[preview] "}${current ? "update" : "create"} ${input.slug}` +
        (current ? ` (${changes})` : ` (order ${data.order})`) +
        (isLocalFile ? `, upload ${image}` : "")
    );
    if (!apply) continue;

    if (isLocalFile) data.imageUrl = await uploadLocalImage(image);

    if (current) {
      await prisma.project.update({ where: { slug: input.slug }, data });
      if ("imageUrl" in data && current.imageUrl !== data.imageUrl) {
        await deleteMediaIfUnused(current.imageUrl);
      }
    } else {
      await prisma.project.create({ data: data as Parameters<typeof prisma.project.create>[0]["data"] });
    }
  }

  console.log(apply ? "Done." : "\nNothing was written. Run again with --apply to save.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
