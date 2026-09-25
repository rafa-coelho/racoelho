"use client";
import { Eye, ExternalLink, SquarePen } from "lucide-react";
import {
  AdminListPage,
  CONTENT_BULK_ACTIONS,
  CONTENT_STATUS_OPTIONS,
  ContentStatusPill,
  DataTable,
  MonoMeta,
} from "@/components/admin/DataTable";
import { formatRelative, formatShortDate, pad2 } from "@/components/rc";

type Challenge = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
  date?: string;
  number?: number;
  updated?: string;
};

const CREATE = { href: "/admin/editor/challenges/new", label: "Novo desafio" };

export default function AdminChallengesPage() {
  return (
    <AdminListPage title="Desafios" description="Gerenciar desafios de programação." create={CREATE}>
      <DataTable<Challenge>
        collection="challenges"
        cacheCollection="challenges"
        columns={[
          {
            id: "title",
            header: "Título",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="truncate text-[15.5px] font-medium tracking-[-.012em] text-rc-ink">
                  {typeof row.number === "number" && row.number > 0 && <span className="mr-2 font-mono text-xs text-rc-green">#{pad2(row.number)}</span>}
                  {row.title}
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-rc-ink-6">/{row.slug}</div>
              </div>
            ),
          },
          { id: "status", header: "Status", sortable: true, width: "140px", cell: (row) => <ContentStatusPill status={row.status} /> },
          { id: "date", header: "Data", sortable: true, width: "150px", cell: (row) => <MonoMeta>{formatShortDate(row.date) || "—"}</MonoMeta> },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/editor/challenges/${row.id}` },
          { label: "Pré-visualizar", icon: Eye, href: `/admin/editor/challenges/${row.id}/view` },
          { label: "Abrir no site", icon: ExternalLink, href: `/listas/desafios/${row.slug}`, external: true },
        ]}
        bulkActions={CONTENT_BULK_ACTIONS}
        defaultSort="-date"
        search={{ placeholder: "Buscar por título ou slug…", fields: ["title", "slug"] }}
        statusOptions={CONTENT_STATUS_OPTIONS}
        mobile={{
          title: (row) => row.title,
          status: (row) => <ContentStatusPill status={row.status} />,
          meta: (row) =>
            row.status === "published"
              ? [formatShortDate(row.date) || "sem data"]
              : [`editado ${formatRelative(row.updated)}`],
          highlight: (row) => row.status !== "published",
        }}
        rowLabel={(row) => row.title}
        create={CREATE}
        emptyMessage="Nenhum desafio ainda."
      />
    </AdminListPage>
  );
}
