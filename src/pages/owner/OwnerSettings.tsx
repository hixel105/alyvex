import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Power, Save, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function OwnerSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await api.updateSettings({
      maintenance_mode: settings.maintenance_mode,
      maintenance_message: settings.maintenance_message,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Configuracion</h1>
        <p className="text-gray-400">Ajustes globales del sitio</p>
      </div>

      {/* Maintenance mode */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${settings.maintenance_mode ? "bg-warning-500/15" : "bg-white/5"}`}>
            <AlertTriangle size={20} className={settings.maintenance_mode ? "text-warning-400" : "text-gray-500"} />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Modo mantenimiento global</h3>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-dark-400/50 border border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <Power size={18} className={settings.maintenance_mode ? "text-warning-400" : "text-gray-500"} />
            <span className="text-sm text-gray-300">
              {settings.maintenance_mode ? "Mantenimiento activo" : "Mantenimiento inactivo"}
            </span>
          </div>
          <button
            onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
            className={`relative h-6 w-11 rounded-full transition-colors ${settings.maintenance_mode ? "bg-warning-500" : "bg-white/10"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${settings.maintenance_mode ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>

        <Textarea
          label="Mensaje de mantenimiento"
          rows={2}
          value={settings.maintenance_message}
          onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
        />

        <Button onClick={handleSave} variant="primary" disabled={saving}>
          {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          {saved ? "Guardado!" : "Guardar configuracion"}
        </Button>
      </div>

      {/* Info */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <SettingsIcon size={20} className="text-gray-500" />
          <h3 className="font-display text-sm font-semibold text-white">Informacion del sistema</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-gray-300">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Plataforma</span>
            <span className="text-gray-300">Supabase + Vite</span>
          </div>
          <div className="flex justify-between">
            <span>Autenticacion</span>
            <span className="text-gray-300">Owner token (HMAC)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
