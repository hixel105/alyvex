import { useEffect, useState } from "react";
import { Crown, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function OwnerPremium() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then((content) => {
      setTitle(content.premium_title ?? "Alyvex Premium");
      setDescription(content.premium_description ?? "");
      setUrl(content.premium_url ?? "");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      api.updateContent("premium_title", title),
      api.updateContent("premium_description", description),
      api.updateContent("premium_url", url),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Premium</h1>
        <p className="text-gray-400">Edita la informacion de la seccion Premium</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
            <Crown size={20} className="text-primary-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Informacion Premium</h3>
        </div>

        <Input
          label="Titulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          label="Descripcion"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="URL de compra"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />

        <Button onClick={handleSave} variant="primary" disabled={saving}>
          {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          {saved ? "Guardado!" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
