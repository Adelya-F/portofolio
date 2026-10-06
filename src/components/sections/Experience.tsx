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
    <section
      id="experience"
      className="scroll-mt-24 bg-background-subtle px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </ScrollReveal>

        <StaggerGroup className="mt-10 space-y-10 border-l border-border pl-6">
          {experience.map((exp) => {
            const isId = locale === "id";
            const description = isId ? exp.descriptionId : exp.descriptionEn;
            // The Indonesian title/organization/date are optional and fall
            // back to the English text when not filled in.
            const title = (isId && exp.titleId) || exp.title;
            const organization = (isId && exp.organizationId) || exp.organization;
            const date = (isId && exp.dateId) || exp.date;

            return (
              <StaggerItem key={exp.id} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-accent" />
                <p className="text-sm font-medium text-accent">{date}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted">{organization}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
