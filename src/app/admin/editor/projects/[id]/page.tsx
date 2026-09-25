"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { ProjectExtraFields, projectExtraFromRecord, projectExtraToPayload, emptyProjectExtra, type ProjectExtra } from "@/components/admin/fields";

type Step = 'metadata' | 'content';

export default function EditProjectPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [step, setStep] = useState<Step>('metadata');
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState("");
  const [role, setRole] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState("");
  const [extra, setExtra] = useState<ProjectExtra>(emptyProjectExtra);
  const [loading, setLoading] = useState(true);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("projects", id);
        if (!mounted) return;
        setTitle(rec.title || "");
        setSlug(rec.slug || "");
        setExcerpt(rec.excerpt || "");
        setContent(rec.content || "");
        setStatus(rec.status || "draft");
        const dateValue = rec.date ? new Date(rec.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setDate(dateValue);
        setTags(Array.isArray(rec.tags) ? rec.tags.join(', ') : '');
        setRole(rec.role || "");
        setRepoUrl(rec.repoUrl || "");
        setLiveUrl(rec.liveUrl || "");
        setFeatured(!!rec.featured);
        setOrder(typeof rec.order === 'number' ? String(rec.order) : "");
        setExtra(projectExtraFromRecord(rec));

        if (rec.coverImage) {
          const pbUrl = process.env.NEXT_PUBLIC_PB_URL || '';
          setCoverPreview(`${pbUrl}/api/files/projects/${rec.id}/${rec.coverImage}`);
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
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      const projectData: any = {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        status,
        date,
        tags: tagsArray,
        role,
        repoUrl,
        liveUrl,
        featured,
        order: order.trim() !== "" ? Number(order) : null,
        ...projectExtraToPayload(extra),
      };

      if (cover) {
        projectData.coverImage = cover;
      }

      await pbUpdate("projects", id, projectData);

      // Invalida o cache público (fire-and-forget)
      fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: 'projects' }),
      }).catch(() => {});

      window.location.href = "/admin/editor/projects";
    } catch (error: any) {
      console.error('Error updating project:', error);
      alert('Erro ao atualizar projeto: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const canProceedMetadata = title.trim().length > 0 && slug.trim().length > 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mx-auto mb-4 text-rc-blue-link" style={{ width: 48, height: 48 }}>⏳</div>
        <p className="text-rc-ink-4">Carregando projeto...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-rc-bg border-b border-rc-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[9px] border border-rc-blue-border bg-rc-blue-chip" />
            <div>
              <div className="text-[13.5px] text-rc-ink-4">Editor - Etapa {step === 'metadata' ? '1' : '2'} de 2</div>
              <h1 className="text-[19px] font-semibold tracking-[-.018em] text-rc-ink md:text-rc-card-title">
                {step === 'metadata' ? 'Informações do Projeto' : 'Case Study (Spec & Arquitetura)'}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-1 rounded-full ${step === 'metadata' ? 'bg-rc-blue' : 'bg-rc-blue-border'}`} />
          <div className={`flex-1 h-1 rounded-full ${step === 'content' ? 'bg-rc-blue' : 'bg-rc-border'}`} />
        </div>
      </div>

      <div className="mt-6">
        {step === 'metadata' ? (
          <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Título *</label>
                <input
                  className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                  placeholder="Ex: Sistema de Agendamento"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Slug *</label>
                <input
                  className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                  placeholder="exemplo-de-slug"
                  value={slug}
                  onChange={e => setSlug(slugify(e.target.value))}
                />
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">URL: /projetos/{slug || 'seu-slug'}</p>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Resumo (opcional)</label>
                <textarea
                  className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y"
                  placeholder="O que é o projeto e qual problema ele resolve..."
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Tags (opcional)</label>
                  <input
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    placeholder="nextjs, dotnet, postgres"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                  <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">Separe por vírgula</p>
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Seu papel (opcional)</label>
                  <input
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    placeholder="Ex: Fullstack, Arquitetura & Backend"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">URL do repositório (opcional)</label>
                  <input
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                  />
                  <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">Deixe vazio se o código for privado</p>
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">URL do projeto no ar (opcional)</label>
                  <input
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    placeholder="https://..."
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Data</label>
                  <input
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Ordem (opcional)</label>
                  <input
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    type="number"
                    placeholder="0"
                    value={order}
                    onChange={e => setOrder(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Status</label>
                  <select
                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-rc-border pt-6">
                <h2 className="mb-5 font-mono text-[11.5px] uppercase tracking-[.1em] text-rc-ink-3">Vitrine</h2>
                <ProjectExtraFields value={extra} onChange={setExtra} title={title} />
              </div>

              <label className="flex min-h-[44px] items-center gap-3 cursor-pointer select-none rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] accent-rc-blue"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                />
                <span className="text-[14.5px] font-medium text-rc-ink">Marcar como destaque (aparece maior na listagem e na home)</span>
              </label>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Capa (opcional)</label>
                <div className="rounded-[12px] border border-rc-border-strong bg-rc-sunken p-4">
                  {coverPreview && !cover && (
                    <div className="mb-4">
                      <img src={coverPreview} alt="Preview" className="w-full h-48 object-cover rounded-[10px]" />
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-rc-border-hover rounded-[10px] cursor-pointer hover:bg-rc-nav-hover transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-rc-ink-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-1 text-[13.5px] text-rc-ink-3"><span className="font-semibold">Clique para upload</span> ou arraste e solte</p>
                      <p className="font-mono text-[11px] text-rc-ink-5">PNG, JPG, WEBP até 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setCover(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCoverPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8">
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">
              Case Study em Markdown — suporta diagramas Mermaid para arquitetura (```mermaid)
            </label>
            <div className="mt-3">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                layout="split"
                editorMinHeightClass="min-h-[calc(100vh-280px)]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] md:bottom-0 z-10 -mx-4 px-4 py-3 bg-rc-bg border-t border-rc-border mt-6">
        <div className="flex items-center justify-between">
          <button
            className="min-h-[44px] rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover"
            onClick={() => history.back()}
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {step === 'metadata' ? (
              <button
                className="min-h-[44px] rounded-[10px] bg-rc-blue px-5 text-[14.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => setStep('content')}
                disabled={!canProceedMetadata}
              >
                Continuar <ChevronRight size={18} />
              </button>
            ) : (
              <>
                <button
                  className="min-h-[44px] rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover flex items-center gap-2"
                  onClick={() => setStep('metadata')}
                >
                  <ChevronLeft size={18} /> Voltar
                </button>
                <button
                  className="min-h-[44px] rounded-[10px] bg-rc-blue px-5 text-[14.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onSave}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Projeto"} <Check size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
