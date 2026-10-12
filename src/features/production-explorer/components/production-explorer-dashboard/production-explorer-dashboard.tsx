import { forwardRef } from "react";
import { useProductionExplorer } from "features/production-explorer/hooks";
import ProductionFilters from "../production-filters";

const ProductionExplorerDashboard = forwardRef<HTMLDivElement>((_, ref) => {
  const explorer = useProductionExplorer();
  const productName = explorer.selectedProduct?.name ?? null;

  return (
    <div
      ref={ref}
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <header className="space-y-3">
        <p className="text-sm font-semibold tracking-[0.2em] text-purple-300 uppercase">
          Supply Chain Explorer
        </p>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Production across global supply chains
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Explore deterministic test data by country, product, and year range.
          </p>
        </div>
      </header>

      <ProductionFilters explorer={explorer} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
        <section
          aria-labelledby="map-heading"
          className="min-h-80 rounded-xl border border-dashed border-slate-600 bg-slate-900/70 p-6"
        >
          <h2 id="map-heading" className="text-lg font-semibold text-white">
            Production map
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {productName === null
              ? "Choose a product to see the production map."
              : `The map will show ${productName} production for the active filters.`}
          </p>
        </section>

        <section
          aria-labelledby="summary-heading"
          className="rounded-xl border border-dashed border-slate-600 bg-slate-900/70 p-6"
        >
          <h2 id="summary-heading" className="text-lg font-semibold text-white">
            Production summary
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Summary metrics will appear here after you choose a product.
          </p>
        </section>
      </div>

      <section
        aria-labelledby="chart-heading"
        className="min-h-56 rounded-xl border border-dashed border-slate-600 bg-slate-900/70 p-6"
      >
        <h2 id="chart-heading" className="text-lg font-semibold text-white">
          Annual production
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          The annual production chart will appear here after you choose a
          product.
        </p>
      </section>
    </div>
  );
});

ProductionExplorerDashboard.displayName = "ProductionExplorerDashboard";

export default ProductionExplorerDashboard;
