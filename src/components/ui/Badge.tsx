import { type ReactNode } from "react";

type Variant = "active" | "maintenance" | "offline" | "default" | "success" | "error";

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  active: "bg-success-500/15 text-success-400 border-success-500/30",
  maintenance: "bg-warning-500/15 text-warning-400 border-warning-500/30",
  offline: "bg-error-500/15 text-error-400 border-error-500/30",
  default: "bg-white/5 text-gray-300 border-white/10",
  success: "bg-success-500/15 text-success-400 border-success-500/30",
  error: "bg-error-500/15 text-error-400 border-error-500/30",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
