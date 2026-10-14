import { expect, test } from "@playwright/test";
import { ProductionExplorerPage } from "../support/production-explorer.page";

test.describe("production explorer filtering", () => {
  test("limits products after selecting a country", async ({ page }) => {
    const productionExplorerPage = new ProductionExplorerPage(page);

    await productionExplorerPage.goto();
    await productionExplorerPage.selectCountry("BRA");

    await expect(productionExplorerPage.product.locator("option")).toHaveText([
      "Choose a product",
      "Coffee",
      "Soybeans",
    ]);

    await productionExplorerPage.selectProduct("coffee");

    await expect(productionExplorerPage.country).toHaveValue("BRA");
    await expect(productionExplorerPage.product).toHaveValue("coffee");
    await expect(
      page.getByText("Showing Coffee production across countries."),
    ).toBeVisible();
    await expect(productionExplorerPage.annualProductionData).toBeVisible();
  });

  test("limits countries after selecting a product", async ({ page }) => {
    const productionExplorerPage = new ProductionExplorerPage(page);

    await productionExplorerPage.goto();
    await productionExplorerPage.selectProduct("wheat");

    await expect(productionExplorerPage.country.locator("option")).toHaveText([
      "All countries",
      "Australia",
      "Canada",
      "China",
      "Germany",
      "France",
      "India",
      "Poland",
      "Ukraine",
      "United States",
    ]);

    await productionExplorerPage.selectCountry("POL");

    await expect(productionExplorerPage.country).toHaveValue("POL");
    await expect(productionExplorerPage.product).toHaveValue("wheat");
    await expect(productionExplorerPage.annualProductionData).toBeVisible();
  });
});
