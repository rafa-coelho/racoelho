"use client";
import { useCallback, useEffect, useState } from "react";
import { pbList, pbUpdate, pbDelete } from "@/lib/pocketbase";
import CopyButton from "@/components/admin/CopyButton";
import { Badge } from "@/components/ui/badge";
import {
  Linkedin,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  RefreshCw,
  Loader,
  Search,
  Trash2,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const statusMeta: Record<string, { label: string; cls: string }> = {
  new: { label: "Nova", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  submitted: { label: "Indicada", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  archived: { label: "Arquivada", cls: "bg-white/10 text-muted-foreground border-white/20" },
};

const STATUS_CYCLE: Record<string, Referral["status"]> = {
  new: "submitted",
  submitted: "archived",
  archived: "new",
};

export default function ReferralsAdminPage() {
  const [items, setItems] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await pbList("job_referrals", {
        perPage: 200,
        sort: "-created",
      });
      setItems(res.items as unknown as Referral[]);
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar indicações");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cycleStatus = async (row: Referral) => {
    const next = STATUS_CYCLE[row.status || "new"];
    setBusyId(row.id);
    try {
      await pbUpdate("job_referrals", row.id, { status: next });
      setItems((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
    } catch {
      /* mantém como estava */
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row: Referral) => {
    if (!window.confirm(`Excluir a indicação de ${row.candidateName}?`)) return;
    setBusyId(row.id);
    try {
      await pbDelete("job_referrals", row.id);
      setItems((prev) => prev.filter((r) => r.id !== row.id));
    } catch {
      /* noop */
    } finally {
      setBusyId(null);
    }
  };

  const filtered = items.filter((r) => {
    const matchesStatus = statusFilter === "all" || (r.status || "new") === statusFilter;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.candidateName.toLowerCase().includes(q) ||
      r.candidateEmail.toLowerCase().includes(q) ||
      r.vagaTitle.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Indicações de Vagas</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "indicação" : "indicações"}
            {statusFilter !== "all" || query ? " (filtradas)" : ""}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm self-start"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, e-mail ou vaga..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] focus:outline-none focus:border-primary/50 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { v: "all", l: "Todas" },
            { v: "new", l: "Novas" },
            { v: "submitted", l: "Indicadas" },
            { v: "archived", l: "Arquivadas" },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setStatusFilter(s.v)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors",
                statusFilter === s.v
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "border-white/10 text-muted-foreground hover:bg-white/5"
              )}
            >
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {/* Estados */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader className="animate-spin mr-2 h-5 w-5" /> Carregando...
        </div>
      )}
      {error && !loading && (
        <div className="card-modern p-6 border border-red-500/20 bg-red-500/5 text-red-400">
          {error}
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Nenhuma indicação {statusFilter !== "all" || query ? "com esses filtros" : "recebida ainda"}.
        </div>
      )}

      {/* ===== MOBILE: cards ===== */}
      {!loading && !error && filtered.length > 0 && (
        <div className="lg:hidden space-y-4">
          {filtered.map((r) => {
            const cv = cvUrl(r);
            const st = statusMeta[r.status || "new"];
            return (
              <div key={r.id} className="card-modern p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.candidateName}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(r.created)}</div>
                  </div>
                  <button
                    onClick={() => cycleStatus(r)}
                    disabled={busyId === r.id}
                    className={cn("text-[11px] font-medium px-2 py-1 rounded-full border shrink-0", st.cls)}
                    title="Tocar para mudar o status"
                  >
                    {st.label}
                  </button>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  Vaga:{" "}
                  <a
                    href={`/vagas/${r.vagaSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary"
                  >
                    {r.vagaTitle}
                  </a>
                </div>

                {/* Campos copiáveis */}
                <div className="space-y-2">
                  <CopyRow icon={<Mail className="h-4 w-4" />} value={r.candidateEmail} href={`mailto:${r.candidateEmail}`} />
                  {r.phone && <CopyRow icon={<Phone className="h-4 w-4" />} value={r.phone} href={`tel:${r.phone}`} />}
                  {r.linkedinUrl && (
                    <CopyRow icon={<Linkedin className="h-4 w-4" />} value={r.linkedinUrl} href={r.linkedinUrl} external />
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                  {cv && (
                    <a
                      href={cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/15 text-primary border border-primary/30 text-sm"
                    >
                      <FileText className="h-4 w-4" /> Baixar CV
                    </a>
                  )}
                  {r.linkedinUrl && (
                    <a
                      href={r.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => remove(r)}
                    disabled={busyId === r.id}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== DESKTOP: tabela ===== */}
      {!loading && !error && filtered.length > 0 && (
        <div className="hidden lg:block card-modern overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Candidato</th>
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 font-medium">Vaga</th>
                <th className="px-4 py-3 font-medium">Recebida</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const cv = cvUrl(r);
                const st = statusMeta[r.status || "new"];
                return (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] align-top">
                    {/* Candidato */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{r.candidateName}</span>
                        <CopyButton value={r.candidateName} label="nome" className="px-1.5 py-1" />
                      </div>
                    </td>
                    {/* Contato (email + phone com copiar) */}
                    <td className="px-4 py-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <a href={`mailto:${r.candidateEmail}`} className="text-muted-foreground hover:text-primary truncate max-w-[220px]">
                            {r.candidateEmail}
                          </a>
                          <CopyButton value={r.candidateEmail} label="e-mail" className="px-1.5 py-1" />
                        </div>
                        {r.phone && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">{r.phone}</span>
                            <CopyButton value={r.phone} label="telefone" className="px-1.5 py-1" />
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Vaga */}
                    <td className="px-4 py-3">
                      <a
                        href={`/vagas/${r.vagaSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-primary max-w-[240px]"
                      >
                        <span className="truncate">{r.vagaTitle}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
                      </a>
                    </td>
                    {/* Data */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(r.created)}
                    </td>
                    {/* Status (clicável) */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => cycleStatus(r)}
                        disabled={busyId === r.id}
                        className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", st.cls)}
                        title="Clique para avançar o status"
                      >
                        {st.label}
                      </button>
                    </td>
                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {r.linkedinUrl && (
                          <a href={r.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                            className="p-2 rounded-lg border border-white/10 hover:bg-white/5">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {cv && (
                          <a href={cv} target="_blank" rel="noopener noreferrer" title="Baixar CV"
                            className="p-2 rounded-lg border border-white/10 hover:bg-white/5">
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        <button onClick={() => remove(r)} disabled={busyId === r.id} title="Excluir"
                          className="p-2 rounded-lg border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Linha de campo copiável (usada nos cards mobile) */
function CopyRow({
  icon,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="flex-1 min-w-0 truncate text-sm hover:text-primary"
        >
          {value}
        </a>
      ) : (
        <span className="flex-1 min-w-0 truncate text-sm">{value}</span>
      )}
      <CopyButton value={value} className="px-2 py-1.5" />
    </div>
  );
}
