import { getLocale } from "next-intl/server";
import { getProfile } from "@/lib/content";
import { getPublicAssetVersion } from "@/lib/asset-version";
import type { AppLocale } from "@/i18n/routing";
import { Hero } from "@/components/Hero";
import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";

// Sections below query the database directly, so this page can't be
// prerendered at build time — it always renders per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = (await getLocale()) as AppLocale;
  const profile = await getProfile(locale);
  const photoVersion = getPublicAssetVersion("images/profile.jpg");

  return (
    <>
      <Hero profile={profile} photoVersion={photoVersion} />
      <About profile={profile} />
      <Achievements />
      <Projects />
      <Skills />
      <Experience />
      <Blog />
      <Contact />
    </>
  );
}
