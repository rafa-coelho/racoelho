"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList, pbDelete } from "@/lib/pocketbase";
import { Plus, Link as LinkIcon, Trash2, Star } from "lucide-react";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: string;
};

export default function LinkItemsPage() {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const res = await pbList("link_items", { page: 1, perPage: 100, sort: "order" }); 
      setItems(res.items as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;
    
    try {
      await pbDelete("link_items", id);
      loadLinks();
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Links do Site</h1>
          <p className="text-sm text-muted-foreground">Gerenciar links da página /links</p>
        </div>
        <Link href="/admin/links/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Link
        </Link>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <LinkIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Nenhum link encontrado</p>
          <Link href="/admin/links/new" className="btn-primary mt-4 inline-flex">
            Adicionar primeiro link
          </Link>
        </div>
      ) : (
        <div className="card-modern">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Tipo</th>
                <th className="text-left p-4">Título</th>
                <th className="text-left p-4">URL</th>
                <th className="text-left p-4">Descrição</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${item.type === 'highlight' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted'}`}>
                      {item.type === 'highlight' && <Star size={12} fill="currentColor" />}
                      {item.type || 'link'}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4">
                    <a href={item.url} target="_blank" rel="noopener" className="text-primary hover:underline">
                      {item.url}
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.description || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/links/${item.id}`} className="px-3 py-1 text-sm rounded border border-white/10 hover:bg-white/5">
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

