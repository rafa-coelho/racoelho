"use client";
import Link from "next/link";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Linkedin } from "lucide-react";

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

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusLabel: Record<string, string> = {
  new: "Nova",
  submitted: "Indicada",
  archived: "Arquivada",
};

export default function ReferralsAdminPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Indicações de Vagas</h1>
          <p className="text-sm text-muted-foreground">
            Candidatos indicados pelo público em /vagas
          </p>
        </div>
      </div>

      <DataTable<Referral>
        columns={[
          {
            id: "candidateName",
            header: "Candidato",
            cell: (row) => (
              <div>
                <div className="font-medium">{row.candidateName}</div>
                <a
                  href={`mailto:${row.candidateEmail}`}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  {row.candidateEmail}
                </a>
                {row.phone && (
                  <div className="text-xs text-muted-foreground">{row.phone}</div>
                )}
              </div>
            ),
            sortable: true,
          },
          {
            id: "vagaTitle",
            header: "Vaga",
            cell: (row) => (
              <a
                href={`/vagas/${row.vagaSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-primary inline-flex items-center gap-1"
              >
                {row.vagaTitle}
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            ),
            sortable: true,
          },
          {
            id: "created",
            header: "Recebida em",
            cell: (row) => (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(row.created)}
              </span>
            ),
            sortable: true,
          },
          {
            id: "status",
            header: "Status",
            cell: (row) => (
              <Badge
                variant={row.status === "submitted" ? "default" : "secondary"}
                className="capitalize"
              >
                {statusLabel[row.status || "new"]}
              </Badge>
            ),
            sortable: true,
          },
          {
            id: "actions",
            header: "Links",
            cell: (row) => {
              const cv = cvUrl(row);
              return (
                <div className="flex items-center gap-1">
                  {row.linkedinUrl && (
                    <a href={row.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <Button variant="ghost" size="sm">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {cv && (
                    <a href={cv} target="_blank" rel="noopener noreferrer" title="Baixar CV">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              );
            },
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("job_referrals", {
            page,
            perPage,
            filter,
            sort: sort || "-created",
          });
          return {
            items: res.items as unknown as Referral[],
            page: res.page,
            perPage: res.perPage,
            totalItems: res.totalItems,
            totalPages: res.totalPages,
          };
        }}
        bulkActions={[
          {
            label: "Marcar como indicada",
            action: async (selected) => {
              await pbBulkUpdate("job_referrals", selected.map((s) => s.id), { status: "submitted" });
            },
          },
          {
            label: "Arquivar",
            action: async (selected) => {
              await pbBulkUpdate("job_referrals", selected.map((s) => s.id), { status: "archived" });
            },
          },
          {
            label: "Excluir selecionados",
            variant: "destructive",
            action: async (selected) => {
              await pbBulkDelete("job_referrals", selected.map((s) => s.id));
            },
          },
        ]}
        defaultSort="-created"
        filtersSchema={{
          q: {
            placeholder: "Buscar por candidato, e-mail ou vaga...",
            searchFields: ["candidateName", "candidateEmail", "vagaTitle"],
          },
          status: {
            placeholder: "Status",
            options: [
              { label: "Nova", value: "new" },
              { label: "Indicada", value: "submitted" },
              { label: "Arquivada", value: "archived" },
            ],
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhuma indicação recebida ainda"
      />
    </div>
  );
}
