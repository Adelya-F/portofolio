"use client";

import { useState } from "react";
import { normalizeImageUrl } from "@/lib/image-url";

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 17 4.8-4.5 3.4 3 3-2.6L20 17" />
    </svg>
  );
}

/**
 * Screenshot of a project framed as a browser window. Every card uses the
 * same 16/10 box so a mix of tall and wide screenshots can't make the grid
 * rows uneven — the image is cropped to fill, never letterboxed.
 *
 * Client component because a broken/expired image URL entered in the admin
 * dashboard has to fall back to the placeholder at runtime (onError).
 */
export function ProjectPreview({
  imageUrl,
  title,
  siteUrl,
  placeholder,
}: {
  imageUrl: string | null;
  title: string;
  siteUrl: string | null;
  placeholder: string;
}) {
  const [errored, setErrored] = useState(false);
  // Links saved before share links were normalised on save still work.
  const src = imageUrl ? normalizeImageUrl(imageUrl) : null;
  const showImage = !!src && !errored;

  let host: string | null = null;
  if (siteUrl) {
    try {
      host = new URL(siteUrl).hostname.replace(/^www\./, "");
    } catch {
      host = null;
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background-subtle shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-danger/50" />
        <span className="h-2 w-2 rounded-full bg-accent/40" />
        <span className="h-2 w-2 rounded-full bg-muted/40" />
        <span className="ml-1.5 flex-1 truncate rounded-full bg-background px-2.5 py-0.5 text-[10px] text-muted">
          {host ?? title.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-background">
        {showImage ? (
          // Screenshots are arbitrary external URLs entered in the admin
          // dashboard, so they skip next/image (which needs every host
          // allow-listed in next.config.ts up front).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`${title} preview`}
            loading="lazy"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            <ImageIcon className="h-6 w-6 opacity-60" />
            <span className="text-xs">{placeholder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
