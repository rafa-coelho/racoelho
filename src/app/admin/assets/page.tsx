"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Folder, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AssetPack = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status?: 'draft' | 'published';
  files?: string[];
};

export default function AssetsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Asset Packs</h1>
          <p className="text-sm text-muted-foreground">Gerenciar pacotes de arquivos</p>
        </div>
        <Link href="/admin/assets/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Pacote
        </Link>
      </div>

      <DataTable<AssetPack>
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
            id: "files",
            header: "Arquivos",
            cell: (row) => (
              <div className="text-sm text-muted-foreground">
                {row.files?.length || 0} arquivo(s)
              </div>
            ),
            sortable: false,
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
              <div className="flex items-center gap-1">
                <Link href={`/admin/assets/${row.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/assets/${row.id}/view`}>
                  <Button variant="ghost" size="sm" title="Ver">
                    <Folder className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("asset_packs", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as AssetPack[],
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
              await pbBulkDelete("asset_packs", selected.map((s) => s.id));
            },
          },
          {
            label: "Publicar",
            action: async (selected) => {
              await pbBulkUpdate("asset_packs", selected.map((s) => s.id), { status: "published" });
            },
          },
          {
            label: "Despublicar",
            action: async (selected) => {
              await pbBulkUpdate("asset_packs", selected.map((s) => s.id), { status: "draft" });
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
        emptyMessage="Nenhum pacote encontrado"
        emptyAction={
          <Link href="/admin/assets/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro pacote
          </Link>
        }
      />
    </div>
  );
}

