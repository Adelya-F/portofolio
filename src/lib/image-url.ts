/**
 * Rewrites the "share" links of common hosts into direct image URLs.
 *
 * Pasting a share link is the usual reason a hosted screenshot "doesn't
 * work": a Google Drive /view link, a Dropbox ?dl=0 link or a GitHub /blob/
 * link all point at an HTML page, not at the image itself, so the <img> on
 * the card fails to load and silently falls back to the placeholder.
 *
 * Anything not recognised is returned unchanged. Shared by the admin form
 * (live preview) and the API validation, so both see the same URL.
 */
export function normalizeImageUrl(raw: string): string {
  const value = raw.trim();

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "drive.google.com" || host === "docs.google.com") {
    const id =
      url.pathname.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.searchParams.get("id");
    if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  }

  if (host === "dropbox.com") {
    url.searchParams.delete("dl");
    url.searchParams.set("raw", "1");
    return url.toString();
  }

  if (host === "github.com") {
    const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/);
    if (match) {
      const [, owner, repo, rest] = match;
      return `https://raw.githubusercontent.com/${owner}/${repo}/${rest}`;
    }
  }

  return value;
}
