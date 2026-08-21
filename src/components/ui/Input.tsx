import { type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        className={`w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-primary-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-primary-500/20 ${error ? "border-error-500/50" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <textarea
        className={`w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-primary-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-primary-500/20 resize-none ${error ? "border-error-500/50" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, className = "", children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">{label}</label>
      )}
      <select
        className={`w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-primary-500/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-primary-500/20 ${error ? "border-error-500/50" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-error-400">{error}</p>}
    </div>
  );
}
