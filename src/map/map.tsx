import { forwardRef, useCallback, useMemo, useState } from "react";
import { getProductionMapData } from "data";
import * as maplibregl from "maplibre-gl";
import {
  Layer,
  Map,
  Popup,
  Source,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { FilterSpecification } from "maplibre-gl";
import type {
  CountryCode,
  CountryProductionTotal,
  Product,
  ProductionFilters,
} from "model";
import { getCountryCode, getMapTooltipText } from "./map-interactions";
import { createMapStyle, createProductionMapLayers } from "./map-style";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

const defaultMapBounds: [[number, number], [number, number]] = [
  [-180, -58],
  [180, 83],
];
const interactiveLayerIds = ["countries-fill"];

interface MapTooltip {
  latitude: number;
  longitude: number;
  text: string;
}

interface ProductionMapProps {
  countryTotals: readonly CountryProductionTotal[];
  filters: ProductionFilters;
  mapViewResetVersion: number;
  onSelectCountry: (countryCode: CountryCode) => void;
  selectedCountry: CountryCode | null;
  selectedProduct: Product | null;
}

const ProductionMap = forwardRef<HTMLElement, ProductionMapProps>(
  (
    {
      countryTotals,
      filters,
      mapViewResetVersion,
      onSelectCountry,
      selectedCountry,
      selectedProduct,
    },
    ref,
  ) => {
    const [mapError, setMapError] = useState(false);
    const [tooltip, setTooltip] = useState<MapTooltip | null>(null);
    const mapData = useMemo(
      () => getProductionMapData(countryTotals),
      [countryTotals],
    );
    const mapStyle = useMemo(() => createMapStyle(), []);
    const mapLayers = useMemo(() => createProductionMapLayers(), []);
    const selectedCountryFilter = useMemo<FilterSpecification>(
      () => ["==", ["get", "iso3"], selectedCountry ?? ""],
      [selectedCountry],
    );
    const handleMouseMove = useCallback(
      (event: MapLayerMouseEvent) => {
        if (selectedProduct === null) {
          return;
        }

        const feature = event.features?.[0];
        const properties = feature?.properties;
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
    const handleClick = useCallback(
      (event: MapLayerMouseEvent) => {
        const countryCode = getCountryCode(
          event.features?.[0]?.properties?.iso3,
        );
        const value = event.features?.[0]?.properties?.value;

        if (countryCode !== null && typeof value === "number") {
          onSelectCountry(countryCode);
        }
      },
      [onSelectCountry],
    );

    return (
      <section
        ref={ref}
        aria-labelledby="map-heading"
        className="rounded-xl border border-border bg-surface p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="map-heading" className="text-lg font-semibold text-heading">
              Production map
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {selectedProduct === null
                ? "Choose a product to color the map."
                : `Showing ${selectedProduct.name} production across countries.`}
            </p>
          </div>
          <div
            aria-label="Production map legend"
            className="flex items-center gap-2 text-xs text-text-secondary"
          >
            <span className="h-3 w-3 rounded-sm bg-map-no-data" />
            No data
            <span className="h-3 w-3 rounded-sm bg-map-low" />
            Lower production
            <span className="h-3 w-3 rounded-sm bg-map-high" />
            Higher production
            <span className="h-3 w-3 rounded-sm bg-map-selection" />
            Selected country
          </div>
        </div>

        {mapError ? (
          <p className="mt-4 text-sm text-text-secondary" role="status">
            The production map is not available in this browser.
          </p>
        ) : (
          <div className="mt-4 h-96 w-full">
            <Map
              key={mapViewResetVersion}
              cursor={selectedProduct === null ? "" : "pointer"}
              initialViewState={{
                bounds: defaultMapBounds,
                fitBoundsOptions: { padding: 20 },
              }}
              interactiveLayerIds={
                selectedProduct === null ? [] : interactiveLayerIds
              }
              mapStyle={mapStyle}
              onClick={handleClick}
              onError={() => setMapError(true)}
              onMouseLeave={() => setTooltip(null)}
              onMouseMove={handleMouseMove}
            >
              <Source id="countries" type="geojson" data={mapData}>
                <Layer {...mapLayers.countriesFill} />
                <Layer {...mapLayers.countriesOutline} />
                <Layer
                  {...mapLayers.countriesSelected}
                  filter={selectedCountryFilter}
                />
              </Source>

              {selectedProduct !== null && tooltip !== null ? (
                <Popup
                  closeButton={false}
                  closeOnClick={false}
                  latitude={tooltip.latitude}
                  longitude={tooltip.longitude}
                  maxWidth="20rem"
                >
                  <p className="m-0 text-sm text-text-inverse">
                    {tooltip.text}
                  </p>
                </Popup>
              ) : null}
            </Map>
          </div>
        )}

        <p className="mt-3 text-xs text-text-muted">
          Geometry: Natural Earth, distributed by world-atlas.
        </p>
      </section>
    );
  },
);

ProductionMap.displayName = "ProductionMap";

export { ProductionMap };
