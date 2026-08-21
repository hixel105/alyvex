import { Zap, MessageSquare, Crown, LifeBuoy, FileText, Shield } from "lucide-react";

interface FooterProps {
  tagline: string;
  discordUrl: string;
  premiumUrl: string;
}

export function Footer({ tagline, discordUrl, premiumUrl }: FooterProps) {
  const links = [
    { label: "Inicio", href: "#hero", icon: Zap },
    { label: "Bots", href: "#bots", icon: MessageSquare },
    { label: "Premium", href: premiumUrl, external: true, icon: Crown },
    { label: "Soporte", href: discordUrl, external: true, icon: LifeBuoy },
    { label: "Panel Owner", href: "/owner/login", internal: true, icon: Shield },
    { label: "Términos", href: "#", icon: FileText },
    { label: "Privacidad", href: "#", icon: Shield },
  ];

  return (
    <footer className="relative border-t border-white/10 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Alyvex Community
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Enlaces</h4>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => {
                if (link.internal) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <link.icon size={14} className="text-gray-600" />
                      {link.label}
                    </a>
                  );
                }
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <link.icon size={14} className="text-gray-600" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Comunidad</h4>
            <div className="flex gap-3">
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl glass hover:bg-secondary-500/20 hover:border-secondary-500/30 transition-all duration-300 hover:scale-110"
              >
                <MessageSquare size={18} className="text-gray-300" />
              </a>
              <a
                href={premiumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl glass hover:bg-primary-500/20 hover:border-primary-500/30 transition-all duration-300 hover:scale-110"
              >
                <Crown size={18} className="text-gray-300" />
              </a>
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl glass hover:bg-success-500/20 hover:border-success-500/30 transition-all duration-300 hover:scale-110"
              >
                <LifeBuoy size={18} className="text-gray-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            (c) {new Date().getFullYear()} Alyvex Community. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-600">
            Hecho con tecnologia para la comunidad de Discord
          </p>
        </div>
      </div>
    </footer>
  );
}
