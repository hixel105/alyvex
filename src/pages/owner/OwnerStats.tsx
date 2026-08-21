import { useEffect, useState } from "react";
import { BarChart3, Bot, Crown, MessageSquare, MousePointer, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import type { Stats } from "@/lib/types";

export function OwnerStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Bots publicados", value: stats.bots_published, icon: Bot, color: "text-primary-400", bg: "bg-primary-500/10" },
    { label: "Clics en invitaciones", value: stats.clicks_by_type.find((c) => c.type === "invite")?.count ?? 0, icon: MousePointer, color: "text-secondary-400", bg: "bg-secondary-500/10" },
    { label: "Clics en Premium", value: stats.clicks_by_type.find((c) => c.type === "premium")?.count ?? 0, icon: Crown, color: "text-warning-400", bg: "bg-warning-500/10" },
    { label: "Clics en Discord", value: stats.clicks_by_type.find((c) => c.type === "discord")?.count ?? 0, icon: MessageSquare, color: "text-accent-400", bg: "bg-accent-500/10" },
    { label: "Anuncios activos", value: stats.active_announcements, icon: TrendingUp, color: "text-success-400", bg: "bg-success-500/10" },
    { label: "Clics totales", value: stats.total_clicks, icon: BarChart3, color: "text-primary-400", bg: "bg-primary-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Estadisticas</h1>
        <p className="text-gray-400">Datos reales de actividad en el sitio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <div className="font-display text-3xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {stats.clicks_by_bot.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Clics por bot</h3>
          <div className="space-y-3">
            {stats.clicks_by_bot.map((item) => {
              const max = Math.max(...stats.clicks_by_bot.map((c) => c.count), 1);
              const pct = (item.count / max) * 100;
              return (
                <div key={item.bot_name} className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 w-32 truncate">{item.bot_name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-white w-12 text-right">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-2xl">
        <p className="text-xs text-gray-500 text-center">
          Las estadisticas mostradas son datos reales registrados por el sistema.
          No se muestran datos de visitas ni usuarios activos porque no hay un backend de analiticas configurado.
        </p>
      </div>
    </div>
  );
}
