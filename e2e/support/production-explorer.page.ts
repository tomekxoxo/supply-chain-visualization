import type { Locator, Page } from "@playwright/test";

export class ProductionExplorerPage {
  readonly annualProductionData: Locator;
  readonly country: Locator;
  readonly fromYear: Locator;
  readonly main: Locator;
  readonly product: Locator;
  readonly resetFilters: Locator;
  readonly toYear: Locator;

  constructor(private readonly page: Page) {
    this.annualProductionData = page.getByRole("table", {
      name: "Annual production data",
    });
    this.country = page.getByRole("combobox", { name: "Country" });
    this.fromYear = page.getByRole("spinbutton", { name: "From year" });
    this.main = page.locator("main");
    this.product = page.getByRole("combobox", { name: "Product" });
    this.resetFilters = page.getByRole("button", { name: "Reset filters" });
    this.toYear = page.getByRole("spinbutton", { name: "To year" });
  }

  async goto(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        value: () => null,
      });
    });
    await this.page.goto("/");
  }

  async selectCountry(countryCode: string): Promise<void> {
    await this.country.selectOption(countryCode);
  }

  async selectProduct(productId: string): Promise<void> {
    await this.product.selectOption(productId);
  }

  async setYearRange(from: number, to: number): Promise<void> {
    await this.fromYear.fill(String(from));
    await this.toYear.fill(String(to));
  }
}
