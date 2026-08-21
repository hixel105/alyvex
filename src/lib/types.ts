export type BotStatus = "active" | "maintenance" | "offline";

export interface Bot {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  invite_url: string;
  status: BotStatus;
  premium_description: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  hero_title?: string;
  hero_subtitle?: string;
  premium_title?: string;
  premium_description?: string;
  premium_url?: string;
  discord_url?: string;
  discord_title?: string;
  discord_description?: string;
  footer_tagline?: string;
  bots_section_title?: string;
  bots_section_description?: string;
  [key: string]: unknown;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  maintenance_mode: boolean;
  maintenance_message: string;
  updated_at: string;
}

export interface OwnerLog {
  id: string;
  action: string;
  detail: string | null;
  result: string;
  created_at: string;
}

export interface Stats {
  bots_published: number;
  total_clicks: number;
  active_announcements: number;
  clicks_by_type: { type: string; count: number }[];
  clicks_by_bot: { bot_name: string; count: number }[];
}
