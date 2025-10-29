"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Link as LinkIcon, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: 'link' | 'highlight';
};

export default function LinkItemsPage() {
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

      <DataTable<LinkItem>
        columns={[
          {
            id: "type",
            header: "Tipo",
            cell: (row) => (
              <Badge variant={row.type === 'highlight' ? 'default' : 'outline'} className="inline-flex items-center gap-1">
                {row.type === 'highlight' && <Star size={12} fill="currentColor" />}
                {row.type === 'highlight' ? 'Destaque' : 'Link'}
              </Badge>
            ),
            sortable: true,
          },
          {
            id: "title",
            header: "Título",
            cell: (row) => <div className="font-medium">{row.title}</div>,
            sortable: true,
          },
          {
            id: "url",
            header: "URL",
            cell: (row) => (
              <a href={row.url} target="_blank" rel="noopener" className="text-primary hover:underline text-sm truncate max-w-xs block">
                {row.url}
              </a>
            ),
          },
          {
            id: "description",
            header: "Descrição",
            cell: (row) => (
              <div className="text-sm text-muted-foreground max-w-md truncate">
                {row.description || "—"}
              </div>
            ),
          },
          {
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <Link href={`/admin/links/${row.id}`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("link_items", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as LinkItem[],
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
              await pbBulkDelete("link_items", selected.map((s) => s.id));
            },
          },
        ]}
        defaultSort="order"
        filtersSchema={{
          q: {
            placeholder: "Buscar por título ou descrição...",
            searchFields: ["title", "description"],
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhum link encontrado"
        emptyAction={
          <Link href="/admin/links/new" className="btn-primary mt-4 inline-flex">
            Adicionar primeiro link
          </Link>
        }
      />
    </div>
  );
}

