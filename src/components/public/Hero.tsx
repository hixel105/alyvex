import { Sparkles, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  title: string;
  subtitle: string;
  discordUrl: string;
  premiumUrl: string;
}

export function Hero({ title, subtitle, discordUrl, premiumUrl }: HeroProps) {
  const scrollToBots = () => {
    const el = document.querySelector("#bots");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPremium = () => {
    const el = document.querySelector("#premium");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-radial-glow animate-glow-pulse" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/5 px-4 py-1.5 mb-8 animate-fade-in-down">
          <Sparkles size={14} className="text-primary-400" />
          <span className="text-xs font-medium text-primary-300">
            Comunidad tecnológica de Discord
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight animate-fade-in-up">
          <span className="text-gradient">{title}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed animate-fade-in-up animate-delay-200">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
          <Button size="lg" variant="secondary" onClick={scrollToBots} className="w-full sm:w-auto">
            Ver Bots
          </Button>
          <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full">
              <Zap size={18} />
              Servidor de Discord
            </Button>
          </a>
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              Comprar Premium
            </Button>
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex items-center justify-center gap-8 sm:gap-16 animate-fade-in animate-delay-500">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-white">3</div>
            <div className="text-xs text-gray-500 mt-1">Bots activos</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-white">24/7</div>
            <div className="text-xs text-gray-500 mt-1">Soporte</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-white">Premium</div>
            <div className="text-xs text-gray-500 mt-1">Funciones extra</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToBots}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white transition-colors animate-bounce-slow"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
