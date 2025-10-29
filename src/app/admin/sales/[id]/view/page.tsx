"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pbGetById } from "@/lib/pocketbase";
import Link from "next/link";

export default function ViewSalesPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [rec, setRec] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const r = await pbGetById("sales_pages", id);
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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="card-modern p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Visualizar Página de Venda</h1>
          <div className="flex gap-2">
            <Link href={`/admin/sales/${id}`} className="btn-primary px-3 py-1.5 text-sm">Editar</Link>
            <a href={`/venda/${rec.slug}`} target="_blank" rel="noopener" className="px-3 py-1.5 text-sm border rounded-md hover:bg-white/5">Ver público</a>
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
          <div>
            <div className="text-muted-foreground">CTA</div>
            <div>{rec.ctaText || "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Pagamento</div>
            <div className="truncate">{rec.paymentUrl || "—"}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-muted-foreground">Blocos</div>
            <pre className="whitespace-pre-wrap text-xs bg-white/5 p-3 rounded-md border border-white/10">{JSON.stringify(rec.blocks || [], null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}


