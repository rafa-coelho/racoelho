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
      <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
        <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Novo Asset Pack</h1>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">
              Slug *
            </label>
            <input
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
              placeholder="melhorando-linkedin"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">
              Título *
            </label>
            <input
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">
              Descrição
            </label>
            <textarea
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">
              Status
            </label>
            <select
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">
              Metadata (JSON)
            </label>
            <textarea
              className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-32 font-mono !text-[13.5px]"
              placeholder='{"type": "ebook"}'
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
            />
            <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">
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

          <div className="flex gap-3 pt-5 border-t border-rc-border">
            <button
              onClick={() => history.back()}
              className="flex-1 min-h-[44px] rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 min-h-[44px] rounded-[10px] bg-rc-blue px-5 text-[14.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"} <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

