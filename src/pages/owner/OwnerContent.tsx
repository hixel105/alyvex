import { useEffect, useState } from "react";
import { FileText, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function OwnerContent() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [botsTitle, setBotsTitle] = useState("");
  const [botsDescription, setBotsDescription] = useState("");
  const [footerTagline, setFooterTagline] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then((content) => {
      setHeroTitle(content.hero_title ?? "");
      setHeroSubtitle(content.hero_subtitle ?? "");
      setBotsTitle(content.bots_section_title ?? "");
      setBotsDescription(content.bots_section_description ?? "");
      setFooterTagline(content.footer_tagline ?? "");
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      api.updateContent("hero_title", heroTitle),
      api.updateContent("hero_subtitle", heroSubtitle),
      api.updateContent("bots_section_title", botsTitle),
      api.updateContent("bots_section_description", botsDescription),
      api.updateContent("footer_tagline", footerTagline),
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
        <h1 className="font-display text-3xl font-bold text-white mb-2">Contenido</h1>
        <p className="text-gray-400">Edita los textos de la pagina publica sin tocar codigo</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
            <FileText size={20} className="text-primary-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Textos del sitio</h3>
        </div>

        <Input label="Titulo principal (Hero)" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        <Textarea label="Subtitulo (Hero)" rows={2} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
        <Input label="Titulo seccion Bots" value={botsTitle} onChange={(e) => setBotsTitle(e.target.value)} />
        <Textarea label="Descripcion seccion Bots" rows={2} value={botsDescription} onChange={(e) => setBotsDescription(e.target.value)} />
        <Textarea label="Texto del footer" rows={2} value={footerTagline} onChange={(e) => setFooterTagline(e.target.value)} />

        <Button onClick={handleSave} variant="primary" disabled={saving}>
          {saving ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          {saved ? "Guardado!" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
