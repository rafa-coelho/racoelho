"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { Check } from "lucide-react";

export default function NewFeatureFlagPage() {
    const [key, setKey] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [description, setDescription] = useState("");
    const [metadata, setMetadata] = useState('{}');
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        if (!key) {
            alert('Preencha a chave');
            return;
        }

        setSaving(true);
        try {
            let parsedMetadata = {};
            try {
                parsedMetadata = JSON.parse(metadata);
            } catch {
                alert('Metadata deve ser um JSON válido');
                setSaving(false);
                return;
            }

            await pbCreate("feature_flags", {
                key,
                enabled,
                metadata: parsedMetadata,
                description
            });
            window.location.href = "/admin/feature-flags";
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-5 md:p-8 max-w-3xl mx-auto">
                <h1 className="mb-6 text-[24px] font-semibold tracking-[-.02em] text-rc-ink md:text-[28px]">Nova Feature Flag</h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Chave *</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            placeholder="ex: share, newsletter, ads"
                            value={key}
                            onChange={e => setKey(e.target.value)} 
                        />
                        <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">Ex: share, newsletter, ads</p>
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Descrição</label>
                        <input 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link" 
                            placeholder="Descrição da feature flag"
                            value={description}
                            onChange={e => setDescription(e.target.value)} 
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-[12px] border border-rc-border-strong bg-rc-sunken">
                        <div>
                            <div className="font-medium text-rc-ink">Status</div>
                            <div className="text-[13.5px] text-rc-ink-4">Habilitar/desabilitar esta feature</div>
                        </div>
                        <button
                            onClick={() => setEnabled(!enabled)}
                            aria-label="Alternar status" className={`w-14 h-7 rounded-full transition-colors flex items-center ${
                                enabled ? 'bg-rc-green' : 'bg-rc-border-strong'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${enabled ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div>
                        <label className="mb-2 block font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Metadata (JSON)</label>
                        <textarea 
                            className="w-full min-h-[46px] rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 py-2.5 text-[15px] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link resize-y h-32 font-mono !text-[12.5px]" 
                            value={metadata}
                            onChange={e => setMetadata(e.target.value)} 
                        />
                        <p className="mt-1.5 text-[12.5px] leading-[1.5] text-rc-ink-5">Ex: {"{"}"networks": ["threads", "x"], "provider": "google"{"}"}</p>
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

