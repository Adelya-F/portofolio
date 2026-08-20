import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../ExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });

  if (!experience) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Experience Entry</h1>
      <ExperienceForm experience={experience} />
    </div>
  );
}
