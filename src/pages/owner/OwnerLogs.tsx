import { useEffect, useState } from "react";
import { ScrollText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";
import type { OwnerLog } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Toast";

const actionLabels: Record<string, string> = {
  login: "Inicio de sesion",
  logout: "Cierre de sesion",
  login_attempt: "Intento de login",
  bot_create: "Creacion de bot",
  bot_update: "Edicion de bot",
  bot_delete: "Eliminacion de bot",
  content_update: "Cambio de contenido",
  announcement_create: "Creacion de anuncio",
  announcement_update: "Edicion de anuncio",
  announcement_delete: "Eliminacion de anuncio",
  maintenance_activate: "Activacion de mantenimiento",
  maintenance_deactivate: "Desactivacion de mantenimiento",
};

export function OwnerLogs() {
  const [logs, setLogs] = useState<OwnerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLogs(200).then(setLogs).finally(() => setLoading(false));
  }, []);

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
        <h1 className="font-display text-3xl font-bold text-white mb-2">Logs</h1>
        <p className="text-gray-400">Registro de acciones administrativas</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState icon={<ScrollText size={40} />} title="No hay registros" description="Las acciones administrativas aparecen aqui" />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Accion</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Detalle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => {
                  const date = new Date(log.created_at);
                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {log.result === "success" ? (
                            <CheckCircle2 size={14} className="text-success-400" />
                          ) : log.result === "failed" ? (
                            <XCircle size={14} className="text-error-400" />
                          ) : (
                            <Clock size={14} className="text-warning-400" />
                          )}
                          <span className="text-sm text-gray-200">
                            {actionLabels[log.action] ?? log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell max-w-xs truncate">
                        {log.detail ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        {date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                        {" "}
                        {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={log.result === "success" ? "success" : log.result === "failed" ? "error" : "maintenance"}>
                          {log.result === "success" ? "Exito" : log.result === "failed" ? "Fallo" : "Limitado"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
