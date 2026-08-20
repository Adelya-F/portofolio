import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Skill } from "@/generated/prisma/client";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

const levelWidth: Record<Skill["level"], string> = {
  BASIC: "w-1/3",
  INTERMEDIATE: "w-2/3",
  ADVANCED: "w-full",
};

function groupByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const group = groups.get(skill.category) ?? [];
    group.push(skill);
    groups.set(skill.category, group);
  }
  return Array.from(groups, ([category, items]) => ({ category, skills: items }));
}

export async function Skills() {
  const [t, skills] = await Promise.all([
    getTranslations("skills"),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
  ]);

  const skillGroups = groupByCategory(skills);

  return (
    <section
      id="skills"
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
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </ScrollReveal>

        <div className="mt-10 space-y-10">
          {skillGroups.map((group) => (
            <ScrollReveal key={group.category}>
              <h3 className="font-display text-lg font-semibold">{group.category}</h3>
              <StaggerGroup className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {group.skills.map((skill) => (
                  <StaggerItem key={skill.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted">{skill.level}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-border">
                      <div
                        className={`h-1.5 rounded-full bg-accent transition-all duration-700 ${levelWidth[skill.level]}`}
                      />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
