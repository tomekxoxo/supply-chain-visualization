import { forwardRef, type ChangeEvent, type FormEvent } from "react";
import Button from "ui/button";
import Select from "ui/select";
import type { ProductionExplorer } from "hooks";

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

const getYear = (event: ChangeEvent<HTMLInputElement>): number | null => {
  const year = Number(event.target.value);

  return Number.isInteger(year) ? year : null;
};

const ProductionFilters = forwardRef<HTMLFormElement, ProductionFiltersProps>(
  ({ explorer }, ref) => {
    const { filters } = explorer;

    const handleFromYearChange = (event: ChangeEvent<HTMLInputElement>) => {
      const from = getYear(event);

      if (from !== null) {
        explorer.setYearRange(from, filters.yearRange.to);
      }
    };
    const handleToYearChange = (event: ChangeEvent<HTMLInputElement>) => {
      const to = getYear(event);

      if (to !== null) {
        explorer.setYearRange(filters.yearRange.from, to);
      }
    };
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
          <label
            className="grid gap-1.5 text-sm font-medium text-text-primary"
            htmlFor="country"
          >
            Country
            <Select
              id="country"
              onChange={(event) => {
                const country = explorer.availableCountries.find(
                  ({ code }) => code === event.target.value,
                );

                explorer.selectCountry(country?.code ?? null);
              }}
              value={filters.countryCode ?? ""}
            >
              <option value="">All countries</option>
              {explorer.availableCountries.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </Select>
          </label>

          <label
            className="grid gap-1.5 text-sm font-medium text-text-primary"
            htmlFor="product"
          >
            Product
            <Select
              id="product"
              onChange={(event) => {
                const product = explorer.availableProducts.find(
                  ({ id }) => id === event.target.value,
                );

                explorer.selectProduct(product?.id ?? null);
              }}
              value={filters.productId ?? ""}
            >
              <option value="">Choose a product</option>
              {explorer.availableProducts.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          </label>

          <label
            className="grid gap-1.5 text-sm font-medium text-text-primary"
            htmlFor="year-from"
          >
            From year
            <input
              className="block w-full rounded-md border-border-strong bg-surface px-3 py-2 text-text-primary shadow-sm focus:border-action-focus focus:ring-action-focus"
              id="year-from"
              max={2026}
              min={2010}
              onChange={handleFromYearChange}
              type="number"
              value={filters.yearRange.from}
            />
          </label>

          <label
            className="grid gap-1.5 text-sm font-medium text-text-primary"
            htmlFor="year-to"
          >
            To year
            <input
              className="block w-full rounded-md border-border-strong bg-surface px-3 py-2 text-text-primary shadow-sm focus:border-action-focus focus:ring-action-focus"
              id="year-to"
              max={2026}
              min={2010}
              onChange={handleToYearChange}
              type="number"
              value={filters.yearRange.to}
            />
          </label>
        </div>
      </form>
    );
  },
);

ProductionFilters.displayName = "ProductionFilters";

export default ProductionFilters;
