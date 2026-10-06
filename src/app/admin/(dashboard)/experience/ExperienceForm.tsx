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
import { readApiError } from "@/lib/admin-form";

/**
 * One field in both languages. English is required; Indonesian is optional
 * and falls back to the English text on the public page when left empty.
 */
function BilingualField({
  name,
  label,
  en,
  id,
  placeholderEn,
  placeholderId,
}: {
  name: string;
  label: string;
  en?: string;
  id?: string | null;
  placeholderEn?: string;
  placeholderId?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className={fieldClass}>
        <label htmlFor={name} className={labelClass}>
          {label} (English)
        </label>
        <input
          id={name}
          name={name}
          type="text"
          required
          defaultValue={en}
          placeholder={placeholderEn}
          className={inputClass}
        />
      </div>
      <div className={fieldClass}>
        <label htmlFor={`${name}Id`} className={labelClass}>
          {label} (Indonesian)
        </label>
        <input
          id={`${name}Id`}
          name={`${name}Id`}
          type="text"
          defaultValue={id ?? ""}
          placeholder={placeholderId ?? "Same as English if empty"}
          className={inputClass}
        />
      </div>
    </div>
  );
}

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
      titleId: data.get("titleId"),
      organization: data.get("organization"),
      organizationId: data.get("organizationId"),
      date: data.get("date"),
      dateId: data.get("dateId"),
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
        setError(await readApiError(response));
        return;
      }

      router.push("/admin/experience");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-5">
      <BilingualField
        name="title"
        label="Title"
        en={experience?.title}
        id={experience?.titleId}
        placeholderEn="e.g. 1st Place, LKS Cloud Computing"
        placeholderId="mis. Juara 1 LKS Cloud Computing"
      />

      <BilingualField
        name="organization"
        label="Organization"
        en={experience?.organization}
        id={experience?.organizationId}
      />

      <BilingualField
        name="date"
        label="Date"
        en={experience?.date}
        id={experience?.dateId}
        placeholderEn="e.g. Feb 2026 – Present"
        placeholderId="mis. Feb 2026 – Sekarang"
      />

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
