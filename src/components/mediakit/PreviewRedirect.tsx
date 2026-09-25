'use client';

import { useEffect } from 'react';

// /mediakit é estática (ISR). O preview do admin (?preview=1) vive em /mediakit/preview,
// que é dinâmica e checa a sessão de admin.
export function PreviewRedirect() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('preview') === '1') window.location.replace('/mediakit/preview');
    } catch {
      // ignora
    }
  }, []);
  return null;
}
