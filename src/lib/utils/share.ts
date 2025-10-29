/**
 * Utilitários para compartilhamento em redes sociais
 */

export interface ShareLinks {
  threads: string;
  x: string;
  linkedin: string;
  whatsapp: string;
}

/**
 * Gera links de compartilhamento para múltiplas redes sociais
 * @param title - Título do conteúdo a ser compartilhado
 * @param url - URL completa do conteúdo
 * @returns Objeto com links de compartilhamento para cada rede social
 */
export function generateShareLinks(title: string, url: string): ShareLinks {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return {
    // Threads (Meta/Instagram)
    threads: `https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
    
    // X (anteriormente Twitter)
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    
    // LinkedIn
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    
    // WhatsApp
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  };
}

/**
 * Abre uma janela popup centralizada para compartilhamento
 * @param url - URL do compartilhamento
 * @param width - Largura da janela (padrão: 550)
 * @param height - Altura da janela (padrão: 420)
 */
export function openSharePopup(url: string, width: number = 550, height: number = 420): void {
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  window.open(
    url,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  );
}

