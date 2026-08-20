export const navItems = [
  { id: "hero", key: "home" },
  { id: "about", key: "about" },
  { id: "achievements", key: "achievements" },
  { id: "projects", key: "projects" },
  { id: "skills", key: "skills" },
  { id: "experience", key: "experience" },
  { id: "blog", key: "blog" },
  { id: "contact", key: "contact" },
] as const;

export const sectionIds = navItems.map((item) => item.id);
