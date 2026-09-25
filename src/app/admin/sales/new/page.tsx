"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { slugify } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";

export default function NewSalesPage() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("draft");
    const [blocks, setBlocks] = useState('[]');
    const [ctaText, setCtaText] = useState("");
    const [ctaUrl, setCtaUrl] = useState("");
    const [paymentUrl, setPaymentUrl] = useState("");
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        setSaving(true);
        try {
            const data: any = {
                title,
                slug: slug || slugify(title),
                status,
                blocks: JSON.parse(blocks),
                ctaText,
                ctaUrl,
                paymentUrl
            };

            await pbCreate("sales_pages", data);
            window.location.href = "/admin/sales";
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
                <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Nova Página de Venda</h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Título *</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={title}
                            onChange={e => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Slug *</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={slug}
                            onChange={e => setSlug(slugify(e.target.value))} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Status</label>
                        <select className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">CTA Texto</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={ctaText}
                            onChange={e => setCtaText(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">CTA URL</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={ctaUrl}
                            onChange={e => setCtaUrl(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Payment URL</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={paymentUrl}
                            onChange={e => setPaymentUrl(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Blocks (JSON)</label>
                        <textarea 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-32 font-mono !text-[12.5px]" 
                            value={blocks}
                            onChange={e => setBlocks(e.target.value)} 
                        />
                    </div>

                    <div className="flex gap-3 pt-5 border-t border-rc-border">
                        <button onClick={() => history.back()} className="flex-1 min-h-[44px] rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14px] font-medium text-rc-ink transition-colors duration-150 hover:border-rc-border-hover">
                            Cancelar
                        </button>
                        <button onClick={onSave} disabled={saving} className="flex-1 min-h-[44px] rounded-[10px] bg-rc-blue px-5 text-[14.5px] font-semibold text-white shadow-rc-primary transition-colors duration-150 hover:bg-rc-blue-hover flex items-center justify-center gap-2 disabled:opacity-60">
                            {saving ? "Salvando..." : "Salvar"} <Check size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

