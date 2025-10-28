"use client";
import { useEffect, useState } from "react";
import { pbList } from "@/lib/pocketbase";

type Post = {
  id: string;
  title: string;
  slug: string;
  status?: string;
  date?: string;
};

export default function AdminPostsPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await pbList("posts", { page: 1, perPage: 50, sort: "-date" });
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
        <h1 className="text-2xl font-semibold">Posts</h1>
        <a href="/admin/editor/posts/new" className="btn btn-primary">Novo Post</a>
      </div>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <a key={p.id} href={`/admin/editor/posts/${p.id}`} className="card-modern p-4">
              <div className="text-sm text-muted-foreground">{p.status || "draft"}</div>
              <div className="font-medium text-lg">{p.title}</div>
              <div className="text-xs opacity-70">/{p.slug}</div>
              {p.date && <div className="text-xs mt-2">{new Date(p.date).toLocaleDateString("pt-BR")}</div>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}


