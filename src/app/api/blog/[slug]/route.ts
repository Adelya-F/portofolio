import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { blogPostUpdateSchema } from "@/lib/validation";
import { jsonError, jsonNotFound, jsonValidationError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) return jsonNotFound("Blog post");
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const body = await request.json();
  const parsed = blogPostUpdateSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const post = await prisma.blogPost.update({ where: { slug }, data: parsed.data });
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") return jsonNotFound("Blog post");
      if (error.code === "P2002") return jsonError("A blog post with this slug already exists", 409);
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { slug } = await params;

  try {
    await prisma.blogPost.delete({ where: { slug } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Blog post");
    }
    throw error;
  }
}
