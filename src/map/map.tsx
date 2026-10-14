import { forwardRef, useMemo } from "react";
import { getProductionMapData } from "data";
import type {
  CountryCode,
  CountryProductionTotal,
  Product,
  ProductionFilters,
} from "model";
import { useMapData, useMapSelection } from "./use-map-data";
import { useMapInstance } from "./use-map-instance";
import { useMapInteractions } from "./use-map-interactions";

interface ProductionMapProps {
  countryTotals: readonly CountryProductionTotal[];
  filters: ProductionFilters;
  onSelectCountry: (countryCode: CountryCode) => void;
  selectedCountry: CountryCode | null;
  selectedProduct: Product | null;
}

const ProductionMap = forwardRef<HTMLElement, ProductionMapProps>(
  (
    {
      countryTotals,
      filters,
      onSelectCountry,
      selectedCountry,
      selectedProduct,
    },
    ref,
  ) => {
    const { containerRef, mapError, mapRef } = useMapInstance();
    const mapData = useMemo(
      () => getProductionMapData(countryTotals),
      [countryTotals],
    );

    useMapData(mapRef, mapData);
    useMapSelection(mapRef, selectedCountry);
    useMapInteractions({ filters, mapRef, onSelectCountry, selectedProduct });

    return (
      <section
        ref={ref}
        aria-labelledby="map-heading"
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="map-heading" className="text-lg font-semibold text-heading">
              Production map
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {selectedProduct === null
                ? "Choose a product to color the map."
                : `Showing ${selectedProduct.name} production across countries.`}
            </p>
          </div>
          <div
            aria-label="Production map legend"
            className="flex items-center gap-2 text-xs text-text-secondary"
          >
            <span className="h-3 w-3 rounded-sm bg-map-no-data" />
            No data
            <span className="h-3 w-3 rounded-sm bg-map-low" />
            Lower production
            <span className="h-3 w-3 rounded-sm bg-map-high" />
            Higher production
          </div>
        </div>

        {mapError ? (
          <p className="mt-4 text-sm text-text-secondary" role="status">
            The production map is not available in this browser.
          </p>
        ) : (
          <div ref={containerRef} className="mt-4 h-96 w-full" />
        )}

        <p className="mt-3 text-xs text-text-muted">
          Geometry: Natural Earth, distributed by world-atlas.
        </p>
      </section>
    );
  },
);

ProductionMap.displayName = "ProductionMap";

export { ProductionMap };
