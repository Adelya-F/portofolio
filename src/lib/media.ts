import { prisma } from "@/lib/prisma";

const MEDIA_URL_PATTERN = /^\/api\/media\/([a-z0-9]+)$/i;

/** The public URL an uploaded image is served from. */
export function mediaUrl(id: string) {
  return `/api/media/${id}`;
}

/**
 * Deletes an uploaded image once nothing points at it any more — called after
 * a project's image is replaced or the project is deleted, so the database
 * does not slowly fill up with screenshots no page shows. External URLs and
 * files in public/ are ignored; only /api/media/<id> URLs are ours to delete.
 */
export async function deleteMediaIfUnused(url: string | null | undefined) {
  const id = url?.match(MEDIA_URL_PATTERN)?.[1];
  if (!id || !url) return;

  const [projects, posts] = await Promise.all([
    prisma.project.count({ where: { imageUrl: url } }),
    prisma.blogPost.count({ where: { coverImage: url } }),
  ]);
  if (projects + posts > 0) return;

  await prisma.media.deleteMany({ where: { id } });
}
