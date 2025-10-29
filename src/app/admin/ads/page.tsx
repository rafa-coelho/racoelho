"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Image, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Ad = {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  targets: string[];
  priority?: number;
  clickUrl: string;
};

export default function AdsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Anúncios</h1>
          <p className="text-sm text-muted-foreground">Gerenciar banners publicitários</p>
        </div>
        <Link href="/admin/ads/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Novo Anúncio
        </Link>
      </div>

      <DataTable<Ad>
        columns={[
          {
            id: "title",
            header: "Título",
            cell: (row) => <div className="font-medium">{row.title}</div>,
            sortable: true,
          },
          {
            id: "status",
            header: "Status",
            cell: (row) => (
              <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {row.status}
              </Badge>
            ),
            sortable: true,
          },
          {
            id: "targets",
            header: "Targets",
            cell: (row) => (
              <div className="text-sm">
                {Array.isArray(row.targets) ? row.targets.join(', ') : ''}
              </div>
            ),
          },
          {
            id: "priority",
            header: "Prioridade",
            cell: (row) => <div className="text-sm">{row.priority ?? 0}</div>,
            sortable: true,
          },
          {
            id: "clickUrl",
            header: "Link",
            cell: (row) => (
              <a href={row.clickUrl} target="_blank" rel="noopener" className="text-primary hover:underline text-sm truncate max-w-xs block">
                {row.clickUrl}
              </a>
            ),
          },
          {
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/ads/${row.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("ads", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as Ad[],
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
            icon: <Trash2 className="h-4 w-4" />,
            action: async (selected) => {
              await pbBulkDelete("ads", selected.map((s) => s.id));
            },
          },
          {
            label: "Ativar",
            action: async (selected) => {
              await pbBulkUpdate("ads", selected.map((s) => s.id), { status: "active" });
            },
          },
          {
            label: "Pausar",
            action: async (selected) => {
              await pbBulkUpdate("ads", selected.map((s) => s.id), { status: "paused" });
            },
          },
          {
            label: "Arquivar",
            action: async (selected) => {
              await pbBulkUpdate("ads", selected.map((s) => s.id), { status: "archived" });
            },
          },
        ]}
        defaultSort="-priority"
        filtersSchema={{
          q: {
            placeholder: "Buscar por título...",
            searchFields: ["title"],
          },
          status: {
            placeholder: "Status",
            options: [
              { label: "Rascunho", value: "draft" },
              { label: "Ativo", value: "active" },
              { label: "Pausado", value: "paused" },
              { label: "Arquivado", value: "archived" },
            ],
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhum anúncio encontrado"
        emptyAction={
          <Link href="/admin/ads/new" className="btn-primary mt-4 inline-flex">
            Criar primeiro anúncio
          </Link>
        }
      />
    </div>
  );
}

