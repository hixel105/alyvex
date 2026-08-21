import { useEffect, useState } from "react";
import { Megaphone, Plus, Pencil, Trash2, Save, X, Power } from "lucide-react";
import { api } from "@/lib/api";
import type { Announcement } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/Toast";
import { announcementSchema, type AnnouncementFormValues } from "@/lib/validation";

const empty: AnnouncementFormValues = {
  title: "",
  message: "",
  priority: 0,
  is_active: true,
};

export function OwnerAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementFormValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.getAnnouncements().then(setAnnouncements).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, message: a.message, priority: a.priority, is_active: a.is_active });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      announcementSchema.parse(form);
      setSaving(true);
      if (editing) {
        await api.updateAnnouncement(editing.id, form);
      } else {
        await api.createAnnouncement(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      if (err instanceof Error && "issues" in err) {
        const fe: Record<string, string> = {};
        (err as unknown as { issues: { path: string[]; message: string }[] }).issues.forEach((i) => {
          fe[i.path[0]] = i.message;
        });
        setErrors(fe);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este anuncio?")) return;
    await api.deleteAnnouncement(id);
    load();
  };

  const toggleActive = async (a: Announcement) => {
    await api.updateAnnouncement(a.id, { is_active: !a.is_active });
    load();
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
          <h1 className="font-display text-3xl font-bold text-white mb-2">Anuncios</h1>
          <p className="text-gray-400">Crea y administra los anuncios de la pagina principal</p>
        </div>
        <Button onClick={openCreate} variant="primary">
          <Plus size={18} />
          Crear anuncio
        </Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState icon={<Megaphone size={40} />} title="No hay anuncios" description="Crea el primer anuncio para la comunidad" />
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div key={a.id} className="glass-card p-5 rounded-2xl animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-semibold text-white">{a.title}</h3>
                    <Badge variant={a.is_active ? "active" : "default"}>
                      {a.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    <Badge variant="default">Prioridad: {a.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-400">{a.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(a)}>
                    <Power size={14} />
                    {a.is_active ? "Desactivar" : "Activar"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>
                    <Pencil size={14} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(a.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar anuncio" : "Crear anuncio"} size="md">
        <div className="space-y-4">
          <Input label="Titulo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} />
          <Textarea label="Mensaje" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} />
          <Input label="Prioridad (0-10)" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} error={errors.priority} />
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
