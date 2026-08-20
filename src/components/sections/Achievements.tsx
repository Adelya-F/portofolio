import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AchievementCard } from "@/components/AchievementCard";
import { ScrollReveal, StaggerGroup } from "@/components/motion/ScrollReveal";

export async function Achievements() {
  const [t, achievements] = await Promise.all([
    getTranslations("achievements"),
    prisma.achievement.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <section
      id="achievements"
      className="scroll-mt-24 bg-background-subtle px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xl text-muted">{t("subtitle")}</p>
        </ScrollReveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
