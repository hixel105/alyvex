import { Crown, Sparkles, Zap, Shield, Settings, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PremiumSectionProps {
  title: string;
  description: string;
  premiumUrl: string;
}

const features = [
  {
    icon: Sparkles,
    title: "Funciones exclusivas",
    description: "Accede a herramientas y comandos disponibles solo para usuarios Premium.",
  },
  {
    icon: Zap,
    title: "Límites superiores",
    description: "Disfruta de límites elevados en todos nuestros bots para un mejor rendimiento.",
  },
  {
    icon: Settings,
    title: "Configuraciones avanzadas",
    description: "Personaliza y configura los bots con opciones avanzadas de gestión.",
  },
  {
    icon: Shield,
    title: "Beneficios especiales",
    description: "Recibe beneficios únicos y ventajas exclusivas en toda la comunidad.",
  },
  {
    icon: Headphones,
    title: "Soporte prioritario",
    description: "Obtén atención preferente y respuestas rápidas del equipo de soporte.",
  },
  {
    icon: Crown,
    title: "Acceso anticipado",
    description: "Sé el primero en probar nuevas funciones antes que el resto.",
  },
];

export function PremiumSection({ title, description, premiumUrl }: PremiumSectionProps) {
  return (
    <section id="premium" className="relative py-24 px-4 overflow-hidden">
      {/* Premium glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary-900/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 mb-4">
            <Crown size={14} className="text-primary-400" />
            <span className="text-xs font-medium text-primary-300">Premium</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">{title}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400">{description}</p>
        </div>

        {/* Premium card */}
        <div className="mx-auto max-w-md mb-12">
          <div className="relative glass-strong rounded-3xl p-8 overflow-hidden group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-colors" />

            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-30" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 glow-primary">
                    <Crown size={36} className="text-white" />
                  </div>
                </div>
              </div>

              <h3 className="text-center font-display text-2xl font-bold text-white mb-2">
                Alyvex Premium
              </h3>
              <p className="text-center text-sm text-gray-400 mb-6">
                Desbloquea todo el potencial de nuestros bots
              </p>

              <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="primary" className="w-full">
                  Visitar tienda
                  <ArrowRight size={18} />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card p-6 transition-all duration-300 hover:border-primary-500/30 hover:bg-white/[0.05] animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 border border-primary-500/20 group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon size={20} className="text-primary-300" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-600 mt-8 max-w-2xl mx-auto">
          Las funciones Premium mostradas son ejemplos de ventajas planificadas.
          Consulta la tienda para ver las funciones disponibles actualmente.
        </p>
      </div>
    </section>
  );
}
