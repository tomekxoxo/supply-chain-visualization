import type {
  FillLayerSpecification,
  LineLayerSpecification,
  StyleSpecification,
} from "maplibre-gl";

const getMapColor = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

export const createMapStyle = (): StyleSpecification => {
  return {
    layers: [
      {
        id: "background",
        paint: { "background-color": getMapColor("--color-map-background") },
        type: "background",
      },
    ],
    sources: {},
    version: 8,
  };
};

interface ProductionMapLayers {
  countriesFill: FillLayerSpecification;
  countriesOutline: LineLayerSpecification;
  countriesSelected: LineLayerSpecification;
}

export const createProductionMapLayers = (): ProductionMapLayers => {
  const colors = {
    high: getMapColor("--color-map-high"),
    low: getMapColor("--color-map-low"),
    noData: getMapColor("--color-map-no-data"),
    outline: getMapColor("--color-map-outline"),
    selection: getMapColor("--color-map-selection"),
  };

  return {
    countriesFill: {
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
    countriesOutline: {
      id: "countries-outline",
      paint: { "line-color": colors.outline, "line-width": 0.5 },
      source: "countries",
      type: "line",
    },
    countriesSelected: {
      id: "countries-selected",
      paint: { "line-color": colors.selection, "line-width": 2.5 },
      source: "countries",
      type: "line",
    },
  };
};
