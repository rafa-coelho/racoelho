"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { Check } from "lucide-react";

export default function NewSocialLinkPage() {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [icon, setIcon] = useState("");
    const [order, setOrder] = useState(0);
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        if (!name || !url) {
            alert('Preencha nome e URL');
            return;
        }

        setSaving(true);
        try {
            await pbCreate("social_links", { name, url, icon, order });
            window.location.href = "/admin/social";
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="card-modern p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Novo Link Social</h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Nome *</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                            value={name}
                            onChange={e => setName(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">URL *</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                            placeholder="https://..."
                            value={url}
                            onChange={e => setUrl(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Ícone</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                            placeholder="Nome do ícone (Lucide icons)"
                            value={icon}
                            onChange={e => setIcon(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Ordem</label>
                        <input 
                            type="number"
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                            value={order}
                            onChange={e => setOrder(Number(e.target.value))} 
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <button onClick={() => history.back()} className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">
                            Cancelar
                        </button>
                        <button onClick={onSave} disabled={saving} className="flex-1 px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {saving ? "Salvando..." : "Salvar"} <Check size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

