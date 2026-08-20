import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { achievementSchema } from "@/lib/validation";
import { jsonValidationError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(achievements);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const parsed = achievementSchema.safeParse(body);

  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }

  const achievement = await prisma.achievement.create({ data: parsed.data });
  return NextResponse.json(achievement, { status: 201 });
}
