"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type Step = 'metadata' | 'content';

export default function NewProjectPage() {
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
    const [role, setRole] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [liveUrl, setLiveUrl] = useState("");
    const [featured, setFeatured] = useState(false);
    const [order, setOrder] = useState("");
    const [saving, setSaving] = useState(false);

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
            };

            if (order.trim() !== "") {
                projectData.order = Number(order);
            }

            if (cover) {
                projectData.coverImage = cover;
            }

            await pbCreate("projects", projectData);

            // Invalida o cache público (fire-and-forget)
            fetch('/api/cache/invalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: 'projects' }),
            }).catch(() => {});

            window.location.href = "/admin/editor/projects";
        } catch (error: any) {
            console.error('Error saving project:', error);
            alert('Erro ao salvar projeto: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const canProceedMetadata = title.trim().length > 0 && slug.trim().length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/70 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary/60 to-primary/20" />
                        <div>
                            <div className="text-sm text-muted-foreground">Editor - Etapa {step === 'metadata' ? '1' : '2'} de 2</div>
                            <h1 className="text-xl font-semibold">
                                {step === 'metadata' ? 'Informações do Projeto' : 'Case Study (Spec & Arquitetura)'}
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
                                    placeholder="Ex: Sistema de Agendamento"
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
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Slug *</label>
                                <input
                                    className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
                                    placeholder="exemplo-de-slug"
                                    value={slug}
                                    onChange={e => {
                                        const value = e.target.value;
                                        const newSlug = value
                                            .toLowerCase()
                                            .replace(/\s+/g, '-')
                                            .replace(/[^\w-]/g, '');
                                        setSlug(newSlug);
                                        setSlugManuallyEdited(newSlug.length > 0);
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-1">URL: /projetos/{slug || 'seu-slug'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Resumo (opcional)</label>
                                <textarea
                                    className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                                    placeholder="O que é o projeto e qual problema ele resolve..."
                                    rows={3}
                                    value={excerpt}
                                    onChange={e => setExcerpt(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Stack / Tags (opcional)</label>
                                    <input
                                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                                        placeholder="nextjs, dotnet, postgres"
                                        value={tags}
                                        onChange={e => setTags(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Separe por vírgula</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Seu papel (opcional)</label>
                                    <input
                                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                                        placeholder="Ex: Fullstack, Arquitetura & Backend"
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">URL do repositório (opcional)</label>
                                    <input
                                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                                        placeholder="https://github.com/..."
                                        value={repoUrl}
                                        onChange={e => setRepoUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Deixe vazio se o código for privado</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">URL do projeto no ar (opcional)</label>
                                    <input
                                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                                        placeholder="https://..."
                                        value={liveUrl}
                                        onChange={e => setLiveUrl(e.target.value)}
                                    />
                                </div>
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
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Ordem (opcional)</label>
                                    <input
                                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                                        type="number"
                                        placeholder="0"
                                        value={order}
                                        onChange={e => setOrder(e.target.value)}
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

                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary"
                                    checked={featured}
                                    onChange={e => setFeatured(e.target.checked)}
                                />
                                <span className="text-sm font-medium">Marcar como destaque (aparece maior na listagem e na home)</span>
                            </label>

                            <ImageUpload
                                image={cover}
                                setImage={setCover}
                                collection="projects"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="card-modern p-8">
                        <label className="text-sm font-medium text-muted-foreground mb-3 block">
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
