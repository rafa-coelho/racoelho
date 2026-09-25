"use client";
import { ExternalLink, Eye, SquarePen, Star } from "lucide-react";
import {
  AdminListPage,
  DataTable,
  MonoMeta,
  VISIBILITY_BULK_ACTIONS,
  VISIBILITY_STATUS_OPTIONS,
  VisibilityPill,
} from "@/components/admin/DataTable";
import { Pill } from "@/components/rc";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  type: 'link' | 'highlight';
  order?: number;
  visible?: boolean;
};

const CREATE = { href: "/admin/links/new", label: "Novo link" };

export default function LinkItemsPage() {
  return (
    <AdminListPage title="Links do Site" description="Gerenciar links da página /links." create={CREATE}>
      <DataTable<LinkItem>
        collection="link_items"
        cacheCollection="links"
        columns={[
          { id: "order", header: "#", sortable: true, width: "72px", cell: (row) => <MonoMeta className="tabular-nums">{row.order ?? "—"}</MonoMeta> },
          {
            id: "title",
            header: "Título",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="truncate text-[15px] font-medium text-rc-ink">{row.title}</div>
                {row.description && <div className="mt-1 truncate text-[13px] text-rc-ink-5">{row.description}</div>}
              </div>
            ),
          },
          {
            id: "type",
            header: "Tipo",
            sortable: true,
            width: "130px",
            cell: (row) =>
              row.type === "highlight" ? (
                <Pill tone="blue"><Star className="h-3 w-3 fill-current" aria-hidden="true" />destaque</Pill>
              ) : (
                <Pill>link</Pill>
              ),
          },
          { id: "visible", header: "Visível", sortable: true, width: "120px", cell: (row) => <VisibilityPill visible={row.visible} /> },
          {
            id: "url",
            header: "URL",
            width: "220px",
            cell: (row) => (
              <a href={row.url} target="_blank" rel="noopener noreferrer" className="block truncate font-mono text-xs text-rc-blue-link hover:underline">
                {row.url}
              </a>
            ),
          },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/links/${row.id}` },
          { label: "Ver detalhes", icon: Eye, href: `/admin/links/${row.id}/view` },
          { label: "Abrir URL", icon: ExternalLink, href: row.url, external: true },
        ]}
        bulkActions={VISIBILITY_BULK_ACTIONS}
        defaultSort="order"
        search={{ placeholder: "Buscar por título ou descrição…", fields: ["title", "description"] }}
        statusOptions={VISIBILITY_STATUS_OPTIONS}
        mobile={{
          title: (row) => row.title,
          status: (row) => <VisibilityPill visible={row.visible} />,
          meta: (row) => [row.type === "highlight" ? "destaque" : "link", `#${row.order ?? "—"}`],
        }}
        rowLabel={(row) => row.title}
        create={CREATE}
        emptyMessage="Nenhum link ainda."
      />
    </AdminListPage>
  );
}
