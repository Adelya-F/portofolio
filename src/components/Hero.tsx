"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/content";
import { ProfilePhoto } from "./ProfilePhoto";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export function Hero({
  profile,
  photoVersion,
}: {
  profile: Profile;
  photoVersion: string | null;
}) {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const photoItem: Variants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-28 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float-a absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--glow-a)] opacity-60 blur-3xl" />
        <div className="animate-float-b absolute top-32 -right-16 h-80 w-80 rounded-full bg-[var(--glow-b)] opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-24 md:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={item}
            className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
          >
            {t("eyebrow")}
          </motion.span>
          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold tracking-tight sm:text-6xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg text-muted">
            {profile.tagline}
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover"
            >
              {t("ctaProjects")}
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-hover"
            >
              {t("ctaContact")}
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={photoItem}>
          <ProfilePhoto alt={profile.name} version={photoVersion} />
        </motion.div>
      </div>
    </section>
  );
}
