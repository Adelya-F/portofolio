import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AchievementForm } from "../AchievementForm";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const achievement = await prisma.achievement.findUnique({ where: { id } });

  if (!achievement) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Achievement</h1>
      <AchievementForm achievement={achievement} />
    </div>
  );
}
