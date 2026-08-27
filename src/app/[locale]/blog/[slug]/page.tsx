import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { marked } from "marked";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site-config";

// Posts are edited in the admin dashboard and must show up immediately.
export const dynamic = "force-dynamic";

function getPost(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, published: true } });
}

export async function generateMetadata(
  props: PageProps<"/[locale]/blog/[slug]">
): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const post = await getPost(slug);

  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteUrl}/${locale}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/${locale}/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/[locale]/blog/[slug]">) {
  const { slug } = await props.params;
  const [t, locale, post] = await Promise.all([
    getTranslations("blog"),
    getLocale() as Promise<AppLocale>,
    getPost(slug),
  ]);

  if (!post) notFound();

  // External coverage has no internal body — anyone landing here (an old link,
  // a search result) gets sent to the original publisher.
  if (post.sourceType === "EXTERNAL" && post.externalUrl) {
    redirect(post.externalUrl);
  }

  const html = marked(post.content ?? "", { async: false }) as string;
  const dateFormatter = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-28">
      <Link
        href="/#blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← {t("backToBlog")}
      </Link>

      {post.coverImage && (
        // Cover URLs are arbitrary external links entered in the admin
        // dashboard, so they skip next/image (which needs allow-listed hosts).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-6 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
        />
      )}

      <header className="mt-8">
        {post.publishedAt && (
          <time className="text-sm text-muted">{dateFormatter.format(post.publishedAt)}</time>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-blue dark:prose-invert mt-10 max-w-none prose-headings:font-display prose-a:text-accent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
