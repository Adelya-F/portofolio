"use client";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="font-display text-2xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted">
        This page reads from the database, and the request failed. If you just set
        this project up, make sure <code className="rounded bg-surface px-1.5 py-0.5">DATABASE_URL</code> is
        set in <code className="rounded bg-surface px-1.5 py-0.5">.env.local</code> and that you&apos;ve run
        the migration and seed commands.
      </p>
      {error.digest && (
        <p className="text-xs text-muted/70">Error reference: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
