import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { achievementUpdateSchema } from "@/lib/validation";
import { jsonNotFound, jsonValidationError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const achievement = await prisma.achievement.findUnique({ where: { id } });

  if (!achievement) return jsonNotFound("Achievement");
  return NextResponse.json(achievement);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json();
  const parsed = achievementUpdateSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const achievement = await prisma.achievement.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(achievement);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Achievement");
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    await prisma.achievement.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Achievement");
    }
    throw error;
  }
}
