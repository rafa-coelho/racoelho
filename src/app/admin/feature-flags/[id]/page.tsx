"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate, pbDelete } from "@/lib/pocketbase";
import { Check, Trash2 } from "lucide-react";

export default function EditFeatureFlagPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [key, setKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [description, setDescription] = useState("");
  const [metadata, setMetadata] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("feature_flags", id);
        if (!mounted) return;
        setKey(rec.key || "");
        setEnabled(rec.enabled || false);
        setDescription(rec.description || "");
        setMetadata(JSON.stringify(rec.metadata || {}, null, 2));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    try {
      let parsedMetadata = {};
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch {
        alert('Metadata deve ser um JSON válido');
        setSaving(false);
        return;
      }

      await pbUpdate("feature_flags", id, {
        key,
        enabled,
        metadata: parsedMetadata,
        description
      });
      window.location.href = "/admin/feature-flags";
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta feature flag?')) return;
    
    try {
      await pbDelete("feature_flags", id);
      window.location.href = "/admin/feature-flags";
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message);
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
        <h1 className="text-2xl font-semibold mb-6">Editar Feature Flag</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Chave *</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
              value={key}
              onChange={e => setKey(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Descrição</label>
            <input 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
              value={description}
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-white/10">
            <div>
              <div className="font-medium">Status</div>
              <div className="text-sm text-muted-foreground">Habilitar/desabilitar esta feature</div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-14 h-7 rounded-full transition-colors flex items-center ${
                enabled ? 'bg-green-500' : 'bg-gray-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${enabled ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Metadata (JSON)</label>
            <textarea 
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none h-32 font-mono text-xs" 
              value={metadata}
              onChange={e => setMetadata(e.target.value)} 
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 flex items-center gap-2"
            >
              <Trash2 size={18} /> Deletar
            </button>
            <div className="flex gap-2 flex-1">
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
    </div>
  );
}

