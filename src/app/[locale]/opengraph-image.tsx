import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";

export const alt = "Adelya Fauzi Alfian - Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social preview card. Uses the dark palette from globals.css so a shared link
// looks like the site itself.
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getProfile(locale as AppLocale);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #05070d 0%, #111735 55%, #1e1b4b 100%)",
          color: "#e8edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#818cf8", letterSpacing: 2 }}>
          {profile.field.toUpperCase()}
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 16 }}>
          {profile.name}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#8d98ae",
            marginTop: 24,
            lineHeight: 1.4,
          }}
        >
          {profile.status}
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#818cf8",
          }}
        >
          <div
            style={{
              width: 56,
              height: 6,
              background: "#818cf8",
              borderRadius: 999,
            }}
          />
          {"AWS · Terraform · Docker · Kubernetes"}
        </div>
      </div>
    ),
    size
  );
}
