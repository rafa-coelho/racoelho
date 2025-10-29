"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList, pbDelete } from "@/lib/pocketbase";
import { Plus, Share2, Trash2 } from "lucide-react";

type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
};

export default function SocialLinksPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const res = await pbList("social_links", { page: 1, perPage: 100, sort: "order" }); 
      setItems(res.items as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;
    
    try {
      await pbDelete("social_links", id);
      loadLinks();
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Links Sociais</h1>
          <p className="text-sm text-muted-foreground">Gerenciar links sociais do footer</p>
        </div>
        <Link href="/admin/social/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Link
        </Link>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Share2 className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Nenhum link social encontrado</p>
          <Link href="/admin/social/new" className="btn-primary mt-4 inline-flex">
            Adicionar primeiro link
          </Link>
        </div>
      ) : (
        <div className="card-modern">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Nome</th>
                <th className="text-left p-4">URL</th>
                <th className="text-left p-4">Ícone</th>
                <th className="text-right p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">
                    <a href={item.url} target="_blank" rel="noopener" className="text-primary hover:underline">
                      {item.url}
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.icon || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/social/${item.id}`} className="px-3 py-1 text-sm rounded border border-white/10 hover:bg-white/5">
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

