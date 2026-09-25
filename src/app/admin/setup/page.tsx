"use client";
import { ExternalLink, Eye, SquarePen } from "lucide-react";
import {
  AdminListPage,
  DataTable,
  MonoMeta,
  VISIBILITY_BULK_ACTIONS,
  VISIBILITY_STATUS_OPTIONS,
  VisibilityPill,
} from "@/components/admin/DataTable";
import { Tag } from "@/components/rc";

type SetupItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  price: string;
  order?: number;
  visible?: boolean;
};

const CREATE = { href: "/admin/setup/new", label: "Novo item" };

export default function SetupItemsPage() {
  return (
    <AdminListPage title="Itens do Setup" description="Gerenciar itens da página /setup." create={CREATE}>
      <DataTable<SetupItem>
        collection="setup_items"
        cacheCollection="setup"
        columns={[
          {
            id: "name",
            header: "Nome",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="truncate text-[15px] font-medium text-rc-ink">{row.name}</div>
                {row.description && <div className="mt-1 truncate text-[13px] text-rc-ink-5">{row.description}</div>}
              </div>
            ),
          },
          { id: "category", header: "Categoria", sortable: true, width: "160px", cell: (row) => (row.category ? <Tag>{row.category}</Tag> : <MonoMeta>—</MonoMeta>) },
          { id: "price", header: "Preço", sortable: true, width: "120px", cell: (row) => <MonoMeta className="text-rc-ink-2">{row.price || "—"}</MonoMeta> },
          { id: "visible", header: "Visível", sortable: true, width: "120px", cell: (row) => <VisibilityPill visible={row.visible} /> },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/setup/${row.id}` },
          { label: "Ver detalhes", icon: Eye, href: `/admin/setup/${row.id}/view` },
          ...(row.url ? [{ label: "Abrir link", icon: ExternalLink, href: row.url, external: true }] : []),
        ]}
        bulkActions={VISIBILITY_BULK_ACTIONS}
        defaultSort="order"
        search={{ placeholder: "Buscar por nome, descrição ou categoria…", fields: ["name", "description", "category"] }}
        statusOptions={VISIBILITY_STATUS_OPTIONS}
        mobile={{
          title: (row) => row.name,
          status: (row) => <VisibilityPill visible={row.visible} />,
          meta: (row) => [row.category || "sem categoria", row.price].filter(Boolean),
        }}
        rowLabel={(row) => row.name}
        create={CREATE}
        emptyMessage="Nenhum item no setup ainda."
      />
    </AdminListPage>
  );
}
