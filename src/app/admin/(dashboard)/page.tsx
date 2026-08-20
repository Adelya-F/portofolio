import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Admin pages always read live data — never cache a stale snapshot.
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [achievements, projects, skills, experience, blogPosts, unreadMessages] =
    await Promise.all([
      prisma.achievement.count(),
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.blogPost.count(),
      prisma.message.count({ where: { read: false } }),
    ]);

  const cards = [
    { label: "Achievements", count: achievements, href: "/admin/achievements" },
    { label: "Projects", count: projects, href: "/admin/projects" },
    { label: "Skills", count: skills, href: "/admin/skills" },
    { label: "Experience", count: experience, href: "/admin/experience" },
    { label: "Blog posts", count: blogPosts, href: "/admin/blog" },
    { label: "Unread messages", count: unreadMessages, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-sm text-muted">Manage your portfolio content.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/50 hover:bg-surface-hover"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
