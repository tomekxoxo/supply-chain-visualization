import type { FeatureCollection, Geometry } from "geojson";
import type { CountryCode, CountryProductionTotal } from "model";
import worldCountriesData from "./world-countries.geo.json";

interface WorldCountryProperties {
  intensity: number | null;
  iso3: CountryCode | null;
  name?: string;
  value: number | null;
}

interface WorldCountryGeometryProperties {
  id: string;
  name?: string;
}

export type ProductionMapData = FeatureCollection<
  Geometry,
  WorldCountryProperties
>;

const countryCodeByNumericId: Readonly<Record<string, CountryCode>> = {
  "032": "ARG",
  "036": "AUS",
  "076": "BRA",
  "124": "CAN",
  "156": "CHN",
  "276": "DEU",
  "250": "FRA",
  "356": "IND",
  "360": "IDN",
  "484": "MEX",
  "566": "NGA",
  "616": "POL",
  "704": "VNM",
  "792": "TUR",
  "804": "UKR",
  "840": "USA",
};

const worldCountries = worldCountriesData as FeatureCollection<
  Geometry,
  WorldCountryGeometryProperties
>;

export const getProductionMapData = (
  countryTotals: readonly CountryProductionTotal[],
): ProductionMapData => {
  const valueByCountry = new Map(
    countryTotals.map(({ countryCode, value }) => [countryCode, value]),
  );
  const maximumValue = Math.max(...countryTotals.map(({ value }) => value), 0);

  return {
    features: worldCountries.features.map(({ geometry, properties }) => {
      const iso3 = countryCodeByNumericId[properties.id] ?? null;
      const value = iso3 === null ? undefined : valueByCountry.get(iso3);

      return {
        geometry,
        properties: {
          intensity:
            value === undefined
              ? null
              : maximumValue === 0
                ? 0
                : value / maximumValue,
          iso3,
          name: properties.name,
          value: value ?? null,
        },
        type: "Feature" as const,
      };
    }),
    type: "FeatureCollection",
  };
};
