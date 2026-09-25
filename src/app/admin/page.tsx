"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    ChevronRight,
    Clock,
    Code2,
    FileText,
    Flag,
    Folder,
    Image,
    Link as LinkIcon,
    Megaphone,
    RefreshCw,
    Settings,
    Share2,
    ShoppingCart,
    type LucideIcon,
} from "lucide-react";
import { getPocketBaseClient } from "@/lib/auth";
import { pbList } from "@/lib/pocketbase";
import { authorInfo } from "@/lib/config/constants";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton, buttonClasses } from "@/components/rc";
import type { SiteStatus } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DAY = 86400000;
const NOW_INPUT_ID = "now-status-input";

// Data no formato aceito pelos filtros do PocketBase
const pbDate = (d: Date) => d.toISOString().replace("T", " ");

function compact(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
    if (n >= 10_000) return `${Math.round(n / 1000)}k`;
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
    return String(n);
}

function greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
}

async function countOf(collection: string, filter?: string): Promise<number> {
    const res = await pbList(collection, { page: 1, perPage: 1, filter, fields: "id" });
    return res.totalItems;
}

// Não deixa uma consulta que falhou derrubar o dashboard inteiro
async function safe<T>(p: Promise<T>): Promise<T | null> {
    try {
        return await p;
    } catch {
        return null;
    }
}

/* ------------------------------------------------------------------ */
/* Dados                                                               */
/* ------------------------------------------------------------------ */

type Visits = { current: number; previous: number; daily: { day: string; count: number }[] };
type Subscribers = { available: boolean; total?: number; last30?: number; prev30?: number };

type Attention = { id: string; text: string; href?: string; focusNow?: boolean; urgent: boolean; icon: LucideIcon };

type DashboardData = {
    visits: Visits | null;
    subscribers: Subscribers | null;
    published: number | null;
    drafts: number | null;
    vagas: number | null;
    pendingReferrals: number | null;
    pendingSubmissions: number | null;
    staleDrafts: number | null;
    mediakitUnreviewed: boolean;
};

async function loadVisits(): Promise<Visits> {
    const pb = getPocketBaseClient();
    const now = Date.now();
    const since = new Date(now - 60 * DAY);
    const opts = { filter: `created >= "${pbDate(since)}"`, fields: "viewerId,created", sort: "created" };
    const [posts, challenges] = await Promise.all([
        pb.collection("post_views").getFullList(opts),
        pb.collection("challenge_views").getFullList(opts),
    ]);
    const all = [...posts, ...challenges] as unknown as { viewerId: string; created: string }[];

    const cut = now - 30 * DAY;
    const cur = new Set<string>();
    const prev = new Set<string>();
    const perDay = new Map<string, Set<string>>();
    for (const v of all) {
        const t = new Date(v.created.replace(" ", "T")).getTime();
        if (t >= cut) {
            cur.add(v.viewerId);
            const day = new Date(t).toISOString().slice(0, 10);
            if (!perDay.has(day)) perDay.set(day, new Set());
            perDay.get(day)!.add(v.viewerId);
        } else {
            prev.add(v.viewerId);
        }
    }

    // 30 barras, uma por dia, da mais antiga para hoje
    const daily = Array.from({ length: 30 }, (_, i) => {
        const day = new Date(now - (29 - i) * DAY).toISOString().slice(0, 10);
        return { day, count: perDay.get(day)?.size ?? 0 };
    });
    return { current: cur.size, previous: prev.size, daily };
}

async function loadDashboard(): Promise<DashboardData> {
    const staleCut = pbDate(new Date(Date.now() - 14 * DAY));

    const [visits, subscribers, published, drafts, server, pendingReferrals, pendingSubmissions, staleDrafts, mediakit] = await Promise.all([
        safe(loadVisits()),
        safe(fetch("/api/admin/subscribers").then((r) => r.json() as Promise<Subscribers>)),
        safe(countOf("posts", "status = 'published'")),
        safe(countOf("posts", "status != 'published'")),
        safe(fetch("/api/admin/dashboard").then((r) => (r.ok ? (r.json() as Promise<{ vagasAtivas: number }>) : null))),
        safe(countOf("job_referrals", "(status = 'new' || status = '')")),
        safe(countOf("challenge_submissions", "status = 'new'")),
        safe(countOf("posts", `status != 'published' && updated < "${staleCut}"`)),
        safe(pbList("mediakit", { page: 1, perPage: 1, fields: "id,reviewed" })),
    ]);

    return {
        visits,
        subscribers,
        published,
        drafts,
        vagas: server?.vagasAtivas ?? null,
        pendingReferrals,
        pendingSubmissions,
        staleDrafts,
        mediakitUnreviewed: !!mediakit?.items[0] && (mediakit.items[0] as any).reviewed !== true,
    };
}

/* ------------------------------------------------------------------ */
/* Componentes                                                         */
/* ------------------------------------------------------------------ */

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) {
    return (
        <div className="mb-3 flex items-center gap-3 md:mb-4 md:gap-3.5">
            {Icon && <Icon className="h-4 w-4 text-rc-ink-4" aria-hidden="true" />}
            <h2 className="text-[15.5px] font-semibold tracking-[-.02em] md:text-[17px]">{children}</h2>
            <span className="h-px flex-1 bg-rc-border" aria-hidden="true" />
        </div>
    );
}

// Status "Agora": uma linha + salvar (PATCH /api/site-status)
function NowStatusField({ status, loading, onSaved }: { status: SiteStatus | null; loading: boolean; onSaved: (s: SiteStatus) => void }) {
    const { toast } = useToast();
    const [text, setText] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mostra o status atual quando ele chega do GET
    useEffect(() => {
        setText(status?.active ? status.text : "");
    }, [status]);

    const current = status?.active ? status.text : "";
    const dirty = text.trim() !== current;
    const age = status?.updatedAt ? Math.floor((Date.now() - new Date(status.updatedAt).getTime()) / DAY) : null;

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const value = text.trim();
            // Campo vazio esconde o card "Agora"
            const res = await fetch("/api/site-status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: value, active: value.length > 0 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Erro ao salvar");
            onSaved(data);
            toast({ title: value ? "Status atualizado" : "Status removido", className: "border-rc-border-card bg-rc-surface text-rc-ink" });
        } catch (err: any) {
            setError(err?.message || "Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={save} className="rounded-rc-card border border-rc-border-card bg-rc-surface p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
                <label htmlFor={NOW_INPUT_ID} className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[.12em] text-rc-ink-4">
                    <span className={cn("h-2 w-2 rounded-full", current ? "bg-rc-green" : "bg-rc-ink-6")} aria-hidden="true" />
                    Agora
                </label>
                <span className="font-mono text-[11px] text-rc-ink-5">
                    {loading ? "" : !current ? "sem status" : age === null ? "" : age === 0 ? "atualizado hoje" : `atualizado há ${age} ${age === 1 ? "dia" : "dias"}`}
                </span>
            </div>
            <div className="mt-3 flex flex-col gap-2.5 md:flex-row">
                {loading ? (
                    <Skeleton className="h-12 rounded-[10px] md:flex-1" />
                ) : (
                    <input
                        id={NOW_INPUT_ID}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={120}
                        placeholder="No que você está trabalhando agora?"
                        className="h-12 min-w-0 rounded-[10px] border border-rc-border-strong bg-rc-input md:flex-1 px-3.5 text-[15px] text-rc-ink placeholder:text-rc-ink-6 focus:border-rc-blue-link focus:outline-none"
                    />
                )}
                <button type="submit" disabled={loading || saving || !dirty} className={buttonClasses({ variant: "primary", size: "lg", className: "h-12 md:min-w-[110px]" })}>
                    {saving ? "Salvando…" : "Salvar"}
                </button>
            </div>
            <div className="mt-2 flex justify-between gap-3 font-mono text-[11px] text-rc-ink-5">
                <span role={error ? "alert" : undefined} className={error ? "text-rc-amber" : undefined}>
                    {error || "Aparece no card “Agora” da home. Vazio esconde o card."}
                </span>
                <span className="shrink-0 tabular-nums">{text.length}/120</span>
            </div>
        </form>
    );
}

function MetricCard({ label, value, sub, subTone = "muted", title }: { label: string; value: string | null; sub?: string | null; subTone?: "up" | "muted" | "amber"; title?: string }) {
    return (
        <div className="rounded-[13px] border border-rc-border-card bg-rc-surface p-3.5 md:rounded-rc-card md:p-5" title={title}>
            <div className="font-mono text-[10px] uppercase tracking-[.1em] text-rc-ink-5 md:text-[10.5px]">{label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-.03em] text-rc-ink md:text-[28px]">{value ?? "—"}</div>
            {sub && (
                <div className={cn("mt-1 font-mono text-[11px]", subTone === "up" ? "text-rc-green" : subTone === "amber" ? "text-rc-amber" : "text-rc-ink-4")}>
                    {sub}
                </div>
            )}
        </div>
    );
}

function VisitsChart({ visits }: { visits: Visits | null }) {
    const max = visits ? Math.max(1, ...visits.daily.map((d) => d.count)) : 1;
    const total = visits?.current ?? 0;
    return (
        <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-4 md:p-5">
            <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-medium text-rc-ink">Visitas por dia</span>
                <span className="font-mono text-[10.5px] text-rc-ink-5">30d</span>
            </div>
            {!visits ? (
                <p className="mt-4 text-sm text-rc-ink-5">Sem dados de visitas.</p>
            ) : (
                <div
                    role="img"
                    aria-label={`Visitantes únicos por dia nos últimos 30 dias; pico de ${max === 1 && total === 0 ? 0 : max} em um dia.`}
                    className="mt-3.5 flex h-[78px] items-end gap-[3px] md:h-[120px] md:gap-1"
                >
                    {visits.daily.map((d) => {
                        const peak = d.count > 0 && d.count === max;
                        return (
                            <span
                                key={d.day}
                                title={`${d.day.split("-").reverse().slice(0, 2).join("/")}: ${d.count}`}
                                className={cn("flex-1 rounded-[2px]", peak ? "bg-rc-blue" : "bg-rc-blue-logo")}
                                style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AttentionList({ items, loading }: { items: Attention[]; loading: boolean }) {
    const focusNow = () => {
        const el = document.getElementById(NOW_INPUT_ID) as HTMLInputElement | null;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
    };
    if (loading) {
        return (
            <div className="flex flex-col gap-[9px]">
                <Skeleton className="h-[50px] rounded-xl" />
                <Skeleton className="h-[50px] rounded-xl" />
            </div>
        );
    }
    if (items.length === 0) return <p className="text-sm text-rc-ink-5">Nada pendente.</p>;
    return (
        <ul className="flex flex-col gap-[9px]">
            {items.map((it) => {
                const Icon = it.urgent ? AlertCircle : it.icon;
                const cls = cn(
                    "flex min-h-[50px] w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
                    it.urgent ? "border-rc-amber-border-soft bg-rc-amber-surface-2 hover:border-rc-amber-border" : "border-rc-border-card bg-rc-surface hover:border-rc-border-hover",
                );
                const inner = (
                    <>
                        <Icon className={cn("h-[17px] w-[17px] shrink-0", it.urgent ? "text-rc-amber" : "text-rc-blue-soft")} aria-hidden="true" />
                        <span className="flex-1 text-[14.5px] text-rc-ink">{it.text}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-rc-ink-6" aria-hidden="true" />
                    </>
                );
                return (
                    <li key={it.id}>
                        {it.href ? (
                            <Link href={it.href} className={cls}>{inner}</Link>
                        ) : (
                            <button type="button" onClick={focusNow} className={cls}>{inner}</button>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

// Coleções que podem ter cache invalidado
const cacheableCollections = [
    { name: 'posts', label: 'Posts', icon: FileText },
    { name: 'challenges', label: 'Desafios', icon: Code2 },
    { name: 'sales_pages', label: 'Páginas de venda', icon: ShoppingCart },
    { name: 'setup', label: 'Setup', icon: Settings },
    { name: 'links', label: 'Links', icon: LinkIcon },
    { name: 'social_links', label: 'Links sociais', icon: Share2 },
    { name: 'assets', label: 'Assets', icon: Folder },
    { name: 'ads', label: 'Anúncios', icon: Image },
    { name: 'feature_flags', label: 'Feature flags', icon: Flag },
];

function CacheSection() {
    const { toast } = useToast();
    const [invalidating, setInvalidating] = useState<string | null>(null);

    const handleInvalidateCache = async (collection: string) => {
        setInvalidating(collection);
        try {
            const response = await fetch('/api/cache/invalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao invalidar cache');
            toast({ title: "Cache limpo", description: data.message, className: "border-rc-border-card bg-rc-surface text-rc-ink" });
        } catch (error: any) {
            toast({ title: "Erro", description: error.message || "Erro ao invalidar cache", variant: "destructive" });
        } finally {
            setInvalidating(null);
        }
    };

    return (
        <section>
            <SectionTitle icon={RefreshCw}>Gerenciamento de cache</SectionTitle>
            <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-4 md:p-[22px]">
                <p className="text-sm text-rc-ink-4 md:text-[14.5px]">Limpe o cache de coleções específicas para forçar atualização dos dados.</p>
                <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4">
                    {cacheableCollections.map((item) => {
                        const Icon = item.icon;
                        const busy = invalidating === item.name;
                        return (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() => handleInvalidateCache(item.name)}
                                disabled={busy}
                                className="flex min-h-[44px] items-center gap-[9px] rounded-[9px] border border-rc-border-chip bg-rc-input px-3.5 py-[11px] text-left text-sm text-rc-ink transition-colors hover:border-rc-border-hover disabled:opacity-60"
                            >
                                <Icon className="h-4 w-4 shrink-0 text-rc-ink-6" aria-hidden="true" />
                                <span className="truncate">{item.label}</span>
                                {busy && <RefreshCw className="ml-auto h-3 w-3 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [nowStatus, setNowStatus] = useState<SiteStatus | null>(null);
    const [nowLoading, setNowLoading] = useState(true);
    const loadedRef = useRef(false);

    const load = useCallback(async () => {
        // Status "Agora" chega antes; as métricas podem demorar mais
        void safe(fetch("/api/site-status", { cache: "no-store" }).then((r) => r.json() as Promise<SiteStatus | null>)).then((s) => {
            setNowStatus(s);
            setNowLoading(false);
        });
        setData(await loadDashboard());
    }, []);

    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;
        void load();
    }, [load]);

    const attention = useMemo<Attention[]>(() => {
        if (!data) return [];
        const list: Attention[] = [];
        const n = (v: number, one: string, many: string) => `${v} ${v === 1 ? one : many}`;
        if (data.pendingReferrals) {
            list.push({ id: "referrals", icon: AlertCircle, urgent: true, href: "/admin/referrals?status=new", text: `${n(data.pendingReferrals, "indicação de vaga aguardando", "indicações de vaga aguardando")} revisão` });
        }
        if (data.pendingSubmissions) {
            list.push({ id: "submissions", icon: AlertCircle, urgent: true, href: "/admin/submissions", text: `${n(data.pendingSubmissions, "solução de desafio", "soluções de desafio")} para revisar` });
        }
        if (data.staleDrafts) {
            list.push({ id: "drafts", icon: FileText, urgent: false, href: "/admin/editor/posts?status=draft", text: `${n(data.staleDrafts, "rascunho parado", "rascunhos parados")} há mais de 14 dias` });
        }
        if (nowStatus?.active && nowStatus.updatedAt) {
            const age = Math.floor((Date.now() - new Date(nowStatus.updatedAt).getTime()) / DAY);
            if (age > 14) list.push({ id: "now", icon: Clock, urgent: false, focusNow: true, text: `Seu status 'Agora' tem ${age} dias` });
        }
        if (data.mediakitUnreviewed) {
            list.push({ id: "mediakit", icon: Megaphone, urgent: false, href: "/admin/mediakit", text: "Media kit com textos não revisados" });
        }
        return list;
    }, [data, nowStatus]);

    const visits = data?.visits ?? null;
    const visitsDelta = visits && visits.previous > 0 ? Math.round(((visits.current - visits.previous) / visits.previous) * 100) : null;
    const subs = data?.subscribers;
    const firstName = authorInfo.name.split(" ")[0];

    return (
        <div className="flex flex-col gap-7 px-4 py-5 md:gap-9 md:p-8">
            <div>
                <h1 className="text-[23px] font-semibold tracking-[-.028em] md:text-[30px] md:tracking-[-.03em]">
                    <span className="md:hidden">{greeting()}, {firstName}</span>
                    <span className="hidden md:inline">Dashboard administrativo</span>
                </h1>
                <p className="mt-1.5 text-sm text-rc-ink-4 md:mt-2 md:text-base">Últimos 30 dias.</p>
            </div>

            <NowStatusField status={nowStatus} loading={nowLoading} onSaved={setNowStatus} />

            {/* Métricas */}
            <section aria-label="Métricas dos últimos 30 dias" className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-[9px] md:grid-cols-4 md:gap-3.5">
                    {!data ? (
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[98px] rounded-[13px] md:h-[122px]" />)
                    ) : (
                        <>
                            <MetricCard
                                label="Visitas"
                                value={visits ? compact(visits.current) : null}
                                sub={visits ? (visitsDelta === null ? "sem base anterior" : `${visitsDelta > 0 ? "+" : ""}${visitsDelta}%`) : null}
                                subTone={visitsDelta !== null && visitsDelta > 0 ? "up" : "muted"}
                                title={visits ? `${visits.current} visitantes únicos (30 dias anteriores: ${visits.previous})` : undefined}
                            />
                            <MetricCard
                                label="Inscritos"
                                value={subs?.available && typeof subs.total === "number" ? compact(subs.total) : null}
                                sub={subs?.available && typeof subs.last30 === "number" ? `+${subs.last30}` : null}
                                subTone={subs?.available && (subs.last30 ?? 0) > (subs.prev30 ?? 0) ? "up" : "muted"}
                                title={subs?.available ? `${subs.last30} novos nos últimos 30 dias (anteriores: ${subs.prev30})` : undefined}
                            />
                            <MetricCard
                                label="Posts"
                                value={data.published === null ? null : String(data.published)}
                                sub={data.drafts === null ? null : `${data.drafts} ${data.drafts === 1 ? "rascunho" : "rascunhos"}`}
                            />
                            <MetricCard
                                label="Vagas"
                                value={data.vagas === null ? null : String(data.vagas)}
                                sub={data.pendingReferrals === null ? null : `${data.pendingReferrals} ${data.pendingReferrals === 1 ? "pendente" : "pendentes"}`}
                                subTone={data.pendingReferrals ? "amber" : "muted"}
                            />
                        </>
                    )}
                </div>
                {!data ? <Skeleton className="h-[140px] md:h-[182px]" /> : <VisitsChart visits={visits} />}
            </section>

            <section>
                <SectionTitle>Precisa da sua atenção</SectionTitle>
                <AttentionList items={attention} loading={!data} />
            </section>

            <CacheSection />
        </div>
    );
}
