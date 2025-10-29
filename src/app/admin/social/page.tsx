"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Share2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
};

export default function SocialLinksPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Links Sociais</h1>
          <p className="text-sm text-muted-foreground">Gerenciar links sociais do footer</p>
        </div>
        <Link href="/admin/social/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Link
        </Link>
      </div>

      <DataTable<SocialLink>
        columns={[
          {
            id: "name",
            header: "Nome",
            cell: (row) => <div className="font-medium">{row.name}</div>,
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
            id: "icon",
            header: "Ícone",
            cell: (row) => (
              <div className="text-sm text-muted-foreground">
                {row.icon || "—"}
              </div>
            ),
          },
          {
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <Link href={`/admin/social/${row.id}`}>
                <Button variant="ghost" size="sm">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("social_links", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as SocialLink[],
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
              await pbBulkDelete("social_links", selected.map((s) => s.id));
            },
          },
        ]}
        defaultSort="order"
        filtersSchema={{
          q: {
            placeholder: "Buscar por nome...",
            searchFields: ["name"],
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhum link social encontrado"
        emptyAction={
          <Link href="/admin/social/new" className="btn-primary mt-4 inline-flex">
            Adicionar primeiro link
          </Link>
        }
      />
    </div>
  );
}

