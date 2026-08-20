import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
