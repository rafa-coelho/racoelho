"use client";
import { useState } from "react";
import { SquarePen } from "lucide-react";
import { pbUpdate } from "@/lib/pocketbase";
import { AdminListPage, DataTable } from "@/components/admin/DataTable";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Pill, buttonClasses } from "@/components/rc";

type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  description?: string;
  metadata?: any;
};

const CREATE = { href: "/admin/feature-flags/new", label: "Nova flag" };

const describe = (row: FeatureFlag): string | undefined => row.metadata?.description || row.description || undefined;

async function invalidateFlags() {
  try {
    await fetch("/api/cache/invalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: "feature_flags" }),
    });
  } catch {
    /* o cache de flags expira em 1 min */
  }
}

export default function FeatureFlagsPage() {
  const { toast } = useToast();
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ flag: FeatureFlag; newValue: boolean } | null>(null);

  const applyToggle = async () => {
    if (!confirm) return;
    const { flag, newValue } = confirm;
    setConfirm(null);
    setTogglingIds((prev) => new Set(prev).add(flag.id));
    try {
      await pbUpdate("feature_flags", flag.id, { enabled: newValue });
      toast({
        title: `Flag "${flag.key}" ${newValue ? "ativada" : "desativada"}`,
        className: "border-rc-border-card bg-rc-surface text-rc-ink",
      });
      void invalidateFlags();
      window.dispatchEvent(new CustomEvent("datatable:refetch"));
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.message || "Falha ao atualizar feature flag",
        variant: "destructive",
      });
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(flag.id);
        return next;
      });
    }
  };

  const toggle = (row: FeatureFlag) => (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={row.enabled}
        disabled={togglingIds.has(row.id)}
        onCheckedChange={(checked) => setConfirm({ flag: row, newValue: checked })}
        aria-label={`${row.enabled ? "Desativar" : "Ativar"} ${row.key}`}
      />
      {row.enabled ? <Pill tone="green">ativa</Pill> : <Pill>inativa</Pill>}
    </div>
  );

  return (
    <AdminListPage title="Feature Flags" description="Controle de funcionalidades do site." create={CREATE}>
      <DataTable<FeatureFlag>
        collection="feature_flags"
        cacheCollection="feature_flags"
        columns={[
          {
            id: "key",
            header: "Chave",
            sortable: true,
            cell: (row) => (
              <div className="min-w-0">
                <div className="truncate font-mono text-sm text-rc-ink">{row.key}</div>
                {describe(row) && <div className="mt-1 truncate text-[13px] text-rc-ink-5">{describe(row)}</div>}
              </div>
            ),
          },
          { id: "enabled", header: "Status", sortable: true, width: "180px", cell: toggle },
        ]}
        rowActions={(row) => [{ label: "Editar", icon: SquarePen, href: `/admin/feature-flags/${row.id}` }]}
        bulkActions={[
          { id: "enable", label: "Ativar", kind: "update", data: { enabled: true } },
          { id: "disable", label: "Desativar", kind: "update", data: { enabled: false }, secondary: true },
          { id: "delete", label: "Excluir", kind: "delete" },
        ]}
        defaultSort="key"
        search={{ placeholder: "Buscar por chave…", fields: ["key"] }}
        statusOptions={[
          { label: "Ativas", value: "on", filter: "enabled = true" },
          { label: "Inativas", value: "off", filter: "enabled = false" },
        ]}
        mobile={{
          title: (row) => <span className="font-mono text-sm">{row.key}</span>,
          meta: (row) => (describe(row) ? [describe(row)] : []),
          extra: (row) => <div className="mt-2.5">{toggle(row)}</div>,
        }}
        rowLabel={(row) => row.key}
        create={CREATE}
        emptyMessage="Nenhuma feature flag ainda."
      />

      {/* Confirmação do toggle individual */}
      <Dialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <DialogContent className="max-w-[calc(100vw-32px)] rounded-rc-card-lg border-rc-border-card bg-rc-surface text-rc-ink sm:max-w-md">
          <DialogTitle className="text-lg font-semibold tracking-[-.02em]">
            {confirm?.newValue ? "Ativar" : "Desativar"} feature flag
          </DialogTitle>
          <DialogDescription className="text-rc-small text-rc-ink-4">
            Tem certeza que deseja {confirm?.newValue ? "ativar" : "desativar"} <strong className="font-mono text-rc-ink">{confirm?.flag.key}</strong>?
            {confirm && describe(confirm.flag) && <span className="mt-2 block">{describe(confirm.flag)}</span>}
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setConfirm(null)} className={buttonClasses({ variant: "secondary", size: "sm", className: "h-11 md:h-9" })}>
              Cancelar
            </button>
            <button type="button" onClick={applyToggle} className={buttonClasses({ variant: "primary", size: "sm", className: "h-11 md:h-9" })}>
              Confirmar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  );
}
