import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Bot, Save, X } from "lucide-react";
import { api } from "@/lib/api";
import type { Bot as BotType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Toast";
import { botSchema, type BotFormValues } from "@/lib/validation";

const emptyBot: BotFormValues = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  invite_url: "",
  status: "active",
  premium_description: "",
  sort_order: 0,
  is_visible: true,
};

export function OwnerBots() {
  const [bots, setBots] = useState<BotType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<BotType | null>(null);
  const [form, setForm] = useState<BotFormValues>(emptyBot);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const loadBots = () => {
    api.getBots().then(setBots).finally(() => setLoading(false));
  };

  useEffect(() => { loadBots(); }, []);

  const openCreate = () => {
    setEditingBot(null);
    setForm(emptyBot);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (bot: BotType) => {
    setEditingBot(bot);
    setForm({
      name: bot.name,
      slug: bot.slug,
      description: bot.description,
      image_url: bot.image_url ?? "",
      invite_url: bot.invite_url,
      status: bot.status,
      premium_description: bot.premium_description ?? "",
      sort_order: bot.sort_order,
      is_visible: bot.is_visible,
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const validated = botSchema.parse(form);
      setSaving(true);
      if (editingBot) {
        await api.updateBot(editingBot.id, validated);
      } else {
        await api.createBot(validated);
      }
      setModalOpen(false);
      loadBots();
    } catch (err) {
      if (err instanceof Error && "issues" in err) {
        const fieldErrors: Record<string, string> = {};
        (err as unknown as { issues: { path: string[]; message: string }[] }).issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ invite_url: err instanceof Error ? err.message : "Error al guardar" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este bot?")) return;
    await api.deleteBot(id);
    loadBots();
  };

  const toggleVisibility = async (bot: BotType) => {
    await api.updateBot(bot.id, { is_visible: !bot.is_visible });
    loadBots();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Bots</h1>
          <p className="text-gray-400">Crea, edita y administra los bots de la comunidad</p>
        </div>
        <Button onClick={openCreate} variant="primary">
          <Plus size={18} />
          Crear bot
        </Button>
      </div>

      {bots.length === 0 ? (
        <EmptyState icon={<Bot size={40} />} title="No hay bots" description="Crea el primer bot para la comunidad" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bots.map((bot, i) => (
            <div key={bot.id} className="glass-card p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/10">
                    {bot.image_url ? (
                      <img src={bot.image_url} alt={bot.name} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <Bot size={22} className="text-primary-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white">{bot.name}</h3>
                    <Badge variant={bot.status === "active" ? "active" : bot.status === "maintenance" ? "maintenance" : "offline"}>
                      {bot.status === "active" ? "Activo" : bot.status === "maintenance" ? "Mantenimiento" : "Offline"}
                    </Badge>
                  </div>
                </div>
                {!bot.is_visible && (
                  <Badge variant="default">
                    <EyeOff size={12} />
                    Oculto
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{bot.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(bot)}>
                  <Pencil size={14} />
                  Editar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleVisibility(bot)}>
                  {bot.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}
                  {bot.is_visible ? "Ocultar" : "Mostrar"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(bot.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBot ? "Editar bot" : "Crear bot"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              error={errors.slug}
            />
          </div>
          <Textarea
            label="Descripcion"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={errors.description}
          />
          <Input
            label="URL de imagen (opcional)"
            value={form.image_url ?? ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            error={errors.image_url}
            placeholder="https://..."
          />
          <Input
            label="URL de invitacion"
            value={form.invite_url}
            onChange={(e) => setForm({ ...form, invite_url: e.target.value })}
            error={errors.invite_url}
            placeholder="https://discord.com/oauth2/authorize?..."
          />
          <Textarea
            label="Descripcion Premium (opcional)"
            rows={2}
            value={form.premium_description ?? ""}
            onChange={(e) => setForm({ ...form, premium_description: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Estado"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as BotFormValues["status"] })}
            >
              <option value="active">Activo</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="offline">Fuera de servicio</option>
            </Select>
            <Input
              label="Orden"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              error={errors.sort_order}
            />
            <Select
              label="Visible"
              value={form.is_visible ? "true" : "false"}
              onChange={(e) => setForm({ ...form, is_visible: e.target.value === "true" })}
            >
              <option value="true">Si</option>
              <option value="false">No</option>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} variant="primary" disabled={saving}>
              {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Guardar
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="ghost">
              <X size={16} />
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
