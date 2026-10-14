import { forwardRef, type FormEvent } from "react";
import { Button } from "ui/button";
import type { ProductionExplorer } from "hooks";
import { CountryFilter } from "./country-filter";
import { ProductFilter } from "./product-filter";
import { YearRangeFilter } from "./year-range-filter";

interface ProductionFiltersProps {
  explorer: Pick<
    ProductionExplorer,
    | "availableCountries"
    | "availableProducts"
    | "filters"
    | "resetFilters"
    | "selectCountry"
    | "selectProduct"
    | "setYearRange"
  >;
}

const ProductionFilters = forwardRef<HTMLFormElement, ProductionFiltersProps>(
  ({ explorer }, ref) => {
    const { filters } = explorer;
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    };

    return (
      <form
        ref={ref}
        aria-labelledby="filters-heading"
        className="rounded-xl border border-border bg-surface p-5 shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="filters-heading"
              className="text-lg font-semibold text-heading"
            >
              Filters
            </h2>
            <p className="text-sm text-text-secondary">
              Test data for 2010–2026.
            </p>
          </div>
          <Button onClick={explorer.resetFilters} variant="secondary">
            Reset filters
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CountryFilter
            countries={explorer.availableCountries}
            onSelect={explorer.selectCountry}
            value={filters.countryCode}
          />
          <ProductFilter
            onSelect={explorer.selectProduct}
            products={explorer.availableProducts}
            value={filters.productId}
          />
          <YearRangeFilter
            from={filters.yearRange.from}
            onChange={explorer.setYearRange}
            to={filters.yearRange.to}
          />
        </div>
      </form>
    );
  },
);

ProductionFilters.displayName = "ProductionFilters";

export { ProductionFilters };
