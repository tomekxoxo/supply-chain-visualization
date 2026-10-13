import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductionSummary from "./summary";

describe("ProductionSummary", () => {
  it("renders each metric with its unit", () => {
    render(
      <ProductionSummary
        summary={{
          average: 72_400_000,
          maximum: 115_200_000,
          minimum: 9_400_000,
          total: 289_600_000,
          unit: "tonnes",
        }}
      />,
    );

    expect(screen.getByText("289,600,000 tonnes")).toBeInTheDocument();
    expect(screen.getByText("72,400,000 tonnes")).toBeInTheDocument();
    expect(screen.getByText("9,400,000 tonnes")).toBeInTheDocument();
    expect(screen.getByText("115,200,000 tonnes")).toBeInTheDocument();
  });

  it("renders a no-data state without treating zero as missing", () => {
    const { rerender } = render(<ProductionSummary summary={null} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "No production data is available for the active filters.",
    );

    rerender(
      <ProductionSummary
        summary={{
          average: 0,
          maximum: 0,
          minimum: 0,
          total: 0,
          unit: "tonnes",
        }}
      />,
    );

    expect(screen.getAllByText("0 tonnes")).toHaveLength(4);
  });
});
