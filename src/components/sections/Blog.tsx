import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
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

export async function Blog() {
  const [t, locale, posts] = await Promise.all([
    getTranslations("blog"),
    getLocale() as Promise<AppLocale>,
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const dateFormatter = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="blog" className="scroll-mt-24 bg-background-subtle px-6 py-20 sm:py-28">
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
          <StaggerGroup className="mt-10 divide-y divide-border">
            {posts.map((post) => (
              <StaggerItem key={post.id} className="py-6 first:pt-0">
                {post.publishedAt && (
                  <time className="text-sm text-muted">
                    {dateFormatter.format(post.publishedAt)}
                  </time>
                )}
                <h3 className="mt-1 font-display text-xl font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
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
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
