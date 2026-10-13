import type {
  CountryCode,
  ProductId,
  ProductionRecord,
} from "production-explorer/model/types";

interface ProductionSeries {
  countryCode: CountryCode;
  productId: ProductId;
  values: readonly number[];
}

const productionSeries: readonly ProductionSeries[] = [
  {
    countryCode: "BRA",
    productId: "coffee",
    values: [
      2.9, 2.8, 3.0, 3.1, 2.7, 3.2, 3.0, 3.1, 3.5, 3.6, 3.7, 3.5, 3.6, 3.8, 3.9,
      3.7, 4.0,
    ],
  },
  {
    countryCode: "BRA",
    productId: "soybeans",
    values: [
      68.8, 75.3, 66.4, 81.5, 86.8, 97.5, 96.3, 114.1, 120.7, 123.2, 126.0,
      135.4, 121.2, 154.6, 147.4, 159.7, 165.2,
    ],
  },
  {
    countryCode: "CHN",
    productId: "cotton",
    values: [
      5.9, 6.6, 6.8, 6.3, 6.2, 5.6, 5.3, 5.5, 6.1, 5.9, 5.9, 5.7, 6.0, 5.6, 6.2,
      6.1, 6.3,
    ],
  },
  {
    countryCode: "CHN",
    productId: "wheat",
    values: [
      115.2, 117.4, 120.6, 121.7, 126.2, 130.2, 131.7, 134.3, 131.4, 133.6,
      134.3, 136.6, 137.7, 136.6, 140.1, 140.8, 142.0,
    ],
  },
  {
    countryCode: "DEU",
    productId: "wheat",
    values: [
      24.1, 22.8, 22.4, 25.0, 27.6, 26.5, 24.5, 24.5, 20.3, 22.9, 22.2, 21.5,
      22.6, 21.4, 18.5, 22.0, 21.8,
    ],
  },
  {
    countryCode: "IND",
    productId: "cotton",
    values: [
      5.9, 6.2, 6.1, 6.4, 6.6, 5.9, 5.8, 6.2, 6.1, 6.0, 6.1, 6.3, 6.0, 5.8, 6.2,
      6.1, 6.3,
    ],
  },
  {
    countryCode: "IND",
    productId: "wheat",
    values: [
      80.8, 86.9, 94.9, 93.5, 95.9, 86.5, 92.3, 98.5, 99.7, 103.6, 107.9, 109.6,
      107.7, 110.6, 113.3, 115.4, 117.2,
    ],
  },
  {
    countryCode: "POL",
    productId: "wheat",
    values: [
      9.4, 9.3, 8.6, 9.5, 11.6, 11.0, 10.8, 11.7, 9.8, 11.0, 12.0, 12.0, 13.2,
      12.7, 12.4, 12.6, 12.9,
    ],
  },
  {
    countryCode: "USA",
    productId: "soybeans",
    values: [
      90.6, 84.2, 82.8, 91.4, 106.9, 106.9, 117.2, 119.5, 120.5, 96.8, 114.7,
      121.5, 116.4, 113.3, 113.3, 118.8, 121.1,
    ],
  },
  {
    countryCode: "USA",
    productId: "wheat",
    values: [
      60.1, 54.4, 61.7, 58.1, 55.1, 55.8, 62.8, 47.4, 51.3, 52.6, 49.8, 44.8,
      44.9, 49.1, 53.7, 52.4, 54.0,
    ],
  },
];

export const productionRecords: readonly ProductionRecord[] =
  productionSeries.flatMap(({ countryCode, productId, values }) =>
    values.map((value, index) => ({
      countryCode,
      productId,
      unit: "tonnes",
      year: 2010 + index,
      value: value * 1_000_000,
    })),
  );
