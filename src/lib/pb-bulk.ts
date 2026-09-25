import { pbDelete, pbUpdate } from './pocketbase';

// Limite de requisições simultâneas nas ações em massa do admin
export const BULK_CONCURRENCY = 5;

export type BulkResult = {
  ok: string[];
  failed: string[];
};

/**
 * Executa `fn` para cada id com no máximo `limit` chamadas em paralelo.
 * Nunca lança: devolve quais ids deram certo e quais falharam.
 */
export async function runBulk(
  ids: string[],
  fn: (id: string) => Promise<unknown>,
  limit = BULK_CONCURRENCY,
): Promise<BulkResult> {
  const ok: string[] = [];
  const failed: string[] = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      try {
        await fn(id);
        ok.push(id);
      } catch {
        failed.push(id);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, ids.length) }, worker));
  return { ok, failed };
}

/** Atualiza cada registro com os dados devolvidos por `dataFor(id)` */
export function pbBulkUpdateEach(
  collection: string,
  ids: string[],
  dataFor: (id: string) => Record<string, unknown>,
): Promise<BulkResult> {
  return runBulk(ids, (id) => pbUpdate(collection, id, dataFor(id)));
}

export function pbBulkDeleteEach(collection: string, ids: string[]): Promise<BulkResult> {
  return runBulk(ids, (id) => pbDelete(collection, id));
}

/**
 * Exclui múltiplos registros de uma coleção (lança se algum falhar)
 */
export async function pbBulkDelete(collection: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { failed } = await pbBulkDeleteEach(collection, ids);
  if (failed.length > 0) {
    throw new Error(`${failed.length} de ${ids.length} registros falharam ao excluir`);
  }
}

/**
 * Atualiza múltiplos registros de uma coleção com os mesmos dados (lança se algum falhar)
 */
export async function pbBulkUpdate(collection: string, ids: string[], data: any): Promise<void> {
  if (ids.length === 0) return;
  const { failed } = await pbBulkUpdateEach(collection, ids, () => data);
  if (failed.length > 0) {
    throw new Error(`${failed.length} de ${ids.length} registros falharam ao atualizar`);
  }
}
