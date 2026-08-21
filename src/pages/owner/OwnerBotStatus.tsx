import { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Bot, BotStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

const statusOptions: { value: BotStatus; label: string; icon: typeof CheckCircle2; variant: "active" | "maintenance" | "offline" }[] = [
  { value: "active", label: "Activo", icon: CheckCircle2, variant: "active" },
  { value: "maintenance", label: "Mantenimiento", icon: AlertTriangle, variant: "maintenance" },
  { value: "offline", label: "Fuera de servicio", icon: XCircle, variant: "offline" },
];

export function OwnerBotStatus() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadBots = () => {
    api.getBots().then(setBots).finally(() => setLoading(false));
  };

  useEffect(() => { loadBots(); }, []);

  const handleStatusChange = async (botId: string, status: BotStatus) => {
    setUpdating(botId);
    await api.updateBot(botId, { status });
    loadBots();
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Estado de Bots</h1>
        <p className="text-gray-400">Cambia el estado de cada bot. La pagina publica se actualizara automaticamente.</p>
      </div>

      <div className="space-y-4">
        {bots.map((bot, i) => (
          <div key={bot.id} className="glass-card p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/10">
                  <Activity size={22} className="text-primary-300" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white">{bot.name}</h3>
                  <Badge variant={bot.status === "active" ? "active" : bot.status === "maintenance" ? "maintenance" : "offline"}>
                    {bot.status === "active" ? "Activo" : bot.status === "maintenance" ? "Mantenimiento" : "Offline"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {statusOptions.map((opt) => {
                  const isActive = bot.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(bot.id, opt.value)}
                      disabled={updating === bot.id}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border ${
                        isActive
                          ? opt.variant === "active"
                            ? "bg-success-500/15 text-success-400 border-success-500/30"
                            : opt.variant === "maintenance"
                            ? "bg-warning-500/15 text-warning-400 border-warning-500/30"
                            : "bg-error-500/15 text-error-400 border-error-500/30"
                          : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <opt.icon size={16} />
                      {opt.label}
                      {updating === bot.id && isActive && (
                        <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {bot.status === "maintenance" && (
              <div className="mt-4 rounded-xl border border-warning-500/20 bg-warning-500/5 px-4 py-2.5">
                <p className="text-xs text-warning-400">
                  La pagina publica mostrara: "{bot.name} esta temporalmente en mantenimiento."
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
