import { forwardRef, type ComponentProps } from "react";

type SelectProps = Omit<ComponentProps<"select">, "className">;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, ...rest }, ref) => (
    <select
      ref={ref}
      className="block w-full rounded-md border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 shadow-sm focus:border-blue-400 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      {...rest}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";

export default Select;
