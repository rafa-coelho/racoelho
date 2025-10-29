"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList, pbDelete } from "@/lib/pocketbase";
import { Plus, Settings, Trash2 } from "lucide-react";

type SetupItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  price: string;
};

export default function SetupItemsPage() {
  const [items, setItems] = useState<SetupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await pbList("setup_items", { page: 1, perPage: 100 }); 
      setItems(res.items as any);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;
    
    try {
      await pbDelete("setup_items", id);
      loadItems();
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Itens do Setup</h1>
          <p className="text-sm text-muted-foreground">Gerenciar itens da página /setup</p>
        </div>
        <Link href="/admin/setup/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Item
        </Link>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Settings className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Nenhum item encontrado</p>
          <Link href="/admin/setup/new" className="btn-primary mt-4 inline-flex">
            Adicionar primeiro item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card-modern p-4 hover:scale-[1.02] transition-all group">
              <div className="text-xs text-muted-foreground mb-2">{item.category}</div>
              <div className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">{item.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{item.description}</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-medium">{item.price}</div>
                <div className="flex gap-2">
                  <Link href={`/admin/setup/${item.id}`} className="px-3 py-1 text-sm rounded border border-white/10 hover:bg-white/5">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

