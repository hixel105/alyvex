import { type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

export function Toast({ message, type = "info" }: ToastProps) {
  const colors: Record<string, string> = {
    success: "bg-success-500/15 border-success-500/30 text-success-400",
    error: "bg-error-500/15 border-error-500/30 text-error-400",
    info: "bg-primary-500/15 border-primary-500/30 text-primary-300",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 backdrop-blur-xl animate-slide-in-right ${colors[type] ?? colors.info}`}
    >
      <AlertCircle size={18} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 p-4 rounded-2xl bg-white/5 text-gray-500">{icon}</div>
      <h3 className="text-lg font-medium text-gray-300">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}
