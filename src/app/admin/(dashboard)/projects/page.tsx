import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";

// Admin pages always read live data — never cache a stale snapshot.
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          New Project
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3 font-medium">{project.title}</td>
                <td className="px-4 py-3 text-muted">{project.slug}</td>
                <td className="px-4 py-3 text-muted">{project.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-muted">{project.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      endpoint={`/api/projects/${project.slug}`}
                      itemLabel={project.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
