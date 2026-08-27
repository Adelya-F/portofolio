"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Skill } from "@/generated/prisma/client";
import {
  inputClass,
  labelClass,
  fieldClass,
  submitButtonClass,
  cancelLinkClass,
  errorBannerClass,
} from "@/components/admin/form-styles";
import { readApiError } from "@/lib/admin-form";

export function SkillForm({ skill }: { skill?: Skill }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name"),
      category: data.get("category"),
      order: Number(data.get("order")),
    };

    const endpoint = skill ? `/api/skills/${skill.id}` : "/api/skills";
    const method = skill ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError(await readApiError(response));
        return;
      }

      router.push("/admin/skills");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-5">
      <div className={fieldClass}>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={skill?.name}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          defaultValue={skill?.category}
          placeholder="e.g. Cloud Computing & Infrastructure"
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
          defaultValue={skill?.order ?? 0}
          className={inputClass}
        />
      </div>

      {error && <div className={errorBannerClass}>{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={submitButtonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Link href="/admin/skills" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
