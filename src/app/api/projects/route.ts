import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { projectSchema } from "@/lib/validation";
import { jsonError, jsonValidationError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const project = await prisma.project.create({ data: parsed.data });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("A project with this slug already exists", 409);
    }
    throw error;
  }
}
