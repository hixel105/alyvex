import { MessageSquare, Users, ArrowRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DiscordSectionProps {
  title: string;
  description: string;
  discordUrl: string;
}

export function DiscordSection({ title, description, discordUrl }: DiscordSectionProps) {
  return (
    <section id="discord" className="relative py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="relative glass-strong rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary-500 blur-2xl opacity-30" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-secondary-500 to-primary-500 glow-secondary">
                  <MessageSquare size={36} className="text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                {title}
              </h2>
              <p className="text-gray-400 mb-6 max-w-xl">{description}</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary">
                    <Users size={18} />
                    Unirse a Discord
                  </Button>
                </a>
                <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="ghost">
                    <LifeBuoy size={18} />
                    Servidor de soporte
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
