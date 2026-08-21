import { useEffect, useState } from "react";
import { Link as LinkIcon, Save, MessageSquare, Crown, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function OwnerLinks() {
  const [discordUrl, setDiscordUrl] = useState("");
  const [premiumUrl, setPremiumUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then((content) => {
      setDiscordUrl(content.discord_url ?? "");
      setPremiumUrl(content.premium_url ?? "");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      api.updateContent("discord_url", discordUrl),
      api.updateContent("premium_url", premiumUrl),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Enlaces</h1>
        <p className="text-gray-400">Administra los enlaces de la comunidad</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-500/10">
            <MessageSquare size={20} className="text-secondary-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Servidor de Discord</h3>
        </div>
        <Input
          label="URL del servidor"
          value={discordUrl}
          onChange={(e) => setDiscordUrl(e.target.value)}
          placeholder="https://discord.gg/..."
        />
        {discordUrl && (
          <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-secondary-400 hover:text-secondary-300 transition-colors">
            <ExternalLink size={14} />
            Probar enlace
          </a>
        )}
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
            <Crown size={20} className="text-primary-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Tienda Premium</h3>
        </div>
        <Input
          label="URL de la tienda"
          value={premiumUrl}
          onChange={(e) => setPremiumUrl(e.target.value)}
          placeholder="https://..."
        />
        {premiumUrl && (
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            <ExternalLink size={14} />
            Probar enlace
          </a>
        )}
      </div>

      <Button onClick={handleSave} variant="primary" disabled={saving}>
        {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
        {saved ? "Guardado!" : "Guardar enlaces"}
      </Button>
    </div>
  );
}
