"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList, pbUpdate } from "@/lib/pocketbase";
import { ToggleLeft, Save, Loader, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  metadata?: any;
};

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [changedFlags, setChangedFlags] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const res = await pbList("feature_flags", { page: 1, perPage: 50 });
      setFlags(res.items as any);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    setChangedFlags(new Set(changedFlags).add(id));
  };

  const saveAll = async () => {
    if (changedFlags.size === 0) return;

    setSaving("all");
    try {
      const updates = flags.filter(f => changedFlags.has(f.id)).map(flag => ({
        id: flag.id,
        enabled: flag.enabled
      }));

      await Promise.all(updates.map(u => pbUpdate("feature_flags", u.id, { enabled: u.enabled })));
      
      setChangedFlags(new Set());
      alert('Feature flags salvas com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center">
          <Loader className="animate-spin text-primary" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Feature Flags</h1>
          <p className="text-sm text-muted-foreground">Controle de funcionalidades do site</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/feature-flags/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Nova Flag
          </Link>
          {changedFlags.size > 0 && (
            <button
              onClick={saveAll}
              disabled={saving === "all"}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving === "all" ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              Salvar ({changedFlags.size})
            </button>
          )}
        </div>
      </div>

      <div className="card-modern p-6">
        <div className="space-y-4">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium mb-1">{flag.key}</div>
                {flag.metadata?.description && (
                  <div className="text-sm text-muted-foreground">{flag.metadata.description}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/feature-flags/${flag.id}`}
                  className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <Settings size={16} /> Editar
                </Link>
                <button
                  onClick={() => toggleFlag(flag.id)}
                  disabled={!!saving}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50",
                    flag.enabled
                      ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  )}
                >
                  <ToggleLeft size={24} className={flag.enabled ? "fill-green-500" : ""} />
                  {flag.enabled ? "Ativo" : "Inativo"}
                </button>
              </div>
            </div>
          ))}

          {flags.length === 0 && (
            <div className="text-center py-12">
              <ToggleLeft className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">Nenhuma feature flag encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

