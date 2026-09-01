// Sanitização leve de HTML vindo de fonte externa confiável (API do Ashby).
// Remove vetores de XSS óbvios sem depender de jsdom/DOMPurify no server.
// Não é um sanitizador de propósito geral — serve para o HTML estruturado
// das descrições de vaga. Se um dia o HTML vier de fonte não confiável,
// troque por uma lib dedicada (sanitize-html / DOMPurify + jsdom).

export function sanitizeJobHtml(html: string): string {
  if (!html) return '';

  return (
    html
      // remove blocos <script>...</script> e <style>...</style>
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      // remove tags perigosas isoladas
      .replace(/<\/?(iframe|object|embed|form|input|button|link|meta)\b[^>]*>/gi, '')
      // remove handlers de evento inline (onclick=, onerror=, ...)
      .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
      // neutraliza javascript: em href/src
      .replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"')
      .replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, "$1='#'")
  );
}
