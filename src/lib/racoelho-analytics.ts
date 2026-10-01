// Analytics próprio (@racoelho/analytics), rodando junto com o Google Analytics.
// O SDK vem do pacote npm @racoelho/analytics.
//
// Sem NEXT_PUBLIC_ANALYTICS_SITE_KEY, ou fora do browser (SSR), tudo aqui é no-op
// silencioso: dev e preview não precisam saber que ele existe. Nada aqui lança.
import { Analytics } from '@racoelho/analytics';

const SITE_KEY = process.env.NEXT_PUBLIC_ANALYTICS_SITE_KEY || '';
// Opcional: sem ele o SDK usa o ingestor default embutido no build.
const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || undefined;

let client: Analytics | null = null;

function getClient(): Analytics | null {
  if (client) return client;
  if (!SITE_KEY || typeof window === 'undefined') return null;
  try {
    // autoPageview desligado: o pageview sai do componente Analytics, que pula o
    // /admin como o GA. Web Vitals e erros JS seguem nos defaults (ligados).
    client = new Analytics({ siteKey: SITE_KEY, endpoint: ENDPOINT, autoPageview: false });
  } catch (error) {
    client = null;
  }
  return client;
}

export function initAnalytics(): void {
  getClient();
}

// Chamado pelo componente Analytics na carga e em cada troca de rota do App Router
// (o SDK não observa history.pushState).
export function pageview(props?: Record<string, unknown>): void {
  try {
    getClient()?.pageview(props);
  } catch {}
}

export function track(name: string, props?: Record<string, unknown>): void {
  try {
    getClient()?.track(name, props);
  } catch {}
}

export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (!userId) return;
  try {
    const hasEmail = typeof traits?.email === 'string' && traits.email !== '';
    getClient()?.identify({ user_id: userId, traits, id_prop: hasEmail ? 'email' : undefined });
  } catch {}
}

export function resetAnalytics(): void {
  try {
    getClient()?.reset();
  } catch {}
}

export function captureException(error: unknown, props?: Record<string, unknown>): void {
  try {
    getClient()?.captureException(error, props);
  } catch {}
}
