import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site-config";

// Blog posts come from the database, so the sitemap is generated per request
// rather than frozen at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // EXTERNAL posts live on someone else's domain — they have no page here
  // to index, so they stay out of the sitemap.
  const posts = await prisma.blogPost.findMany({
    where: { published: true, sourceType: "ORIGINAL" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const home: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((code) => [code, `${siteUrl}/${code}`])
      ),
    },
  }));

  const postUrls: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${siteUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...home, ...postUrls];
}
