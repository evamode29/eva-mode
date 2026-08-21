import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button className={`eva-button eva-button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
