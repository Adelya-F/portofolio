"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Achievement } from "@/generated/prisma/client";
import {
  inputClass,
  labelClass,
  fieldClass,
  submitButtonClass,
  cancelLinkClass,
  errorBannerClass,
} from "@/components/admin/form-styles";
import Link from "next/link";

type Props = {
  achievement?: Achievement;
};

export function AchievementForm({ achievement }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(e.currentTarget);
    const payload = {
      title: data.get("title"),
      level: data.get("level"),
      competition: data.get("competition"),
      year: Number(data.get("year")),
      order: Number(data.get("order")),
    };

    const endpoint = achievement
      ? `/api/achievements/${achievement.id}`
      : "/api/achievements";
    const method = achievement ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/admin/achievements");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
      <div className={fieldClass}>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={achievement?.title}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="level" className={labelClass}>
          Level
        </label>
        <select
          id="level"
          name="level"
          defaultValue={achievement?.level ?? "NATIONAL"}
          className={inputClass}
        >
          <option value="NATIONAL">National</option>
          <option value="PROVINCIAL">Provincial</option>
          <option value="CITY">City</option>
        </select>
      </div>

      <div className={fieldClass}>
        <label htmlFor="competition" className={labelClass}>
          Competition
        </label>
        <input
          id="competition"
          name="competition"
          type="text"
          required
          defaultValue={achievement?.competition}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="year" className={labelClass}>
          Year
        </label>
        <input
          id="year"
          name="year"
          type="number"
          required
          defaultValue={achievement?.year}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="order" className={labelClass}>
          Order (lower shows first)
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={achievement?.order ?? 0}
          className={inputClass}
        />
      </div>

      {error && <div className={errorBannerClass}>{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={submitButtonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Link href="/admin/achievements" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
