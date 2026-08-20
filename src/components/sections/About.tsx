import { getTranslations } from "next-intl/server";
import type { Profile } from "@/lib/content";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion/ScrollReveal";

export async function About({ profile }: { profile: Profile }) {
  const t = await getTranslations("about");

  const facts = [
    { label: t("statusLabel"), value: profile.status },
    { label: t("fieldLabel"), value: profile.field },
    { label: t("locationLabel"), value: profile.location },
    { label: t("emailLabel"), value: profile.email },
  ];

  return (
    <section id="about" className="scroll-mt-24 bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{profile.bio}</p>
        </ScrollReveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <StaggerItem
              key={fact.label}
              className="rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
            >
              <dt className="text-sm text-muted">{fact.label}</dt>
              <dd className="mt-1 font-medium">{fact.value}</dd>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
