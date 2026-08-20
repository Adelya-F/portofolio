import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";

// Admin pages always read live data — never cache a stale snapshot.
export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experience = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Experience</h1>
          <p className="mt-1 text-sm text-muted">{experience.length} total</p>
        </div>
        <Link
          href="/admin/experience/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          New Entry
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Organization</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {experience.map((exp) => (
              <tr key={exp.id}>
                <td className="px-4 py-3 font-medium">{exp.title}</td>
                <td className="px-4 py-3 text-muted">{exp.organization}</td>
                <td className="px-4 py-3 text-muted">{exp.date}</td>
                <td className="px-4 py-3 text-muted">{exp.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/experience/${exp.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                    >
                      Edit
                    </Link>
                    <DeleteButton endpoint={`/api/experience/${exp.id}`} itemLabel={exp.title} />
                  </div>
                </td>
              </tr>
            ))}
            {experience.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No experience entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
