import { describe, expect, it } from "vitest";
import {
  countries,
  products,
  productionRecords,
} from "production-explorer/data";
import { PRODUCTION_YEAR_RANGE } from "production-explorer/model/types";

describe("productionRecords", () => {
  it("provides deterministic records for every year in the supported range", () => {
    const years = new Set(productionRecords.map(({ year }) => year));

    expect(years).toEqual(
      new Set(
        Array.from(
          {
            length: PRODUCTION_YEAR_RANGE.end - PRODUCTION_YEAR_RANGE.start + 1,
          },
          (_, index) => PRODUCTION_YEAR_RANGE.start + index,
        ),
      ),
    );
  });

  it("references known countries and products with non-negative values", () => {
    const countryCodes = new Set(countries.map(({ code }) => code));
    const productIds = new Set(products.map(({ id }) => id));

    productionRecords.forEach(({ countryCode, productId, value }) => {
      expect(countryCodes).toContain(countryCode);
      expect(productIds).toContain(productId);
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });
});
