"use client";
import { ExternalLink, SquarePen, Star } from "lucide-react";
import {
  AdminListPage,
  CONTENT_BULK_ACTIONS,
  CONTENT_STATUS_OPTIONS,
  ContentStatusPill,
  DataTable,
  MonoMeta,
} from "@/components/admin/DataTable";
import { formatRelative, formatShortDate } from "@/components/rc";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  status?: 'draft' | 'published';
  date?: string;
  featured?: boolean;
  updated?: string;
};

const CREATE = { href: "/admin/editor/projects/new", label: "Novo projeto" };

export default function AdminProjectsPage() {
  return (
    <AdminListPage title="Projetos" description="Gerenciar projetos do portfólio." create={CREATE}>
      <DataTable<ProjectRow>
        collection="projects"
        cacheCollection="projects"
        columns={[
          {
            id: "title",
            header: "Título",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[15.5px] font-medium tracking-[-.012em] text-rc-ink">
                  <span className="truncate">{row.title}</span>
                  {row.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-current text-rc-amber" aria-label="Destaque" />}
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-rc-ink-6">/{row.slug}</div>
              </div>
            ),
          },
          { id: "status", header: "Status", sortable: true, width: "140px", cell: (row) => <ContentStatusPill status={row.status} /> },
          { id: "date", header: "Data", sortable: true, width: "150px", cell: (row) => <MonoMeta>{formatShortDate(row.date) || "—"}</MonoMeta> },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/editor/projects/${row.id}` },
          { label: "Abrir no site", icon: ExternalLink, href: `/projetos/${row.slug}`, external: true },
        ]}
        bulkActions={[
          ...CONTENT_BULK_ACTIONS.slice(0, 2),
          { id: "feature", label: "Marcar destaque", kind: "update", data: { featured: true } },
          { id: "unfeature", label: "Remover destaque", kind: "update", data: { featured: false } },
          ...CONTENT_BULK_ACTIONS.slice(2),
        ]}
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
        emptyMessage="Nenhum projeto ainda."
      />
    </AdminListPage>
  );
}
