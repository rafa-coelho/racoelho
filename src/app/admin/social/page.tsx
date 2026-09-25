"use client";
import { ExternalLink, SquarePen } from "lucide-react";
import {
  AdminListPage,
  DataTable,
  MonoMeta,
  VISIBILITY_BULK_ACTIONS,
  VISIBILITY_STATUS_OPTIONS,
  VisibilityPill,
} from "@/components/admin/DataTable";
import { SocialIcon } from "@/components/rc";

type SocialLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
  order?: number;
  visible?: boolean;
};

const CREATE = { href: "/admin/social/new", label: "Novo link social" };

export default function SocialLinksPage() {
  return (
    <AdminListPage title="Links Sociais" description="Gerenciar links sociais do footer." create={CREATE}>
      <DataTable<SocialLink>
        collection="social_links"
        cacheCollection="social_links"
        columns={[
          { id: "order", header: "#", sortable: true, width: "72px", cell: (row) => <MonoMeta className="tabular-nums">{row.order ?? "—"}</MonoMeta> },
          {
            id: "name",
            header: "Nome",
            sortable: true,
            cell: (row) => (
              <div className="flex items-center gap-2.5 text-[15px] font-medium text-rc-ink">
                <span className="text-rc-ink-4"><SocialIcon name={row.icon || row.name} /></span>
                <span className="truncate">{row.name}</span>
              </div>
            ),
          },
          {
            id: "url",
            header: "URL",
            cell: (row) => (
              <a href={row.url} target="_blank" rel="noopener noreferrer" className="block truncate font-mono text-xs text-rc-blue-link hover:underline">
                {row.url}
              </a>
            ),
          },
          { id: "visible", header: "Visível", sortable: true, width: "120px", cell: (row) => <VisibilityPill visible={row.visible} /> },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/social/${row.id}` },
          { label: "Abrir URL", icon: ExternalLink, href: row.url, external: true },
        ]}
        bulkActions={VISIBILITY_BULK_ACTIONS}
        defaultSort="order"
        search={{ placeholder: "Buscar por nome…", fields: ["name"] }}
        statusOptions={VISIBILITY_STATUS_OPTIONS}
        mobile={{
          title: (row) => row.name,
          status: (row) => <VisibilityPill visible={row.visible} />,
          meta: (row) => [row.icon || "—", `#${row.order ?? "—"}`],
        }}
        rowLabel={(row) => row.name}
        create={CREATE}
        emptyMessage="Nenhum link social ainda."
      />
    </AdminListPage>
  );
}
