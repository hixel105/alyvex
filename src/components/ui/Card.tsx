import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`glass-card p-6 ${hover ? "transition-all duration-300 hover:border-primary-500/30 hover:bg-white/[0.05] hover:scale-[1.02]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
