"use client";

import { useRef, useState } from "react";
import { inputClass, labelClass, fieldClass } from "./form-styles";
import { readApiError } from "@/lib/admin-form";
import { normalizeImageUrl } from "@/lib/image-url";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif,image/avif";
const MAX_WIDTH = 1920;

type PreviewState = "idle" | "loading" | "ok" | "error";

/**
 * Re-encodes a screenshot as WebP, at most MAX_WIDTH wide, before upload.
 * Phone screenshots and full-page PNGs are easily 3-8 MB — over Vercel's
 * 4.5 MB request limit — while the card only ever shows them ~500px wide.
 * GIFs are sent as-is so animation survives; if re-encoding would not make
 * the file smaller, the original is kept.
 */
async function prepareForUpload(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );
    if (!blob || blob.size >= file.size) return file;

    // Browsers without WebP encoding fall back to PNG — name it accordingly.
    const extension = blob.type === "image/webp" ? "webp" : "png";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.${extension}`, { type: blob.type });
  } catch {
    return file;
  }
}

/**
 * Image picker for the admin forms: paste a link to an image hosted anywhere,
 * or upload a file straight from this device (stored in the database and
 * served from /api/media/<id>). Either way a live preview shows whether the
 * image actually loads before you press Save — a link to a web page instead
 * of to the image file is the most common reason a card shows no picture.
 */
export function ImageField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState<PreviewState>(defaultValue ? "loading" : "idle");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const trimmed = value.trim();
  const resolved = trimmed ? normalizeImageUrl(trimmed) : "";

  function changeValue(next: string) {
    setValue(next);
    setUploadError(null);
    setPreview(next.trim() ? "loading" : "idle");
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append("file", await prepareForUpload(file));

      const response = await fetch("/api/media", { method: "POST", body });
      if (!response.ok) {
        setUploadError(await readApiError(response));
        return;
      }

      const { url } = (await response.json()) as { url: string };
      changeValue(url);
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={fieldClass}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>

      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={(e) => changeValue(e.target.value)}
          placeholder="https://… or /images/projects/name.png"
          className={`${inputClass} min-w-0 flex-1`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {hint && <p className="text-xs text-muted">{hint}</p>}

      {resolved && resolved !== trimmed && (
        <p className="text-xs text-muted">
          Share link detected. It will be saved as the direct image link:{" "}
          <span className="break-all">{resolved}</span>
        </p>
      )}

      {uploadError && <p className="text-xs text-danger">{uploadError}</p>}

      {resolved && (
        <div className="mt-1 overflow-hidden rounded-lg border border-border bg-background">
          <div className="relative aspect-[16/9.5] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={resolved}
              src={resolved}
              alt="Preview"
              onLoad={() => setPreview("ok")}
              onError={() => setPreview("error")}
              className={`h-full w-full object-cover object-top ${
                preview === "error" ? "hidden" : ""
              }`}
            />
            {preview === "error" && (
              <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-danger">
                This image could not be loaded. Make sure the link opens the image
                file itself (right-click the image → &quot;Copy image address&quot;), not a
                web page that shows it — or use Upload instead.
              </div>
            )}
          </div>
        </div>
      )}

      {preview === "ok" && value !== (defaultValue ?? "") && (
        <p className="text-xs text-accent">Image looks good. Press Save to apply it.</p>
      )}
    </div>
  );
}
