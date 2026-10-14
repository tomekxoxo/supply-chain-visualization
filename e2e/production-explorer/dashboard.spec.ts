import { expect, test } from "@playwright/test";
import { ProductionExplorerPage } from "../support/production-explorer.page";

test("loads the production explorer dashboard", async ({ page }) => {
  const productionExplorerPage = new ProductionExplorerPage(page);

  await productionExplorerPage.goto();

  await expect(page).toHaveTitle("Supply Chain Explorer");
  await expect(productionExplorerPage.main).toBeVisible();
});
