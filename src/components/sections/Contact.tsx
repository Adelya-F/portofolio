import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ContactForm } from "./ContactForm";

export async function Contact() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="scroll-mt-24 bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <ScrollReveal>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  );
}
