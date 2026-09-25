"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { calculateReadingTime, slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { ChallengeExtraFields, challengeExtraFromRecord, challengeExtraToPayload, emptyChallengeExtra, type ChallengeExtra } from "@/components/admin/fields";

type Step = 'metadata' | 'content';

export default function EditChallengePage() {
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
  const [keywords, setKeywords] = useState("");
  const [extra, setExtra] = useState<ChallengeExtra>(emptyChallengeExtra);
  const [loading, setLoading] = useState(true);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const readingTime = useMemo(() => calculateReadingTime(content || ""), [content]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("challenges", id);
        if (!mounted) return;
        setTitle(rec.title || "");
        setSlug(rec.slug || "");
        setExcerpt(rec.excerpt || "");
        setContent(rec.content || "");
        setStatus(rec.status || "draft");
        // Formatar data corretamente
        const dateValue = rec.date ? new Date(rec.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setDate(dateValue);
        setExtra(challengeExtraFromRecord(rec));
        setTags(Array.isArray(rec.tags) ? rec.tags.join(', ') : '');
        setKeywords(rec.keywords || '');
        
        // Carregar preview da imagem existente
        if (rec.coverImage) {
          const pbUrl = process.env.NEXT_PUBLIC_PB_URL || '';
          setCoverPreview(`${pbUrl}/api/files/challenges/${rec.id}/${rec.coverImage}`);
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
      
      const challengeData: any = {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        status,
        date,
        tags: tagsArray,
        keywords,
        ...challengeExtraToPayload(extra),
        readingTime: readingTime
      };

      if (cover) {
        challengeData.coverImage = cover;
      }

      await pbUpdate("challenges", id, challengeData);
      window.location.href = "/admin/editor/challenges";
    } catch (error: any) {
      console.error('Error updating challenge:', error);
      alert('Erro ao atualizar desafio: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const canProceedMetadata = title.trim().length > 0 && slug.trim().length > 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mx-auto mb-4 text-rc-blue-link" style={{ width: 48, height: 48 }}>⏳</div>
        <p className="text-rc-ink-4">Carregando desafio...</p>
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
                {step === 'metadata' ? 'Informações do Desafio' : 'Conteúdo do Desafio'}
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
                  placeholder="Ex: Criar um TODO List"
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
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">URL: /listas/desafios/{slug || 'seu-slug'}</p>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Resumo (opcional)</label>
                <textarea 
                  className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y" 
                  placeholder="Breve descrição do desafio..."
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)} 
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Tags (opcional)</label>
                <input 
                  className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                  placeholder="javascript, typescript, react"
                  value={tags}
                  onChange={e => setTags(e.target.value)} 
                />
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">Separe as tags por vírgula</p>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Keywords (opcional)</label>
                <input 
                  className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                  placeholder="desafios, programação, portfolio"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)} 
                />
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">Palavras-chave para SEO</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                <h2 className="mb-5 font-mono text-[11.5px] uppercase tracking-[.1em] text-rc-ink-3">Trilha</h2>
                <ChallengeExtraFields value={extra} onChange={setExtra} />
              </div>

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
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Conteúdo (Markdown)</label>
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
                  {saving ? "Salvando..." : "Salvar Desafio"} <Check size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

