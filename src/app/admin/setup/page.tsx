"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SetupItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  price: string;
};

export default function SetupItemsPage() {
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

      <DataTable<SetupItem>
        columns={[
          {
            id: "name",
            header: "Nome",
            cell: (row) => <div className="font-medium">{row.name}</div>,
            sortable: true,
          },
          {
            id: "category",
            header: "Categoria",
            cell: (row) => (
              <Badge variant="outline">{row.category}</Badge>
            ),
            sortable: true,
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
            id: "price",
            header: "Preço",
            cell: (row) => <div className="font-medium">{row.price}</div>,
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
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <Link href={`/admin/setup/${row.id}`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("setup_items", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as SetupItem[],
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
              await pbBulkDelete("setup_items", selected.map((s) => s.id));
            },
          },
        ]}
        defaultSort="order"
        filtersSchema={{
          q: {
            placeholder: "Buscar por nome ou descrição...",
            searchFields: ["name", "description", "category"],
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhum item encontrado"
        emptyAction={
          <Link href="/admin/setup/new" className="btn-primary mt-4 inline-flex">
            Adicionar primeiro item
          </Link>
        }
      />
    </div>
  );
}

