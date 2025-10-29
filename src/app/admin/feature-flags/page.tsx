"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, ToggleLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  metadata?: any;
};

export default function FeatureFlagsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Feature Flags</h1>
          <p className="text-sm text-muted-foreground">Controle de funcionalidades do site</p>
        </div>
        <Link href="/admin/feature-flags/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nova Flag
        </Link>
      </div>

      <DataTable<FeatureFlag>
        columns={[
          {
            id: "key",
            header: "Chave",
            cell: (row) => (
              <div>
                <div className="font-medium">{row.key}</div>
                {row.metadata?.description && (
                  <div className="text-xs text-muted-foreground mt-1">{row.metadata.description}</div>
                )}
              </div>
            ),
            sortable: true,
          },
          {
            id: "enabled",
            header: "Status",
            cell: (row) => (
              <Badge variant={row.enabled ? 'default' : 'secondary'} className="capitalize">
                {row.enabled ? 'Ativo' : 'Inativo'}
              </Badge>
            ),
            sortable: true,
          },
          {
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/feature-flags/${row.id}`}>
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
          const res = await pbList("feature_flags", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as FeatureFlag[],
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
              await pbBulkDelete("feature_flags", selected.map((s) => s.id));
            },
          },
          {
            label: "Ativar",
            action: async (selected) => {
              await pbBulkUpdate("feature_flags", selected.map((s) => s.id), { enabled: true });
            },
          },
          {
            label: "Desativar",
            action: async (selected) => {
              await pbBulkUpdate("feature_flags", selected.map((s) => s.id), { enabled: false });
            },
          },
        ]}
        defaultSort="key"
        filtersSchema={{
          q: {
            placeholder: "Buscar por chave...",
            searchFields: ["key"],
          },
          enabled: {
            label: "Status",
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhuma feature flag encontrada"
        emptyAction={
          <Link href="/admin/feature-flags/new" className="btn-primary mt-4 inline-flex">
            Criar primeira flag
          </Link>
        }
      />
    </div>
  );
}

