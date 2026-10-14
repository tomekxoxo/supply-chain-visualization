import { useCallback, useMemo, useState } from "react";
import { countries, products, productionRecords } from "data";
import { createParser, parseAsStringLiteral, useQueryStates } from "nuqs";
import {
  createProductionFilterReducer,
  getAvailableCountryCodes,
  getAvailableProductIds,
  getCountryProductionTotals,
  getProductionSummary,
  getYearlyProduction,
  initialProductionFilters,
  PRODUCTION_YEAR_RANGE,
} from "model";
import type {
  Country,
  CountryCode,
  Product,
  ProductId,
  ProductionFilters,
} from "model";

const countryCodes = countries.map(({ code }) => code);
const productIds = products.map(({ id }) => id);

const parseAsProductionYear = createParser({
  parse: (value) => {
    const year = Number(value);

    return Number.isInteger(year) &&
      year >= PRODUCTION_YEAR_RANGE.start &&
      year <= PRODUCTION_YEAR_RANGE.end
      ? year
      : null;
  },
  serialize: (value) => String(value),
});

const productionFilterQuery = {
  country: parseAsStringLiteral(countryCodes),
  from: parseAsProductionYear.withDefault(PRODUCTION_YEAR_RANGE.start),
  product: parseAsStringLiteral(productIds),
  to: parseAsProductionYear.withDefault(PRODUCTION_YEAR_RANGE.end),
};

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

const filterCountries = (countryCodes: readonly CountryCode[]) =>
  countries.filter(({ code }) => countryCodes.includes(code));

const filterProducts = (productIds: readonly ProductId[]) =>
  products.filter(({ id }) => productIds.includes(id));

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

  const filters = useMemo(() => {
    const filtersWithProduct = reducer(initialProductionFilters, {
      productId: queryFilters.product,
      type: "select-product",
    });
    const filtersWithCountry = reducer(filtersWithProduct, {
      countryCode: queryFilters.country,
      type: "select-country",
    });

    return reducer(filtersWithCountry, {
      from: queryFilters.from,
      to: queryFilters.to,
      type: "set-year-range",
    });
  }, [queryFilters, reducer]);

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

  const availableProductIds = useMemo(
    () => getAvailableProductIds(productionRecords, filters.countryCode),
    [filters.countryCode],
  );
  const availableCountryCodes = useMemo(
    () => getAvailableCountryCodes(productionRecords, filters.productId),
    [filters.productId],
  );
  const selectedProduct = useMemo(
    () => products.find(({ id }) => id === filters.productId) ?? null,
    [filters.productId],
  );
  const availableCountries = useMemo(
    () => filterCountries(availableCountryCodes),
    [availableCountryCodes],
  );
  const availableProducts = useMemo(
    () => filterProducts(availableProductIds),
    [availableProductIds],
  );
  const countryTotals = useMemo(
    () =>
      getCountryProductionTotals(productionRecords, filters, selectedProduct),
    [filters, selectedProduct],
  );
  const yearlyProduction = useMemo(
    () => getYearlyProduction(productionRecords, filters, selectedProduct),
    [filters, selectedProduct],
  );
  const summary = useMemo(
    () => getProductionSummary(productionRecords, filters, selectedProduct),
    [filters, selectedProduct],
  );
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
    availableCountries,
    availableProducts,
    countryTotals,
    filters,
    mapViewResetVersion,
    resetFilters,
    selectCountry,
    selectedProduct,
    selectProduct,
    setYearRange,
    summary,
    yearlyProduction,
  };
};
