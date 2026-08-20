import { prisma } from "@/lib/prisma";
import { markAsReadAction } from "./actions";

// Admin pages always read live data — never cache a stale snapshot.
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-muted">{messages.length} total</p>

      <div className="mt-8 flex flex-col gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl border p-5 ${
              message.read ? "border-border bg-surface" : "border-accent/40 bg-accent-soft"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!message.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  )}
                  <p className="font-medium">{message.name}</p>
                  <span className="text-sm text-muted">&lt;{message.email}&gt;</span>
                </div>
                <p className="mt-1 text-xs text-muted">{formatDate(message.createdAt)}</p>
              </div>

              {!message.read && (
                <form action={markAsReadAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-hover"
                  >
                    Mark as read
                  </button>
                </form>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
