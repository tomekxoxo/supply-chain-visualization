import { describe, expect, it } from "vitest";
import { getCountryCode, getMapTooltipText } from "./map-interactions";

describe("getCountryCode", () => {
  it("returns only a supported ISO3 country code", () => {
    expect(getCountryCode("POL")).toBe("POL");
    expect(getCountryCode("XXX")).toBeNull();
    expect(getCountryCode(undefined)).toBeNull();
  });
});

describe("getMapTooltipText", () => {
  it("includes the country, product, total, unit, and active period", () => {
    expect(
      getMapTooltipText({
        countryName: "Poland",
        period: { from: 2010, to: 2026 },
        productName: "Wheat",
        unit: "tonnes",
        value: 12_000_000,
      }),
    ).toBe("Poland: Wheat — 12,000,000 tonnes (2010–2026)");
  });

  it("keeps missing values distinct from zero", () => {
    expect(
      getMapTooltipText({
        countryName: "Poland",
        period: { from: 2010, to: 2026 },
        productName: "Wheat",
        unit: "tonnes",
        value: null,
      }),
    ).toContain("No data");
  });
});
