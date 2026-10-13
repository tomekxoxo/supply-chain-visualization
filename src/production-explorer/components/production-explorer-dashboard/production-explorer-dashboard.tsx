import { forwardRef, lazy, Suspense } from "react";
import { useProductionExplorer } from "production-explorer/hooks";
import ProductionFilters from "../production-filters";
import ProductionSummary from "../production-summary";

const ProductionAnnualChart = lazy(() => import("../production-annual-chart"));
const ProductionMap = lazy(async () => {
  const { ProductionMap: ProductionMapComponent } =
    await import("../production-map");

  return { default: ProductionMapComponent };
});

const ProductionExplorerDashboard = forwardRef<HTMLDivElement>((_, ref) => {
  const explorer = useProductionExplorer();

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
        <Suspense
          fallback={
            <section
              aria-busy="true"
              aria-labelledby="map-heading"
              className="min-h-80 rounded-xl border border-slate-700 bg-slate-900 p-6"
            >
              <h2 id="map-heading" className="text-lg font-semibold text-white">
                Production map
              </h2>
              <p className="mt-2 text-sm text-slate-300">Loading map data…</p>
            </section>
          }
        >
          <ProductionMap
            countryTotals={explorer.countryTotals}
            filters={explorer.filters}
            onSelectCountry={explorer.selectCountry}
            selectedCountry={explorer.filters.countryCode}
            selectedProduct={explorer.selectedProduct}
          />
        </Suspense>

        <ProductionSummary summary={explorer.summary} />
      </div>

      <Suspense
        fallback={
          <section
            aria-busy="true"
            aria-labelledby="chart-heading"
            className="min-h-56 rounded-xl border border-slate-700 bg-slate-900 p-6"
          >
            <h2 id="chart-heading" className="text-lg font-semibold text-white">
              Annual production
            </h2>
            <p className="mt-2 text-sm text-slate-300">Loading chart data…</p>
          </section>
        }
      >
        <ProductionAnnualChart data={explorer.yearlyProduction} />
      </Suspense>
    </div>
  );
});

ProductionExplorerDashboard.displayName = "ProductionExplorerDashboard";

export default ProductionExplorerDashboard;
