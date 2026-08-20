"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

function PortraitIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8.5" r="3.5" />
      <path strokeLinecap="round" d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" />
    </svg>
  );
}

export function ProfilePhoto({ alt }: { alt: string }) {
  const t = useTranslations("home");
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative mx-auto w-56 sm:w-72">
      <div
        aria-hidden
        className="absolute -inset-5 -z-10 rounded-[2.75rem] bg-gradient-to-br from-accent/30 via-accent-soft to-transparent blur-2xl"
      />
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl shadow-accent/10">
        {!errored ? (
          <Image
            src="/images/profile.jpg"
            alt={alt}
            fill
            sizes="(min-width: 640px) 288px, 224px"
            className="object-cover"
            onError={() => setErrored(true)}
            priority
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-accent-soft p-6 text-center">
            <PortraitIcon className="h-10 w-10 text-accent" />
            <p className="text-sm font-medium text-accent">{t("photoPlaceholder")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
