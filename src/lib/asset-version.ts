import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * Returns the file's last-modified time so callers can cache-bust a public/
 * asset URL. Next's image optimizer caches by URL, not file content, so
 * replacing a file without changing its name would otherwise keep serving
 * the stale cached version indefinitely (server cache has no TTL-independent
 * invalidation, and the browser's own HTTP cache compounds it).
 */
export function getPublicAssetVersion(publicPath: string): string | null {
  try {
    const stat = statSync(join(process.cwd(), "public", publicPath));
    return stat.mtimeMs.toString(36);
  } catch {
    return null;
  }
}
