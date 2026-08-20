import { useTranslations } from "next-intl";
import type { Achievement } from "@/generated/prisma/client";
import { StaggerItem } from "./motion/ScrollReveal";
import { AnimatedNumber } from "./motion/AnimatedNumber";

const levelStyles: Record<Achievement["level"], string> = {
  NATIONAL: "bg-accent text-accent-foreground",
  PROVINCIAL: "bg-accent-soft text-accent",
  CITY: "border border-border text-muted",
};

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3a1 1 0 0 0-1 1v1H3.5A1.5 1.5 0 0 0 2 6.5V8c0 2.1 1.55 3.84 3.57 4.14A5.51 5.51 0 0 0 9.5 15.9v2.35H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-1.5V15.9a5.51 5.51 0 0 0 3.93-3.76C20.45 11.84 22 10.1 22 8V6.5A1.5 1.5 0 0 0 20.5 5H19V4a1 1 0 0 0-1-1H6ZM4 6.5V8c0 .98.63 1.81 1.5 2.12A8 8 0 0 1 5 7V6.5H4Zm15 0V7a8 8 0 0 1-.5 2.62A1.5 1.5 0 0 0 20 8V6.5h-1Z" />
    </svg>
  );
}

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const t = useTranslations("achievements");

  return (
    <StaggerItem className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${levelStyles[achievement.level]}`}
      >
        <TrophyIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">
          {t("rankPrefix")}
          <AnimatedNumber value={1} />
          {t("rankSuffix")} · {t(achievement.level.toLowerCase())}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold">
          {achievement.competition} — {achievement.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{achievement.year}</p>
      </div>
    </StaggerItem>
  );
}
