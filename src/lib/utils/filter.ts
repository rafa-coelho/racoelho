/**
 * Constrói um filtro do PocketBase a partir de parâmetros
 */
export function buildFilter(params: {
  q?: string; // busca genérica
  status?: string;
  enabled?: boolean;
  searchFields?: string[]; // campos para buscar quando 'q' for fornecido
}): string | undefined {
  const filters: string[] = [];

  // Busca genérica
  if (params.q && params.searchFields && params.searchFields.length > 0) {
    // PocketBase: (field ~ "term" || field ~ "term")
    const searchParts = params.searchFields.map(field => `${field} ~ "${params.q}"`).join(' || ');
    if (searchParts) {
      filters.push(`(${searchParts})`);
    }
  }

  // Status
  if (params.status) {
    filters.push(`status = '${params.status}'`);
  }

  // Enabled (boolean)
  if (params.enabled !== undefined) {
    filters.push(`enabled = ${params.enabled}`);
  }

  return filters.length > 0 ? filters.join(' && ') : undefined;
}
