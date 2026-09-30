// Sentinela (monitoramento) — só no servidor: SENTINELA_SECRET nunca vai para o browser.
// Sem SENTINELA_URL/SENTINELA_SECRET o client é no-op silencioso.
import { createClientFromEnv } from './sentinela-client';

export const sentinela = createClientFromEnv();

/**
 * Reporta um erro de servidor (fire-and-forget: nunca aguardar no caminho da resposta).
 * `route` entra no fingerprint, agrupando os incidentes por rota.
 */
export function reportServerError(route: string, error: unknown, props?: Record<string, unknown>): void {
  void sentinela.reportError('server_error', {
    ...props,
    route,
    reason: error instanceof Error ? error.message : String(error),
  });
}
