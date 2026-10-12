export const PRODUCTION_YEAR_RANGE = {
  start: 2010,
  end: 2026,
} as const;

export type CountryCode = "BRA" | "CHN" | "DEU" | "IND" | "POL" | "USA";

export type ProductId = "coffee" | "cotton" | "soybeans" | "wheat";

export type ProductionUnit = "tonnes";

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
