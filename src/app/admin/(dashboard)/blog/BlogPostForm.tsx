"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import type { BlogPost } from "@/generated/prisma/client";
import {
  inputClass,
  labelClass,
  fieldClass,
  submitButtonClass,
  cancelLinkClass,
  errorBannerClass,
} from "@/components/admin/form-styles";

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [content, setContent] = useState(post?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  const previewHtml = useMemo(
    () => marked(content, { async: false }) as string,
    [content]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const data = new FormData(e.currentTarget);
    const tags = String(data.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const publishedAt = data.get("publishedAt");

    const payload = {
      title: data.get("title"),
      slug: data.get("slug"),
      excerpt: data.get("excerpt"),
      content,
      coverImage: data.get("coverImage") || null,
      published: data.get("published") === "on",
      publishedAt: publishedAt ? publishedAt : null,
      tags,
    };

    const endpoint = post ? `/api/blog/${post.slug}` : "/api/blog";
    const method = post ? "PUT" : "POST";

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

      router.push("/admin/blog");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-5">
      <div className={fieldClass}>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post?.title}
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
          defaultValue={post?.slug}
          placeholder="lowercase-with-hyphens"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="excerpt" className={labelClass}>
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={post?.excerpt}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className={fieldClass}>
        <div className="flex items-center justify-between">
          <label htmlFor="content" className={labelClass}>
            Content (Markdown)
          </label>
          <div className="flex gap-1 rounded-full border border-border bg-surface p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`rounded-full px-3 py-1 ${tab === "write" ? "bg-accent text-accent-foreground" : "text-muted"}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`rounded-full px-3 py-1 ${tab === "preview" ? "bg-accent text-accent-foreground" : "text-muted"}`}
            >
              Preview
            </button>
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            id="content"
            name="content"
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in Markdown — headings with #, **bold**, lists with -, etc."
            className={`${inputClass} font-mono resize-none`}
          />
        ) : (
          <div
            className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border bg-background px-4 py-3 text-foreground"
            dangerouslySetInnerHTML={{ __html: previewHtml || "<p class='text-muted'>Nothing to preview yet.</p>" }}
          />
        )}
      </div>

      <div className={fieldClass}>
        <label htmlFor="coverImage" className={labelClass}>
          Cover Image URL (optional)
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          defaultValue={post?.coverImage ?? ""}
          className={inputClass}
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
          defaultValue={post?.tags.join(", ")}
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="publishedAt" className={labelClass}>
          Published date (optional)
        </label>
        <input
          id="publishedAt"
          name="publishedAt"
          type="date"
          defaultValue={toDateInputValue(post?.publishedAt)}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published}
          className="h-4 w-4 rounded border-border accent-accent"
        />
        Published (visible on the public site)
      </label>

      {error && <div className={errorBannerClass}>{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={submitButtonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
        <Link href="/admin/blog" className={cancelLinkClass}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
