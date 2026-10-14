import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { Map as MapLibreMap } from "maplibre-gl";
import { createMapStyle } from "./map-style";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

const hasWebGLSupport = (): boolean => {
  if (navigator.userAgent.includes("jsdom")) {
    return false;
  }

  const canvas = document.createElement("canvas");

  return (
    canvas.getContext("webgl2") !== null || canvas.getContext("webgl") !== null
  );
};

export const useMapInstance = () => {
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
      map.remove();
      mapRef.current = null;
    };
  }, [mapError]);

  return { containerRef, mapError, mapRef };
};
