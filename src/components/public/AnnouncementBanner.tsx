import { Megaphone, X } from "lucide-react";
import { useState } from "react";
import type { Announcement } from "@/lib/types";

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const active = announcements
    .filter((a) => a.is_active && !dismissed.includes(a.id))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 1);

  if (active.length === 0) return null;

  const announcement = active[0];

  return (
    <div className="relative z-30 bg-gradient-to-r from-primary-500/15 via-secondary-500/15 to-accent-500/15 border-b border-white/10 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-center relative">
          <Megaphone size={18} className="text-primary-400 shrink-0 animate-glow-pulse" />
          <div>
            <span className="text-sm font-semibold text-white">{announcement.title}</span>
            <span className="text-sm text-gray-300 ml-2">{announcement.message}</span>
          </div>
          <button
            onClick={() => setDismissed([...dismissed, announcement.id])}
            className="absolute right-0 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
