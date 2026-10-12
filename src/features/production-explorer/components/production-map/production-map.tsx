import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  StyleSpecification,
} from "maplibre-gl";
import { getProductionMapData } from "features/production-explorer/data";
import type {
  CountryProductionTotal,
  Product,
} from "features/production-explorer/model";

interface ProductionMapProps {
  countryTotals: readonly CountryProductionTotal[];
  selectedProduct: Product | null;
}

const createMapStyle = (): StyleSpecification => ({
  layers: [
    {
      id: "background",
      paint: { "background-color": "#0f172a" },
      type: "background",
    },
    {
      id: "countries-fill",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "intensity"], null],
          "#334155",
          [
            "interpolate",
            ["linear"],
            ["get", "intensity"],
            0,
            "#dbeafe",
            1,
            "#2563eb",
          ],
        ],
        "fill-opacity": 0.9,
      },
      source: "countries",
      type: "fill",
    },
    {
      id: "countries-outline",
      paint: { "line-color": "#94a3b8", "line-width": 0.5 },
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
});

const hasWebGLSupport = (): boolean => {
  if (navigator.userAgent.includes("jsdom")) {
    return false;
  }

  const canvas = document.createElement("canvas");

  return (
    canvas.getContext("webgl2") !== null || canvas.getContext("webgl") !== null
  );
};

const ProductionMap = forwardRef<HTMLElement, ProductionMapProps>(
  ({ countryTotals, selectedProduct }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const [mapError, setMapError] = useState(false);
    const mapData = useMemo(
      () => getProductionMapData(countryTotals),
      [countryTotals],
    );

    useEffect(() => {
      const container = containerRef.current;

      if (container === null || !hasWebGLSupport()) {
        setMapError(true);
        return;
      }

      const map = new maplibregl.Map({
        attributionControl: false,
        container,
        style: createMapStyle(),
      });
      mapRef.current = map;
      map.on("load", () => {
        map.fitBounds(
          [
            [-180, -58],
            [180, 83],
          ],
          { animate: false, padding: 20 },
        );
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, []);

    useEffect(() => {
      const map = mapRef.current;

      if (map === null) {
        return;
      }

      const updateSource = () => {
        const source = map.getSource("countries") as GeoJSONSource | undefined;

        source?.setData(mapData);
      };

      if (map.isStyleLoaded()) {
        updateSource();
      } else {
        map.once("load", updateSource);
      }

      return () => {
        map.off("load", updateSource);
      };
    }, [mapData]);

    return (
      <section
        ref={ref}
        aria-labelledby="map-heading"
        className="rounded-xl border border-slate-700 bg-slate-900 p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="map-heading" className="text-lg font-semibold text-white">
              Production map
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {selectedProduct === null
                ? "Choose a product to color the map."
                : `Showing ${selectedProduct.name} production across countries.`}
            </p>
          </div>
          <div
            aria-label="Production map legend"
            className="flex items-center gap-2 text-xs text-slate-300"
          >
            <span className="h-3 w-3 rounded-sm bg-slate-600" />
            No data
            <span className="h-3 w-3 rounded-sm bg-blue-200" />
            Lower production
            <span className="h-3 w-3 rounded-sm bg-blue-600" />
            Higher production
          </div>
        </div>

        {mapError ? (
          <p className="mt-4 text-sm text-slate-300" role="status">
            The production map is not available in this browser.
          </p>
        ) : (
          <div ref={containerRef} className="mt-4 h-96 w-full" />
        )}

        <p className="mt-3 text-xs text-slate-400">
          Geometry: Natural Earth, distributed by world-atlas.
        </p>
      </section>
    );
  },
);

ProductionMap.displayName = "ProductionMap";

export { ProductionMap };
