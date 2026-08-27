"use client";

import { useState } from "react";

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
 * Cover image for a blog card, with a tidy placeholder when `coverImage` is
 * empty or the URL fails to load. Client component so onError can swap in the
 * placeholder — cover URLs are arbitrary external links typed into the admin
 * dashboard and can rot.
 */
export function BlogThumbnail({
  coverImage,
  alt,
  placeholder,
  className = "",
  iconClassName = "h-6 w-6",
}: {
  coverImage: string | null;
  alt: string;
  placeholder: string;
  className?: string;
  iconClassName?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = !!coverImage && !errored;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border bg-background-subtle ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-muted"
          title={placeholder}
        >
          <ImageIcon className={`${iconClassName} opacity-50`} />
          <span className="sr-only">{placeholder}</span>
        </div>
      )}
    </div>
  );
}
