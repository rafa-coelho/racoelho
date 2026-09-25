"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import MarkdownEditor from "@/components/MarkdownEditor";
import { slugify } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { ProjectExtraFields, projectExtraToPayload, emptyProjectExtra, type ProjectExtra } from "@/components/admin/fields";
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
    const [extra, setExtra] = useState<ProjectExtra>(emptyProjectExtra);
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
                ...projectExtraToPayload(extra),
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
                                        const newSlug = value
                                            .toLowerCase()
                                            .replace(/\s+/g, '-')
                                            .replace(/[^\w-]/g, '');
                                        setSlug(newSlug);
                                        setSlugManuallyEdited(newSlug.length > 0);
                                    }}
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

                            <ImageUpload
                                image={cover}
                                setImage={setCover}
                                collection="projects"
                            />
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
