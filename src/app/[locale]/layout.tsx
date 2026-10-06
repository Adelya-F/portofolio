import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { routing, type AppLocale } from "@/i18n/routing";
import { getProfile } from "@/lib/content";
import { siteUrl } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  const profile = await getProfile(locale as AppLocale);
  const title = `${profile.name} - Portfolio`;

  return {
    metadataBase: new URL(siteUrl),
    // Sub-pages (blog posts) set their own title and get the suffix appended.
    title: { default: title, template: `%s - ${profile.name}` },
    description: profile.tagline,
    applicationName: title,
    authors: [{ name: profile.name }],
    creator: profile.name,
    keywords: [
      profile.name,
      "Cloud Computing",
      "AWS",
      "GCP",
      "Terraform",
      "Docker",
      "Kubernetes",
      "DevOps",
      "SMKN 13 Bandung",
      "LKSN",
      "portfolio",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", id: "/id" },
    },
    openGraph: {
      type: "website",
      siteName: title,
      title,
      description: profile.tagline,
      url: `/${locale}`,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? "en_US" : "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.tagline,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ScrollProgress />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
            {/* Vercel Web Analytics: page views, referrers, devices, top pages.
                No-ops outside Vercel, so local dev is unaffected. */}
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
