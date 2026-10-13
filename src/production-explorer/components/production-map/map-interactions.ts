import { countries } from "production-explorer/data";
import type { CountryCode, ProductionUnit } from "production-explorer/model";

interface MapTooltipDetails {
  countryName: string;
  period: {
    from: number;
    to: number;
  };
  productName: string;
  unit: ProductionUnit;
  value: number | null;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const getCountryCode = (value: unknown): CountryCode | null => {
  if (typeof value !== "string") {
    return null;
  }

  return countries.some(({ code }) => code === value)
    ? (value as CountryCode)
    : null;
};

export const getMapTooltipText = ({
  countryName,
  period,
  productName,
  unit,
  value,
}: MapTooltipDetails): string => {
  const production =
    value === null ? "No data" : `${numberFormatter.format(value)} ${unit}`;

  return `${countryName}: ${productName} — ${production} (${period.from}–${period.to})`;
};
