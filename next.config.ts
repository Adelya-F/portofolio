import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Allows the ?v=<mtime> cache-busting query param used for public/images/*
    // (e.g. the profile photo) — see src/lib/asset-version.ts.
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default withNextIntl(nextConfig);
