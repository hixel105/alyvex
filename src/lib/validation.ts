import { z } from "zod";

export const botSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  image_url: z.string().url("URL de imagen inválida").or(z.literal("")).nullable(),
  invite_url: z.string().url("URL de invitación inválida"),
  status: z.enum(["active", "maintenance", "offline"]),
  premium_description: z.string().nullable(),
  sort_order: z.number().int().min(0),
  is_visible: z.boolean(),
});

export const announcementSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  message: z.string().min(1, "El mensaje es requerido"),
  priority: z.number().int().min(0).max(10),
  is_active: z.boolean(),
});

export const loginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
});

export type BotFormValues = z.infer<typeof botSchema>;
export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
