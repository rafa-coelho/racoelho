"use client";
import { ExternalLink, SquarePen } from "lucide-react";
import { AD_BULK_ACTIONS, AdminListPage, DataTable, MonoMeta } from "@/components/admin/DataTable";
import { Pill, type PillTone } from "@/components/rc";

type Ad = {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  targets: string[];
  priority?: number;
  clickUrl: string;
};

const STATUS: Record<string, { label: string; tone: PillTone }> = {
  active: { label: "ativo", tone: "green" },
  paused: { label: "pausado", tone: "amber" },
  draft: { label: "rascunho", tone: "neutral" },
  archived: { label: "arquivado", tone: "neutral" },
};

function AdStatusPill({ status }: { status?: string }) {
  const s = STATUS[status || "draft"] ?? { label: status || "—", tone: "neutral" as PillTone };
  return <Pill tone={s.tone}>{s.label}</Pill>;
}

const CREATE = { href: "/admin/ads/new", label: "Novo anúncio" };

export default function AdsPage() {
  return (
    <AdminListPage title="Anúncios" description="Gerenciar banners publicitários." create={CREATE}>
      <DataTable<Ad>
        collection="ads"
        cacheCollection="ads"
        columns={[
          { id: "title", header: "Título", sortable: true, cell: (row) => <div className="truncate text-[15px] font-medium text-rc-ink">{row.title}</div> },
          { id: "status", header: "Status", sortable: true, width: "130px", cell: (row) => <AdStatusPill status={row.status} /> },
          {
            id: "targets",
            header: "Targets",
            width: "170px",
            cell: (row) => <MonoMeta className="block truncate">{Array.isArray(row.targets) && row.targets.length ? row.targets.join(", ") : "—"}</MonoMeta>,
          },
          { id: "priority", header: "Prioridade", sortable: true, width: "130px", cell: (row) => <MonoMeta className="text-rc-ink-2">{row.priority ?? 0}</MonoMeta> },
          {
            id: "clickUrl",
            header: "Link",
            cell: (row) =>
              row.clickUrl ? (
                <a href={row.clickUrl} target="_blank" rel="noopener noreferrer" className="block truncate font-mono text-xs text-rc-blue-link hover:underline">
                  {row.clickUrl}
                </a>
              ) : (
                <MonoMeta>—</MonoMeta>
              ),
          },
        ]}
        rowActions={(row) => [
          { label: "Editar", icon: SquarePen, href: `/admin/ads/${row.id}` },
          ...(row.clickUrl ? [{ label: "Abrir link", icon: ExternalLink, href: row.clickUrl, external: true }] : []),
        ]}
        bulkActions={AD_BULK_ACTIONS}
        defaultSort="-priority"
        search={{ placeholder: "Buscar por título…", fields: ["title"] }}
        statusOptions={[
          { label: "Ativos", value: "active", filter: "status = 'active'" },
          { label: "Pausados", value: "paused", filter: "status = 'paused'" },
          { label: "Rascunhos", value: "draft", filter: "status = 'draft'" },
          { label: "Arquivados", value: "archived", filter: "status = 'archived'" },
        ]}
        mobile={{
          title: (row) => row.title,
          status: (row) => <AdStatusPill status={row.status} />,
          meta: (row) => [Array.isArray(row.targets) && row.targets.length ? row.targets.join(", ") : "sem target", `prioridade ${row.priority ?? 0}`],
        }}
        rowLabel={(row) => row.title}
        create={CREATE}
        emptyMessage="Nenhum anúncio ainda."
      />
    </AdminListPage>
  );
}
