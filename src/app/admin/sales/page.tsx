"use client";
import { ExternalLink, Eye, SquarePen } from "lucide-react";
import {
  AdminListPage,
  CONTENT_BULK_ACTIONS,
  CONTENT_STATUS_OPTIONS,
  ContentStatusPill,
  DataTable,
} from "@/components/admin/DataTable";

type SalesPage = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
};

const CREATE = { href: "/admin/sales/new", label: "Nova página" };

export default function SalesPagesPage() {
  return (
    <AdminListPage title="Páginas de Venda" description="Gerenciar páginas de vendas." create={CREATE}>
      <DataTable<SalesPage>
        collection="sales_pages"
        cacheCollection="sales_pages"
        columns={[
          {
            id: "title",
            header: "Título",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="truncate text-[15.5px] font-medium tracking-[-.012em] text-rc-ink">{row.title}</div>
                <div className="mt-1 truncate font-mono text-[11px] text-rc-ink-6">/venda/{row.slug}</div>
              </div>
            ),
          },
          { id: "status", header: "Status", sortable: true, width: "140px", cell: (row) => <ContentStatusPill status={row.status} /> },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/sales/${row.id}` },
          { label: "Ver detalhes", icon: Eye, href: `/admin/sales/${row.id}/view` },
          { label: "Abrir no site", icon: ExternalLink, href: `/venda/${row.slug}`, external: true },
        ]}
        bulkActions={CONTENT_BULK_ACTIONS}
        search={{ placeholder: "Buscar por título ou slug…", fields: ["title", "slug"] }}
        statusOptions={CONTENT_STATUS_OPTIONS}
        mobile={{
          title: (row) => row.title,
          status: (row) => <ContentStatusPill status={row.status} />,
          meta: (row) => [`/venda/${row.slug}`],
          highlight: (row) => row.status !== "published",
        }}
        rowLabel={(row) => row.title}
        create={CREATE}
        emptyMessage="Nenhuma página de venda ainda."
      />
    </AdminListPage>
  );
}
