import type { AppLocale } from "@/i18n/routing";

export type Profile = {
  name: string;
  status: string;
  field: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
};

const loaders: Record<AppLocale, () => Promise<{ profile: Profile }>> = {
  en: () => import("./content.en"),
  id: () => import("./content.id"),
};

export async function getProfile(locale: AppLocale): Promise<Profile> {
  const mod = await loaders[locale]();
  return mod.profile;
}
