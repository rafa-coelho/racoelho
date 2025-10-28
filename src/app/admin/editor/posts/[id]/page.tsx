"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { pbGetById, pbUpdate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { calculateReadingTime, slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

type Step = 'metadata' | 'content';

export default function EditPostPage() {
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
  const [loading, setLoading] = useState(true);
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const readingTime = useMemo(() => calculateReadingTime(content || ""), [content]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const rec = await pbGetById("posts", id);
        if (!mounted) return;
        setTitle(rec.title || "");
        setSlug(rec.slug || "");
        setExcerpt(rec.excerpt || "");
        setContent(rec.content || "");
        setStatus(rec.status || "draft");
        setDate(rec.date || new Date().toISOString().split('T')[0]);
        setTags(Array.isArray(rec.tags) ? rec.tags.join(', ') : '');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    try {
      const rt = readingTime;
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const postData: any = {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        status,
        date,
        tags: tagsArray,
        readingTime: rt
      };

      if (cover) {
        postData.coverImage = cover;
      }

      await pbUpdate("posts", id, postData);
      
      window.location.href = "/admin/editor/posts";
    } catch (error: any) {
      console.error('Error updating post:', error);
      alert('Erro ao atualizar post: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const canProceedMetadata = title.trim().length > 0 && slug.trim().length > 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mx-auto mb-4 text-primary" style={{ width: 48, height: 48 }}>⏳</div>
        <p className="text-muted-foreground">Carregando post...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header fixo com ações */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/70 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary/60 to-primary/20" />
            <div>
              <div className="text-sm text-muted-foreground">Editor - Etapa {step === 'metadata' ? '1' : '2'} de 2</div>
              <h1 className="text-xl font-semibold">
                {step === 'metadata' ? 'Informações do Post' : 'Conteúdo do Post'}
              </h1>
            </div>
          </div>
          {step === 'content' && (
            <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">{readingTime} min</span>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-1 rounded-full ${step === 'metadata' ? 'bg-primary' : 'bg-primary/30'}`} />
          <div className={`flex-1 h-1 rounded-full ${step === 'content' ? 'bg-primary' : 'bg-white/10'}`} />
        </div>
      </div>

      {/* Form principal baseado na etapa */}
      <div className="mt-6">
        {step === 'metadata' ? (
          <div className="card-modern p-8 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
                <input 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                  placeholder="Ex: Como funciona a Internet"
                  value={title}
                  onChange={e => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} 
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
                <p className="text-xs text-muted-foreground mt-1">URL: /posts/{slug || 'seu-slug'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Resumo (opcional)</label>
                <textarea 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none" 
                  placeholder="Breve descrição do post..."
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Capa (opcional)</label>
                  <input 
                    className="w-full text-sm" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setCover(e.target.files?.[0] || null)} 
                  />
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

      {/* Footer fixo com ações */}
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
                  {saving ? "Salvando..." : "Salvar Post"} <Check size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
