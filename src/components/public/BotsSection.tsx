import { useState } from "react";
import { Shield, Bot, MessageSquare, ExternalLink, Info, AlertTriangle, XCircle, Crown } from "lucide-react";
import type { Bot as BotType } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";

interface BotsSectionProps {
  bots: BotType[];
  title: string;
  description: string;
  premiumUrl: string;
}

const statusConfig = {
  active: { variant: "active" as const, label: "Activo", icon: null },
  maintenance: { variant: "maintenance" as const, label: "Mantenimiento", icon: AlertTriangle },
  offline: { variant: "offline" as const, label: "Fuera de servicio", icon: XCircle },
};

const botIcons: Record<string, typeof Shield> = {
  yumekaiguard: Shield,
  "bot-perro": Bot,
  nekomi: MessageSquare,
};

function getBotIcon(slug: string) {
  return botIcons[slug] ?? Bot;
}

function trackClick(botId: string) {
  supabase.from("click_events").insert({ bot_id: botId, type: "invite" }).then();
}

export function BotsSection({ bots, title, description, premiumUrl }: BotsSectionProps) {
  const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
  const visibleBots = bots.filter((b) => b.is_visible).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="bots" className="relative py-24 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary-500/20 bg-secondary-500/5 px-4 py-1.5 mb-4">
            <Bot size={14} className="text-secondary-400" />
            <span className="text-xs font-medium text-secondary-300">Nuestros bots</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">{description}</p>
        </div>

        {/* Bots grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleBots.map((bot, index) => {
            const Icon = getBotIcon(bot.slug);
            const status = statusConfig[bot.status];
            const StatusIcon = status.icon;
            const isDisabled = bot.status === "offline";

            return (
              <div
                key={bot.id}
                className="group glass-card p-6 transition-all duration-300 hover:border-primary-500/30 hover:bg-white/[0.05] hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Bot header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/10">
                      {bot.image_url ? (
                        <img
                          src={bot.image_url}
                          alt={bot.name}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      ) : (
                        <Icon size={26} className="text-primary-300" />
                      )}
                    </div>
                  </div>
                  <Badge variant={status.variant}>
                    {StatusIcon && <StatusIcon size={12} />}
                    {status.label}
                  </Badge>
                </div>

                {/* Bot info */}
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {bot.name}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-5 min-h-[40px]">
                  {bot.description}
                </p>

                {/* Maintenance notice */}
                {bot.status === "maintenance" && (
                  <div className="mb-4 rounded-xl border border-warning-500/20 bg-warning-500/5 px-4 py-2.5">
                    <p className="text-xs text-warning-400 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      Este bot se encuentra actualmente en mantenimiento.
                    </p>
                  </div>
                )}
                {bot.status === "offline" && (
                  <div className="mb-4 rounded-xl border border-error-500/20 bg-error-500/5 px-4 py-2.5">
                    <p className="text-xs text-error-400 flex items-center gap-2">
                      <XCircle size={14} />
                      Este bot está fuera de servicio.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={isDisabled ? undefined : bot.invite_url}
                    target={isDisabled ? undefined : "_blank"}
                    rel={isDisabled ? undefined : "noopener noreferrer"}
                    className="flex-1"
                    onClick={() => !isDisabled && trackClick(bot.id)}
                  >
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full"
                      disabled={isDisabled}
                    >
                      <ExternalLink size={14} />
                      Invitar
                    </Button>
                  </a>
                  <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      <Crown size={14} />
                      Premium
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedBot(bot)}
                  >
                    <Info size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {visibleBots.length === 0 && (
          <div className="text-center py-16">
            <Bot size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500">No hay bots disponibles en este momento.</p>
          </div>
        )}
      </div>

      {/* Bot info modal */}
      <Modal
        open={!!selectedBot}
        onClose={() => setSelectedBot(null)}
        title={selectedBot?.name}
        size="md"
      >
        {selectedBot && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/10">
                {(() => {
                  const Icon = getBotIcon(selectedBot.slug);
                  return <Icon size={30} className="text-primary-300" />;
                })()}
              </div>
              <div>
                <Badge variant={statusConfig[selectedBot.status].variant}>
                  {statusConfig[selectedBot.status].label}
                </Badge>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">{selectedBot.description}</p>

            {selectedBot.premium_description && (
              <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4">
                <h4 className="text-sm font-semibold text-primary-300 mb-1.5">
                  Funciones Premium
                </h4>
                <p className="text-sm text-gray-400">
                  {selectedBot.premium_description}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <a
                href={selectedBot.status === "offline" ? undefined : selectedBot.invite_url}
                target={selectedBot.status === "offline" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex-1"
                onClick={() => selectedBot.status !== "offline" && trackClick(selectedBot.id)}
              >
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={selectedBot.status === "offline"}
                >
                  <ExternalLink size={16} />
                  Invitar {selectedBot.name}
                </Button>
              </a>
              <Button variant="ghost" onClick={() => setSelectedBot(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
