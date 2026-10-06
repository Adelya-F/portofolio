/**
 * Projects to add (or update) with `npx tsx scripts/add-projects.ts`.
 *
 * Matching is by `slug`: a slug that already exists is updated (only the
 * fields you list change, e.g. `{ slug: "averus", order: 4 }`), a new one is
 * created. Projects not listed here are left alone, so anything added or
 * edited from the admin dashboard is safe.
 *
 * `image` can be:
 *   - a file on this computer, e.g. "D:/screenshots/kulkul.png" — it is
 *     resized, uploaded into the database and served from /api/media/<id>,
 *     so it shows up immediately, no git push or redeploy needed;
 *   - a link to an image hosted anywhere (https://…), Google Drive / Dropbox
 *     share links included;
 *   - a path inside public/, e.g. "/images/projects/x.png" (only works once
 *     that file has been pushed and deployed).
 *
 * After running the script you can empty this list again — the projects live
 * in the database, not here.
 */
export type ProjectToAdd = {
  slug: string;
  // Required for a new project; optional when updating an existing one.
  title?: string;
  descriptionEn?: string;
  descriptionId?: string;
  tags?: string[];
  image?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured?: boolean;
  /** Position in the rail, lower shows first. Defaults to after the last one. */
  order?: number;
};

export const projectsToAdd: ProjectToAdd[] = [];
