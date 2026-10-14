import { useEffect, useRef, type RefObject } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, MapLayerMouseEvent } from "maplibre-gl";
import type { CountryCode, Product, ProductionFilters } from "model";
import { getCountryCode, getMapTooltipText } from "./map-interactions";

interface UseMapInteractionsOptions {
  filters: ProductionFilters;
  mapRef: RefObject<MapLibreMap | null>;
  onSelectCountry: (countryCode: CountryCode) => void;
  selectedProduct: Product | null;
}

export const useMapInteractions = ({
  filters,
  mapRef,
  onSelectCountry,
  selectedProduct,
}: UseMapInteractionsOptions): void => {
  const popupRef = useRef<maplibregl.Popup | null>(null);

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
      tooltip.className = "m-0 text-sm text-text-inverse";
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
  }, [filters.yearRange, mapRef, onSelectCountry, selectedProduct]);
};
