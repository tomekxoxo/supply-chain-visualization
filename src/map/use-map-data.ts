import { useEffect, type RefObject } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import type { ProductionMapData } from "data";
import type { CountryCode } from "model";

export const useMapData = (
  mapRef: RefObject<MapLibreMap | null>,
  mapData: ProductionMapData,
): void => {
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
  }, [mapData, mapRef]);
};

export const useMapSelection = (
  mapRef: RefObject<MapLibreMap | null>,
  selectedCountry: CountryCode | null,
): void => {
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
  }, [mapRef, selectedCountry]);
};
