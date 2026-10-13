import { expect, test } from "@playwright/test";
import { ProductionExplorerPage } from "../support/production-explorer.page";

test.describe("production explorer period and reset", () => {
  test("limits annual data to the selected inclusive year range", async ({
    page,
  }) => {
    const productionExplorerPage = new ProductionExplorerPage(page);

    await productionExplorerPage.goto();
    await productionExplorerPage.selectProduct("coffee");
    await productionExplorerPage.setYearRange(2020, 2022);

    await expect(productionExplorerPage.fromYear).toHaveValue("2020");
    await expect(productionExplorerPage.toYear).toHaveValue("2022");
    await expect(productionExplorerPage.annualProductionData).toBeVisible();
    await expect(
      productionExplorerPage.annualProductionData.getByRole("row"),
    ).toHaveCount(4);
    await expect(
      productionExplorerPage.annualProductionData.getByRole("cell", {
        name: "2020",
      }),
    ).toBeVisible();
    await expect(
      productionExplorerPage.annualProductionData.getByRole("cell", {
        name: "2022",
      }),
    ).toBeVisible();
  });

  test("resets country, product, and year range", async ({ page }) => {
    const productionExplorerPage = new ProductionExplorerPage(page);

    await productionExplorerPage.goto();
    await productionExplorerPage.selectCountry("BRA");
    await productionExplorerPage.selectProduct("coffee");
    await productionExplorerPage.setYearRange(2020, 2022);
    await productionExplorerPage.resetFilters.click();

    await expect(productionExplorerPage.country).toHaveValue("");
    await expect(productionExplorerPage.product).toHaveValue("");
    await expect(productionExplorerPage.fromYear).toHaveValue("2010");
    await expect(productionExplorerPage.toYear).toHaveValue("2026");
    await expect(
      page.getByText("Choose a product to color the map."),
    ).toBeVisible();
  });
});
