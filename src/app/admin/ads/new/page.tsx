"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { Check } from "lucide-react";

export default function NewAdPage() {
    const [position, setPosition] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [altText, setAltText] = useState("");
    const [trackingLabel, setTrackingLabel] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        if (!position || !title || !link || !image) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setSaving(true);
        try {
            const data: any = {
                position,
                title,
                link,
                altText,
                trackingLabel
            };

            if (image) {
                data.image = image;
            }

            await pbCreate("ads", data);
            window.location.href = "/admin/ads";
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="card-modern p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Novo Anúncio</h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Posição *</label>
                        <select 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="post:sidebar-left">Post: Sidebar Esquerda</option>
                            <option value="post:sidebar-right-1">Post: Sidebar Direita 1</option>
                            <option value="post:content">Post: Meio do Conteúdo</option>
                            <option value="post:sidebar-right-2">Post: Sidebar Direita 2</option>
                            <option value="challenge:sidebar-1">Challenge: Sidebar 1</option>
                            <option value="challenge:sidebar-2">Challenge: Sidebar 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40" 
                            value={title}
                            onChange={e => setTitle(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Link *</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                            placeholder="https://..."
                            value={link}
                            onChange={e => setLink(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Imagem *</label>
                        <input 
                            className="w-full text-sm" 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setImage(e.target.files?.[0] || null)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Alt Text</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                            value={altText}
                            onChange={e => setAltText(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Tracking Label</label>
                        <input 
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3" 
                            value={trackingLabel}
                            onChange={e => setTrackingLabel(e.target.value)} 
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

