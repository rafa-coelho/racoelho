"use client";
import { useState } from "react";
import Link from "next/link";
import { pbList, pbUpdate } from "@/lib/pocketbase";
import { pbBulkDelete, pbBulkUpdate } from "@/lib/pb-bulk";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  metadata?: any;
};

export default function FeatureFlagsPage() {
  const { toast } = useToast();
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    flag: FeatureFlag | null;
    newValue: boolean;
  }>({
    open: false,
    flag: null,
    newValue: false,
  });
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Feature Flags</h1>
          <p className="text-sm text-muted-foreground">Controle de funcionalidades do site</p>
        </div>
        <Link href="/admin/feature-flags/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nova Flag
        </Link>
      </div>

      <DataTable<FeatureFlag>
        columns={[
          {
            id: "key",
            header: "Chave",
            cell: (row) => (
              <div>
                <div className="font-medium">{row.key}</div>
                {row.metadata?.description && (
                  <div className="text-xs text-muted-foreground mt-1">{row.metadata.description}</div>
                )}
              </div>
            ),
            sortable: true,
          },
          {
            id: "enabled",
            header: "Status",
            cell: (row) => {
              const isToggling = togglingIds.has(row.id);
              return (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={row.enabled}
                    disabled={isToggling}
                    onCheckedChange={(checked) => {
                      setConfirmDialog({
                        open: true,
                        flag: row,
                        newValue: checked,
                      });
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {row.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              );
            },
            sortable: true,
          },
          {
            id: "actions",
            header: "Ações",
            cell: (row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/feature-flags/${row.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ),
            sortable: false,
          },
        ]}
        fetcher={async ({ page, perPage, filter, sort }) => {
          const res = await pbList("feature_flags", { page, perPage, filter, sort });
          return {
            items: res.items as unknown as FeatureFlag[],
            page: res.page,
            perPage: res.perPage,
            totalItems: res.totalItems,
            totalPages: res.totalPages,
          };
        }}
        bulkActions={[
          {
            label: "Excluir selecionados",
            variant: "destructive",
            action: async (selected) => {
              await pbBulkDelete("feature_flags", selected.map((s) => s.id));
            },
          },
          {
            label: "Ativar",
            action: async (selected) => {
              await pbBulkUpdate("feature_flags", selected.map((s) => s.id), { enabled: true });
            },
          },
          {
            label: "Desativar",
            action: async (selected) => {
              await pbBulkUpdate("feature_flags", selected.map((s) => s.id), { enabled: false });
            },
          },
        ]}
        defaultSort="key"
        filtersSchema={{
          q: {
            placeholder: "Buscar por chave...",
            searchFields: ["key"],
          },
          enabled: {
            label: "Status",
          },
        }}
        getRowId={(row) => row.id}
        emptyMessage="Nenhuma feature flag encontrada"
        emptyAction={
          <Link href="/admin/feature-flags/new" className="btn-primary mt-4 inline-flex">
            Criar primeira flag
          </Link>
        }
      />

      {/* Dialog de Confirmação */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.flag?.enabled ? 'Desativar' : 'Ativar'} Feature Flag
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja {confirmDialog.flag?.enabled ? 'desativar' : 'ativar'} a feature flag{' '}
              <strong>{confirmDialog.flag?.key}</strong>?
              {confirmDialog.flag?.metadata?.description && (
                <div className="mt-2 text-sm">
                  {confirmDialog.flag.metadata.description}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, flag: null, newValue: false })}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (!confirmDialog.flag) return;

                const flag = confirmDialog.flag;
                setConfirmDialog({ open: false, flag: null, newValue: false });
                setTogglingIds((prev) => new Set(prev).add(flag.id));
                
                try {
                  await pbUpdate("feature_flags", flag.id, { enabled: confirmDialog.newValue });
                  toast({
                    title: "Sucesso",
                    description: `Feature flag "${flag.key}" ${confirmDialog.newValue ? 'ativada' : 'desativada'}`,
                  });
                  // Recarregar dados automaticamente
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('datatable:refetch'));
                  }, 100);
                } catch (error: any) {
                  toast({
                    title: "Erro",
                    description: error.message || "Falha ao atualizar feature flag",
                    variant: "destructive",
                  });
                } finally {
                  setTogglingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(flag.id);
                    return next;
                  });
                }
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

