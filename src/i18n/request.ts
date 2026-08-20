import { getRequestConfig } from "next-intl/server";
import { locale as getRootLocale } from "next/root-params";
import { routing, type AppLocale } from "./routing";

function isAppLocale(value: string | undefined): value is AppLocale {
  return !!value && (routing.locales as readonly string[]).includes(value);
}

export default getRequestConfig(async () => {
  const requested = await getRootLocale();
  const locale = isAppLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
