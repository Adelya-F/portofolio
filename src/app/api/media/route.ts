import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";
import { mediaUrl } from "@/lib/media";

// Vercel rejects request bodies over 4.5 MB before they reach the function.
// The admin form re-encodes screenshots to WebP first, so real uploads are
// far below this.
const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/avif",
]);

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) return jsonError("No file was uploaded");
  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError("Only PNG, JPEG, WebP, GIF, or AVIF images can be uploaded", 415);
  }
  if (file.size > MAX_BYTES) return jsonError("Image is larger than 4 MB", 413);

  const media = await prisma.media.create({
    data: {
      filename: file.name || "upload",
      contentType: file.type,
      size: file.size,
      data: new Uint8Array(await file.arrayBuffer()),
    },
    select: { id: true },
  });

  return NextResponse.json({ id: media.id, url: mediaUrl(media.id) }, { status: 201 });
}
