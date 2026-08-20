"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  itemLabel,
}: {
  endpoint: string;
  itemLabel: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${itemLabel}"? This can't be undone.`);
    if (!confirmed) return;

    setPending(true);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        alert("Couldn't delete this item. Please try again.");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
