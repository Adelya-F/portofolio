"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, animate } from "framer-motion";

export function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(value);

  // useReducedMotion() is always false during SSR and only reports the real
  // preference after mount, so it must never decide what gets rendered —
  // that mismatch is a hydration error. The count-up starts from 0 here,
  // imperatively, once hydration is done.
  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    ref.current.textContent = "0";
  }, [reduceMotion]);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toString();
        }
      },
    });

    return () => controls.stop();
  }, [inView, value, count, reduceMotion]);

  return <span ref={ref}>{value}</span>;
}
