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
      <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
        <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Editar Link Social</h1>
        
        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Nome *</label>
            <input 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
              value={name}
              onChange={e => setName(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">URL *</label>
            <input 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
              value={url}
              onChange={e => setUrl(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Ícone</label>
            <input 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
              value={icon}
              onChange={e => setIcon(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Ordem</label>
            <input 
              type="number"
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
              value={order}
              onChange={e => setOrder(Number(e.target.value))} 
            />
          </div>

          <div className="flex gap-3 pt-5 border-t border-rc-border">
            <button onClick={() => history.back()} className="flex-1 min-h-[44px] rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover">
              Cancelar
            </button>
            <button onClick={onSave} disabled={saving} className="flex-1 min-h-[44px] rounded-[10px] bg-rc-blue px-5 text-[14.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"} <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

