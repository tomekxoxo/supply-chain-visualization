import { describe, expect, it } from "vitest";
import { productionRecords } from "data";
import { createProductionFilterReducer, initialProductionFilters } from "model";

const reduceFilters = createProductionFilterReducer(productionRecords);

describe("production filter reducer", () => {
  it("clears a product that is unavailable for the newly selected country", () => {
    const state = reduceFilters(
      { ...initialProductionFilters, productId: "soybeans" },
      { countryCode: "POL", type: "select-country" },
    );

    expect(state).toMatchObject({ countryCode: "POL", productId: null });
  });

  it("clears a country that is unavailable for the newly selected product", () => {
    const state = reduceFilters(
      { ...initialProductionFilters, countryCode: "USA" },
      { productId: "coffee", type: "select-product" },
    );

    expect(state).toMatchObject({ countryCode: null, productId: "coffee" });
  });

  it("normalizes the range and resets all filters", () => {
    const rangedState = reduceFilters(initialProductionFilters, {
      from: 2030,
      to: 2000,
      type: "set-year-range",
    });

    expect(rangedState.yearRange).toEqual({ from: 2010, to: 2026 });
    expect(reduceFilters(rangedState, { type: "reset" })).toEqual(
      initialProductionFilters,
    );
  });
});
