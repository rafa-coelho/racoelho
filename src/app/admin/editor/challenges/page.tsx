"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { Plus, Calendar, Code2 } from "lucide-react";

type Challenge = {
  id: string;
  title: string;
  slug: string;
  status?: string;
  date?: string;
};

export default function AdminChallengesPage() {
  const [items, setItems] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await pbList("challenges", { page: 1, perPage: 50, sort: "-date" }); 
        if (mounted) setItems(res.items as any);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Desafios</h1>
          <p className="text-sm text-muted-foreground">Gerenciar desafios de programação</p>
        </div>
        <Link href="/admin/editor/challenges/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Desafio
        </Link>
      </div>
      {loading ? (
        <div>Carregando...</div>
      ) : items.length === 0 ? (
        <div className="card-modern p-12 text-center">
          <Code2 className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Nenhum desafio encontrado</p>
          <Link href="/admin/editor/challenges/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro desafio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/admin/editor/challenges/${item.id}`} className="card-modern p-4 hover:scale-[1.02] transition-all group">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <div className={`px-2 py-1 rounded ${item.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {item.status || "draft"}
                </div>
                {item.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
              <div className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</div>
              <div className="text-xs opacity-70">/{item.slug}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

