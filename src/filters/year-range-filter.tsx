import { forwardRef, type ChangeEvent } from "react";

interface YearRangeFilterProps {
  from: number;
  onChange: (from: number, to: number) => void;
  to: number;
}

const getYear = (event: ChangeEvent<HTMLInputElement>): number | null => {
  const year = Number(event.target.value);

  return Number.isInteger(year) ? year : null;
};

const YearRangeFilter = forwardRef<HTMLDivElement, YearRangeFilterProps>(
  ({ from, onChange, to }, ref) => (
    <div ref={ref} className="contents">
      <label
        className="grid gap-1.5 text-sm font-medium text-text-primary"
        htmlFor="year-from"
      >
        From year
        <input
          className="block w-full rounded-md border-border-strong bg-surface px-3 py-2 text-text-primary shadow-sm focus:border-action-focus focus:ring-action-focus"
          id="year-from"
          max={2026}
          min={2010}
          onChange={(event) => {
            const value = getYear(event);

            if (value !== null) {
              onChange(value, to);
            }
          }}
          type="number"
          value={from}
        />
      </label>
      <label
        className="grid gap-1.5 text-sm font-medium text-text-primary"
        htmlFor="year-to"
      >
        To year
        <input
          className="block w-full rounded-md border-border-strong bg-surface px-3 py-2 text-text-primary shadow-sm focus:border-action-focus focus:ring-action-focus"
          id="year-to"
          max={2026}
          min={2010}
          onChange={(event) => {
            const value = getYear(event);

            if (value !== null) {
              onChange(from, value);
            }
          }}
          type="number"
          value={to}
        />
      </label>
    </div>
  ),
);

YearRangeFilter.displayName = "YearRangeFilter";

export { YearRangeFilter };
