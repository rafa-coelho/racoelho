"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, FolderGit2, Pencil, Calendar, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  date?: string;
};

export default function AdminProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projetos</h1>
          <p className="text-sm text-muted-foreground">Gerenciar projetos do portfólio</p>
        </div>
        <Link href="/admin/editor/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Projeto
        </Link>
      </div>

      <DataTable<ProjectRow>
        columns={[
          {
            id: "title",
            header: "Título",
            cell: (row) => (
              <div>
                <div className="font-medium flex items-center gap-2">
                  {row.title}
                  {row.featured && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                </div>
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
                <Link href={`/admin/editor/projects/${row.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href={`/projetos/${row.slug}`}
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
          const res = await pbList("projects", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as ProjectRow[],
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
              await pbBulkDelete("projects", selected.map((s) => s.id));
            },
          },
          {
            label: "Publicar",
            action: async (selected) => {
              await pbBulkUpdate("projects", selected.map((s) => s.id), { status: "published" });
            },
          },
          {
            label: "Despublicar",
            action: async (selected) => {
              await pbBulkUpdate("projects", selected.map((s) => s.id), { status: "draft" });
            },
          },
          {
            label: "Marcar destaque",
            action: async (selected) => {
              await pbBulkUpdate("projects", selected.map((s) => s.id), { featured: true });
            },
          },
          {
            label: "Remover destaque",
            action: async (selected) => {
              await pbBulkUpdate("projects", selected.map((s) => s.id), { featured: false });
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
        emptyMessage="Nenhum projeto encontrado"
        emptyAction={
          <Link href="/admin/editor/projects/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro projeto
          </Link>
        }
      />
    </div>
  );
}
