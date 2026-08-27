"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Horizontal card rail with prev/next controls.
 *
 * The arrows only appear once the content actually overflows, so a section
 * with two cards on a wide screen still looks like a plain row — nothing to
 * click, nothing to hint at content that isn't there. Native scrolling stays
 * enabled throughout, which is what touch devices and trackpads expect.
 */
export function Carousel({
  children,
  itemClassName = "",
  className = "",
}: {
  children: ReactNode;
  /** Width of one card, e.g. "w-[85%] sm:w-[48%] lg:w-[32%]". */
  itemClassName?: string;
  className?: string;
}) {
  const t = useTranslations("carousel");
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // 4px of slack: sub-pixel layout rounding otherwise leaves the forward
    // arrow enabled forever at the end of the rail.
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollBack(track.scrollLeft > 4);
    setCanScrollForward(track.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    sync();
    track.addEventListener("scroll", sync, { passive: true });

    const observer = new ResizeObserver(sync);
    observer.observe(track);
    for (const child of Array.from(track.children)) observer.observe(child);

    // Belt and braces: a viewport change is what decides whether the arrows are
    // needed at all, and ResizeObserver can miss it when the element's own box
    // does not change (e.g. a percentage-width rail inside a fluid container).
    window.addEventListener("resize", sync);

    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      observer.disconnect();
    };
  }, [sync, children]);

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    // One card at a time when we can measure one, otherwise most of a screen.
    const step = firstCard ? firstCard.offsetWidth + 24 : track.clientWidth * 0.9;
    track.scrollBy({
      left: step * direction,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  const hasControls = canScrollBack || canScrollForward;
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {hasControls && (
        <div className="mb-4 flex justify-end gap-2">
          {([-1, 1] as const).map((direction) => {
            const enabled = direction === -1 ? canScrollBack : canScrollForward;
            return (
              <motion.button
                key={direction}
                type="button"
                onClick={() => scrollByPage(direction)}
                disabled={!enabled}
                whileTap={enabled && !reduceMotion ? { scale: 0.92 } : undefined}
                aria-label={direction === -1 ? t("previous") : t("next")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/50 hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-35"
              >
                <ChevronIcon
                  className={`h-4 w-4 ${direction === -1 ? "rotate-180" : ""}`}
                />
              </motion.button>
            );
          })}
        </div>
      )}

      <div
        ref={trackRef}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-2"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex shrink-0 snap-start [&>*]:w-full ${itemClassName}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
