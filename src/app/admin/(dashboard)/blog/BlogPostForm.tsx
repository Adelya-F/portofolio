"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import type { BlogPost, BlogSourceType } from "@/generated/prisma/client";
import {
  inputClass,
  labelClass,
  fieldClass,
  submitButtonClass,
  cancelLinkClass,
  errorBannerClass,
} from "@/components/admin/form-styles";
import { readApiError } from "@/lib/admin-form";

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const sourceOptions: { value: BlogSourceType; label: string; hint: string }[] = [
  {
    value: "ORIGINAL",
    label: "Original post",
    hint: "You wrote it. The card opens the detail page on this site.",
  },
  {
    value: "EXTERNAL",
    label: "External article",
    hint: "Someone else published it. The card links straight out to them.",
  },
];

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [content, setContent] = useState(post?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [sourceType, setSourceType] = useState<BlogSourceType>(
    post?.sourceType ?? "ORIGINAL"
  );

  const isExternal = sourceType === "EXTERNAL";

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
    const published = data.get("published") === "on";

    const payload = {
      title: data.get("title"),
      slug: data.get("slug"),
      sourceType,
      excerpt: data.get("excerpt"),
      // Only one of these two applies. The other is cleared so switching the
      // source type never leaves stale data behind.
      content: isExternal ? null : content,
      externalUrl: isExternal ? data.get("externalUrl") || null : null,
      coverImage: data.get("coverImage") || null,
      published,
      // A published post with no date sorts above everything else on the
      // public page, so fall back to today.
      publishedAt: publishedAt || (published ? new Date().toISOString().slice(0, 10) : null),
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
        setError(await readApiError(response));
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
      <fieldset className={fieldClass}>
        <legend className={labelClass}>Source</legend>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {sourceOptions.map((option) => {
            const active = sourceType === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-lg border px-4 py-3 transition-colors ${
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-background hover:bg-surface-hover"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="sourceType"
                    value={option.value}
                    checked={active}
                    onChange={() => setSourceType(option.value)}
                    className="h-4 w-4 accent-accent"
                  />
                  {option.label}
                </span>
                <span className="mt-1 block text-xs text-muted">{option.hint}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

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

      {isExternal ? (
        <div className={fieldClass}>
          <label htmlFor="externalUrl" className={labelClass}>
            External article URL
          </label>
          <input
            id="externalUrl"
            name="externalUrl"
            type="url"
            required
            defaultValue={post?.externalUrl ?? ""}
            placeholder="https://news-site.com/article-about-you"
            className={inputClass}
          />
          <p className="text-xs text-muted">
            Clicking the card on the public site opens this link in a new tab —
            no detail page is generated.
          </p>
        </div>
      ) : (
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
              dangerouslySetInnerHTML={{
                __html: previewHtml || "<p>Nothing to preview yet.</p>",
              }}
            />
          )}
        </div>
      )}

      <div className={fieldClass}>
        <label htmlFor="coverImage" className={labelClass}>
          Cover Image URL (optional)
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="text"
          defaultValue={post?.coverImage ?? ""}
          placeholder="https://… or /images/name.jpg"
          className={inputClass}
        />
        <p className="text-xs text-muted">
          Used as the card thumbnail. Must be a direct link to the image file
          (ending in .jpg/.png/.webp), not a link to the page it sits on.
          Leave empty to show a placeholder.
        </p>
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

      <div className={fieldClass}>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="published"
            // New posts default to published — a draft saves fine but never
            // shows up on the site, which reads as "the post disappeared".
            defaultChecked={post ? post.published : true}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Published (visible on the public site)
        </label>
        <p className="text-xs text-muted">
          Unchecked saves the post as a draft: it stays in this list but does
          not appear in the Blog section of the site.
        </p>
      </div>

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
