"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import { Check } from "lucide-react";

export default function EditSocialLinkPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("social_links", id);
        if (!mounted) return;
        setName(rec.name || "");
        setUrl(rec.url || "");
        setIcon(rec.icon || "");
        setOrder(rec.order || 0);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    try {
      await pbUpdate("social_links", id, { name, url, icon, order });
      window.location.href = "/admin/social";
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
        <h1 className="text-2xl font-semibold mb-6">Editar Link Social</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Nome *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
              value={name}
              onChange={e => setName(e.target.value)} 
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
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Ícone</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={icon}
              onChange={e => setIcon(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Ordem</label>
            <input 
              type="number"
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={order}
              onChange={e => setOrder(Number(e.target.value))} 
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

