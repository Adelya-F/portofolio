import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "./actions";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadCount = await prisma.message.count({ where: { read: false } });

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-surface p-4 md:w-64 md:border-r md:border-b-0 md:p-6">
        <Link href="/admin" className="font-display text-lg font-semibold">
          Adelya<span className="text-accent">.</span>{" "}
          <span className="text-sm font-normal text-muted">Admin</span>
        </Link>

        <nav className="mt-4 flex gap-1 overflow-x-auto md:mt-8 md:flex-1 md:flex-col md:overflow-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {item.label}
              {item.href === "/admin/messages" && unreadCount > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="mt-4 md:mt-0">
          <button
            type="submit"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            Log Out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
