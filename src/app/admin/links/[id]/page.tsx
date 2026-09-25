"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import { Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditLinkItemPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("link");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);
  const [visible, setVisible] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
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
        setOrder(typeof rec.order === 'number' ? rec.order : 0);
        setVisible(rec.visible !== false);

        // Carregar preview da imagem existente
        if (rec.image) {
          const pbUrl = process.env.NEXT_PUBLIC_PB_URL || '';
          setExistingImageUrl(`${pbUrl}/api/files/link_items/${rec.id}/${rec.image}`);
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
        title,
        url,
        description,
        type,
        icon,
        order,
        visible
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
      <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
        <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Editar Link</h1>
        
        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Título *</label>
            <input 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
              value={title}
              onChange={e => setTitle(e.target.value)} 
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
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Descrição</label>
            <textarea 
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-24" 
              value={description}
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Tipo</label>
              <select 
                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="link">Link</option>
                <option value="highlight">Destaque</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Ícone</label>
              <input
                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                value={icon}
                onChange={e => setIcon(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Ordem</label>
              <input
                type="number"
                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Visibilidade</div>
              <label className="flex min-h-[46px] items-center gap-3 px-3.5 py-2.5 rounded-[10px] bg-rc-input border border-rc-border-strong cursor-pointer text-rc-ink">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={e => setVisible(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{visible ? "Visível na página /links" : "Oculto"}</span>
              </label>
            </div>
          </div>

          <ImageUpload
            image={image}
            setImage={setImage}
            existingImageUrl={existingImageUrl}
            collection="link_items"
            recordId={id}
          />

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

