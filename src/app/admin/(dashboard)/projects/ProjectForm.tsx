"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/generated/prisma/client";
import {
  inputClass,
  labelClass,
  fieldClass,
  submitButtonClass,
  cancelLinkClass,
  errorBannerClass,
} from "@/components/admin/form-styles";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(e.currentTarget);
    const tags = String(data.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      title: data.get("title"),
      slug: data.get("slug"),
      descriptionEn: data.get("descriptionEn"),
      descriptionId: data.get("descriptionId"),
      imageUrl: data.get("imageUrl") || null,
      demoUrl: data.get("demoUrl") || null,
      repoUrl: data.get("repoUrl") || null,
      tags,
      featured: data.get("featured") === "on",
      order: Number(data.get("order")),
    };

    const endpoint = project ? `/api/projects/${project.slug}` : "/api/projects";
    const method = project ? "PUT" : "POST";

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

      router.push("/admin/projects");
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
          defaultValue={project?.title}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="slug" className={labelClass}>
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={project?.slug}
          placeholder="lowercase-with-hyphens"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
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
          defaultValue={project?.descriptionEn}
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
          defaultValue={project?.descriptionId}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="tags" className={labelClass}>
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={project?.tags.join(", ")}
          placeholder="Terraform, Docker, Kubernetes"
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="imageUrl" className={labelClass}>
          Image URL (optional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={project?.imageUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="demoUrl" className={labelClass}>
          Demo URL (optional)
        </label>
        <input
          id="demoUrl"
          name="demoUrl"
          type="url"
          defaultValue={project?.demoUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="repoUrl" className={labelClass}>
          Repository URL (optional)
        </label>
        <input
          id="repoUrl"
          name="repoUrl"
          type="url"
          defaultValue={project?.repoUrl ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        Featured
      </label>

      <div className={fieldClass}>
        <label htmlFor="order" className={labelClass}>
          Order (lower shows first)
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={project?.order ?? 0}
          className={inputClass}
        />
      </div>

      {error && <div className={errorBannerClass}>{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={submitButtonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Link href="/admin/projects" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
