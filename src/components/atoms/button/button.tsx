import { forwardRef, type ComponentProps } from "react";

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  variant?: "primary" | "secondary";
}

const variantClasses = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-400 focus-visible:outline-blue-300",
  secondary:
    "border border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-300",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = "button", variant = "primary", ...rest }, ref) => (
    <button
      ref={ref}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export default Button;
