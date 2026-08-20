import { getTranslations, getLocale } from "next-intl/server";
import { getProfile } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";

export async function Footer() {
  const locale = (await getLocale()) as AppLocale;
  const [t, profile] = await Promise.all([
    getTranslations("footer"),
    getProfile(locale),
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          &copy; {year} {profile.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-4">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-accent">
            {t("email")}
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            {t("github")}
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            {t("linkedin")}
          </a>
        </div>
      </div>
    </footer>
  );
}
