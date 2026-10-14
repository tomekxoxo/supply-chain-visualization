import { forwardRef } from "react";

interface SectionLoadingFallbackProps {
  description: string;
  headingId: string;
  minHeightClassName: "min-h-56" | "min-h-80";
  title: string;
}

const SectionLoadingFallback = forwardRef<
  HTMLElement,
  SectionLoadingFallbackProps
>(({ description, headingId, minHeightClassName, title }, ref) => (
  <section
    ref={ref}
    aria-busy="true"
    aria-labelledby={headingId}
    className={`${minHeightClassName} rounded-xl border border-border bg-surface p-6`}
  >
    <h2 id={headingId} className="text-lg font-semibold text-heading">
      {title}
    </h2>
    <p className="mt-2 text-sm text-text-secondary">{description}</p>
  </section>
));

SectionLoadingFallback.displayName = "SectionLoadingFallback";

export { SectionLoadingFallback };
