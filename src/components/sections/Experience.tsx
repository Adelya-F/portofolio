import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

export async function Experience() {
  const [t, locale, experience] = await Promise.all([
    getTranslations("experience"),
    getLocale() as Promise<AppLocale>,
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <section id="experience" className="scroll-mt-24 bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </ScrollReveal>

        <StaggerGroup className="mt-10 space-y-10 border-l border-border pl-6">
          {experience.map((exp) => {
            const description = locale === "id" ? exp.descriptionId : exp.descriptionEn;

            return (
              <StaggerItem key={exp.id} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-accent" />
                <p className="text-sm font-medium text-accent">{exp.date}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted">{exp.organization}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
