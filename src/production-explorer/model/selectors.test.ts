import { describe, expect, it } from "vitest";
import { products, productionRecords } from "production-explorer/data";
import {
  filterProductionRecords,
  getAvailableCountryCodes,
  getAvailableProductIds,
  getCountryProductionTotals,
  getProductionSummary,
  getYearlyProduction,
  initialProductionFilters,
  type ProductionRecord,
} from "production-explorer/model";

const wheat = products.find(({ id }) => id === "wheat") ?? null;

describe("production selectors", () => {
  it("limits the second filter to compatible options", () => {
    expect(getAvailableProductIds(productionRecords, "BRA")).toEqual([
      "coffee",
      "soybeans",
    ]);
    expect(getAvailableCountryCodes(productionRecords, "cotton")).toEqual([
      "CHN",
      "IND",
    ]);
  });

  it("filters an inclusive range", () => {
    const records = filterProductionRecords(productionRecords, {
      ...initialProductionFilters,
      countryCode: "POL",
      productId: "wheat",
      yearRange: { from: 2010, to: 2011 },
    });

    expect(records.map(({ year }) => year)).toEqual([2010, 2011]);
  });

  it("returns country totals, annual series, and summary from the same filters", () => {
    const filters = {
      ...initialProductionFilters,
      productId: "wheat" as const,
      yearRange: { from: 2010, to: 2010 },
    };

    expect(
      getCountryProductionTotals(productionRecords, filters, wheat),
    ).toEqual([
      { countryCode: "CHN", unit: "tonnes", value: 115_200_000 },
      { countryCode: "DEU", unit: "tonnes", value: 24_100_000 },
      { countryCode: "IND", unit: "tonnes", value: 80_800_000 },
      { countryCode: "POL", unit: "tonnes", value: 9_400_000 },
      { countryCode: "USA", unit: "tonnes", value: 60_100_000 },
    ]);
    expect(getYearlyProduction(productionRecords, filters, wheat)).toEqual([
      { unit: "tonnes", value: 289_600_000, year: 2010 },
    ]);
    expect(
      getProductionSummary(productionRecords, filters, wheat),
    ).toMatchObject({
      total: 289_600_000,
      unit: "tonnes",
    });
  });

  it("does not confuse a zero value with missing data and rejects a mismatched unit", () => {
    const zeroRecord: ProductionRecord = {
      countryCode: "POL",
      productId: "wheat",
      unit: "tonnes",
      value: 0,
      year: 2010,
    };
    const incompatibleRecord: ProductionRecord = {
      ...zeroRecord,
      unit: "hectares",
      value: 100,
    };
    const filters = {
      ...initialProductionFilters,
      countryCode: "POL" as const,
      productId: "wheat" as const,
      yearRange: { from: 2010, to: 2010 },
    };

    expect(getProductionSummary([zeroRecord], filters, wheat)).toMatchObject({
      total: 0,
    });
    expect(getProductionSummary([], filters, wheat)).toBeNull();
    expect(
      getProductionSummary([incompatibleRecord], filters, wheat),
    ).toBeNull();
  });
});
