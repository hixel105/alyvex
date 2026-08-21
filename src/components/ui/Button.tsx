import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 glow-primary",
  secondary:
    "bg-gradient-to-r from-secondary-600 to-secondary-500 text-white hover:from-secondary-500 hover:to-secondary-400 glow-secondary",
  ghost:
    "bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10",
  outline:
    "bg-transparent text-primary-300 border border-primary-500/30 hover:bg-primary-500/10 hover:border-primary-500/50",
  danger:
    "bg-gradient-to-r from-error-600 to-error-500 text-white hover:from-error-500 hover:to-error-400",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn-glow inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
