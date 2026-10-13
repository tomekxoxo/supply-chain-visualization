import { getAvailableCountryCodes, getAvailableProductIds } from "./selectors";
import {
  PRODUCTION_YEAR_RANGE,
  type CountryCode,
  type ProductId,
  type ProductionFilters,
  type ProductionRecord,
} from "./types";

export type ProductionFilterAction =
  | { countryCode: CountryCode | null; type: "select-country" }
  | { productId: ProductId | null; type: "select-product" }
  | { from: number; to: number; type: "set-year-range" }
  | { type: "reset" };

export const initialProductionFilters: ProductionFilters = {
  countryCode: null,
  productId: null,
  yearRange: {
    from: PRODUCTION_YEAR_RANGE.start,
    to: PRODUCTION_YEAR_RANGE.end,
  },
};

const getNormalizedYearRange = (from: number, to: number) => ({
  from: Math.max(PRODUCTION_YEAR_RANGE.start, Math.min(from, to)),
  to: Math.min(PRODUCTION_YEAR_RANGE.end, Math.max(from, to)),
});

export const createProductionFilterReducer = (
  records: readonly ProductionRecord[],
) =>
  function productionFilterReducer(
    state: ProductionFilters,
    action: ProductionFilterAction,
  ): ProductionFilters {
    switch (action.type) {
      case "select-country": {
        const productId =
          state.productId !== null &&
          getAvailableProductIds(records, action.countryCode).includes(
            state.productId,
          )
            ? state.productId
            : null;

        return { ...state, countryCode: action.countryCode, productId };
      }

      case "select-product": {
        const countryCode =
          state.countryCode !== null &&
          getAvailableCountryCodes(records, action.productId).includes(
            state.countryCode,
          )
            ? state.countryCode
            : null;

        return { ...state, countryCode, productId: action.productId };
      }

      case "set-year-range":
        return {
          ...state,
          yearRange: getNormalizedYearRange(action.from, action.to),
        };

      case "reset":
        return initialProductionFilters;
    }
  };
