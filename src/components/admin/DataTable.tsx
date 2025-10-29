"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Search, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Column<T = any> = {
  id: string;
  header: string | ((props: { sortable?: boolean }) => React.ReactNode);
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

type BulkAction<T = any> = {
  label: string;
  action: (selectedRows: T[]) => Promise<void>;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
};

type FilterSchema = {
  q?: {
    placeholder?: string;
    searchFields: string[];
  };
  status?: {
    options: { label: string; value: string }[];
    placeholder?: string;
  };
  enabled?: {
    label?: string;
  };
};

type FetcherParams = {
  page: number;
  perPage: number;
  filter?: string;
  sort?: string;
};

type FetcherResult<T> = {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

type DataTableProps<T = any> = {
  columns: Column<T>[];
  fetcher: (params: FetcherParams) => Promise<FetcherResult<T>>;
  bulkActions?: BulkAction<T>[];
  defaultSort?: string;
  filtersSchema?: FilterSchema;
  getRowId: (row: T) => string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  onRefetch?: () => void; // Callback para forçar refetch externo
};

export function DataTable<T extends { id?: string }>({
  columns,
  fetcher,
  bulkActions = [],
  defaultSort,
  filtersSchema,
  getRowId,
  emptyMessage = "Nenhum item encontrado",
  emptyAction,
  onRefetch,
}: DataTableProps<T>) {
  const { toast } = useToast();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<string | undefined>(defaultSort);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [enabledFilter, setEnabledFilter] = useState<boolean | undefined>(undefined);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: () => Promise<void>;
    title: string;
    description: string;
  }>({
    open: false,
    action: async () => {},
    title: "",
    description: "",
  });

  const buildFilter = useCallback(() => {
    const filters: string[] = [];

    if (searchQuery && filtersSchema?.q?.searchFields) {
      const searchParts = filtersSchema.q.searchFields
        .map((field) => `${field} ~ "${searchQuery}"`)
        .join(" || ");
      if (searchParts) {
        filters.push(`(${searchParts})`);
      }
    }

    if (statusFilter) {
      filters.push(`status = '${statusFilter}'`);
    }

    if (enabledFilter !== undefined && filtersSchema?.enabled) {
      filters.push(`enabled = ${enabledFilter}`);
    }

    return filters.length > 0 ? filters.join(" && ") : undefined;
  }, [searchQuery, statusFilter, enabledFilter, filtersSchema]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const filter = buildFilter();
      // Evitar duplicar hífen se sort já começa com -
      let sortParam: string | undefined = undefined;
      if (sort) {
        const hasMinus = sort.startsWith('-');
        const cleanSort = hasMinus ? sort.slice(1) : sort;
        sortParam = `${sortDirection === "desc" ? "-" : ""}${cleanSort}`;
      }

      const result = await fetcher({
        page,
        perPage,
        filter,
        sort: sortParam,
      });

      setData(result.items);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao buscar os itens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sort, sortDirection, buildFilter, fetcher, toast]);

  // Escutar evento de refetch externo
  useEffect(() => {
    const handleRefetch = () => {
      loadData();
    };
    window.addEventListener('datatable:refetch', handleRefetch);
    return () => {
      window.removeEventListener('datatable:refetch', handleRefetch);
    };
  }, [loadData]);

  useEffect(() => {
    // Reset page when filters change
    if (page !== 1) {
      setPage(1);
    } else {
      loadData();
    }
  }, [searchQuery, statusFilter, enabledFilter]);

  useEffect(() => {
    loadData();
  }, [page, perPage, sort, sortDirection, loadData]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((row) => getRowId(row))));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSort = (columnId: string) => {
    if (sort === columnId) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSort(columnId);
      setSortDirection("desc");
    }
  };

  const handleBulkAction = async (action: BulkAction<T>) => {
    const selected = data.filter((row) => selectedRows.has(getRowId(row)));
    if (selected.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos um item para executar a ação",
        variant: "destructive",
      });
      return;
    }

    setConfirmDialog({
      open: true,
      action: async () => {
        try {
          await action.action(selected);
          toast({
            title: "Sucesso",
            description: `Ação executada em ${selected.length} item(ns)`,
          });
          setSelectedRows(new Set());
          loadData();
        } catch (error: any) {
          toast({
            title: "Erro",
            description: error.message || "Falha ao executar ação",
            variant: "destructive",
          });
        }
      },
      title: action.label,
      description: `Tem certeza que deseja ${action.label.toLowerCase()} ${selected.length} item(ns) selecionado(s)?`,
    });
  };

  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 items-center">
            {filtersSchema?.q && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={filtersSchema.q.placeholder || "Buscar..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setPage(1);
                    }
                  }}
                  className="pl-8"
                />
              </div>
            )}
            {filtersSchema?.status && (
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) => {
                  setStatusFilter(value === "all" ? "" : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={filtersSchema.status.placeholder || "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filtersSchema.status.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {filtersSchema?.enabled && (
              <Select
                value={enabledFilter === undefined ? "all" : enabledFilter.toString()}
                onValueChange={(value) => {
                  setEnabledFilter(value === "all" ? undefined : value === "true");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={filtersSchema.enabled.label || "Ativo?"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {bulkActions.length > 0 && selectedRows.size > 0 && (
            <div className="flex gap-2">
              {bulkActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || "default"}
                  size="sm"
                  onClick={() => handleBulkAction(action)}
                >
                  {action.icon}
                  {action.label} ({selectedRows.size})
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      column.sortable !== false && "cursor-pointer hover:bg-muted/50",
                      column.className
                    )}
                    onClick={() => column.sortable !== false && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      {typeof column.header === "function"
                        ? column.header({ sortable: column.sortable })
                        : column.header}
                      {column.sortable !== false && sort === column.id && (
                        <>
                          {sortDirection === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUp className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">{emptyMessage}</p>
                      {emptyAction}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const rowId = getRowId(row);
                  return (
                    <TableRow key={rowId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(rowId)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowId, checked as boolean)
                          }
                          aria-label={`Selecionar ${rowId}`}
                        />
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          {column.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {data.length === 0 ? 0 : (page - 1) * perPage + 1} a{" "}
            {Math.min(page * perPage, totalItems)} de {totalItems} itens
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Por página:</span>
              <Select
                value={perPage.toString()}
                onValueChange={(value) => {
                  setPerPage(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-3">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await confirmDialog.action();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
