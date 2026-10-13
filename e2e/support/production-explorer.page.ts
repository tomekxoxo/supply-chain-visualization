import type { Locator, Page } from "@playwright/test";

export class ProductionExplorerPage {
  readonly main: Locator;

  constructor(private readonly page: Page) {
    this.main = page.locator("main");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }
}
