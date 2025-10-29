"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList, pbDelete } from "@/lib/pocketbase";
import { Plus, Image, Trash2 } from "lucide-react";

type Ad = {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  targets: string[];
  priority?: number;
  clickUrl: string;
};

export default function AdsPage() {
  const [items, setItems] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const res = await pbList("ads", { page: 1, perPage: 100 }); 
      setItems(res.items as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este anúncio?')) return;
    
    try {
      await pbDelete("ads", id);
      loadAds();
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Anúncios</h1>
          <p className="text-sm text-muted-foreground">Gerenciar banners publicitários</p>
        </div>
        <Link href="/admin/ads/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Anúncio
        </Link>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Image className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Nenhum anúncio encontrado</p>
          <Link href="/admin/ads/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro anúncio
          </Link>
        </div>
      ) : (
        <div className="card-modern">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Título</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Targets</th>
                <th className="text-left p-4">Prioridade</th>
                <th className="text-left p-4">Link</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">{item.title}</td>
                  <td className="p-4 capitalize">{item.status}</td>
                  <td className="p-4">{Array.isArray(item.targets) ? item.targets.join(', ') : ''}</td>
                  <td className="p-4">{item.priority ?? 0}</td>
                  <td className="p-4">
                    <a href={item.clickUrl} target="_blank" rel="noopener" className="text-primary hover:underline">
                      {item.clickUrl}
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/ads/${item.id}`} className="px-3 py-1 text-sm rounded border border-white/10 hover:bg-white/5">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-sm rounded border border-red-500/30 text-red-500 hover:bg-red-500/10 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

