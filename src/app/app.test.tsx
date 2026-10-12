import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./app";

describe("App", () => {
  it("renders the production explorer dashboard", async () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Production across global supply chains",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Filters" })).toBeInTheDocument();
    expect(
      await screen.findByText("Choose a product to color the map."),
    ).toBeInTheDocument();
  });

  it("updates the map placeholder after selecting a product", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Product" }),
      "coffee",
    );

    expect(
      await screen.findByText("Showing Coffee production across countries."),
    ).toBeInTheDocument();
  });
});
