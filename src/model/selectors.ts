import type {
  CountryCode,
  Product,
  ProductId,
  ProductionFilters,
  ProductionRecord,
  ProductionUnit,
} from "./types";

export interface CountryProductionTotal {
  countryCode: CountryCode;
  unit: ProductionUnit;
  value: number;
}

export interface ProductionSummary {
  average: number;
  maximum: number;
  minimum: number;
  total: number;
  unit: ProductionUnit;
}

export interface YearlyProduction {
  unit: ProductionUnit;
  value: number;
  year: number;
}

export const getAvailableProductIds = (
  records: readonly ProductionRecord[],
  countryCode: CountryCode | null,
): readonly ProductId[] => {
  const productIds = new Set<ProductId>();

  records.forEach((record) => {
    if (countryCode === null || record.countryCode === countryCode) {
      productIds.add(record.productId);
    }
  });

  return [...productIds].sort();
};

export const getAvailableCountryCodes = (
  records: readonly ProductionRecord[],
  productId: ProductId | null,
): readonly CountryCode[] => {
  const countryCodes = new Set<CountryCode>();

  records.forEach((record) => {
    if (productId === null || record.productId === productId) {
      countryCodes.add(record.countryCode);
    }
  });

  return [...countryCodes].sort();
};

export const filterProductionRecords = (
  records: readonly ProductionRecord[],
  filters: ProductionFilters,
): readonly ProductionRecord[] =>
  records.filter(
    (record) =>
      record.year >= filters.yearRange.from &&
      record.year <= filters.yearRange.to &&
      (filters.countryCode === null ||
        record.countryCode === filters.countryCode) &&
      (filters.productId === null || record.productId === filters.productId),
  );

const getCompatibleRecords = (
  records: readonly ProductionRecord[],
  filters: ProductionFilters,
  product: Product | null,
): readonly ProductionRecord[] => {
  if (product === null || filters.productId !== product.id) {
    return [];
  }

  return filterProductionRecords(records, filters).filter(
    ({ unit }) => unit === product.unit,
  );
};

export const getCountryProductionTotals = (
  records: readonly ProductionRecord[],
  filters: ProductionFilters,
  product: Product | null,
): readonly CountryProductionTotal[] => {
  if (product === null || filters.productId !== product.id) {
    return [];
  }

  const totals = new Map<CountryCode, number>();

  getCompatibleRecords(records, filters, product).forEach(
    ({ countryCode, value }) => {
      totals.set(countryCode, (totals.get(countryCode) ?? 0) + value);
    },
  );

  return [...totals.entries()]
    .map(([countryCode, value]) => ({ countryCode, unit: product.unit, value }))
    .sort((first, second) =>
      first.countryCode.localeCompare(second.countryCode),
    );
};

export const getYearlyProduction = (
  records: readonly ProductionRecord[],
  filters: ProductionFilters,
  product: Product | null,
): readonly YearlyProduction[] => {
  if (product === null || filters.productId !== product.id) {
    return [];
  }

  const totals = new Map<number, number>();

  getCompatibleRecords(records, filters, product).forEach(({ year, value }) => {
    totals.set(year, (totals.get(year) ?? 0) + value);
  });

  return [...totals.entries()]
    .map(([year, value]) => ({ unit: product.unit, value, year }))
    .sort((first, second) => first.year - second.year);
};

export const getProductionSummary = (
  records: readonly ProductionRecord[],
  filters: ProductionFilters,
  product: Product | null,
): ProductionSummary | null => {
  const compatibleRecords = getCompatibleRecords(records, filters, product);

  if (compatibleRecords.length === 0 || product === null) {
    return null;
  }

  const values = compatibleRecords.map(({ value }) => value);
  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    average: total / values.length,
    maximum: Math.max(...values),
    minimum: Math.min(...values),
    total,
    unit: product.unit,
  };
};
