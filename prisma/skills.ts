/**
 * The skills shown on the public site, grouped by the `category` field —
 * the Skills section renders one heading per category, in this order.
 *
 * `level` is kept because the column is non-null in the database, but it is
 * not displayed anywhere: the public site shows plain name chips and the admin
 * form no longer asks for it.
 *
 * Both `prisma/seed.ts` and `scripts/sync-skills.ts` read this list, so it is
 * the single place to add or remove a skill. After editing, run:
 *
 *   npx tsx scripts/sync-skills.ts
 */
export type SeedSkill = {
  name: string;
  category: string;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCED";
};

const groups: { category: string; level: SeedSkill["level"]; names: string[] }[] = [
  {
    // Platforms only, not a list of individual services: naming every AWS
    // service made this one heading longer than the rest of the section.
    category: "Cloud Computing",
    level: "ADVANCED",
    names: ["AWS (Primary)", "GCP"],
  },
  {
    category: "DevOps & Infrastructure",
    level: "ADVANCED",
    names: [
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "CI/CD",
      "Infrastructure as Code",
      "Networking Fundamentals",
      "Infrastructure Troubleshooting",
      "Git & GitHub",
    ],
  },
  {
    category: "Front-End Development",
    level: "INTERMEDIATE",
    names: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    category: "Back-End Development",
    level: "INTERMEDIATE",
    names: ["Laravel", "PHP", "Node.js", "REST API"],
  },
  {
    category: "Mobile Development",
    level: "INTERMEDIATE",
    names: ["Flutter", "Dart", "Android Studio", "Firebase"],
  },
  {
    category: "Desktop Development",
    level: "INTERMEDIATE",
    names: ["C#", ".NET", "Windows Forms / WPF"],
  },
  {
    // Redis belongs with the databases: it is an in-memory key-value store,
    // used as a cache and session store rather than a system of record — hence
    // the category name rather than a plain "Databases".
    category: "Databases & Caching",
    level: "INTERMEDIATE",
    names: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
];

export const skills: (SeedSkill & { order: number })[] = groups.flatMap(
  (group, groupIndex) =>
    group.names.map((name, nameIndex) => ({
      name,
      category: group.category,
      level: group.level,
      // Leaves room to insert skills inside a group without renumbering.
      order: groupIndex * 100 + nameIndex,
    }))
);
