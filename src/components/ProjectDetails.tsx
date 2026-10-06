"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectPreview } from "./ProjectPreview";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

type Labels = {
  readMore: string;
  close: string;
  demo: string;
  repo: string;
  featured: string;
  imagePlaceholder: string;
};

/**
 * The description on a project card, clamped to three lines so every card in
 * the rail stays the same size. When the text does not fit, a "Read more"
 * button opens the project in a larger dialog with the full description,
 * a bigger screenshot, every tag, and the links.
 *
 * The button's row is always reserved (just invisible when not needed), so
 * the card does not grow after hydration measures the text.
 */
export function ProjectDetails({
  title,
  description,
  tags,
  imageUrl,
  demoUrl,
  repoUrl,
  featured,
  labels,
}: {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  labels: Labels;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const measure = () => setTruncated(text.scrollHeight > text.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(text);
    return () => observer.disconnect();
  }, [description]);


  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <div className="mt-1.5 flex flex-1 flex-col items-start">
      <p ref={textRef} className="text-sm text-muted line-clamp-3">
        {description}
      </p>
      <button
        type="button"
        onClick={open}
        tabIndex={truncated ? 0 : -1}
        aria-hidden={!truncated}
        className={`mt-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover hover:underline ${
          truncated ? "" : "invisible"
        }`}
      >
        {labels.readMore} →
      </button>

      <dialog
        ref={dialogRef}
        aria-label={title}
        // Clicks on the dimmed backdrop land on the <dialog> element itself.
        // No page scroll lock: it needs a reliable "closed" signal, and Esc
        // closes the dialog natively. overscroll-contain keeps scrolling the
        // long text from scrolling the page behind it instead.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-[90dvh] w-[min(92vw,44rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-[project-dialog-in_200ms_ease-out]"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold sm:text-2xl">{title}</h3>
              {featured && (
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {labels.featured}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <ProjectPreview
              imageUrl={imageUrl}
              title={title}
              siteUrl={demoUrl ?? repoUrl}
              placeholder={labels.imagePlaceholder}
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-muted sm:text-base">
            {description}
          </p>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {(demoUrl || repoUrl) && (
            <div className="mt-5 flex gap-4 text-sm font-medium">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  {labels.demo} →
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {labels.repo} →
                </a>
              )}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
