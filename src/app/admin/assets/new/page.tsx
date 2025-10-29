"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { Check } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";

export default function NewAssetPackPage() {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [metadata, setMetadata] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!slug || !title) {
      alert("Preencha o slug e título");
      return;
    }

    setSaving(true);
    try {
      const data: any = {
        slug,
        title,
        description: description || undefined,
        status,
      };

      // Parse metadata JSON se fornecido
      if (metadata.trim()) {
        try {
          data.metadata = JSON.parse(metadata);
        } catch (e) {
          alert("Metadata JSON inválido");
          setSaving(false);
          return;
        }
      }

      // Adicionar arquivos se houver
      if (files.length > 0) {
        // Pocketbase aceita array de File para múltiplos arquivos
        data.files = files.length === 1 ? files[0] : files;
      }

      await pbCreate("asset_packs", data);
      window.location.href = "/admin/assets";
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="card-modern p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Novo Asset Pack</h1>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Slug *
            </label>
            <input
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="melhorando-linkedin"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Título *
            </label>
            <input
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Descrição
            </label>
            <textarea
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Status
            </label>
            <select
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Metadata (JSON)
            </label>
            <textarea
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none h-32 font-mono text-sm"
              placeholder='{"type": "ebook"}'
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              JSON opcional para dados extras (ex: tipo de asset)
            </p>
          </div>

          <FileUpload
            files={files}
            setFiles={setFiles}
            collection="asset_packs"
            accept="*"
            maxFiles={10}
          />

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => history.back()}
              className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"} <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

