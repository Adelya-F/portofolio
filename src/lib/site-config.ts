// Central place for the footer/social links shown across the site.
// Update the two placeholder URLs below with your real profiles — nothing
// else in the codebase needs to change.
export const socialLinks = {
  github: "https://github.com/Adelya-F",
  linkedin: "https://www.linkedin.com/in/adelya-fauzi-alfian-196b95408/",
  email: "adelyafzy@gmail.com",
};

/**
 * Absolute base URL of the deployed site. Used for metadataBase, Open Graph
 * URLs, and sitemap.xml — all of which must be absolute, not relative.
 * Set NEXT_PUBLIC_SITE_URL in Vercel; NEXTAUTH_URL is the fallback so a
 * correctly configured deployment works even if you only set that one.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");
