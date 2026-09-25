"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { pbList } from "@/lib/pocketbase";
import { pbBulkDeleteEach, pbBulkUpdateEach } from "@/lib/pb-bulk";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { EmptyState, ErrorState, Pill, Skeleton, buttonClasses } from "@/components/rc";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  /** Campo do PocketBase usado na ordenação (padrão: id da coluna) */
  sortField?: string;
  /** Largura da coluna no desktop (ex.: "130px"); sem valor = flexível */
  width?: string;
  align?: "left" | "right";
  className?: string;
};

export type RowAction = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  external?: boolean;
  onSelect?: () => void | Promise<void>;
  danger?: boolean;
};

export type BulkAction =
  | { id: string; label: string; kind: "update"; data: Record<string, unknown>; secondary?: boolean }
  | { id: string; label: string; kind: "delete" };

export type StatusOption = {
  label: string;
  value: string;
  /** Filtro PocketBase aplicado quando a opção está ativa */
  filter: string;
};

type DataTableProps<T extends { id: string }> = {
  collection: string;
  /** Nome aceito por /api/cache/invalidate — chamado após ações em massa */
  cacheCollection?: string;
  columns: DataTableColumn<T>[];
  rowActions?: (row: T) => RowAction[];
  bulkActions?: BulkAction[];
  /** Ordenação padrão do PocketBase quando nenhuma coluna está ordenada */
  defaultSort?: string;
  search?: { placeholder: string; fields: string[] };
  statusOptions?: StatusOption[];
  /** Cartão do mobile */
  mobile: {
    title: (row: T) => ReactNode;
    status?: (row: T) => ReactNode;
    meta?: (row: T) => ReactNode[];
    extra?: (row: T) => ReactNode;
    highlight?: (row: T) => boolean;
  };
  rowLabel: (row: T) => string;
  create?: { href: string; label: string };
  emptyMessage: string;
  /** "client": carrega a lista inteira e ordena/pagina no cliente */
  mode?: "server" | "client";
};

type SortState = { column: string; dir: "asc" | "desc" } | null;

/* ------------------------------------------------------------------ */
/* Presets de ações em massa (F §3.15)                                 */
/* ------------------------------------------------------------------ */

const DELETE_ACTION: BulkAction = { id: "delete", label: "Excluir", kind: "delete" };

// posts, desafios, projetos, vendas, assets
export const CONTENT_BULK_ACTIONS: BulkAction[] = [
  { id: "publish", label: "Publicar", kind: "update", data: { status: "published" } },
  { id: "unpublish", label: "Despublicar", kind: "update", data: { status: "draft" }, secondary: true },
  DELETE_ACTION,
];

// links, setup, social
export const VISIBILITY_BULK_ACTIONS: BulkAction[] = [
  { id: "show", label: "Mostrar", kind: "update", data: { visible: true } },
  { id: "hide", label: "Ocultar", kind: "update", data: { visible: false }, secondary: true },
  DELETE_ACTION,
];

// anúncios
export const AD_BULK_ACTIONS: BulkAction[] = [
  { id: "activate", label: "Ativar", kind: "update", data: { status: "active" } },
  { id: "pause", label: "Pausar", kind: "update", data: { status: "paused" }, secondary: true },
  DELETE_ACTION,
];

export const CONTENT_STATUS_OPTIONS: StatusOption[] = [
  { label: "Publicados", value: "published", filter: "status = 'published'" },
  { label: "Rascunhos", value: "draft", filter: "status != 'published'" },
];

export const VISIBILITY_STATUS_OPTIONS: StatusOption[] = [
  { label: "Visíveis", value: "visible", filter: "visible = true" },
  { label: "Ocultos", value: "hidden", filter: "visible = false" },
];

/* ------------------------------------------------------------------ */
/* Pequenos componentes compartilhados                                 */
/* ------------------------------------------------------------------ */

// Pílula de status: verde = publicado, âmbar = rascunho
export function ContentStatusPill({ status }: { status?: string }) {
  return status === "published" ? <Pill tone="green">publicado</Pill> : <Pill tone="amber">rascunho</Pill>;
}

export function VisibilityPill({ visible }: { visible?: boolean }) {
  return visible === false ? <Pill tone="neutral">oculto</Pill> : <Pill tone="green">visível</Pill>;
}

export function MonoMeta({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-xs text-rc-ink-4", className)}>{children}</span>;
}

function RcCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
  size = 16,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  size?: 16 | 18;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  const on = checked || indeterminate;
  return (
    // O label amplia a área de toque para 44px sem mudar o desenho
    <label className={cn("relative inline-grid cursor-pointer place-items-center", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="peer absolute inset-0 cursor-pointer opacity-0"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className={cn(
          "grid place-items-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-rc-blue-link",
          on ? "border-rc-blue bg-rc-blue text-white" : "border-rc-border-strong bg-rc-surface-2",
        )}
      >
        {indeterminate ? <Minus className="h-3 w-3" strokeWidth={3} /> : checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
    </label>
  );
}

function RowActionsMenu({ actions, label, className }: { actions: RowAction[]; label: string; className?: string }) {
  if (actions.length === 0) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`Ações para ${label}`}
        className={cn(
          "grid place-items-center rounded-lg text-rc-ink-5 transition-colors hover:bg-rc-nav-hover hover:text-rc-blue-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rc-blue-link data-[state=open]:bg-rc-nav-hover data-[state=open]:text-rc-ink",
          className,
        )}
      >
        <MoreVertical className="h-[17px] w-[17px]" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px] rounded-[10px] border-rc-border-card bg-rc-surface p-1 text-rc-ink">
        {actions.map((a) => {
          const Icon = a.icon;
          const inner = (
            <>
              {Icon && <Icon className={cn("h-4 w-4", a.danger ? "text-rc-red" : "text-rc-ink-5")} aria-hidden="true" />}
              {a.label}
            </>
          );
          const itemCls = cn(
            "flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm focus:bg-rc-nav-hover",
            a.danger ? "text-rc-red focus:text-rc-red" : "text-rc-ink-2 focus:text-rc-ink",
          );
          if (a.href) {
            return (
              <DropdownMenuItem key={a.label} asChild className={itemCls}>
                {a.external ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <Link href={a.href}>{inner}</Link>
                )}
              </DropdownMenuItem>
            );
          }
          return (
            <DropdownMenuItem key={a.label} className={itemCls} onSelect={() => void a.onSelect?.()}>
              {inner}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------ */
/* URL (?sort=coluna:asc&status=…)                                      */
/* ------------------------------------------------------------------ */

function readUrl(): { sort: SortState; status: string } {
  if (typeof window === "undefined") return { sort: null, status: "" };
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("sort") || "";
  const [column, dir] = raw.split(":");
  const sort: SortState = column && (dir === "asc" || dir === "desc") ? { column, dir } : null;
  return { sort, status: params.get("status") || "" };
}

function writeUrl(sort: SortState, status: string) {
  const url = new URL(window.location.href);
  if (sort) url.searchParams.set("sort", `${sort.column}:${sort.dir}`);
  else url.searchParams.delete("sort");
  if (status) url.searchParams.set("status", status);
  else url.searchParams.delete("status");
  // Mantém "sort=coluna:asc" legível na URL
  url.search = url.searchParams.toString().replace(/%3A/gi, ":");
  window.history.replaceState(window.history.state, "", url.toString());
}

function escapeFilter(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null || a === "") return 1;
  if (b == null || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a).localeCompare(String(b), "pt-BR", { numeric: true, sensitivity: "base" });
}

async function invalidateCache(collection?: string) {
  if (!collection) return;
  try {
    await fetch("/api/cache/invalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection }),
    });
  } catch {
    /* o cache expira sozinho */
  }
}

/* ------------------------------------------------------------------ */
/* DataTable                                                           */
/* ------------------------------------------------------------------ */

const PER_PAGE_OPTIONS = [10, 20, 50, 100];
// Altura da barra de abas do admin no mobile (ver MobileNav)
const TAB_BAR_OFFSET = "calc(72px + env(safe-area-inset-bottom))";

export function DataTable<T extends { id: string }>({
  collection,
  cacheCollection,
  columns,
  rowActions,
  bulkActions = [],
  defaultSort,
  search,
  statusOptions,
  mobile,
  rowLabel,
  create,
  emptyMessage,
  mode = "server",
}: DataTableProps<T>) {
  const { toast } = useToast();

  const [ready, setReady] = useState(false);
  const [rows, setRows] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sort, setSort] = useState<SortState>(null);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[]; typed: string } | null>(null);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [bulkSheetOpen, setBulkSheetOpen] = useState(false);

  // Estado inicial vem da URL
  useEffect(() => {
    const initial = readUrl();
    const validSort = initial.sort && columns.some((c) => c.id === initial.sort!.column && c.sortable) ? initial.sort : null;
    const validStatus = statusOptions?.some((o) => o.value === initial.status) ? initial.status : "";
    setSort(validSort);
    setStatus(validStatus);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) writeUrl(sort, status);
  }, [ready, sort, status]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Seleção e página zeram ao trocar filtro
  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [status, debouncedQuery, perPage]);

  const filter = useMemo(() => {
    const parts: string[] = [];
    if (debouncedQuery && search?.fields.length) {
      const q = escapeFilter(debouncedQuery);
      parts.push(`(${search.fields.map((f) => `${f} ~ "${q}"`).join(" || ")})`);
    }
    const opt = statusOptions?.find((o) => o.value === status);
    if (opt) parts.push(`(${opt.filter})`);
    return parts.length ? parts.join(" && ") : undefined;
  }, [debouncedQuery, search, statusOptions, status]);

  const pbSort = useMemo(() => {
    if (!sort) return defaultSort || undefined;
    const col = columns.find((c) => c.id === sort.column);
    const field = col?.sortField || sort.column;
    return sort.dir === "desc" ? `-${field}` : field;
  }, [sort, defaultSort, columns]);

  const load = useCallback(async () => {
    if (!ready) return;
    setLoading(true);
    setError(null);
    try {
      if (mode === "client") {
        // Lista inteira (filtrada no servidor); ordenação e paginação no cliente
        const res = await pbList(collection, { page: 1, perPage: 500, filter, sort: defaultSort || undefined });
        setRows(res.items as unknown as T[]);
        setTotalItems(res.items.length);
      } else {
        const res = await pbList(collection, { page, perPage, filter, sort: pbSort });
        setRows(res.items as unknown as T[]);
        setTotalItems(res.totalItems);
        setTotalPages(Math.max(1, res.totalPages));
      }
    } catch (e: any) {
      setError(e?.message || "Não foi possível carregar a lista.");
    } finally {
      setLoading(false);
    }
  }, [ready, mode, collection, page, perPage, filter, pbSort, defaultSort]);

  useEffect(() => {
    load();
  }, [load]);

  // Refetch externo (ex.: toggle de flag)
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("datatable:refetch", handler);
    return () => window.removeEventListener("datatable:refetch", handler);
  }, [load]);

  // Linhas visíveis na página atual
  const pageRows = useMemo(() => {
    if (mode !== "client") return rows;
    let list = rows;
    if (sort) {
      const col = columns.find((c) => c.id === sort.column);
      const field = col?.sortField || sort.column;
      list = [...rows].sort((a, b) => {
        const r = compareValues((a as any)[field], (b as any)[field]);
        return sort.dir === "asc" ? r : -r;
      });
    }
    return list.slice((page - 1) * perPage, page * perPage);
  }, [mode, rows, sort, columns, page, perPage]);

  const pages = mode === "client" ? Math.max(1, Math.ceil(rows.length / perPage)) : totalPages;

  const changePage = (next: number) => {
    setPage(next);
    setSelected(new Set());
  };

  const toggleSort = (columnId: string) => {
    setSelected(new Set());
    setPage(1);
    setSort((prev) => {
      if (!prev || prev.column !== columnId) return { column: columnId, dir: "asc" };
      if (prev.dir === "asc") return { column: columnId, dir: "desc" };
      return null;
    });
  };

  const pageIds = pageRows.map((r) => r.id);
  const selectedOnPage = pageIds.filter((id) => selected.has(id));
  const allSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(pageIds) : new Set());
  const toggleRow = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  /* ---------------- ações em massa ---------------- */

  const plural = (n: number) => (n === 1 ? "item" : "itens");

  const undoUpdate = async (ids: string[], previous: Record<string, Record<string, unknown>>) => {
    setBusy(true);
    const res = await pbBulkUpdateEach(collection, ids, (id) => previous[id]);
    setBusy(false);
    toast({
      title: res.failed.length ? `${res.ok.length} de ${ids.length} restaurados` : "Ação desfeita",
      className: "border-rc-border-card bg-rc-surface text-rc-ink",
    });
    void invalidateCache(cacheCollection);
    load();
  };

  const runUpdate = async (action: Extract<BulkAction, { kind: "update" }>) => {
    const ids = rows.filter((r) => selected.has(r.id)).map((r) => r.id);
    if (!ids.length) return;
    // Guarda os valores anteriores de cada campo alterado para o "Desfazer"
    const previous: Record<string, Record<string, unknown>> = {};
    for (const row of rows) {
      if (!selected.has(row.id)) continue;
      previous[row.id] = Object.fromEntries(Object.keys(action.data).map((k) => [k, (row as any)[k] ?? null]));
    }
    setBusy(true);
    const res = await pbBulkUpdateEach(collection, ids, () => action.data);
    setBusy(false);
    setSelected(new Set(res.failed));
    const total = ids.length;
    toast({
      title: res.failed.length ? `${res.ok.length} de ${total} atualizados` : `${total} ${plural(total)} atualizado${total === 1 ? "" : "s"}`,
      description: action.label,
      duration: 6000,
      className: "border-rc-border-card bg-rc-surface text-rc-ink",
      action: res.ok.length ? (
        <ToastAction
          altText="Desfazer"
          onClick={() => undoUpdate(res.ok, previous)}
          className="border-rc-border-strong text-rc-blue-link hover:bg-rc-nav-hover"
        >
          Desfazer
        </ToastAction>
      ) : undefined,
    });
    void invalidateCache(cacheCollection);
    load();
  };

  const runDelete = async (ids: string[]) => {
    setConfirmDelete(null);
    setBusy(true);
    const res = await pbBulkDeleteEach(collection, ids);
    setBusy(false);
    setSelected(new Set(res.failed));
    toast({
      title: res.failed.length ? `${res.ok.length} de ${ids.length} excluídos` : `${ids.length} ${plural(ids.length)} excluído${ids.length === 1 ? "" : "s"}`,
      className: "border-rc-border-card bg-rc-surface text-rc-ink",
    });
    void invalidateCache(cacheCollection);
    load();
  };

  const triggerBulk = (action: BulkAction) => {
    setBulkSheetOpen(false);
    if (action.kind === "delete") {
      setConfirmDelete({ ids: rows.filter((r) => selected.has(r.id)).map((r) => r.id), typed: "" });
    } else {
      void runUpdate(action);
    }
  };

  const selectedCount = selected.size;
  const secondaryAction = bulkActions.find((a) => a.kind === "update" && a.secondary) || bulkActions[0];
  const sortableColumns = columns.filter((c) => c.sortable);
  const statusLabel = statusOptions?.find((o) => o.value === status)?.label;

  /* ---------------- render ---------------- */

  const inputCls =
    "w-full bg-transparent text-[14.5px] text-rc-ink placeholder:text-rc-ink-6 focus:outline-none";

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
        <div className="flex gap-2">
          {search && (
            <label className="flex h-[46px] flex-1 items-center gap-2.5 rounded-[11px] border border-rc-border-chip bg-rc-surface px-[13px] focus-within:border-rc-border-hover md:h-auto md:rounded-[10px] md:px-[15px] md:py-[11px]">
              <Search className="h-4 w-4 shrink-0 text-rc-ink-6" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={search.placeholder}
                aria-label={search.placeholder}
                className={inputCls}
              />
            </label>
          )}
          {/* Ordenação no mobile */}
          {sortableColumns.length > 0 && (
            <button
              type="button"
              onClick={() => setSortSheetOpen(true)}
              aria-label="Ordenar"
              className={cn(
                "grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[11px] border md:hidden",
                sort ? "border-rc-border-hover bg-rc-blue-chip text-rc-blue-link" : "border-rc-border-chip bg-rc-surface text-rc-ink-3",
              )}
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          )}
        </div>
        {statusOptions && statusOptions.length > 0 && (
          <>
            {/* Chips no mobile */}
            <div className="-mx-4 flex gap-[7px] overflow-x-auto px-4 [scrollbar-width:none] md:hidden" role="group" aria-label="Filtrar por status">
              {[{ label: "Todos", value: "" }, ...statusOptions].map((o) => {
                const active = status === o.value;
                return (
                  <button
                    key={o.value || "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStatus(o.value)}
                    className={cn(
                      "inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-full border px-[13px] text-[13px]",
                      active ? "border-rc-border-hover bg-rc-blue-chip text-rc-ink" : "border-rc-border-card bg-rc-surface text-rc-ink-3",
                    )}
                  >
                    {o.label}
                    {active && !loading && <span className="text-rc-blue-link">{totalItems}</span>}
                  </button>
                );
              })}
            </div>
            {/* Select no desktop */}
            <label className="relative hidden md:block">
              <span className="sr-only">Filtrar por status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-full min-w-[160px] cursor-pointer appearance-none rounded-[10px] border border-rc-border-chip bg-rc-surface py-[11px] pl-[15px] pr-10 text-[14.5px] text-rc-ink-2 focus:border-rc-border-hover focus:outline-none"
              >
                <option value="">Todos</option>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rc-ink-6" aria-hidden="true" />
            </label>
          </>
        )}
      </div>

      {/* Barra de ações em massa — desktop */}
      {bulkActions.length > 0 && selectedCount > 0 && (
        <div className="hidden items-center justify-between gap-4 rounded-xl border border-rc-border-hover bg-rc-blue-chip px-4 py-3 md:flex" role="region" aria-label="Ações em massa">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-rc-blue-soft" aria-live="polite">
              {selectedCount} {selectedCount === 1 ? "item selecionado" : "itens selecionados"}
            </span>
            <button type="button" onClick={() => setSelected(new Set())} className="font-mono text-xs text-rc-ink-5 hover:text-rc-ink">
              limpar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-[13.5px]">
            {bulkActions.map((a) =>
              a.kind === "delete" ? (
                <button
                  key={a.id}
                  type="button"
                  disabled={busy}
                  onClick={() => triggerBulk(a)}
                  className="inline-flex items-center gap-[7px] rounded-lg border border-rc-border-strong bg-rc-surface px-3.5 py-2 text-rc-red transition-colors hover:border-rc-red disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {a.label} ({selectedCount})
                </button>
              ) : (
                <button
                  key={a.id}
                  type="button"
                  disabled={busy}
                  onClick={() => triggerBulk(a)}
                  className="rounded-lg border border-rc-border-strong bg-rc-surface px-3.5 py-2 text-rc-ink transition-colors hover:border-rc-border-hover disabled:opacity-60"
                >
                  {a.label} ({selectedCount})
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Estados */}
      {error && !loading ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading || !ready ? (
        <>
          <div className="hidden overflow-hidden rounded-rc-card border border-rc-border-card bg-rc-surface md:block" aria-busy="true">
            <div className="h-[42px] border-b border-rc-border-card" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b border-rc-border-card px-5 py-[15px] last:border-0">
                <Skeleton className="h-[34px] rounded-lg" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[9px] md:hidden" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[86px] rounded-[13px]" />
            ))}
          </div>
        </>
      ) : pageRows.length === 0 ? (
        <EmptyState
          message={debouncedQuery || status ? "Nada encontrado com esses filtros." : emptyMessage}
          action={
            debouncedQuery || status ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatus("");
                }}
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                Limpar filtros
              </button>
            ) : create ? (
              <Link href={create.href} className={buttonClasses({ variant: "primary", size: "sm" })}>
                <Plus className="h-4 w-4" aria-hidden="true" /> {create.label}
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Tabela — desktop */}
          <div className="hidden overflow-x-auto rounded-rc-card border border-rc-border-card bg-rc-surface md:block">
            <table className="w-full table-fixed border-collapse text-left">
              <colgroup>
                {bulkActions.length > 0 && <col style={{ width: 52 }} />}
                {columns.map((c) => (
                  <col key={c.id} style={c.width ? { width: c.width } : undefined} />
                ))}
                {rowActions && <col style={{ width: 64 }} />}
              </colgroup>
              <thead>
                <tr className="border-b border-rc-border-card font-mono text-[10.5px] uppercase tracking-[.12em] text-rc-ink-5">
                  {bulkActions.length > 0 && (
                    <th scope="col" className="py-2 pl-5 pr-0 font-normal">
                      <RcCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} label="Selecionar todos da página" className="h-7 w-7" />
                    </th>
                  )}
                  {columns.map((c) => {
                    const active = sort?.column === c.id;
                    return (
                      <th
                        key={c.id}
                        scope="col"
                        aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined}
                        className={cn("px-3 py-[13px] font-normal", c.align === "right" && "text-right")}
                      >
                        {c.sortable ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(c.id)}
                            className={cn(
                              "inline-flex items-center gap-1.5 uppercase tracking-[.12em] transition-colors hover:text-rc-ink",
                              active ? "text-rc-blue-soft" : "text-rc-ink-5",
                            )}
                          >
                            {c.header}
                            {active ? (
                              sort!.dir === "asc" ? <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 text-rc-ink-6" aria-hidden="true" />
                            )}
                          </button>
                        ) : (
                          c.header
                        )}
                      </th>
                    );
                  })}
                  {rowActions && (
                    <th scope="col" className="py-[13px] pl-3 pr-5 text-right font-normal">
                      <span className="sr-only">Ações</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  const isSel = selected.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-rc-border-card align-middle transition-colors last:border-0",
                        isSel ? "bg-rc-blue-surface" : "hover:bg-rc-surface-2",
                      )}
                    >
                      {bulkActions.length > 0 && (
                        <td className="py-2 pl-5 pr-0">
                          <RcCheckbox checked={isSel} onChange={(v) => toggleRow(row.id, v)} label={`Selecionar ${rowLabel(row)}`} className="h-7 w-7" />
                        </td>
                      )}
                      {columns.map((c) => (
                        <td key={c.id} className={cn("px-3 py-[15px]", c.align === "right" && "text-right", c.className)}>
                          {c.cell(row)}
                        </td>
                      ))}
                      {rowActions && (
                        <td className="py-2 pl-3 pr-5 text-right">
                          <RowActionsMenu actions={rowActions(row)} label={rowLabel(row)} className="ml-auto h-8 w-8" />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cartões — mobile */}
          <ul className="flex flex-col gap-[9px] md:hidden">
            {pageRows.map((row) => {
              const isSel = selected.has(row.id);
              const hl = mobile.highlight?.(row);
              const meta = (mobile.meta?.(row) ?? []).filter((m) => m !== "" && m != null && m !== false);
              return (
                <li
                  key={row.id}
                  className={cn(
                    "rounded-[13px] border py-2.5 pl-1.5 pr-1.5",
                    isSel ? "border-rc-border-hover bg-rc-blue-surface" : hl ? "border-rc-amber-border-soft bg-rc-amber-surface-2" : "border-rc-border-card bg-rc-surface",
                  )}
                >
                  <div className="flex items-start gap-0.5">
                    {bulkActions.length > 0 && (
                      <RcCheckbox checked={isSel} onChange={(v) => toggleRow(row.id, v)} label={`Selecionar ${rowLabel(row)}`} size={18} className="h-11 w-11 shrink-0 -mt-2" />
                    )}
                    <div className={cn("min-w-0 flex-1 pt-0.5", bulkActions.length === 0 && "pl-2.5")}>
                      <div className="text-[15px] font-medium leading-[1.35] text-rc-ink">{mobile.title(row)}</div>
                      {(mobile.status || meta.length > 0) && (
                        <div className="mt-[7px] flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-rc-ink-5">
                          {mobile.status?.(row)}
                          {meta.map((m, i) => (
                            <span key={i} className="flex items-center gap-2">
                              {(i > 0 || mobile.status) && <span aria-hidden="true">·</span>}
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                      {mobile.extra?.(row)}
                    </div>
                    {rowActions && <RowActionsMenu actions={rowActions(row)} label={rowLabel(row)} className="-mt-1.5 h-11 w-11 shrink-0" />}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Paginação */}
      {!error && totalItems > 0 && (
        <div className="flex flex-col gap-3 font-mono text-xs text-rc-ink-5 md:flex-row md:items-center md:justify-between">
          <span>
            Mostrando {(page - 1) * perPage + 1} a {Math.min(page * perPage, totalItems)} de {totalItems} {plural(totalItems)}
          </span>
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2">
              por página
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="h-9 cursor-pointer rounded-lg border border-rc-border-chip bg-rc-surface px-2.5 text-rc-ink-2 focus:outline-none"
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1 || loading}
              onClick={() => changePage(page - 1)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-rc-border-chip bg-rc-surface text-rc-ink-3 disabled:text-rc-ink-6 md:h-9 md:w-9"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-rc-ink-2">
              página {page} de {pages}
            </span>
            <button
              type="button"
              aria-label="Próxima página"
              disabled={page >= pages || loading}
              onClick={() => changePage(page + 1)}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-lg border md:h-9 md:w-9",
                page < pages ? "border-rc-border-hover bg-rc-blue-chip text-rc-blue-soft" : "border-rc-border-chip bg-rc-surface text-rc-ink-6",
              )}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Rodapé fixo do mobile: ações em massa + FAB de criar */}
      {(selectedCount > 0 || create) && (
        <>
          <div className="h-16 md:hidden" aria-hidden="true" />
          {selectedCount > 0 && bulkActions.length > 0 ? (
            <div
              className="fixed inset-x-0 z-30 flex items-center gap-2.5 border-t border-rc-border bg-rc-bg-admin px-4 pb-3 pt-3 md:hidden"
              style={{ bottom: TAB_BAR_OFFSET }}
              role="region"
              aria-label="Ações em massa"
            >
              <span className="flex-1 font-mono text-[11.5px] text-rc-ink-4" aria-live="polite">
                {selectedCount} {selectedCount === 1 ? "selecionado" : "selecionados"}
              </span>
              {secondaryAction && secondaryAction.kind === "update" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => triggerBulk(secondaryAction)}
                  className="h-11 rounded-[11px] border border-rc-border-card bg-rc-surface px-4 text-sm text-rc-ink-2 disabled:opacity-60"
                >
                  {secondaryAction.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => setBulkSheetOpen(true)}
                aria-label="Mais ações em massa"
                className="grid h-11 w-11 place-items-center rounded-[11px] border border-rc-border-card bg-rc-surface text-rc-ink-3"
              >
                <MoreHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              {create && (
                <Link href={create.href} aria-label={create.label} className="grid h-11 w-[52px] place-items-center rounded-[11px] bg-rc-blue text-white">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}
            </div>
          ) : (
            create && (
              <Link
                href={create.href}
                aria-label={create.label}
                className="fixed right-4 z-30 grid h-11 w-[52px] place-items-center rounded-[11px] bg-rc-blue text-white shadow-rc-primary md:hidden"
                style={{ bottom: `calc(${TAB_BAR_OFFSET} + 12px)` }}
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </Link>
            )
          )}
        </>
      )}

      {/* Folha: todas as ações em massa (mobile) */}
      <Sheet open={bulkSheetOpen} onOpenChange={setBulkSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-rc-card-lg border-rc-border bg-rc-bg-admin px-4 pt-5 text-rc-ink" style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
          <SheetTitle className="text-[15.5px] font-semibold text-rc-ink">
            {selectedCount} {selectedCount === 1 ? "selecionado" : "selecionados"}
          </SheetTitle>
          <div className="mt-4 flex flex-col gap-2">
            {bulkActions.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={busy}
                onClick={() => triggerBulk(a)}
                className={cn(
                  "flex min-h-[48px] items-center gap-3 rounded-[11px] border px-4 text-left text-[15px]",
                  a.kind === "delete" ? "border-rc-border-strong bg-rc-surface text-rc-red" : "border-rc-border-card bg-rc-surface text-rc-ink",
                )}
              >
                {a.kind === "delete" && <Trash2 className="h-4 w-4" aria-hidden="true" />}
                {a.label}
              </button>
            ))}
            <button type="button" onClick={() => { setSelected(new Set()); setBulkSheetOpen(false); }} className="min-h-[48px] rounded-[11px] px-4 text-left text-[15px] text-rc-ink-4">
              Limpar seleção
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Folha: ordenação (mobile) */}
      <Sheet open={sortSheetOpen} onOpenChange={setSortSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-rc-card-lg border-rc-border bg-rc-bg-admin px-4 pt-5 text-rc-ink" style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}>
          <SheetTitle className="text-[15.5px] font-semibold text-rc-ink">Ordenar por</SheetTitle>
          {statusLabel && <p className="mt-1 font-mono text-[11px] text-rc-ink-5">filtro: {statusLabel}</p>}
          <div className="mt-4 flex flex-col gap-1">
            <SortOption active={!sort} label="Padrão" onClick={() => { setSort(null); setSortSheetOpen(false); }} />
            {sortableColumns.flatMap((c) =>
              (["asc", "desc"] as const).map((dir) => (
                <SortOption
                  key={`${c.id}-${dir}`}
                  active={sort?.column === c.id && sort.dir === dir}
                  label={`${c.header} ${dir === "asc" ? "↑ crescente" : "↓ decrescente"}`}
                  onClick={() => {
                    setSort({ column: c.id, dir });
                    setPage(1);
                    setSelected(new Set());
                    setSortSheetOpen(false);
                  }}
                />
              )),
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmação de exclusão: digitar o número de itens */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="max-w-[calc(100vw-32px)] rounded-rc-card-lg border-rc-border-card bg-rc-surface text-rc-ink sm:max-w-md">
          <DialogTitle className="text-lg font-semibold tracking-[-.02em]">
            Excluir {confirmDelete?.ids.length} {plural(confirmDelete?.ids.length ?? 0)}?
          </DialogTitle>
          <DialogDescription className="text-rc-small text-rc-ink-4">
            Não dá para desfazer. Digite <strong className="font-mono text-rc-ink">{confirmDelete?.ids.length}</strong> para confirmar.
          </DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (confirmDelete && confirmDelete.typed.trim() === String(confirmDelete.ids.length)) void runDelete(confirmDelete.ids);
            }}
            className="flex flex-col gap-3"
          >
            <input
              autoFocus
              inputMode="numeric"
              value={confirmDelete?.typed ?? ""}
              onChange={(e) => setConfirmDelete((prev) => (prev ? { ...prev, typed: e.target.value } : prev))}
              aria-label="Número de itens"
              className="h-12 rounded-[10px] border border-rc-border-strong bg-rc-input px-3.5 font-mono text-rc-ink focus:border-rc-border-hover focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmDelete(null)} className={buttonClasses({ variant: "secondary", size: "sm", className: "h-11 md:h-9" })}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!confirmDelete || confirmDelete.typed.trim() !== String(confirmDelete.ids.length)}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-rc-border-strong bg-rc-surface-2 px-3.5 text-[13.5px] font-medium text-rc-red transition-colors hover:border-rc-red disabled:opacity-50 md:h-9"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Excluir
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortOption({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-[46px] items-center justify-between rounded-[10px] px-3 text-left text-[15px]",
        active ? "bg-rc-blue-chip text-rc-ink" : "text-rc-ink-2 hover:bg-rc-nav-hover",
      )}
    >
      {label}
      {active && <Check className="h-4 w-4 text-rc-blue-link" aria-hidden="true" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Cabeçalho padrão das páginas de listagem                            */
/* ------------------------------------------------------------------ */

export function AdminListPage({
  title,
  description,
  create,
  actions,
  children,
}: {
  title: string;
  description?: string;
  create?: { href: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="px-4 py-5 md:p-8">
      {/* No mobile o título já está no header de 56px do shell */}
      <div className={cn("flex items-start justify-between gap-6 md:mb-[26px]", actions && "mb-4")}>
        <div>
          <h1 className="sr-only text-[30px] font-semibold tracking-[-.03em] text-rc-ink md:not-sr-only">{title}</h1>
          {description && <p className="hidden text-base text-rc-ink-4 md:mt-2 md:block">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {create && (
            <Link href={create.href} className={buttonClasses({ variant: "primary", size: "lg", className: "hidden md:inline-flex" })}>
              <Plus className="h-4 w-4" aria-hidden="true" /> {create.label}
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

