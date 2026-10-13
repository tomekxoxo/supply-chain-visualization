import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductionAnnualChart } from "./annual-chart";

describe("ProductionAnnualChart", () => {
  it("provides an accessible annual data table", () => {
    render(
      <ProductionAnnualChart
        data={[
          { unit: "tonnes", value: 1_200_000, year: 2020 },
          { unit: "tonnes", value: 1_350_000, year: 2021 },
        ]}
      />,
    );

    expect(
      screen.getByRole("table", { name: "Annual production data" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1,200,000 tonnes")).toBeInTheDocument();
    expect(screen.getByText("1,350,000 tonnes")).toBeInTheDocument();
  });

  it("renders a no-data state", () => {
    render(<ProductionAnnualChart data={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "No annual production data is available for the active filters.",
    );
  });
});
