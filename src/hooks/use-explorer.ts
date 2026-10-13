import { useCallback, useMemo, useReducer } from "react";
import { countries, products, productionRecords } from "data";
import {
  createProductionFilterReducer,
  getAvailableCountryCodes,
  getAvailableProductIds,
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

export interface ProductionExplorer {
  availableCountries: readonly Country[];
  availableProducts: readonly Product[];
  countryTotals: ReturnType<typeof getCountryProductionTotals>;
  filters: ProductionFilters;
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
  const [filters, dispatch] = useReducer(reducer, initialProductionFilters);

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
      dispatch({ countryCode, type: "select-country" });
    },
    [dispatch],
  );
  const selectProduct = useCallback(
    (productId: ProductId | null) => {
      dispatch({ productId, type: "select-product" });
    },
    [dispatch],
  );
  const setYearRange = useCallback(
    (from: number, to: number) => {
      dispatch({ from, to, type: "set-year-range" });
    },
    [dispatch],
  );
  const resetFilters = useCallback(() => {
    dispatch({ type: "reset" });
  }, [dispatch]);

  return {
    availableCountries,
    availableProducts,
    countryTotals,
    filters,
    resetFilters,
    selectCountry,
    selectedProduct,
    selectProduct,
    setYearRange,
    summary,
    yearlyProduction,
  };
};
