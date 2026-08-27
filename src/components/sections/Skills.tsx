import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { Skill } from "@/generated/prisma/client";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

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
      className="scroll-mt-24 bg-background px-6 py-20 sm:py-28"
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

        <div className="mt-10 space-y-8">
          {skillGroups.map((group) => (
            <ScrollReveal key={group.category}>
              <h3 className="font-display text-lg font-semibold">{group.category}</h3>
              {/* Plain name chips — the stored `level` is deliberately not shown. */}
              <StaggerGroup className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <StaggerItem key={skill.id}>
                    <span className="inline-flex rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-accent/50 hover:bg-accent-soft hover:text-accent">
                      {skill.name}
                    </span>
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
