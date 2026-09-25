"use client";
import { useState } from "react";
import { ArrowRightLeft, ExternalLink, FileText, Linkedin, Mail, Phone, Trash2 } from "lucide-react";
import { pbDelete, pbUpdate } from "@/lib/pocketbase";
import CopyButton from "@/components/admin/CopyButton";
import { AdminListPage, DataTable, MonoMeta } from "@/components/admin/DataTable";
import { Pill, formatShortDate, type PillTone } from "@/components/rc";
import { useToast } from "@/hooks/use-toast";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "";

type Referral = {
  id: string;
  collectionId: string;
  vagaSlug: string;
  vagaTitle: string;
  candidateName: string;
  candidateEmail: string;
  linkedinUrl?: string;
  phone?: string;
  cv?: string;
  status?: "new" | "submitted" | "archived";
  created: string;
};

function cvUrl(row: Referral): string | null {
  if (!row.cv) return null;
  return `${PB_URL}/api/files/${row.collectionId}/${row.id}/${row.cv}`;
}

function formatDateTime(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// "new" = aguardando revisão; "submitted" = revisada e indicada; "archived" = arquivada
const statusMeta: Record<string, { label: string; tone: PillTone }> = {
  new: { label: "nova", tone: "amber" },
  submitted: { label: "indicada", tone: "green" },
  archived: { label: "arquivada", tone: "neutral" },
};

const STATUS_CYCLE: Record<string, Referral["status"]> = {
  new: "submitted",
  submitted: "archived",
  archived: "new",
};

function StatusPill({ status }: { status?: string }) {
  const st = statusMeta[status || "new"] ?? statusMeta.new;
  return <Pill tone={st.tone}>{st.label}</Pill>;
}

function CopyRow({ icon, value, href, label, external }: { icon: React.ReactNode; value: string; href?: string; label: string; external?: boolean }) {
  return (
    <div className="flex min-h-[44px] items-center gap-2 rounded-[10px] border border-rc-border-chip bg-rc-surface-2 py-1 pl-3 pr-1">
      <span className="shrink-0 text-rc-ink-5">{icon}</span>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="min-w-0 flex-1 truncate text-sm text-rc-ink-2 hover:text-rc-blue-link"
        >
          {value}
        </a>
      ) : (
        <span className="min-w-0 flex-1 truncate text-sm text-rc-ink-2">{value}</span>
      )}
      <CopyButton value={value} label={label} className="h-9 w-9" />
    </div>
  );
}

export default function ReferralsAdminPage() {
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  const refetch = () => window.dispatchEvent(new CustomEvent("datatable:refetch"));

  const cycleStatus = async (row: Referral) => {
    const next = STATUS_CYCLE[row.status || "new"];
    setBusyId(row.id);
    try {
      await pbUpdate("job_referrals", row.id, { status: next });
      refetch();
    } catch {
      toast({ title: "Não foi possível mudar o status", variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row: Referral) => {
    if (!window.confirm(`Excluir a indicação de ${row.candidateName}?`)) return;
    try {
      await pbDelete("job_referrals", row.id);
      refetch();
    } catch {
      toast({ title: "Não foi possível excluir", variant: "destructive" });
    }
  };

  return (
    <AdminListPage title="Indicações de Vagas" description="Candidatos indicados em /vagas.">
      <DataTable<Referral>
        mode="client"
        collection="job_referrals"
        columns={[
          {
            id: "candidateName",
            header: "Candidato",
            sortable: true,
            cell: (row) => (
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-[15px] font-medium text-rc-ink">{row.candidateName}</span>
                <CopyButton value={row.candidateName} label="nome" className="h-7 w-7" />
              </div>
            ),
          },
          {
            id: "candidateEmail",
            header: "Contato",
            width: "260px",
            cell: (row) => (
              <div className="flex flex-col gap-1.5">
                <div className="flex min-w-0 items-center gap-1.5">
                  <a href={`mailto:${row.candidateEmail}`} className="truncate text-sm text-rc-ink-3 hover:text-rc-blue-link">
                    {row.candidateEmail}
                  </a>
                  <CopyButton value={row.candidateEmail} label="e-mail" className="h-7 w-7" />
                </div>
                {row.phone && (
                  <div className="flex items-center gap-1.5">
                    <MonoMeta>{row.phone}</MonoMeta>
                    <CopyButton value={row.phone} label="telefone" className="h-7 w-7" />
                  </div>
                )}
              </div>
            ),
          },
          {
            id: "vagaTitle",
            header: "Vaga",
            sortable: true,
            width: "22%",
            cell: (row) => (
              <a href={`/vagas/${row.vagaSlug}`} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-1 text-sm text-rc-ink-2 hover:text-rc-blue-link">
                <span className="truncate">{row.vagaTitle}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
              </a>
            ),
          },
          { id: "created", header: "Recebida", sortable: true, width: "130px", cell: (row) => <MonoMeta><time dateTime={row.created} title={formatDateTime(row.created)}>{formatShortDate(row.created)}</time></MonoMeta> },
          {
            id: "status",
            header: "Status",
            sortable: true,
            width: "130px",
            cell: (row) => (
              <button
                type="button"
                onClick={() => cycleStatus(row)}
                disabled={busyId === row.id}
                title="Clique para avançar o status"
                aria-label={`Status ${statusMeta[row.status || "new"]?.label}. Avançar status`}
                className="disabled:opacity-60"
              >
                <StatusPill status={row.status} />
              </button>
            ),
          },
        ]}
        rowActions={(row) => {
          const cv = cvUrl(row);
          return [
            { label: "Avançar status", icon: ArrowRightLeft, onSelect: () => cycleStatus(row) },
            { label: "Enviar e-mail", icon: Mail, href: `mailto:${row.candidateEmail}`, external: true },
            ...(row.linkedinUrl ? [{ label: "LinkedIn", icon: Linkedin, href: row.linkedinUrl, external: true }] : []),
            ...(cv ? [{ label: "Baixar CV", icon: FileText, href: cv, external: true }] : []),
            { label: "Excluir", icon: Trash2, onSelect: () => remove(row), danger: true },
          ];
        }}
        bulkActions={[
          { id: "reviewed", label: "Marcar como revisada", kind: "update", data: { status: "submitted" } },
          { id: "archive", label: "Arquivar", kind: "update", data: { status: "archived" }, secondary: true },
        ]}
        defaultSort="-created"
        search={{ placeholder: "Buscar por nome, e-mail ou vaga…", fields: ["candidateName", "candidateEmail", "vagaTitle"] }}
        statusOptions={[
          { label: "Novas", value: "new", filter: "(status = 'new' || status = '')" },
          { label: "Indicadas", value: "submitted", filter: "status = 'submitted'" },
          { label: "Arquivadas", value: "archived", filter: "status = 'archived'" },
        ]}
        mobile={{
          title: (row) => row.candidateName,
          status: (row) => <StatusPill status={row.status} />,
          meta: (row) => [formatShortDate(row.created), row.vagaTitle],
          highlight: (row) => (row.status || "new") === "new",
          extra: (row) => (
            <div className="mt-3 flex flex-col gap-2 pr-1">
              <CopyRow icon={<Mail className="h-4 w-4" />} value={row.candidateEmail} href={`mailto:${row.candidateEmail}`} label="e-mail" />
              {row.phone && <CopyRow icon={<Phone className="h-4 w-4" />} value={row.phone} href={`tel:${row.phone}`} label="telefone" />}
              {row.linkedinUrl && <CopyRow icon={<Linkedin className="h-4 w-4" />} value={row.linkedinUrl} href={row.linkedinUrl} label="LinkedIn" external />}
            </div>
          ),
        }}
        rowLabel={(row) => row.candidateName}
        emptyMessage="Nenhuma indicação recebida ainda."
      />
      <p className="sr-only" aria-live="polite">{busyId ? "Atualizando status…" : ""}</p>
    </AdminListPage>
  );
}
