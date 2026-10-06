import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNotFound } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const media = await prisma.media.findUnique({
    where: { id },
    select: { data: true, contentType: true },
  });

  if (!media) return jsonNotFound("Image");

  return new Response(Buffer.from(media.data), {
    headers: {
      "Content-Type": media.contentType,
      // An id is never reused for different bytes (a new upload gets a new
      // id), so the image can be cached forever — by browsers and by
      // Vercel's CDN (s-maxage), which keeps repeat views off the database.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
