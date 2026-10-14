import type { StyleSpecification } from "maplibre-gl";
import { getProductionMapData } from "data";

const getMapColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

export const createMapStyle = (): StyleSpecification => {
  const colors = {
    background: getMapColor("--color-map-background"),
    high: getMapColor("--color-map-high"),
    low: getMapColor("--color-map-low"),
    noData: getMapColor("--color-map-no-data"),
    outline: getMapColor("--color-map-outline"),
    selection: getMapColor("--color-map-selection"),
  };

  return {
    layers: [
      {
        id: "background",
        paint: { "background-color": colors.background },
        type: "background",
      },
      {
        id: "countries-fill",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "intensity"], null],
            colors.noData,
            [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0,
              colors.low,
              1,
              colors.high,
            ],
          ],
          "fill-opacity": 0.9,
        },
        source: "countries",
        type: "fill",
      },
      {
        id: "countries-outline",
        paint: { "line-color": colors.outline, "line-width": 0.5 },
        source: "countries",
        type: "line",
      },
      {
        filter: ["==", ["get", "iso3"], ""],
        id: "countries-selected",
        layout: { visibility: "none" },
        paint: { "line-color": colors.selection, "line-width": 2.5 },
        source: "countries",
        type: "line",
      },
    ],
    sources: {
      countries: {
        data: getProductionMapData([]),
        type: "geojson",
      },
    },
    version: 8,
  };
};
