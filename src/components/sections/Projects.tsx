import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

export async function Projects() {
  const [t, locale, projects] = await Promise.all([
    getTranslations("projects"),
    getLocale() as Promise<AppLocale>,
    prisma.project.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <section id="projects" className="scroll-mt-24 bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </ScrollReveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            const description = locale === "id" ? project.descriptionId : project.descriptionEn;

            return (
              <StaggerItem
                key={project.id}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{project.title}</h3>
                  {project.featured && (
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      {t("featuredBadge")}
                    </span>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(project.demoUrl || project.repoUrl) && (
                  <div className="mt-5 flex gap-4 text-sm font-medium">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent transition-colors hover:text-accent-hover"
                      >
                        {t("demo")} →
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {t("repo")} →
                      </a>
                    )}
                  </div>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
