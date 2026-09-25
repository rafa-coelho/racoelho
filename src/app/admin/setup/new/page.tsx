"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { Check } from "lucide-react";
import { SetupExtraFields, setupExtraToPayload, emptySetupExtra, type SetupExtra } from "@/components/admin/fields";

export default function NewSetupItemPage() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [price, setPrice] = useState("");
    const [extra, setExtra] = useState<SetupExtra>(emptySetupExtra);
    const [image, setImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        if (!name) {
            alert('Preencha o nome');
            return;
        }

        setSaving(true);
        try {
            const data: any = {
                name,
                category,
                description,
                url,
                price,
                ...setupExtraToPayload(extra),
            };

            if (image) {
                data.image = image;
            }

            await pbCreate("setup_items", data);
            window.location.href = "/admin/setup";
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
                <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Novo Item do Setup</h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Nome *</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={name}
                            onChange={e => setName(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Categoria</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            value={category}
                            onChange={e => setCategory(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Descrição</label>
                        <textarea 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-24" 
                            value={description}
                            onChange={e => setDescription(e.target.value)} 
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">URL</label>
                            <input 
                                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                                placeholder="https://..."
                                value={url}
                                onChange={e => setUrl(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Preço</label>
                            <input 
                                className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                                value={price}
                                onChange={e => setPrice(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Imagem</label>
                        <input 
                            className="w-full text-sm" 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setImage(e.target.files?.[0] || null)} 
                        />
                    </div>

                    <SetupExtraFields value={extra} onChange={setExtra} />

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

