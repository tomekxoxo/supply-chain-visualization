import { forwardRef, type ComponentProps } from "react";

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  variant?: "primary" | "secondary";
}

const variantClasses = {
  primary:
    "bg-action text-heading hover:bg-action-hover focus-visible:outline-action-focus-subtle",
  secondary:
    "border border-border-strong bg-surface-raised text-text-primary hover:bg-border focus-visible:outline-text-secondary",
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

export { Button };
