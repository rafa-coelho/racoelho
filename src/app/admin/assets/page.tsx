"use client";
import { Eye, SquarePen } from "lucide-react";
import {
  AdminListPage,
  CONTENT_BULK_ACTIONS,
  CONTENT_STATUS_OPTIONS,
  ContentStatusPill,
  DataTable,
  MonoMeta,
} from "@/components/admin/DataTable";

type AssetPack = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status?: 'draft' | 'published';
  files?: string[];
};

const CREATE = { href: "/admin/assets/new", label: "Novo pack" };

const filesLabel = (row: AssetPack) => {
  const n = row.files?.length || 0;
  return `${n} ${n === 1 ? "arquivo" : "arquivos"}`;
};

export default function AssetsPage() {
  return (
    <AdminListPage title="Asset Packs" description="Gerenciar pacotes de arquivos (ebooks, banners etc.)." create={CREATE}>
      <DataTable<AssetPack>
        collection="asset_packs"
        cacheCollection="assets"
        columns={[
          {
            id: "title",
            header: "Título",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="truncate text-[15.5px] font-medium tracking-[-.012em] text-rc-ink">{row.title}</div>
                <div className="mt-1 truncate font-mono text-[11px] text-rc-ink-6">/{row.slug}</div>
              </div>
            ),
          },
          { id: "files", header: "Arquivos", width: "140px", cell: (row) => <MonoMeta>{filesLabel(row)}</MonoMeta> },
          { id: "status", header: "Status", sortable: true, width: "140px", cell: (row) => <ContentStatusPill status={row.status} /> },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/assets/${row.id}` },
          { label: "Ver detalhes", icon: Eye, href: `/admin/assets/${row.id}/view` },
        ]}
        bulkActions={CONTENT_BULK_ACTIONS}
        search={{ placeholder: "Buscar por título ou slug…", fields: ["title", "slug"] }}
        statusOptions={CONTENT_STATUS_OPTIONS}
        mobile={{
          title: (row) => row.title,
          status: (row) => <ContentStatusPill status={row.status} />,
          meta: (row) => [filesLabel(row)],
          highlight: (row) => row.status !== "published",
        }}
        rowLabel={(row) => row.title}
        create={CREATE}
        emptyMessage="Nenhum asset pack ainda."
      />
    </AdminListPage>
  );
}
