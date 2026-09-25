"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import { Check } from "lucide-react";
import { SetupExtraFields, setupExtraFromRecord, setupExtraToPayload, emptySetupExtra, type SetupExtra } from "@/components/admin/fields";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditSetupItemPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [extra, setExtra] = useState<SetupExtra>(emptySetupExtra);
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("setup_items", id);
        if (!mounted) return;
        setName(rec.name || "");
        setCategory(rec.category || "");
        setDescription(rec.description || "");
        setUrl(rec.url || "");
        setPrice(rec.price || "");
        setExtra(setupExtraFromRecord(rec));
        
        // Carregar preview da imagem existente
        if (rec.image) {
          const pbUrl = process.env.NEXT_PUBLIC_PB_URL || '';
          setExistingImageUrl(`${pbUrl}/api/files/setup_items/${rec.id}/${rec.image}`);
        }
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
        name,
        category,
        description,
        url,
        price,
        ...setupExtraToPayload(extra),
      };

      if (image) {
        data.image = image;
      }

      await pbUpdate("setup_items", id, data);
      window.location.href = "/admin/setup";
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
        <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Editar Item do Setup</h1>
        
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
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Categoria</label>
            <input 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
              value={category}
              onChange={e => setCategory(e.target.value)} 
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Descrição</label>
            <textarea 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-24" 
              value={description}
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">URL</label>
              <input 
                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                value={url}
                onChange={e => setUrl(e.target.value)} 
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Preço</label>
              <input 
                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                value={price}
                onChange={e => setPrice(e.target.value)} 
              />
            </div>
          </div>

          <ImageUpload 
            image={image}
            setImage={setImage}
            existingImageUrl={existingImageUrl}
            collection="setup_items"
            recordId={id}
          />

          <SetupExtraFields value={extra} onChange={setExtra} />

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

