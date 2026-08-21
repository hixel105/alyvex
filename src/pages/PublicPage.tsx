import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Bot, SiteContent, Announcement, SiteSettings } from "@/lib/types";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { BotsSection } from "@/components/public/BotsSection";
import { PremiumSection } from "@/components/public/PremiumSection";
import { DiscordSection } from "@/components/public/DiscordSection";
import { Footer } from "@/components/public/Footer";
import { MaintenanceBanner } from "@/components/public/MaintenanceBanner";
import { AnnouncementBanner } from "@/components/public/AnnouncementBanner";
import { OwnerPanelSection } from "@/components/public/OwnerPanelSection";

const defaultContent: Required<Pick<SiteContent, "hero_title" | "hero_subtitle" | "premium_title" | "premium_description" | "premium_url" | "discord_url" | "discord_title" | "discord_description" | "footer_tagline" | "bots_section_title" | "bots_section_description">> = {
  hero_title: "Alyvex Community",
  hero_subtitle: "Una comunidad creada para ofrecer bots, herramientas y servicios modernos para Discord.",
  premium_title: "Alyvex Premium",
  premium_description: "Obtén funciones Premium para nuestros bots y disfruta de una experiencia mejorada.",
  premium_url: "https://alyvex.tip4serv.com/",
  discord_url: "https://discord.gg/9yGwxX9CRW",
  discord_title: "Unete a nuestra comunidad de Discord",
  discord_description: "Conectate con nuestra comunidad, obten soporte y mantente al dia con todas las novedades.",
  footer_tagline: "Una comunidad para bots, herramientas y servicios de Discord.",
  bots_section_title: "Nuestros Bots",
  bots_section_description: "Descubre los bots que Alyvex Community ofrece para mejorar tu servidor de Discord.",
};

export function PublicPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [content, setContent] = useState<SiteContent>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: botsData }, { data: contentData }, { data: announceData }, { data: settingsData }] =
        await Promise.all([
          supabase.from("bots").select("*").order("sort_order", { ascending: true }),
          supabase.from("site_content").select("*"),
          supabase.from("announcements").select("*").eq("is_active", true).order("priority", { ascending: false }),
          supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        ]);

      setBots(botsData ?? []);
      const contentObj: SiteContent = {};
      for (const row of contentData ?? []) {
        contentObj[row.key] = row.value;
      }
      setContent(contentObj);
      setAnnouncements(announceData ?? []);
      setSettings(settingsData);
      setLoading(false);
    }
    load();
  }, []);

  const c = { ...defaultContent, ...content };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-30 animate-glow-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 animate-pulse">
            <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {settings?.maintenance_mode && (
        <MaintenanceBanner message={settings.maintenance_message} />
      )}
      <AnnouncementBanner announcements={announcements} />
      <Navbar discordUrl={c.discord_url} />
      <main>
        <Hero
          title={c.hero_title}
          subtitle={c.hero_subtitle}
          discordUrl={c.discord_url}
          premiumUrl={c.premium_url}
        />
        <BotsSection
          bots={bots}
          title={c.bots_section_title}
          description={c.bots_section_description}
          premiumUrl={c.premium_url}
        />
        <PremiumSection
          title={c.premium_title}
          description={c.premium_description}
          premiumUrl={c.premium_url}
        />
        <DiscordSection
          title={c.discord_title}
          description={c.discord_description}
          discordUrl={c.discord_url}
        />
      </main>
      <OwnerPanelSection />
      <Footer
        tagline={c.footer_tagline}
        discordUrl={c.discord_url}
        premiumUrl={c.premium_url}
      />
    </div>
  );
}
