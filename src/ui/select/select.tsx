import { forwardRef, type ComponentProps } from "react";

type SelectProps = Omit<ComponentProps<"select">, "className">;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, ...rest }, ref) => (
    <select
      ref={ref}
      className="block w-full rounded-md border-border-strong bg-surface px-3 py-2 text-text-primary shadow-sm focus:border-action-focus focus:ring-action-focus disabled:cursor-not-allowed disabled:opacity-50"
      {...rest}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";

export default Select;
