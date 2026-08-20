import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { projectUpdateSchema } from "@/lib/validation";
import { jsonError, jsonNotFound, jsonValidationError } from "@/lib/api-response";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) return jsonNotFound("Project");
  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const body = await request.json();
  const parsed = projectUpdateSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const project = await prisma.project.update({ where: { slug }, data: parsed.data });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") return jsonNotFound("Project");
      if (error.code === "P2002") return jsonError("A project with this slug already exists", 409);
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { slug } = await params;

  try {
    await prisma.project.delete({ where: { slug } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Project");
    }
    throw error;
  }
}
