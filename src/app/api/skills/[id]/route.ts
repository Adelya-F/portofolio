import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { skillUpdateSchema } from "@/lib/validation";
import { jsonNotFound, jsonValidationError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const skill = await prisma.skill.findUnique({ where: { id } });

  if (!skill) return jsonNotFound("Skill");
  return NextResponse.json(skill);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const parsed = skillUpdateSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const skill = await prisma.skill.update({ where: { id }, data: parsed.data });
    return NextResponse.json(skill);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Skill");
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    await prisma.skill.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Skill");
    }
    throw error;
  }
}
