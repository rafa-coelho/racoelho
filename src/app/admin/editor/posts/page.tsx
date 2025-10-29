"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, FileText, Pencil, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
  date?: string;
};

export default function AdminPostsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-muted-foreground">Gerenciar artigos do blog</p>
        </div>
        <Link href="/admin/editor/posts/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Post
        </Link>
      </div>

      <DataTable<Post>
        columns={[
          {
            id: "title",
            header: "Título",
            cell: (row) => (
              <div>
                <div className="font-medium">{row.title}</div>
                <div className="text-xs text-muted-foreground">/{row.slug}</div>
              </div>
            ),
            sortable: true,
          },
          {
            id: "status",
            header: "Status",
            cell: (row) => (
              <Badge variant={row.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                {row.status || 'draft'}
              </Badge>
            ),
            sortable: true,
          },
          {
            id: "date",
            header: "Data",
            cell: (row) => (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {row.date ? formatDate(row.date) : '-'}
              </div>
            ),
            sortable: true,
          },
          {
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <div className="flex items-center gap-1">
                <Link href={`/admin/editor/posts/${row.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/editor/posts/${row.id}/view`}>
                  <Button variant="ghost" size="sm" title="Ver">
                    <FileText className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href={`/posts/${row.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex ml-1"
                  title="Ver"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("posts", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as Post[],
            page: res.page,
            perPage: res.perPage,
            totalItems: res.totalItems,
            totalPages: res.totalPages,
          };
        }}
        bulkActions={[
          {
            label: "Excluir selecionados",
            variant: "destructive",
            action: async (selected) => {
              await pbBulkDelete("posts", selected.map((s) => s.id));
            },
          },
          {
            label: "Publicar",
            action: async (selected) => {
              await pbBulkUpdate("posts", selected.map((s) => s.id), { status: "published" });
            },
          },
          {
            label: "Despublicar",
            action: async (selected) => {
              await pbBulkUpdate("posts", selected.map((s) => s.id), { status: "draft" });
            },
          },
        ]}
        defaultSort="-date"
        filtersSchema={{
          q: {
            placeholder: "Buscar por título ou slug...",
            searchFields: ["title", "slug"],
          },
          status: {
            placeholder: "Status",
            options: [
              { label: "Rascunho", value: "draft" },
              { label: "Publicado", value: "published" },
            ],
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhum post encontrado"
        emptyAction={
          <Link href="/admin/editor/posts/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro post
          </Link>
        }
      />
    </div>
  );
}


