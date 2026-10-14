import { useCallback, useMemo, useState } from "react";
import { productionRecords } from "data";
import { useQueryStates } from "nuqs";
import {
  createProductionFilterReducer,
  getCountryProductionTotals,
  getProductionSummary,
  getYearlyProduction,
  initialProductionFilters,
} from "model";
import type {
  Country,
  CountryCode,
  Product,
  ProductId,
  ProductionFilters,
} from "model";
import {
  getFiltersFromQuery,
  productionFilterQuery,
} from "./production-filter-query";
import { useExplorerDerivedData } from "./use-explorer-derived-data";

export interface ProductionExplorer {
  availableCountries: readonly Country[];
  availableProducts: readonly Product[];
  countryTotals: ReturnType<typeof getCountryProductionTotals>;
  filters: ProductionFilters;
  mapViewResetVersion: number;
  resetFilters: () => void;
  selectCountry: (countryCode: CountryCode | null) => void;
  selectedProduct: Product | null;
  selectProduct: (productId: ProductId | null) => void;
  setYearRange: (from: number, to: number) => void;
  summary: ReturnType<typeof getProductionSummary>;
  yearlyProduction: ReturnType<typeof getYearlyProduction>;
}

export const useProductionExplorer = (): ProductionExplorer => {
  const reducer = useMemo(
    () => createProductionFilterReducer(productionRecords),
    [],
  );
  const [queryFilters, setQueryFilters] = useQueryStates(
    productionFilterQuery,
    { history: "replace" },
  );
  const [mapViewResetVersion, setMapViewResetVersion] = useState(0);

  const filters = useMemo(
    () => getFiltersFromQuery(queryFilters, reducer),
    [queryFilters, reducer],
  );

  const updateFilters = useCallback(
    (nextFilters: ProductionFilters) => {
      void setQueryFilters({
        country: nextFilters.countryCode,
        from: nextFilters.yearRange.from,
        product: nextFilters.productId,
        to: nextFilters.yearRange.to,
      });
    },
    [setQueryFilters],
  );

  const derivedData = useExplorerDerivedData(filters);
  const selectCountry = useCallback(
    (countryCode: CountryCode | null) => {
      updateFilters(reducer(filters, { countryCode, type: "select-country" }));
    },
    [filters, reducer, updateFilters],
  );
  const selectProduct = useCallback(
    (productId: ProductId | null) => {
      updateFilters(reducer(filters, { productId, type: "select-product" }));
    },
    [filters, reducer, updateFilters],
  );
  const setYearRange = useCallback(
    (from: number, to: number) => {
      updateFilters(reducer(filters, { from, to, type: "set-year-range" }));
    },
    [filters, reducer, updateFilters],
  );
  const resetFilters = useCallback(() => {
    updateFilters(initialProductionFilters);
    setMapViewResetVersion((version) => version + 1);
  }, [setMapViewResetVersion, updateFilters]);

  return {
    ...derivedData,
    filters,
    mapViewResetVersion,
    resetFilters,
    selectCountry,
    selectProduct,
    setYearRange,
  };
};
