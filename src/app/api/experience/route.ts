import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { experienceSchema } from "@/lib/validation";
import { jsonValidationError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const experience = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(experience);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const parsed = experienceSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  const experience = await prisma.experience.create({ data: parsed.data });
  return NextResponse.json(experience, { status: 201 });
}
