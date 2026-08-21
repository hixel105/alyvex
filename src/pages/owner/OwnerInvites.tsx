import { useEffect, useState } from "react";
import { Link as LinkIcon, Copy, Check, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import type { Bot } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function OwnerInvites() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    api.getBots().then(setBots).finally(() => setLoading(false));
  }, []);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
        <h1 className="font-display text-3xl font-bold text-white mb-2">Invitaciones</h1>
        <p className="text-gray-400">Gestiona los enlaces de invitacion de cada bot</p>
      </div>

      <div className="space-y-4">
        {bots.map((bot, i) => (
          <div key={bot.id} className="glass-card p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <LinkIcon size={18} className="text-primary-400" />
              <h3 className="font-display font-semibold text-white">{bot.name}</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-dark-400/50 border border-white/10 px-4 py-2.5 min-h-[42px]">
                <span className="text-sm text-gray-400 truncate flex-1">{bot.invite_url}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => copyUrl(bot.invite_url, bot.id)}>
                {copied === bot.id ? <Check size={14} className="text-success-400" /> : <Copy size={14} />}
                {copied === bot.id ? "Copiado" : "Copiar"}
              </Button>
              <a href={bot.invite_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="primary">
                  <ExternalLink size={14} />
                  Abrir
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
