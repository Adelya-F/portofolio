import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("blog");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="font-display text-2xl font-semibold">404</h2>
      <p className="text-sm text-muted">{t("notFound")}</p>
      <Link
        href="/"
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        {t("backToBlog")}
      </Link>
    </div>
  );
}
