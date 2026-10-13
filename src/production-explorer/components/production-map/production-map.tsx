import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  StyleSpecification,
} from "maplibre-gl";
import { getProductionMapData } from "production-explorer/data";
import type {
  CountryCode,
  CountryProductionTotal,
  Product,
  ProductionFilters,
} from "production-explorer/model";
import { getCountryCode, getMapTooltipText } from "./map-interactions";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

interface ProductionMapProps {
  countryTotals: readonly CountryProductionTotal[];
  filters: ProductionFilters;
  onSelectCountry: (countryCode: CountryCode) => void;
  selectedCountry: CountryCode | null;
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
    {
      filter: ["==", ["get", "iso3"], ""],
      id: "countries-selected",
      paint: { "line-color": "#c084fc", "line-width": 2.5 },
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
  (
    {
      countryTotals,
      filters,
      onSelectCountry,
      selectedCountry,
      selectedProduct,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const popupRef = useRef<maplibregl.Popup | null>(null);
    const [mapError, setMapError] = useState(() => !hasWebGLSupport());
    const mapData = useMemo(
      () => getProductionMapData(countryTotals),
      [countryTotals],
    );

    useEffect(() => {
      const container = containerRef.current;

      if (container === null || mapError) {
        return;
      }

      let map: MapLibreMap;

      try {
        map = new maplibregl.Map({
          attributionControl: false,
          container,
          style: createMapStyle(),
        });
      } catch {
        let disposed = false;

        queueMicrotask(() => {
          if (!disposed) {
            setMapError(true);
          }
        });

        return () => {
          disposed = true;
        };
      }

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
      map.once("error", () => {
        setMapError(true);
      });

      return () => {
        popupRef.current?.remove();
        map.remove();
        mapRef.current = null;
      };
    }, [mapError]);

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

    useEffect(() => {
      const map = mapRef.current;

      if (map === null) {
        return;
      }

      const updateSelection = () => {
        map.setFilter("countries-selected", [
          "==",
          ["get", "iso3"],
          selectedCountry ?? "",
        ]);
      };

      if (map.isStyleLoaded()) {
        updateSelection();
      } else {
        map.once("load", updateSelection);
      }

      return () => {
        map.off("load", updateSelection);
      };
    }, [selectedCountry]);

    useEffect(() => {
      const map = mapRef.current;

      if (map === null || selectedProduct === null) {
        return;
      }

      const removePopup = () => {
        popupRef.current?.remove();
        popupRef.current = null;
      };
      const getCountryDetails = (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        const properties = feature?.properties;
        const countryCode = getCountryCode(properties?.iso3);
        const countryName =
          typeof properties?.name === "string" ? properties.name : null;
        const value =
          typeof properties?.value === "number" ? properties.value : null;

        return { countryCode, countryName, value };
      };
      const handleMouseMove = (event: MapLayerMouseEvent) => {
        const { countryName, value } = getCountryDetails(event);

        if (countryName === null) {
          return;
        }

        removePopup();
        const tooltip = document.createElement("p");
        tooltip.className = "m-0 text-sm text-slate-900";
        tooltip.textContent = getMapTooltipText({
          countryName,
          period: filters.yearRange,
          productName: selectedProduct.name,
          unit: selectedProduct.unit,
          value,
        });
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          maxWidth: "20rem",
        })
          .setLngLat(event.lngLat)
          .setDOMContent(tooltip)
          .addTo(map);
      };
      const handleMouseEnter = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const handleMouseLeave = () => {
        map.getCanvas().style.cursor = "";
        removePopup();
      };
      const handleClick = (event: MapLayerMouseEvent) => {
        const { countryCode, value } = getCountryDetails(event);

        if (countryCode !== null && value !== null) {
          onSelectCountry(countryCode);
        }
      };
      const addInteractions = () => {
        map.on("click", "countries-fill", handleClick);
        map.on("mouseenter", "countries-fill", handleMouseEnter);
        map.on("mouseleave", "countries-fill", handleMouseLeave);
        map.on("mousemove", "countries-fill", handleMouseMove);
      };

      if (map.isStyleLoaded()) {
        addInteractions();
      } else {
        map.once("load", addInteractions);
      }

      return () => {
        map.off("click", "countries-fill", handleClick);
        map.off("load", addInteractions);
        map.off("mouseenter", "countries-fill", handleMouseEnter);
        map.off("mouseleave", "countries-fill", handleMouseLeave);
        map.off("mousemove", "countries-fill", handleMouseMove);
        removePopup();
      };
    }, [filters.yearRange, onSelectCountry, selectedProduct]);

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
