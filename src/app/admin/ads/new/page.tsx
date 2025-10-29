"use client";
import { useState } from "react";
import { pbCreate } from "@/lib/pocketbase";
import { Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NewAdPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<'draft' | 'active' | 'paused' | 'archived'>('draft');
    const [targets, setTargets] = useState<string[]>([]);
    const [priority, setPriority] = useState<number>(0);
    const [startAt, setStartAt] = useState<string>("");
    const [endAt, setEndAt] = useState<string>("");
    const [clickUrl, setClickUrl] = useState("");
    const [utmSource, setUtmSource] = useState("");
    const [utmCampaign, setUtmCampaign] = useState("");
    const [utmMedium, setUtmMedium] = useState("");
    const [creativeLeaderboard, setCreativeLeaderboard] = useState<File | null>(null);
    const [creativeRectangle, setCreativeRectangle] = useState<File | null>(null);
    const [creativeSkyscraper, setCreativeSkyscraper] = useState<File | null>(null);
    const [creativeSquare, setCreativeSquare] = useState<File | null>(null);
    const [creativeMobileBanner, setCreativeMobileBanner] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        if (!title || !clickUrl || targets.length === 0) {
            toast({
                title: "Campos obrigatórios",
                description: "Preencha todos os campos obrigatórios",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        try {
            const data: any = {
                title,
                status,
                targets,
                priority,
                startAt: startAt || null,
                endAt: endAt || null,
                clickUrl,
                utmSource,
                utmCampaign,
                utmMedium,
            };

            if (creativeLeaderboard) data.creative_leaderboard = creativeLeaderboard;
            if (creativeRectangle) data.creative_rectangle = creativeRectangle;
            if (creativeSkyscraper) data.creative_skyscraper = creativeSkyscraper;
            if (creativeSquare) data.creative_square = creativeSquare;
            if (creativeMobileBanner) data.creative_mobile_banner = creativeMobileBanner;

            await pbCreate("ads", data);
            toast({
                title: "Sucesso",
                description: "Anúncio criado com sucesso",
            });
            router.push("/admin/ads");
        } catch (error: any) {
            toast({
                title: "Erro ao salvar",
                description: error.message || "Ocorreu um erro ao criar o anúncio",
                variant: "destructive",
            });
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
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Título *</label>
                        <input
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Status *</label>
                        <select
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
                            value={status}
                            onChange={e => setStatus(e.target.value as any)}
                        >
                            <option value="draft">Rascunho</option>
                            <option value="active">Ativo</option>
                            <option value="paused">Pausado</option>
                            <option value="archived">Arquivado</option>
                        </select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-muted-foreground mb-3 block">Targets *</Label>
                        <div className="flex gap-6">
                            {['posts', 'challenges'].map(t => (
                                <div key={t} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`target-${t}`}
                                        checked={targets.includes(t)}
                                        onCheckedChange={(checked) => {
                                            setTargets(prev => checked ? [...prev, t] : prev.filter(x => x !== t));
                                        }}
                                    />
                                    <Label
                                        htmlFor={`target-${t}`}
                                        className="text-sm font-normal cursor-pointer capitalize"
                                    >
                                        {t}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Prioridade</label>
                        <input
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
                            type="number"
                            value={priority}
                            onChange={e => setPriority(parseInt(e.target.value || '0', 10))}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Janela de veiculação</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input className="rounded-md bg-white/5 border border-white/10 px-4 py-3" type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} />
                            <input className="rounded-md bg-white/5 border border-white/10 px-4 py-3" type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">URL de Clique *</label>
                        <input
                            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3"
                            placeholder="https://..."
                            value={clickUrl}
                            onChange={e => setClickUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">UTM (opcional)</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input className="rounded-md bg-white/5 border border-white/10 px-4 py-3" placeholder="utm_source" value={utmSource} onChange={e => setUtmSource(e.target.value)} />
                            <input className="rounded-md bg-white/5 border border-white/10 px-4 py-3" placeholder="utm_campaign" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} />
                            <input className="rounded-md bg-white/5 border border-white/10 px-4 py-3" placeholder="utm_medium" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-4">Criativos (upload um ou mais formatos)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Leaderboard (728x90 / 970x90)</h4>
                                    <ImageUpload
                                        image={creativeLeaderboard}
                                        setImage={setCreativeLeaderboard}
                                        collection="ads"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Rectangle (300x250 / 336x280)</h4>
                                    <ImageUpload
                                        image={creativeRectangle}
                                        setImage={setCreativeRectangle}
                                        collection="ads"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Skyscraper (160x600 / 300x600)</h4>
                                    <ImageUpload
                                        image={creativeSkyscraper}
                                        setImage={setCreativeSkyscraper}
                                        collection="ads"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Square (200x200 / 250x250)</h4>
                                    <ImageUpload
                                        image={creativeSquare}
                                        setImage={setCreativeSquare}
                                        collection="ads"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Mobile Banner (320x50 / 320x100)</h4>
                                    <ImageUpload
                                        image={creativeMobileBanner}
                                        setImage={setCreativeMobileBanner}
                                        collection="ads"
                                    />
                                </div>
                            </div>
                        </div>
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

