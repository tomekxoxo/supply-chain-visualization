import { forwardRef } from "react";
import type { ProductionSummary as ProductionSummaryData } from "production-explorer/model";

interface ProductionSummaryProps {
  summary: ProductionSummaryData | null;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const ProductionSummary = forwardRef<HTMLElement, ProductionSummaryProps>(
  ({ summary }, ref) => {
    if (summary === null) {
      return (
        <section
          ref={ref}
          aria-labelledby="summary-heading"
          className="rounded-xl border border-border bg-surface p-6"
        >
          <h2
            id="summary-heading"
            className="text-lg font-semibold text-heading"
          >
            Production summary
          </h2>
          <p className="mt-2 text-sm text-text-secondary" role="status">
            No production data is available for the active filters.
          </p>
        </section>
      );
    }

    const metrics = [
      { label: "Total", value: summary.total },
      { label: "Average", value: summary.average },
      { label: "Minimum", value: summary.minimum },
      { label: "Maximum", value: summary.maximum },
    ];

    return (
      <section
        ref={ref}
        aria-labelledby="summary-heading"
        className="rounded-xl border border-border bg-surface p-6"
      >
        <h2 id="summary-heading" className="text-lg font-semibold text-heading">
          Production summary
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {metrics.map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-surface-raised p-3">
              <dt className="text-sm text-text-secondary">{label}</dt>
              <dd className="mt-1 text-lg font-semibold text-heading">
                {numberFormatter.format(value)} {summary.unit}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  },
);

ProductionSummary.displayName = "ProductionSummary";

export default ProductionSummary;
