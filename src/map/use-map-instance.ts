import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { Map as MapLibreMap } from "maplibre-gl";
import { createMapStyle } from "./map-style";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

const defaultMapBounds: [[number, number], [number, number]] = [
  [-180, -58],
  [180, 83],
];

const fitToDefaultBounds = (map: MapLibreMap, animate: boolean): void => {
  map.fitBounds(defaultMapBounds, { animate, padding: 20 });
};

const hasWebGLSupport = (): boolean => {
  if (navigator.userAgent.includes("jsdom")) {
    return false;
  }

  const canvas = document.createElement("canvas");

  return (
    canvas.getContext("webgl2") !== null || canvas.getContext("webgl") !== null
  );
};

export const useMapInstance = (mapViewResetVersion: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapError, setMapError] = useState(() => !hasWebGLSupport());

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
      fitToDefaultBounds(map, false);
    });
    map.once("error", () => {
      setMapError(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapError]);

  useEffect(() => {
    if (mapViewResetVersion === 0) {
      return;
    }

    const map = mapRef.current;

    if (map === null) {
      return;
    }

    const resetMapView = () => {
      fitToDefaultBounds(map, true);
    };

    if (map.isStyleLoaded()) {
      resetMapView();
    } else {
      map.once("load", resetMapView);
    }

    return () => {
      map.off("load", resetMapView);
    };
  }, [mapViewResetVersion]);

  return { containerRef, mapError, mapRef };
};
