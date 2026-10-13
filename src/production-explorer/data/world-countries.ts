import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import countriesTopology from "world-atlas/countries-110m.json";
import type {
  CountryCode,
  CountryProductionTotal,
} from "production-explorer/model";

interface WorldCountryProperties {
  intensity: number | null;
  iso3: CountryCode | null;
  name?: string;
  value: number | null;
}

export type ProductionMapData = FeatureCollection<
  Geometry,
  WorldCountryProperties
>;

const countryCodeByNumericId: Readonly<Record<string, CountryCode>> = {
  "076": "BRA",
  "156": "CHN",
  "276": "DEU",
  "356": "IND",
  "616": "POL",
  "840": "USA",
};

const topology = countriesTopology as unknown as Topology;
const countries = feature(
  topology,
  topology.objects.countries,
) as FeatureCollection;

const getIso3CountryCode = (
  id: string | number | undefined,
): CountryCode | null => {
  if (id === undefined) {
    return null;
  }

  return countryCodeByNumericId[String(id).padStart(3, "0")] ?? null;
};

const worldCountries = countries.features.map(
  ({ geometry, id, properties }) => ({
    geometry,
    properties: {
      iso3: getIso3CountryCode(id),
      name: typeof properties?.name === "string" ? properties.name : undefined,
    },
    type: "Feature" as const,
  }),
);

export const getProductionMapData = (
  countryTotals: readonly CountryProductionTotal[],
): ProductionMapData => {
  const valueByCountry = new Map(
    countryTotals.map(({ countryCode, value }) => [countryCode, value]),
  );
  const maximumValue = Math.max(...countryTotals.map(({ value }) => value), 0);

  return {
    features: worldCountries.map(({ geometry, properties }) => {
      const value =
        properties.iso3 === null
          ? undefined
          : valueByCountry.get(properties.iso3);

      return {
        geometry,
        properties: {
          ...properties,
          intensity:
            value === undefined
              ? null
              : maximumValue === 0
                ? 0
                : value / maximumValue,
          value: value ?? null,
        },
        type: "Feature" as const,
      };
    }),
    type: "FeatureCollection",
  };
};
