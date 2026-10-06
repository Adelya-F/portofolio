/**
 * The "A" monogram — same Cinzel letter as the favicon (src/app/icon.svg),
 * so the tab icon and the logo on the page read as one mark.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`font-brand inline-flex items-center justify-center leading-none font-bold ${className}`}
    >
      A
    </span>
  );
}
