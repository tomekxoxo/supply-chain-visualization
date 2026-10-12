import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./app";

describe("App", () => {
  it("renders the production explorer dashboard", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Production across global supply chains",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Filters" })).toBeInTheDocument();
    expect(
      screen.getByText("Choose a product to see the production map."),
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
      screen.getByText(
        "The map will show Coffee production for the active filters.",
      ),
    ).toBeInTheDocument();
  });
});
