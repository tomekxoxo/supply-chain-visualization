import { forwardRef, lazy, Suspense } from "react";
import { useProductionExplorer } from "hooks";
import ProductionFilters from "../filters";
import ProductionSummary from "../summary";

const ProductionAnnualChart = lazy(() => import("../annual-chart"));
const ProductionMap = lazy(async () => {
  const { ProductionMap: ProductionMapComponent } = await import("../map");

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
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">
          Supply Chain Explorer
        </p>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Production across global supply chains
          </h1>
          <p className="text-base text-text-secondary sm:text-lg">
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
              className="min-h-80 rounded-xl border border-border bg-surface p-6"
            >
              <h2
                id="map-heading"
                className="text-lg font-semibold text-heading"
              >
                Production map
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Loading map data…
              </p>
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
            className="min-h-56 rounded-xl border border-border bg-surface p-6"
          >
            <h2
              id="chart-heading"
              className="text-lg font-semibold text-heading"
            >
              Annual production
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Loading chart data…
            </p>
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
