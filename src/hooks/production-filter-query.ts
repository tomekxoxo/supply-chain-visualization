import { countries, products } from "data";
import { createParser, parseAsStringLiteral } from "nuqs";
import {
  createProductionFilterReducer,
  initialProductionFilters,
  PRODUCTION_YEAR_RANGE,
} from "model";
import type { ProductionFilters } from "model";

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

export const productionFilterQuery = {
  country: parseAsStringLiteral(countryCodes),
  from: parseAsProductionYear.withDefault(PRODUCTION_YEAR_RANGE.start),
  product: parseAsStringLiteral(productIds),
  to: parseAsProductionYear.withDefault(PRODUCTION_YEAR_RANGE.end),
};

export const getFiltersFromQuery = (
  queryFilters: {
    country: (typeof countryCodes)[number] | null;
    from: number;
    product: (typeof productIds)[number] | null;
    to: number;
  },
  reducer: ReturnType<typeof createProductionFilterReducer>,
): ProductionFilters => {
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
};
