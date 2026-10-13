import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useProductionExplorer } from "production-explorer";
import ProductionFilters from "./production-filters";

const ProductionFiltersHarness = () => {
  const explorer = useProductionExplorer();

  return <ProductionFilters explorer={explorer} />;
};

describe("ProductionFilters", () => {
  it("limits products after selecting a country", async () => {
    const user = userEvent.setup();

    render(<ProductionFiltersHarness />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Country" }),
      "BRA",
    );

    expect(
      screen
        .getAllByRole("option")
        .filter(
          (option) => option.parentElement?.getAttribute("id") === "product",
        )
        .map(({ textContent }) => textContent),
    ).toEqual(["Choose a product", "Coffee", "Soybeans"]);
  });

  it("resets selections and the range", async () => {
    const user = userEvent.setup();

    render(<ProductionFiltersHarness />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Country" }),
      "POL",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Product" }),
      "wheat",
    );
    await user.clear(screen.getByRole("spinbutton", { name: "From year" }));
    await user.type(
      screen.getByRole("spinbutton", { name: "From year" }),
      "2020",
    );
    await user.click(screen.getByRole("button", { name: "Reset filters" }));

    expect(screen.getByRole("combobox", { name: "Country" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Product" })).toHaveValue("");
    expect(screen.getByRole("spinbutton", { name: "From year" })).toHaveValue(
      2010,
    );
  });
});
