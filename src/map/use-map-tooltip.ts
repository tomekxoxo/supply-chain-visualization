import { useCallback, useState } from "react";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";
import { getMapTooltipText } from "./map-interactions";
import type { Product, ProductionFilters } from "model";

export interface MapTooltip {
  latitude: number;
  longitude: number;
  text: string;
}

export const useMapTooltip = (
  filters: ProductionFilters,
  selectedProduct: Product | null,
) => {
  const [tooltip, setTooltip] = useState<MapTooltip | null>(null);

  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      if (selectedProduct === null) {
        return;
      }

      const properties = event.features?.[0]?.properties;
      const countryName =
        typeof properties?.name === "string" ? properties.name : null;
      const value =
        typeof properties?.value === "number" ? properties.value : null;

      if (countryName === null) {
        setTooltip(null);
        return;
      }

      setTooltip({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
        text: getMapTooltipText({
          countryName,
          period: filters.yearRange,
          productName: selectedProduct.name,
          unit: selectedProduct.unit,
          value,
        }),
      });
    },
    [filters.yearRange, selectedProduct],
  );

  return { handleMouseMove, setTooltip, tooltip };
};
