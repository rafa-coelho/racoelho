"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import { Check } from "lucide-react";

export default function EditLinkItemPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("link");
  const [icon, setIcon] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("link_items", id);
        if (!mounted) return;
        setTitle(rec.title || "");
        setUrl(rec.url || "");
        setDescription(rec.description || "");
        setType(rec.type || "link");
        setIcon(rec.icon || "");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    try {
      const data: any = {
        title,
        url,
        description,
        type,
        icon
      };

      if (image) {
        data.image = image;
      }

      await pbUpdate("link_items", id, data);
      window.location.href = "/admin/links";
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-10">
      <div>Carregando...</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="card-modern p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Editar Link</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
              value={title}
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">URL *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={url}
              onChange={e => setUrl(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Descrição</label>
            <textarea 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none h-24" 
              value={description}
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Tipo</label>
              <select 
                className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="link">Link</option>
                <option value="highlight">Destaque</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Ícone</label>
              <input 
                className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                value={icon}
                onChange={e => setIcon(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Nova Imagem (opcional)</label>
            <input 
              className="w-full text-sm" 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files?.[0] || null)} 
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button onClick={() => history.back()} className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">
              Cancelar
            </button>
            <button onClick={onSave} disabled={saving} className="flex-1 px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? "Salvando..." : "Salvar"} <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

