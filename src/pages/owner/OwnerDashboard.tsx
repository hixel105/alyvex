import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Megaphone, MousePointer, Crown, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Stats, SiteSettings } from "@/lib/types";

export function OwnerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getSettings()])
      .then(([s, sett]) => {
        setStats(s);
        setSettings(sett);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Bots publicados", value: stats?.bots_published ?? 0, icon: Bot, color: "text-primary-400", bg: "bg-primary-500/10" },
    { label: "Anuncios activos", value: stats?.active_announcements ?? 0, icon: Megaphone, color: "text-warning-400", bg: "bg-warning-500/10" },
    { label: "Clics totales", value: stats?.total_clicks ?? 0, icon: MousePointer, color: "text-secondary-400", bg: "bg-secondary-500/10" },
  ];

  const quickLinks = [
    { label: "Gestionar bots", path: "/owner/bots", icon: Bot },
    { label: "Editar contenido", path: "/owner/content", icon: TrendingUp },
    { label: "Anuncios", path: "/owner/announcements", icon: Megaphone },
    { label: "Configuracion", path: "/owner/settings", icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Bienvenido al panel de administracion de Alyvex Community</p>
      </div>

      {/* Maintenance alert */}
      {settings?.maintenance_mode && (
        <div className="glass-card border-warning-500/20 bg-warning-500/5 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-500/15">
              <Megaphone size={20} className="text-warning-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-warning-300">Modo mantenimiento activo</h3>
              <p className="text-xs text-gray-400">{settings.maintenance_message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
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

      {/* Click breakdown */}
      {stats && stats.clicks_by_type.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Clics por tipo</h3>
          <div className="space-y-3">
            {stats.clicks_by_type.map((item) => {
              const max = Math.max(...stats.clicks_by_type.map((c) => c.count), 1);
              const pct = (item.count / max) * 100;
              const icon = item.type === "invite" ? Bot : item.type === "premium" ? Crown : MessageSquare;
              const Icon = icon;
              return (
                <div key={item.type} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-28">
                    <Icon size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-300 capitalize">{item.type}</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white w-12 text-right">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h3 className="font-display text-lg font-semibold text-white mb-4">Accesos rapidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className="group glass-card p-5 rounded-2xl hover:border-primary-500/30 hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                  <link.icon size={20} className="text-primary-300" />
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-3 text-sm font-medium text-white">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
