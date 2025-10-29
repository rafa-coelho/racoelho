import { pbDelete, pbUpdate } from './pocketbase';

/**
 * Exclui múltiplos registros de uma coleção
 */
export async function pbBulkDelete(collection: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  
  // Executar em paralelo com Promise.allSettled para não parar se algum falhar
  const results = await Promise.allSettled(
    ids.map(id => pbDelete(collection, id))
  );

  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    throw new Error(`${failed.length} de ${ids.length} registros falharam ao excluir`);
  }
}

/**
 * Atualiza múltiplos registros de uma coleção com os mesmos dados
 */
export async function pbBulkUpdate(collection: string, ids: string[], data: any): Promise<void> {
  if (ids.length === 0) return;

  const results = await Promise.allSettled(
    ids.map(id => pbUpdate(collection, id, data))
  );

  const failed = results.filter(r => r.status === 'rejected');
  if (failed.length > 0) {
    throw new Error(`${failed.length} de ${ids.length} registros falharam ao atualizar`);
  }
}
