import { describe, expect, it } from "vitest";
import { getProductionMapData } from "./world-geometry";

describe("getProductionMapData", () => {
  it("joins supported ISO3 country codes to published world geometry", () => {
    const data = getProductionMapData([
      { countryCode: "BRA", unit: "tonnes", value: 100 },
      { countryCode: "POL", unit: "tonnes", value: 50 },
    ]);
    const brazil = data.features.find(
      ({ properties }) => properties.iso3 === "BRA",
    );
    const poland = data.features.find(
      ({ properties }) => properties.iso3 === "POL",
    );
    const germany = data.features.find(
      ({ properties }) => properties.iso3 === "DEU",
    );

    expect(brazil?.properties).toMatchObject({ intensity: 1, value: 100 });
    expect(poland?.properties).toMatchObject({ intensity: 0.5, value: 50 });
    expect(germany?.properties).toMatchObject({ intensity: null, value: null });
  });

  it("joins the additional mock-data countries to the map geometry", () => {
    const data = getProductionMapData([
      { countryCode: "ARG", unit: "tonnes", value: 100 },
      { countryCode: "VNM", unit: "tonnes", value: 50 },
    ]);

    const argentina = data.features.find(
      ({ properties }) => properties.iso3 === "ARG",
    );
    const vietnam = data.features.find(
      ({ properties }) => properties.iso3 === "VNM",
    );

    expect(argentina?.properties).toMatchObject({ intensity: 1, value: 100 });
    expect(vietnam?.properties).toMatchObject({ intensity: 0.5, value: 50 });
  });

  it("provides country rings that do not cross the antimeridian", () => {
    const data = getProductionMapData([]);

    for (const feature of data.features) {
      const polygons =
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates]
          : feature.geometry.type === "MultiPolygon"
            ? feature.geometry.coordinates
            : [];

      for (const polygon of polygons) {
        for (const ring of polygon) {
          for (let index = 1; index < ring.length; index += 1) {
            expect(
              Math.abs(ring[index][0] - ring[index - 1][0]),
              feature.properties.name,
            ).toBeLessThanOrEqual(180);
          }
        }
      }
    }
  });
});
