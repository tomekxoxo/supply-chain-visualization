import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useProductionExplorer } from "production-explorer/hooks";

describe("useProductionExplorer", () => {
  it("keeps all derived data aligned with filter changes", () => {
    const { result } = renderHook(() => useProductionExplorer());

    act(() => {
      result.current.selectProduct("coffee");
    });

    expect(result.current.availableCountries.map(({ code }) => code)).toEqual([
      "BRA",
    ]);
    expect(result.current.countryTotals).toHaveLength(1);
    expect(result.current.summary).not.toBeNull();

    act(() => {
      result.current.selectCountry("USA");
    });

    expect(result.current.filters).toMatchObject({
      countryCode: "USA",
      productId: null,
    });
    expect(result.current.countryTotals).toEqual([]);
    expect(result.current.summary).toBeNull();
  });

  it("resets range and selections", () => {
    const { result } = renderHook(() => useProductionExplorer());

    act(() => {
      result.current.selectCountry("POL");
      result.current.selectProduct("wheat");
      result.current.setYearRange(2020, 2022);
    });
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      countryCode: null,
      productId: null,
      yearRange: { from: 2010, to: 2026 },
    });
  });
});
