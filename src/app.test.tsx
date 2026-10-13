import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./app";

vi.mock("./dashboard", () => ({
  default: () => (
    <section aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading">Production across global supply chains</h1>
    </section>
  ),
}));

describe("App", () => {
  it("renders the production explorer dashboard", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Production across global supply chains",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: "Production across global supply chains",
      }),
    ).toBeInTheDocument();
  });
});
