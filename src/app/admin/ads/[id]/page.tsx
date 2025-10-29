"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import { Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditAdPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [position, setPosition] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [altText, setAltText] = useState("");
  const [trackingLabel, setTrackingLabel] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("ads", id);
        if (!mounted) return;
        setPosition(rec.position || "");
        setTitle(rec.title || "");
        setLink(rec.link || "");
        setAltText(rec.altText || "");
        setTrackingLabel(rec.trackingLabel || "");
        
        // Carregar preview da imagem existente
        if (rec.image) {
          const pbUrl = process.env.NEXT_PUBLIC_PB_URL || '';
          setExistingImageUrl(`${pbUrl}/api/files/ads/${rec.id}/${rec.image}`);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSave = async () => {
    if (!position || !title || !link) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const data: any = {
        position,
        title,
        link,
        altText,
        trackingLabel
      };

      if (image) {
        data.image = image;
      }

      await pbUpdate("ads", id, data);
      window.location.href = "/admin/ads";
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
        <h1 className="text-2xl font-semibold mb-6">Editar Anúncio</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Posição *</label>
            <select 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
              value={position}
              onChange={e => setPosition(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="post:sidebar-left">Post: Sidebar Esquerda</option>
              <option value="post:sidebar-right-1">Post: Sidebar Direita 1</option>
              <option value="post:content">Post: Meio do Conteúdo</option>
              <option value="post:sidebar-right-2">Post: Sidebar Direita 2</option>
              <option value="challenge:sidebar-1">Challenge: Sidebar 1</option>
              <option value="challenge:sidebar-2">Challenge: Sidebar 2</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
              value={title}
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Link *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={link}
              onChange={e => setLink(e.target.value)} 
            />
          </div>

          <ImageUpload 
            image={image}
            setImage={setImage}
            existingImageUrl={existingImageUrl}
            collection="ads"
            recordId={id}
          />

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Alt Text</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={altText}
              onChange={e => setAltText(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Tracking Label</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={trackingLabel}
              onChange={e => setTrackingLabel(e.target.value)} 
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

