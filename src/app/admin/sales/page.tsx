"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList, pbDelete } from "@/lib/pocketbase";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";

type SalesPage = {
  id: string;
  title: string;
  slug: string;
  status?: string;
};

export default function SalesPagesPage() {
  const [items, setItems] = useState<SalesPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const res = await pbList("sales_pages", { page: 1, perPage: 50 }); 
      setItems(res.items as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta página?')) return;
    
    try {
      await pbDelete("sales_pages", id);
      loadPages();
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Páginas de Venda</h1>
          <p className="text-sm text-muted-foreground">Gerenciar páginas de vendas</p>
        </div>
        <Link href="/admin/sales/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nova Página
        </Link>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <ShoppingCart className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Nenhuma página encontrada</p>
          <Link href="/admin/sales/new" className="btn-primary mt-4 inline-flex">
            Criar primeira página
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card-modern p-4 hover:scale-[1.02] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded ${item.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {item.status || "draft"}
                </span>
              </div>
              <div className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</div>
              <div className="text-xs opacity-70 mb-4">/{item.slug}</div>
              <div className="flex gap-2 mt-4">
                <Link href={`/admin/sales/${item.id}`} className="flex-1 px-3 py-1 text-sm text-center rounded border border-white/10 hover:bg-white/5">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-sm rounded border border-red-500/30 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

