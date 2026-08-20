"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Experience } from "@/generated/prisma/client";
import {
  inputClass,
  labelClass,
  fieldClass,
  submitButtonClass,
  cancelLinkClass,
  errorBannerClass,
} from "@/components/admin/form-styles";

export function ExperienceForm({ experience }: { experience?: Experience }) {
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
      organization: data.get("organization"),
      date: data.get("date"),
      descriptionEn: data.get("descriptionEn"),
      descriptionId: data.get("descriptionId"),
      order: Number(data.get("order")),
    };

    const endpoint = experience ? `/api/experience/${experience.id}` : "/api/experience";
    const method = experience ? "PUT" : "POST";

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

      router.push("/admin/experience");
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
          defaultValue={experience?.title}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="organization" className={labelClass}>
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          required
          defaultValue={experience?.organization}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="date" className={labelClass}>
          Date
        </label>
        <input
          id="date"
          name="date"
          type="text"
          required
          defaultValue={experience?.date}
          placeholder="e.g. Feb 2026 — Present"
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="descriptionEn" className={labelClass}>
          Description (English)
        </label>
        <textarea
          id="descriptionEn"
          name="descriptionEn"
          required
          rows={4}
          defaultValue={experience?.descriptionEn}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="descriptionId" className={labelClass}>
          Description (Indonesian)
        </label>
        <textarea
          id="descriptionId"
          name="descriptionId"
          required
          rows={4}
          defaultValue={experience?.descriptionId}
          className={`${inputClass} resize-none`}
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
          defaultValue={experience?.order ?? 0}
          className={inputClass}
        />
      </div>

      {error && <div className={errorBannerClass}>{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={submitButtonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Link href="/admin/experience" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
