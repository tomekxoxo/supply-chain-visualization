export const PRODUCTION_YEAR_RANGE = {
  start: 2010,
  end: 2026,
} as const;

export type CountryCode =
  | "ARG"
  | "AUS"
  | "BRA"
  | "CAN"
  | "CHN"
  | "DEU"
  | "FRA"
  | "IND"
  | "IDN"
  | "MEX"
  | "NGA"
  | "POL"
  | "TUR"
  | "UKR"
  | "USA"
  | "VNM";

export type ProductId = "coffee" | "cotton" | "soybeans" | "wheat";

export type ProductionUnit = "hectares" | "tonnes";

export interface Country {
  code: CountryCode;
  name: string;
}

export interface Product {
  id: ProductId;
  name: string;
  unit: ProductionUnit;
}

export interface ProductionRecord {
  countryCode: CountryCode;
  productId: ProductId;
  unit: ProductionUnit;
  year: number;
  value: number;
}

export interface ProductionFilters {
  countryCode: CountryCode | null;
  productId: ProductId | null;
  yearRange: {
    from: number;
    to: number;
  };
}
