import { useEffect, useState } from "react";
import { Shield, Lock, CheckCircle2, KeyRound, Activity } from "lucide-react";
import { api } from "@/lib/api";
import type { OwnerLog } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function OwnerSecurity() {
  const [logs, setLogs] = useState<OwnerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLogs(20).then(setLogs).finally(() => setLoading(false));
  }, []);

  const securityLogs = logs.filter((l) =>
    ["login", "logout", "login_attempt"].includes(l.action),
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Seguridad</h1>
        <p className="text-gray-400">Informacion de seguridad y acceso del panel</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-500/10">
            <Shield size={20} className="text-success-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Estado de seguridad</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-dark-400/50 border border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">Autenticacion por token HMAC</span>
            </div>
            <Badge variant="success">
              <CheckCircle2 size={12} />
              Activo
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-dark-400/50 border border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <KeyRound size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">Validacion en servidor</span>
            </div>
            <Badge variant="success">
              <CheckCircle2 size={12} />
              Activo
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-dark-400/50 border border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">Rate limiting en login</span>
            </div>
            <Badge variant="success">
              <CheckCircle2 size={12} />
              Activo
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-dark-400/50 border border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">Proteccion de rutas</span>
            </div>
            <Badge variant="success">
              <CheckCircle2 size={12} />
              Activo
            </Badge>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="font-display text-lg font-semibold text-white mb-4">Actividad reciente</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : securityLogs.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No hay actividad reciente</p>
        ) : (
          <div className="space-y-2">
            {securityLogs.map((log) => {
              const date = new Date(log.created_at);
              return (
                <div key={log.id} className="flex items-center justify-between rounded-xl bg-dark-400/30 border border-white/5 px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <Badge variant={log.result === "success" ? "success" : log.result === "failed" ? "error" : "maintenance"}>
                      {log.result === "success" ? "Exito" : log.result === "failed" ? "Fallo" : "Limitado"}
                    </Badge>
                    <span className="text-sm text-gray-300">
                      {log.action === "login" ? "Inicio de sesion" : log.action === "logout" ? "Cierre de sesion" : "Intento de login"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
