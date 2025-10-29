export function getPublicUrl(entity: string, record: any): string | null {
  switch (entity) {
    case 'posts':
      return record?.slug ? `/posts/${record.slug}` : null;
    case 'challenges':
      return record?.slug ? `/listas/desafios/${record.slug}` : null;
    case 'sales_pages':
      return record?.slug ? `/venda/${record.slug}` : null;
    case 'links':
    case 'link_items':
      return `/links`;
    case 'setup':
    case 'setup_items':
      return `/setup`;
    default:
      return null;
  }
}

export function getAssetProxyUrl(slug: string, filename: string): string {
  return `/api/assets-proxy/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`;
}


