import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validation";
import { jsonValidationError } from "@/lib/api-response";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = skillSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  const skill = await prisma.skill.create({ data: parsed.data });
  return NextResponse.json(skill, { status: 201 });
}
