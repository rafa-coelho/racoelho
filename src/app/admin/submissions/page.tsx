"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getPocketBaseClient } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Chip, EmptyState, ErrorState, Skeleton } from "@/components/rc";
import type { ChallengeSubmission, ChallengeSubmissionStatus } from "@/lib/types";
import SubmissionsTable from "@/components/admin/submissions/SubmissionsTable";
import SubmissionDrawer from "@/components/admin/submissions/SubmissionDrawer";
import { SUBMISSION_STATUS, SUBMISSION_STATUS_ORDER } from "@/components/admin/submissions/SubmissionStatusPill";

const COLLECTION = "challenge_submissions";

type ChallengeOption = { id: string; title: string; number?: number };

function mapRecord(rec: any): ChallengeSubmission {
  return {
    id: rec.id,
    challenge: rec.challenge,
    challengeTitle: rec.expand?.challenge?.title,
    challengeSlug: rec.expand?.challenge?.slug,
    name: rec.name,
    email: rec.email,
    repoUrl: rec.repoUrl,
    demoUrl: rec.demoUrl || undefined,
    notes: rec.notes || undefined,
    status: rec.status || "new",
    reviewNote: rec.reviewNote || undefined,
    created: rec.created,
  };
}

// Filtros ficam na URL (?desafio=&status=) para dar para voltar/compartilhar.
function readParams() {
  if (typeof window === "undefined") return { challenge: "", status: "" };
  const p = new URLSearchParams(window.location.search);
  return { challenge: p.get("desafio") || "", status: p.get("status") || "" };
}

function writeParams(challenge: string, status: string) {
  const p = new URLSearchParams(window.location.search);
  challenge ? p.set("desafio", challenge) : p.delete("desafio");
  status ? p.set("status", status) : p.delete("status");
  const qs = p.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
}

export default function SubmissionsAdminPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<ChallengeSubmission[]>([]);
  const [challenges, setChallenges] = useState<ChallengeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challengeFilter, setChallengeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ChallengeSubmissionStatus>("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const p = readParams();
    setChallengeFilter(p.challenge);
    if (SUBMISSION_STATUS_ORDER.includes(p.status as ChallengeSubmissionStatus)) setStatusFilter(p.status as ChallengeSubmissionStatus);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pb = getPocketBaseClient();
      const [subs, chs] = await Promise.all([
        pb.collection(COLLECTION).getFullList({ sort: "-created", expand: "challenge" }),
        pb.collection("challenges").getFullList({ fields: "id,title,number", sort: "number,title" }),
      ]);
      setItems(subs.map(mapRecord));
      setChallenges(chs.map((c: any) => ({ id: c.id, title: c.title, number: c.number || undefined })));
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar soluções");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setChallenge = (value: string) => {
    setChallengeFilter(value);
    writeParams(value, statusFilter);
  };
  const setStatus = (value: "" | ChallengeSubmissionStatus) => {
    setStatusFilter(value);
    writeParams(challengeFilter, value);
  };

  const filtered = useMemo(
    () => items.filter((s) => (!challengeFilter || s.challenge === challengeFilter) && (!statusFilter || s.status === statusFilter)),
    [items, challengeFilter, statusFilter],
  );

  // Só desafios que têm envio aparecem no filtro.
  const challengeOptions = useMemo(() => {
    const withSubs = new Set(items.map((s) => s.challenge));
    return challenges.filter((c) => withSubs.has(c.id) || c.id === challengeFilter);
  }, [challenges, items, challengeFilter]);

  const counts = useMemo(() => {
    const base = items.filter((s) => !challengeFilter || s.challenge === challengeFilter);
    const acc: Record<string, number> = { all: base.length };
    for (const s of base) acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, [items, challengeFilter]);

  const save = async (id: string, data: { status: ChallengeSubmissionStatus; reviewNote: string }) => {
    try {
      const pb = getPocketBaseClient();
      await pb.collection(COLLECTION).update(id, data);
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status: data.status, reviewNote: data.reviewNote || undefined } : s)));
      toast({ title: `Marcada como ${SUBMISSION_STATUS[data.status].label.toLowerCase()}` });
    } catch (e: any) {
      toast({ title: "Não foi possível atualizar", description: e?.message, variant: "destructive" });
    }
  };

  const openSubmission = items.find((s) => s.id === openId) || null;
  const newCount = items.filter((s) => s.status === "new").length;

  return (
    <div className="w-full px-4 py-6 text-rc-ink md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-.03em] md:text-[28px]">Soluções de desafio</h1>
          <p className="mt-2 text-[14.5px] text-rc-ink-4 md:text-[15.5px]">
            {loading ? "Carregando…" : `${items.length} ${items.length === 1 ? "envio" : "envios"}${newCount ? ` · ${newCount} ${newCount === 1 ? "nova" : "novas"}` : ""}`}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] border border-rc-border-strong bg-rc-surface-3 px-4 text-[14.5px] font-medium text-rc-ink transition-colors hover:border-rc-border-hover disabled:opacity-60"
          aria-label="Atualizar lista"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin motion-reduce:animate-none")} aria-hidden="true" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="flex h-11 items-center gap-2 rounded-[10px] border border-rc-border-chip bg-rc-surface px-3.5 md:w-[280px]">
          <span className="sr-only">Filtrar por desafio</span>
          <select
            value={challengeFilter}
            onChange={(e) => setChallenge(e.target.value)}
            className="h-full w-full bg-transparent text-[14.5px] text-rc-ink outline-none [&>option]:bg-rc-surface"
          >
            <option value="">Todos os desafios</option>
            {challengeOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.number ? `#${String(c.number).padStart(2, "0")} ` : ""}
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 md:pb-0" role="group" aria-label="Filtrar por status">
          <Chip active={!statusFilter} onClick={() => setStatus("")} className="h-11 md:h-9">
            todas · {counts.all || 0}
          </Chip>
          {SUBMISSION_STATUS_ORDER.map((st) => (
            <Chip key={st} active={statusFilter === st} onClick={() => setStatus(statusFilter === st ? "" : st)} className="h-11 md:h-9">
              {SUBMISSION_STATUS[st].label.toLowerCase()} · {counts[st] || 0}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[62px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            message={items.length === 0 ? "Nenhuma solução enviada ainda." : "Nenhuma solução com esses filtros."}
            action={
              items.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setChallengeFilter("");
                    setStatusFilter("");
                    writeParams("", "");
                  }}
                  className="text-sm font-medium text-rc-blue-link hover:text-rc-blue-soft"
                >
                  Limpar filtros
                </button>
              ) : undefined
            }
          />
        ) : (
          <SubmissionsTable items={filtered} onOpen={(s) => setOpenId(s.id)} />
        )}
      </div>

      <SubmissionDrawer submission={openSubmission} onClose={() => setOpenId(null)} onSave={save} />
    </div>
  );
}
