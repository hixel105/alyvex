import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface MaintenanceBannerProps {
  message: string;
}

export function MaintenanceBanner({ message }: MaintenanceBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-30 bg-gradient-to-r from-warning-500/20 via-warning-500/10 to-warning-500/20 border-b border-warning-500/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-center">
          <AlertTriangle size={18} className="text-warning-400 shrink-0" />
          <p className="text-sm text-warning-300 font-medium">{message}</p>
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 p-1 rounded-lg text-warning-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
