import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { experienceUpdateSchema } from "@/lib/validation";
import { jsonNotFound, jsonValidationError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });

  if (!experience) return jsonNotFound("Experience");
  return NextResponse.json(experience);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = experienceUpdateSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  try {
    const experience = await prisma.experience.update({ where: { id }, data: parsed.data });
    return NextResponse.json(experience);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Experience");
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.experience.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonNotFound("Experience");
    }
    throw error;
  }
}
