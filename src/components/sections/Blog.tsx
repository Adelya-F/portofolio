import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { BlogThumbnail } from "@/components/BlogThumbnail";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

function PenIcon({ className }: { className?: string }) {
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487a2.06 2.06 0 1 1 2.914 2.914L8.5 18.677l-4 1 1-4L16.862 4.487Z"
      />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 4 11 13" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"
      />
    </svg>
  );
}

export async function Blog() {
  const [t, locale, posts] = await Promise.all([
    getTranslations("blog"),
    getLocale() as Promise<AppLocale>,
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [
        // nulls: "last" keeps a dateless post from sorting above dated ones.
        { publishedAt: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
    }),
  ]);

  const dateFormatter = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="blog" className="scroll-mt-24 bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </ScrollReveal>

        {posts.length === 0 ? (
          <ScrollReveal delay={0.1} className="mt-10">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-accent/30 bg-surface px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                <PenIcon className="h-5 w-5 text-accent" />
              </span>
              <h3 className="font-display text-lg font-semibold">{t("emptyTitle")}</h3>
              <p className="max-w-sm text-sm text-muted">{t("emptyMessage")}</p>
            </div>
          </ScrollReveal>
        ) : (
          <StaggerGroup className="mt-10 space-y-4">
            {posts.map((post) => {
              const isExternal = post.sourceType === "EXTERNAL" && !!post.externalUrl;

              const card = (
                <>
                  <BlogThumbnail
                    coverImage={post.coverImage}
                    alt={post.title}
                    placeholder={t("coverPlaceholder")}
                    className="aspect-[4/3] w-24 shrink-0 sm:w-36"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      {post.publishedAt && (
                        <time className="text-xs text-muted sm:text-sm">
                          {dateFormatter.format(post.publishedAt)}
                        </time>
                      )}
                      {isExternal && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted">
                          <ExternalIcon className="h-3 w-3" />
                          {t("externalBadge")}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 font-display text-lg font-semibold transition-colors group-hover:text-accent sm:text-xl">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );

              const cardClass =
                "spotlight group flex gap-4 rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10";

              return (
                <StaggerItem key={post.id}>
                  {isExternal ? (
                    // External coverage links straight out to the publisher —
                    // there is no internal detail page for these.
                    <a
                      href={post.externalUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t("externalHint")}
                      className={cardClass}
                    >
                      {card}
                    </a>
                  ) : (
                    <Link href={`/blog/${post.slug}`} className={cardClass}>
                      {card}
                    </Link>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
