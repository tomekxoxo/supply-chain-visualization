import { forwardRef, type ChangeEvent } from "react";
import { Select } from "ui/select";
import type { Country, CountryCode } from "model";

interface CountryFilterProps {
  countries: readonly Country[];
  onSelect: (countryCode: CountryCode | null) => void;
  value: CountryCode | null;
}

const CountryFilter = forwardRef<HTMLSelectElement, CountryFilterProps>(
  ({ countries, onSelect, value }, ref) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const country = countries.find(({ code }) => code === event.target.value);

      onSelect(country?.code ?? null);
    };

    return (
      <label
        className="grid gap-1.5 text-sm font-medium text-text-primary"
        htmlFor="country"
      >
        Country
        <Select
          id="country"
          ref={ref}
          onChange={handleChange}
          value={value ?? ""}
        >
          <option value="">All countries</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </Select>
      </label>
    );
  },
);

CountryFilter.displayName = "CountryFilter";

export { CountryFilter };
