"use client";

import { useEffect } from "react";

/**
 * Drives the cursor-following glow on every `.spotlight` element (see
 * globals.css). One passive listener for the whole page instead of a handler
 * per card, so server-rendered cards get the effect without becoming client
 * components. Touch input is skipped — there is no hover to follow.
 */
export function PointerSpotlight() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(".spotlight");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
