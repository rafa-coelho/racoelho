"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, ShoppingCart, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SalesPage = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
};

export default function SalesPagesPage() {
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

      <DataTable<SalesPage>
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
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <Link href={`/admin/sales/${row.id}`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("sales_pages", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as SalesPage[],
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
              await pbBulkDelete("sales_pages", selected.map((s) => s.id));
            },
          },
          {
            label: "Publicar",
            action: async (selected) => {
              await pbBulkUpdate("sales_pages", selected.map((s) => s.id), { status: "published" });
            },
          },
          {
            label: "Despublicar",
            action: async (selected) => {
              await pbBulkUpdate("sales_pages", selected.map((s) => s.id), { status: "draft" });
            },
          },
        ]}
        defaultSort=""
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
        emptyMessage="Nenhuma página encontrada"
        emptyAction={
          <Link href="/admin/sales/new" className="btn-primary mt-4 inline-flex">
            Criar primeira página
          </Link>
        }
      />
    </div>
  );
}

