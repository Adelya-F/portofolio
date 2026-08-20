import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillForm } from "../SkillForm";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await prisma.skill.findUnique({ where: { id } });

  if (!skill) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Skill</h1>
      <SkillForm skill={skill} />
    </div>
  );
}
