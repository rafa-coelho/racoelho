"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { calculateReadingTime, slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

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
  const [difficulty, setDifficulty] = useState("medium");
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
        setDifficulty(rec.difficulty || "medium");
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
        difficulty,
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
        <div className="animate-spin mx-auto mb-4 text-primary" style={{ width: 48, height: 48 }}>⏳</div>
        <p className="text-muted-foreground">Carregando desafio...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/70 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary/60 to-primary/20" />
            <div>
              <div className="text-sm text-muted-foreground">Editor - Etapa {step === 'metadata' ? '1' : '2'} de 2</div>
              <h1 className="text-xl font-semibold">
                {step === 'metadata' ? 'Informações do Desafio' : 'Conteúdo do Desafio'}
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-1 rounded-full ${step === 'metadata' ? 'bg-primary' : 'bg-primary/30'}`} />
          <div className={`flex-1 h-1 rounded-full ${step === 'content' ? 'bg-primary' : 'bg-white/10'}`} />
        </div>
      </div>

      <div className="mt-6">
        {step === 'metadata' ? (
          <div className="card-modern p-8 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
                <input 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                  placeholder="Ex: Criar um TODO List"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Slug *</label>
                <input 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                  placeholder="exemplo-de-slug"
                  value={slug}
                  onChange={e => setSlug(slugify(e.target.value))} 
                />
                <p className="text-xs text-muted-foreground mt-1">URL: /listas/desafios/{slug || 'seu-slug'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Resumo (opcional)</label>
                <textarea 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none" 
                  placeholder="Breve descrição do desafio..."
                  rows={3}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Tags (opcional)</label>
                <input 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                  placeholder="javascript, typescript, react"
                  value={tags}
                  onChange={e => setTags(e.target.value)} 
                />
                <p className="text-xs text-muted-foreground mt-1">Separe as tags por vírgula</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Keywords (opcional)</label>
                <input 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                  placeholder="desafios, programação, portfolio"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)} 
                />
                <p className="text-xs text-muted-foreground mt-1">Palavras-chave para SEO</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Dificuldade</label>
                  <select 
                    className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                    value={difficulty} 
                    onChange={e => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Data</label>
                  <input 
                    className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                  <select 
                    className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Capa (opcional)</label>
                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                  {coverPreview && !cover && (
                    <div className="mb-4">
                      <img src={coverPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para upload</span> ou arraste e solte</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 10MB</p>
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
          <div className="card-modern p-8">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">Conteúdo (Markdown)</label>
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

      <div className="sticky bottom-0 z-10 -mx-4 px-4 py-4 bg-background/70 backdrop-blur-xl border-t border-white/5 mt-6">
        <div className="flex items-center justify-between">
          <button 
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
            onClick={() => history.back()}
          >
            Cancelar
          </button>
          
          <div className="flex items-center gap-2">
            {step === 'metadata' ? (
              <button 
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={() => setStep('content')} 
                disabled={!canProceedMetadata}
              >
                Continuar <ChevronRight size={18} />
              </button>
            ) : (
              <>
                <button 
                  className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm font-medium" 
                  onClick={() => setStep('metadata')}
                >
                  <ChevronLeft size={18} /> Voltar
                </button>
                <button 
                  className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
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

