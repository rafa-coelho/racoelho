"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Code2, Pencil, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type Challenge = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
  date?: string;
};

export default function AdminChallengesPage() {
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

      <DataTable<Challenge>
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
              <Link href={`/admin/editor/challenges/${row.id}`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("challenges", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as Challenge[],
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
              await pbBulkDelete("challenges", selected.map((s) => s.id));
            },
          },
          {
            label: "Publicar",
            action: async (selected) => {
              await pbBulkUpdate("challenges", selected.map((s) => s.id), { status: "published" });
            },
          },
          {
            label: "Despublicar",
            action: async (selected) => {
              await pbBulkUpdate("challenges", selected.map((s) => s.id), { status: "draft" });
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
        emptyMessage="Nenhum desafio encontrado"
        emptyAction={
          <Link href="/admin/editor/challenges/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro desafio
          </Link>
        }
      />
    </div>
  );
}

