import { useMemo } from "react";
import { countries, products, productionRecords } from "data";
import {
  getAvailableCountryCodes,
  getAvailableProductIds,
  getCountryProductionTotals,
  getProductionSummary,
  getYearlyProduction,
} from "model";
import type { ProductionFilters } from "model";

const filterCountries = (countryCodes: readonly string[]) =>
  countries.filter(({ code }) => countryCodes.includes(code));

const filterProducts = (productIds: readonly string[]) =>
  products.filter(({ id }) => productIds.includes(id));

export const useExplorerDerivedData = (filters: ProductionFilters) => {
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

  return {
    availableCountries,
    availableProducts,
    countryTotals,
    selectedProduct,
    summary,
    yearlyProduction,
  };
};
