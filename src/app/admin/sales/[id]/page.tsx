"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import { slugify } from "@/lib/utils";
import { Check } from "lucide-react";

export default function EditSalesPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [blocks, setBlocks] = useState('[]');
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("sales_pages", id);
        if (!mounted) return;
        setTitle(rec.title || "");
        setSlug(rec.slug || "");
        setStatus(rec.status || "draft");
        setBlocks(JSON.stringify(rec.blocks || [], null, 2));
        setCtaText(rec.ctaText || "");
        setCtaUrl(rec.ctaUrl || "");
        setPaymentUrl(rec.paymentUrl || "");
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
        slug: slug || slugify(title),
        status,
        blocks: JSON.parse(blocks),
        ctaText,
        ctaUrl,
        paymentUrl
      };

      await pbUpdate("sales_pages", id, data);
      window.location.href = "/admin/sales";
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
        <h1 className="text-2xl font-semibold mb-6">Editar Página de Venda</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
              value={title}
              onChange={e => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Slug *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={slug}
              onChange={e => setSlug(slugify(e.target.value))} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
            <select className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">CTA Texto</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={ctaText}
              onChange={e => setCtaText(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">CTA URL</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={ctaUrl}
              onChange={e => setCtaUrl(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Payment URL</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={paymentUrl}
              onChange={e => setPaymentUrl(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Blocks (JSON)</label>
            <textarea 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none h-48 font-mono text-xs" 
              value={blocks}
              onChange={e => setBlocks(e.target.value)} 
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

