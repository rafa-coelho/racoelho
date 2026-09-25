"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { pbList, pbCreate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { calculateReadingTime, slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckboxField } from "@/components/admin/fields";
import ImageUpload from "@/components/admin/ImageUpload";

type Step = 'metadata' | 'content';

export default function NewPostPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState<Step>('metadata');
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState<File | null>(null);
    const [status, setStatus] = useState("draft");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState("");
    const [keywords, setKeywords] = useState("");
    const [featured, setFeatured] = useState(false);
    const [saving, setSaving] = useState(false);

    const readingTime = useMemo(() => calculateReadingTime(content || ""), [content]);

    const onSave = async () => {
        setSaving(true);
        try {
            const rt = readingTime;
            const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            
            // Prepare data object
            const postData: any = {
                title,
                slug: slug || slugify(title),
                excerpt,
                content,
                status,
                date,
                tags: tagsArray,
                keywords,
                featured,
                readingTime: rt
            };

            // If there's a cover image, we need to append it as a file
            if (cover) {
                postData.coverImage = cover;
            }

            // Use the SDK to create the post
            await pbCreate("posts", postData);
            
            toast({
                title: "Sucesso",
                description: "Post criado com sucesso",
            });
            router.push("/admin/editor/posts");
        } catch (error: any) {
            console.error('Error saving post:', error);
            toast({
                title: "Erro ao salvar",
                description: error.message || "Ocorreu um erro ao criar o post",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const canProceedMetadata = title.trim().length > 0 && slug.trim().length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header fixo com ações */}
            <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-rc-bg border-b border-rc-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-[9px] border border-rc-blue-border bg-rc-blue-chip" />
                        <div>
                            <div className="text-[13.5px] text-rc-ink-4">Editor - Etapa {step === 'metadata' ? '1' : '2'} de 2</div>
                            <h1 className="text-[19px] font-semibold tracking-[-.018em] text-rc-ink md:text-rc-card-title">
                                {step === 'metadata' ? 'Informações do Post' : 'Conteúdo do Post'}
                            </h1>
                        </div>
                    </div>
                    {step === 'content' && (
                        <span className="inline-flex min-h-[32px] items-center rounded-[8px] border border-rc-border-strong bg-rc-surface-3 px-2.5 font-mono text-[12px] text-rc-ink-3">{readingTime} min</span>
                    )}
                </div>
                
                {/* Progress bar */}
                <div className="flex items-center gap-2 mt-4">
                    <div className={`flex-1 h-1 rounded-full ${step === 'metadata' ? 'bg-rc-blue' : 'bg-rc-blue-border'}`} />
                    <div className={`flex-1 h-1 rounded-full ${step === 'content' ? 'bg-rc-blue' : 'bg-rc-border'}`} />
                </div>
            </div>

            {/* Form principal baseado na etapa */}
            <div className="mt-6">
                {step === 'metadata' ? (
                    <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Título *</label>
                                <input 
                                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                                    placeholder="Ex: Como funciona a Internet"
                                    value={title}
                                    onChange={e => { 
                                        setTitle(e.target.value); 
                                        if (!slugManuallyEdited) {
                                            setSlug(slugify(e.target.value));
                                        }
                                    }} 
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Slug *</label>
                                <input 
                                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                                    placeholder="exemplo-de-slug"
                                    value={slug}
                                    onChange={e => {
                                        const value = e.target.value;
                                        // Permite traços, letras, números. Remove apenas espaços (substitui por traços) e caracteres especiais
                                        const newSlug = value
                                            .toLowerCase()
                                            .replace(/\s+/g, '-')      // Substitui espaços por traços
                                            .replace(/[^\w-]/g, '');   // Remove tudo exceto letras, números e traços
                                        setSlug(newSlug);
                                        // Se limpar o slug, volta a seguir o título
                                        setSlugManuallyEdited(newSlug.length > 0);
                                    }} 
                                />
                                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">URL: /posts/{slug || 'seu-slug'}</p>
                            </div>

                            <div>
                                <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Resumo (opcional)</label>
                                <textarea 
                                    className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y" 
                                    placeholder="Breve descrição do post..."
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
                                    placeholder="programação, dev, desenvolvimento"
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

                            <CheckboxField
                              label="Destaque"
                              hint="O mais recente marcado aparece como cartão grande no topo de /posts."
                              checked={featured}
                              onChange={setFeatured}
                            />

                            <ImageUpload 
                                image={cover}
                                setImage={setCover}
                                collection="posts"
                            />
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

            {/* Footer fixo com ações */}
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


