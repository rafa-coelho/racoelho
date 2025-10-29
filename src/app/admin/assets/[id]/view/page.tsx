"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById } from "@/lib/pocketbase";
import Link from "next/link";

export default function ViewAssetPackPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [rec, setRec] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const r = await pbGetById("asset_packs", id);
        if (!mounted) return;
        setRec(r);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-10">Carregando...</div>;
  if (!rec) return <div className="container mx-auto px-4 py-10">Não encontrado.</div>;

  const files: string[] = Array.isArray(rec.files) ? rec.files : (rec.files ? [rec.files] : []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="card-modern p-6 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Visualizar Asset Pack</h1>
          <div className="flex gap-2">
            <Link href={`/admin/assets/${id}`} className="btn-primary px-3 py-1.5 text-sm">Editar</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Título</div>
            <div className="font-medium">{rec.title}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Slug</div>
            <div className="font-mono">{rec.slug}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-muted-foreground">Descrição</div>
            <div>{rec.description || "—"}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Arquivos</div>
          {files.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum arquivo</div>
          ) : (
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f} className="flex items-center justify-between border border-white/10 rounded-md px-3 py-2">
                  <span className="text-sm truncate mr-3">{f}</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`/api/assets-proxy/${rec.slug}/${encodeURIComponent(f)}`}
                      target="_blank"
                      rel="noopener"
                      className="text-primary hover:underline text-sm"
                    >
                      Abrir
                    </a>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5"
                      onClick={async () => {
                        const url = `${window.location.origin}/api/assets-proxy/${rec.slug}/${encodeURIComponent(f)}`;
                        try {
                          await navigator.clipboard.writeText(url);
                        } catch {}
                      }}
                      title="Copiar link"
                    >
                      Copiar link
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


