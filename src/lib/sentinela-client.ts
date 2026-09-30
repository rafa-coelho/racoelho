/**
 * Copiado de /home/user/sentinela/packages/sdk/src/index.ts (@racoelho/sentinela,
 * que nao esta no npm). NAO edite aqui: atualize no repo do Sentinela e copie de novo.
 */

/**
 * @racoelho/sentinela — client oficial do Sentinela.
 *
 * Faz duas coisas: manda SINAIS (o app contando o que aconteceu com ele) e
 * abre CHAMADOS (um usuario do app pedindo ajuda).
 *
 * Regras de ouro, herdadas do SDK do analytics:
 *  - nunca lanca: um erro no client nao pode derrubar o app que ele observa;
 *  - nunca bloqueia: fire-and-forget com timeout curto;
 *  - sem as envs configuradas vira no-op silencioso (dev e preview nao viram
 *    ruido, e ninguem precisa de um mock para rodar local).
 *
 * Zero dependencias: o arquivo inteiro pode ser copiado para dentro de um app
 * que nao consiga instalar o pacote.
 *
 * IMPORTANTE: a chave secreta identifica o APP e nunca pode ir para o browser.
 * Use este client no servidor; se precisar de um formulario no front, o
 * backend do seu app encaminha.
 */

export type SignalType = "error" | "metric" | "heartbeat" | "event";
export type Severity = "low" | "medium" | "high" | "critical";
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogLine {
  level: LogLevel;
  message: string;
  /** Epoch ms. Default: agora. */
  ts?: number;
  /** Contexto estruturado (requestId, userId, ...). Forma livre. */
  meta?: Record<string, unknown>;
  /**
   * Desempata dois logs identicos (mesmo nivel, mesmo instante, mesmo texto).
   * Entra na chave de idempotencia; sem ele, reenvios viram um log so.
   */
  dedupeKey?: string;
}

export interface Signal {
  type: SignalType;
  name: string;
  severity?: Severity;
  /** Epoch ms. Default: agora. */
  ts?: number;
  props?: Record<string, unknown>;
  /**
   * Diferencia dois sinais que seriam identicos (mesmo nome, mesmo instante).
   * Entra na chave de idempotencia; sem ele, reenvios viram um sinal so.
   */
  dedupeKey?: string;
}

/** Quem abriu o chamado, do ponto de vista do app de origem. */
export interface TicketReporter {
  name?: string;
  /** Sem canal de resposta dentro do app, e por aqui que voce responde. */
  email?: string;
  /** Id do usuario no app — permite achar a conta dele por la. */
  externalId?: string;
}

export interface Ticket {
  title: string;
  description?: string;
  /** Default: medium. Chamado de usuario raramente e critico. */
  severity?: Severity;
  reporter?: TicketReporter;
  /** O que so o app sabe: url, versao, plano, user agent. Forma livre. */
  context?: Record<string, unknown>;
}

export interface ClientOptions {
  /** Base do Sentinela, ex: https://sentinela-production-ae78.up.railway.app */
  url?: string;
  /** secretKey do app monitorado (tela /apps do Sentinela). */
  secret?: string;
  /** Timeout das chamadas. Default 3000ms. */
  timeoutMs?: number;
  /** Injecao para teste. Default: fetch global. */
  fetchImpl?: typeof fetch;
  /** Loga falhas no console. Default: false. */
  debug?: boolean;
}

export interface TicketResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface SentinelaClient {
  readonly enabled: boolean;
  send(signals: Signal[]): Promise<void>;
  reportError(name: string, props?: Record<string, unknown>, severity?: Severity): Promise<void>;
  reportEvent(name: string, props?: Record<string, unknown>): Promise<void>;
  reportMetric(name: string, value: number, props?: Record<string, unknown>): Promise<void>;
  reportHeartbeat(props?: Record<string, unknown>): Promise<void>;
  /**
   * Envia uma linha de log. Fire-and-forget como os sinais: um log nao pode
   * atrasar nem derrubar o app que o gera. Aceita uma linha ou um lote (ate
   * 50). A regra `log_pattern` do Sentinela transforma logs em incidente.
   */
  captureLog(level: LogLevel, message: string, meta?: Record<string, unknown>): Promise<void>;
  sendLogs(logs: LogLine[]): Promise<void>;
  /**
   * Abre um chamado. Diferente dos sinais, ESTE aguarda a resposta e devolve o
   * resultado: quem clicou em "enviar" precisa saber se deu certo.
   */
  createTicket(ticket: Ticket): Promise<TicketResult>;
}

const noop = async () => {};

export function createClient(options: ClientOptions = {}): SentinelaClient {
  const url = (options.url ?? "").replace(/\/+$/, "");
  const secret = options.secret ?? "";
  const timeoutMs = options.timeoutMs ?? 3000;
  const doFetch = options.fetchImpl ?? globalThis.fetch;
  const enabled = Boolean(url && secret && typeof doFetch === "function");

  if (!enabled) {
    return {
      enabled: false,
      send: noop,
      reportError: noop,
      reportEvent: noop,
      reportMetric: noop,
      reportHeartbeat: noop,
      captureLog: noop,
      sendLogs: noop,
      createTicket: async () => ({ ok: false, error: "not_configured" }),
    };
  }

  async function post(path: string, body: unknown): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await doFetch(`${url}${path}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        // Sobrevive ao fim do handler em runtimes serverless (Vercel congela a
        // funcao assim que a resposta sai).
        keepalive: true,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async function send(signals: Signal[]): Promise<void> {
    if (!signals.length) return;
    try {
      await post("/api/v1/signals", { signals });
    } catch (error) {
      if (options.debug) console.warn("[sentinela] falha ao enviar sinal:", error);
    }
  }

  async function sendLogs(logs: LogLine[]): Promise<void> {
    if (!logs.length) return;
    try {
      await post("/api/v1/logs", { logs });
    } catch (error) {
      if (options.debug) console.warn("[sentinela] falha ao enviar log:", error);
    }
  }

  return {
    enabled: true,
    send,
    reportError(name, props, severity = "high") {
      return send([{ type: "error", name, severity, props }]);
    },
    reportEvent(name, props) {
      return send([{ type: "event", name, props }]);
    },
    reportMetric(name, value, props) {
      return send([{ type: "metric", name, props: { ...props, value } }]);
    },
    reportHeartbeat(props) {
      return send([{ type: "heartbeat", name: "heartbeat", props }]);
    },
    sendLogs,
    captureLog(level, message, meta) {
      return sendLogs([{ level, message, meta }]);
    },
    async createTicket(ticket) {
      try {
        const response = await post("/api/v1/tickets", ticket);
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          if (options.debug) console.warn("[sentinela] chamado recusado:", response.status, detail);
          return { ok: false, error: response.status === 429 ? "rate_limited" : `http_${response.status}` };
        }
        const data = (await response.json().catch(() => ({}))) as { id?: string };
        return { ok: true, id: data.id };
      } catch (error) {
        if (options.debug) console.warn("[sentinela] falha ao abrir chamado:", error);
        return { ok: false, error: "network" };
      }
    },
  };
}

/** Client a partir de SENTINELA_URL / SENTINELA_SECRET. */
export function createClientFromEnv(
  env: Record<string, string | undefined> = process.env
): SentinelaClient {
  return createClient({
    url: env.SENTINELA_URL,
    secret: env.SENTINELA_SECRET,
    debug: env.SENTINELA_DEBUG === "true",
  });
}

/** @deprecated Use `createClient`. Mantido para nao quebrar quem ja importava. */
export const createReporter = createClient;
/** @deprecated Use `createClientFromEnv`. */
export const createReporterFromEnv = createClientFromEnv;
export type Reporter = SentinelaClient;
export type ReporterOptions = ClientOptions;
