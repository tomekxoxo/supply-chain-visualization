import { forwardRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearlyProduction } from "model";

interface ProductionAnnualChartProps {
  data: readonly YearlyProduction[];
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const ProductionAnnualChart = forwardRef<
  HTMLElement,
  ProductionAnnualChartProps
>(({ data }, ref) => {
  if (data.length === 0) {
    return (
      <section
        ref={ref}
        aria-labelledby="chart-heading"
        className="min-h-56 rounded-xl border border-border bg-surface p-6"
      >
        <h2 id="chart-heading" className="text-lg font-semibold text-heading">
          Annual production
        </h2>
        <p className="mt-2 text-sm text-text-secondary" role="status">
          No annual production data is available for the active filters.
        </p>
      </section>
    );
  }

  const unit = data[0].unit;

  return (
    <section
      ref={ref}
      aria-labelledby="chart-heading"
      className="min-h-80 rounded-xl border border-border bg-surface p-6"
    >
      <h2 id="chart-heading" className="text-lg font-semibold text-heading">
        Annual production
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Production volume in {unit} for the active filters.
      </p>
      <div className="mt-4 h-64" data-testid="annual-production-chart">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart
            data={data}
            margin={{ bottom: 8, left: 12, right: 12, top: 12 }}
          >
            <CartesianGrid
              stroke="var(--color-chart-grid)"
              strokeDasharray="3 3"
            />
            <XAxis dataKey="year" stroke="var(--color-chart-axis)" />
            <YAxis
              stroke="var(--color-chart-axis)"
              tickFormatter={(value) => numberFormatter.format(Number(value))}
              width={88}
            />
            <Tooltip
              formatter={(value) =>
                `${numberFormatter.format(Number(value))} ${unit}`
              }
              labelFormatter={(label) => `Year ${label}`}
            />
            <Line
              dataKey="value"
              dot={false}
              name="Production"
              stroke="var(--color-chart-series)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only" aria-label="Annual production data">
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Production</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ value, year }) => (
            <tr key={year}>
              <td>{year}</td>
              <td>
                {numberFormatter.format(value)} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});

ProductionAnnualChart.displayName = "ProductionAnnualChart";

export { ProductionAnnualChart };
