import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { blogPostSchema } from "@/lib/validation";
import { jsonError, jsonValidationError } from "@/lib/api-response";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = blogPostSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const post = await prisma.blogPost.create({ data: parsed.data });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("A blog post with this slug already exists", 409);
    }
    throw error;
  }
}
