import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
}

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-metro-blue to-metro-blue-dim text-white shadow-glow shadow-metro-blue/20 hover:brightness-110",
  secondary:
    "bg-base-800 text-ink-primary border border-base-600 hover:border-metro-blue/50",
  ghost: "text-ink-muted hover:text-ink-primary hover:bg-base-800",
};

export default function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
