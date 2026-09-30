/* eslint-disable */
// @ts-nocheck
/**
 * @racoelho/analytics — build vendorizado (ESM, sem minificar).
 *
 * Origem: rafa-coelho/analytics@97b90ec, packages/sdk (`npx tsup --no-minify`).
 * Vendorizado porque a versão no npm (0.1.1) é anterior à captura de erros JS
 * (que o Sentinela lê) e ao fix do identify. Quando uma versão nova for
 * publicada, troque o import em lib/analytics por '@racoelho/analytics' e
 * apague esta pasta. Não edite à mão.
 */

// src/ids.ts
var hasCryptoUUID = typeof crypto !== "undefined" && !!crypto.randomUUID;
function uuid() {
  if (hasCryptoUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
var ANON_KEY = "__anid";
var SESS_KEY = "__sid";
function getAnonId() {
  try {
    const v = localStorage.getItem(ANON_KEY);
    if (v) return v;
    const n = uuid();
    localStorage.setItem(ANON_KEY, n);
    return n;
  } catch {
    return uuid();
  }
}
function getSessionId() {
  try {
    const v = sessionStorage.getItem(SESS_KEY);
    if (v) return v;
    const n = uuid();
    sessionStorage.setItem(SESS_KEY, n);
    return n;
  } catch {
    return uuid();
  }
}
function resetSessionId() {
  const n = uuid();
  try {
    sessionStorage.setItem(SESS_KEY, n);
  } catch {
  }
  return n;
}

// src/storage.ts
function safeGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
  }
}
var CONSENT_KEY = "__consent";

// src/identity.ts
var UID_KEY = "__uid";
function loadIdentity() {
  const v = safeGet(UID_KEY, null);
  if (!v || typeof v !== "object") return null;
  if (typeof v.user_id !== "string" || !v.user_id) return null;
  return v;
}
function saveIdentity(identity) {
  safeSet(UID_KEY, identity);
}
function clearIdentity() {
  try {
    localStorage.removeItem(UID_KEY);
  } catch {
  }
}

// src/transport.ts
function detectCountry() {
  if (typeof navigator === "undefined") return null;
  try {
    const lang = navigator.language || navigator.languages?.[0] || "";
    if (lang) {
      const parts = lang.split("-");
      if (parts.length > 1 && parts[1].length === 2) {
        const countryCode = parts[1].toUpperCase();
        if (/^[A-Z]{2}$/.test(countryCode)) {
          return countryCode;
        }
      }
    }
    if ("Intl" in globalThis) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz) {
        const tzToCountry = {
          // América do Sul
          "America/Sao_Paulo": "BR",
          "America/Manaus": "BR",
          "America/Fortaleza": "BR",
          "America/Recife": "BR",
          "America/Campo_Grande": "BR",
          "America/Cuiaba": "BR",
          "America/Araguaina": "BR",
          "America/Bahia": "BR",
          "America/Belem": "BR",
          "America/Boa_Vista": "BR",
          "America/Maceio": "BR",
          "America/Noronha": "BR",
          "America/Porto_Velho": "BR",
          "America/Rio_Branco": "BR",
          "America/Santarem": "BR",
          "America/Buenos_Aires": "AR",
          "America/Argentina/Buenos_Aires": "AR",
          "America/Cordoba": "AR",
          "America/La_Paz": "BO",
          "America/Santiago": "CL",
          "America/Bogota": "CO",
          "America/Guayaquil": "EC",
          "America/Asuncion": "PY",
          "America/Lima": "PE",
          "America/Montevideo": "UY",
          "America/Caracas": "VE",
          // América do Norte
          "America/New_York": "US",
          "America/Chicago": "US",
          "America/Denver": "US",
          "America/Los_Angeles": "US",
          "America/Phoenix": "US",
          "America/Anchorage": "US",
          "America/Detroit": "US",
          "America/Indiana/Indianapolis": "US",
          "America/Juneau": "US",
          "America/Kentucky/Louisville": "US",
          "America/Menominee": "US",
          "America/Metlakatla": "US",
          "America/Nome": "US",
          "America/North_Dakota/Center": "US",
          "America/Sitka": "US",
          "America/Yakutat": "US",
          "America/Toronto": "CA",
          "America/Vancouver": "CA",
          "America/Winnipeg": "CA",
          "America/Halifax": "CA",
          "America/St_Johns": "CA",
          "America/Mexico_City": "MX",
          "America/Monterrey": "MX",
          "America/Tijuana": "MX",
          "America/Cancun": "MX",
          "America/Merida": "MX",
          "America/Chihuahua": "MX",
          "America/Mazatlan": "MX",
          "America/Hermosillo": "MX",
          // Europa
          "Europe/London": "GB",
          "Europe/Dublin": "IE",
          "Europe/Lisbon": "PT",
          "Europe/Madrid": "ES",
          "Europe/Barcelona": "ES",
          "Europe/Paris": "FR",
          "Europe/Berlin": "DE",
          "Europe/Munich": "DE",
          "Europe/Rome": "IT",
          "Europe/Milan": "IT",
          "Europe/Amsterdam": "NL",
          "Europe/Brussels": "BE",
          "Europe/Vienna": "AT",
          "Europe/Zurich": "CH",
          "Europe/Stockholm": "SE",
          "Europe/Oslo": "NO",
          "Europe/Copenhagen": "DK",
          "Europe/Helsinki": "FI",
          "Europe/Warsaw": "PL",
          "Europe/Prague": "CZ",
          "Europe/Budapest": "HU",
          "Europe/Bucharest": "RO",
          "Europe/Sofia": "BG",
          "Europe/Athens": "GR",
          "Europe/Istanbul": "TR",
          "Europe/Moscow": "RU",
          "Europe/Kiev": "UA",
          // Ásia
          "Asia/Tokyo": "JP",
          "Asia/Seoul": "KR",
          "Asia/Shanghai": "CN",
          "Asia/Beijing": "CN",
          "Asia/Hong_Kong": "HK",
          "Asia/Macau": "MO",
          "Asia/Taipei": "TW",
          "Asia/Singapore": "SG",
          "Asia/Kuala_Lumpur": "MY",
          "Asia/Bangkok": "TH",
          "Asia/Jakarta": "ID",
          "Asia/Manila": "PH",
          "Asia/Ho_Chi_Minh": "VN",
          "Asia/Dubai": "AE",
          "Asia/Riyadh": "SA",
          "Asia/Jerusalem": "IL",
          "Asia/Tehran": "IR",
          "Asia/Baghdad": "IQ",
          "Asia/Kuwait": "KW",
          "Asia/Doha": "QA",
          "Asia/Kolkata": "IN",
          "Asia/Mumbai": "IN",
          "Asia/Delhi": "IN",
          "Asia/Dhaka": "BD",
          "Asia/Karachi": "PK",
          "Asia/Kathmandu": "NP",
          "Asia/Colombo": "LK",
          // Oceania
          "Australia/Sydney": "AU",
          "Australia/Melbourne": "AU",
          "Australia/Brisbane": "AU",
          "Australia/Perth": "AU",
          "Australia/Adelaide": "AU",
          "Australia/Darwin": "AU",
          "Australia/Hobart": "AU",
          "Pacific/Auckland": "NZ",
          "Pacific/Wellington": "NZ",
          // África
          "Africa/Cairo": "EG",
          "Africa/Johannesburg": "ZA",
          "Africa/Casablanca": "MA",
          "Africa/Lagos": "NG",
          "Africa/Nairobi": "KE",
          "Africa/Addis_Ababa": "ET"
        };
        if (tzToCountry[tz]) {
          return tzToCountry[tz];
        }
        const tzParts = tz.split("/");
        if (tzParts.length > 1) {
          const tzRegion = tzParts[1];
          for (const [tzKey, country] of Object.entries(tzToCountry)) {
            const keyParts = tzKey.split("/");
            if (keyParts.length > 1 && (keyParts[1] === tzRegion || tzKey.includes(tzRegion))) {
              return country;
            }
          }
        }
      }
    }
    if (lang) {
      const langCode = lang.split("-")[0].toLowerCase();
      const langToCountry = {
        "pt": "BR",
        // Português -> Brasil (mais comum)
        "en": "US",
        // Inglês -> EUA (mais comum)
        "es": "ES",
        // Espanhol -> Espanha
        "fr": "FR",
        // Francês -> França
        "de": "DE",
        // Alemão -> Alemanha
        "it": "IT",
        // Italiano -> Itália
        "ja": "JP",
        // Japonês -> Japão
        "zh": "CN",
        // Chinês -> China
        "ko": "KR",
        // Coreano -> Coreia do Sul
        "ru": "RU",
        // Russo -> Rússia
        "ar": "SA",
        // Árabe -> Arábia Saudita
        "tr": "TR",
        // Turco -> Turquia
        "pl": "PL",
        // Polonês -> Polônia
        "nl": "NL",
        // Holandês -> Holanda
        "sv": "SE",
        // Sueco -> Suécia
        "no": "NO",
        // Norueguês -> Noruega
        "da": "DK",
        // Dinamarquês -> Dinamarca
        "fi": "FI",
        // Finlandês -> Finlândia
        "el": "GR",
        // Grego -> Grécia
        "he": "IL",
        // Hebraico -> Israel
        "hi": "IN",
        // Hindi -> Índia
        "th": "TH",
        // Tailandês -> Tailândia
        "vi": "VN",
        // Vietnamita -> Vietnã
        "id": "ID",
        // Indonésio -> Indonésia
        "ms": "MY",
        // Malaio -> Malásia
        "cs": "CZ",
        // Tcheco -> República Tcheca
        "hu": "HU",
        // Húngaro -> Hungria
        "ro": "RO",
        // Romeno -> Romênia
        "bg": "BG",
        // Búlgaro -> Bulgária
        "uk": "UA",
        // Ucraniano -> Ucrânia
        "sk": "SK",
        // Eslovaco -> Eslováquia
        "sr": "RS"
        // Sérvio -> Sérvia
      };
      if (langToCountry[langCode]) {
        return langToCountry[langCode];
      }
    }
  } catch (error) {
  }
  return null;
}
async function postJSON(url, body, debug = false, headers) {
  const hasHeaders = headers !== void 0;
  if (!hasHeaders && typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    try {
      const ok = navigator.sendBeacon(
        url,
        new Blob([JSON.stringify(body)], { type: "text/plain" })
      );
      return ok;
    } catch (error) {
    }
  }
  try {
    const fetchHeaders = { "Content-Type": "text/plain" };
    if (headers && Object.keys(headers).length > 0) {
      Object.assign(fetchHeaders, headers);
    }
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: fetchHeaders,
      mode: "cors",
      credentials: "omit",
      keepalive: true
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}

// src/web-vitals.ts
var THRESHOLDS = {
  LCP: [2500, 4e3],
  FCP: [1800, 3e3],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  TTFB: [800, 1800]
};
function rate(name, value) {
  const [good, poor] = THRESHOLDS[name];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}
function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function safeObserve(type, cb) {
  try {
    const supported = PerformanceObserver.supportedEntryTypes;
    if (supported && !supported.includes(type)) return null;
    const po = new PerformanceObserver((list) => cb(list.getEntries()));
    po.observe({ type, buffered: true });
    return po;
  } catch {
    return null;
  }
}
function startWebVitals(report) {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => {
    };
  }
  const observers = [];
  let lcpValue = 0;
  let lcpId = uid();
  const lcpObs = safeObserve("largest-contentful-paint", (entries) => {
    const last = entries[entries.length - 1];
    if (last) lcpValue = last.renderTime || last.loadTime || last.startTime || 0;
  });
  if (lcpObs) observers.push(lcpObs);
  let fcpReported = false;
  const fcpObs = safeObserve("paint", (entries) => {
    if (fcpReported) return;
    for (const e of entries) {
      if (e.name === "first-contentful-paint") {
        fcpReported = true;
        report({ name: "FCP", value: e.startTime, rating: rate("FCP", e.startTime), id: uid() });
      }
    }
  });
  if (fcpObs) observers.push(fcpObs);
  let clsValue = 0;
  const clsId = uid();
  const clsObs = safeObserve("layout-shift", (entries) => {
    for (const e of entries) {
      if (!e.hadRecentInput) clsValue += e.value;
    }
  });
  if (clsObs) observers.push(clsObs);
  let inpValue = 0;
  let inpId = uid();
  const inpObs = safeObserve("event", (entries) => {
    for (const e of entries) {
      if (e.duration > inpValue) {
        inpValue = e.duration;
        inpId = uid();
      }
    }
  });
  if (inpObs) observers.push(inpObs);
  try {
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav && nav.responseStart > 0) {
      const ttfb = nav.responseStart;
      report({ name: "TTFB", value: ttfb, rating: rate("TTFB", ttfb), id: uid() });
    }
  } catch {
  }
  const finalize = () => {
    if (lcpValue > 0) {
      report({ name: "LCP", value: lcpValue, rating: rate("LCP", lcpValue), id: lcpId });
      lcpValue = 0;
    }
    if (clsValue > 0) {
      report({ name: "CLS", value: clsValue, rating: rate("CLS", clsValue), id: clsId });
    }
    if (inpValue > 0) {
      report({ name: "INP", value: inpValue, rating: rate("INP", inpValue), id: inpId });
      inpValue = 0;
    }
  };
  const onHidden = () => {
    if (document.visibilityState === "hidden") finalize();
  };
  document.addEventListener("visibilitychange", onHidden, { once: false });
  window.addEventListener("pagehide", finalize, { once: true });
  return () => {
    observers.forEach((o) => {
      try {
        o.disconnect();
      } catch {
      }
    });
    document.removeEventListener("visibilitychange", onHidden);
    window.removeEventListener("pagehide", finalize);
  };
}

// src/errors.ts
var MAX_MESSAGE = 1e3;
var MAX_STACK = 4e3;
function clamp(s, max) {
  if (!s) return "";
  return s.length > max ? s.slice(0, max) : s;
}
function hash(input) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = (h << 5) + h + input.charCodeAt(i) | 0;
  return (h >>> 0).toString(36);
}
function fingerprintOf(name, message, stack) {
  const frames = (stack || "").split("\n").map((l) => l.trim()).filter((l) => l.startsWith("at ") || l.includes("@")).slice(0, 2).join("|");
  const normMessage = message.replace(/\d+/g, "#").slice(0, 120);
  return hash(`${name}|${normMessage}|${frames}`);
}
function normalize(input) {
  const err = input.error;
  let name = "Error";
  let message = input.message || "";
  let stack;
  if (err instanceof Error) {
    name = err.name || "Error";
    message = err.message || message;
    stack = err.stack;
  } else if (err && typeof err === "object") {
    const anyErr = err;
    name = typeof anyErr.name === "string" ? anyErr.name : name;
    message = typeof anyErr.message === "string" ? anyErr.message : message || safeStringify(err);
    stack = typeof anyErr.stack === "string" ? anyErr.stack : void 0;
  } else if (err !== void 0 && err !== null) {
    message = message || String(err);
  }
  if (!message) message = "Unknown error";
  message = clamp(message, MAX_MESSAGE);
  stack = stack ? clamp(stack, MAX_STACK) : void 0;
  return {
    message,
    name,
    stack,
    source: input.source,
    lineno: input.lineno,
    colno: input.colno,
    kind: input.kind,
    handled: input.handled,
    fingerprint: fingerprintOf(name, message, stack)
  };
}
function safeStringify(v) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
function startErrorTracking(report) {
  if (typeof window === "undefined") return () => {
  };
  const DEDUPE_WINDOW_MS = 5e3;
  const MAX_PER_PAGE = 50;
  const lastSeen = /* @__PURE__ */ new Map();
  let total = 0;
  const emit = (e) => {
    if (total >= MAX_PER_PAGE) return;
    const now = Date.now();
    const prev = lastSeen.get(e.fingerprint);
    if (prev && now - prev < DEDUPE_WINDOW_MS) return;
    lastSeen.set(e.fingerprint, now);
    total++;
    report(e);
  };
  const onError = (event) => {
    emit(
      normalize({
        error: event.error,
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        kind: "onerror",
        handled: false
      })
    );
  };
  const onRejection = (event) => {
    emit(
      normalize({
        error: event.reason,
        kind: "unhandledrejection",
        handled: false
      })
    );
  };
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
function captureToPayload(error, extra) {
  const base = normalize({ error, kind: "manual", handled: true });
  return extra ? { ...base, extra } : base;
}

// src/tracker.ts
var isBrowser = typeof window !== "undefined";
var DEFAULT_ENDPOINT = "https://function-bun-production-3339.up.railway.app/v1/i";
function pickUTM() {
  if (!isBrowser) return {};
  const sp = new URLSearchParams(window.location.search);
  const ret = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = sp.get(k);
    if (v) ret[k.replace("utm_", "")] = v;
  });
  return ret;
}
function basePayload() {
  const lang = isBrowser ? navigator.language || "" : "";
  const tz = isBrowser && "Intl" in globalThis ? Intl.DateTimeFormat().resolvedOptions().timeZone || "" : "";
  const viewport = isBrowser ? { w: window.innerWidth, h: window.innerHeight } : void 0;
  const screenInfo = isBrowser ? { w: window.screen.width, h: window.screen.height } : void 0;
  return { lang, tz, viewport, screen: screenInfo };
}
var Analytics = class {
  constructor(cfg) {
    this.q = [];
    this.timer = null;
    this.isFlushing = false;
    this.anonId = "";
    this.sessId = "";
    this.userId = null;
    this.lastPageviewPath = null;
    this.autoPageviewInitialized = false;
    this.lastPageviewTs = 0;
    this.lastIdentifyTs = 0;
    this.lastIdentifyUserId = null;
    if (!cfg.siteKey) throw new Error("siteKey is required");
    this.cfg = {
      siteKey: cfg.siteKey,
      endpoint: cfg.endpoint || DEFAULT_ENDPOINT,
      batchSize: cfg.batchSize ?? 10,
      flushIntervalMs: cfg.flushIntervalMs ?? 3e3,
      respectDNT: cfg.respectDNT ?? true,
      autoPageview: cfg.autoPageview ?? true,
      autoWebVitals: cfg.autoWebVitals ?? true,
      autoErrors: cfg.autoErrors ?? true,
      debug: cfg.debug ?? false
    };
    this.anonId = getAnonId();
    this.sessId = getSessionId();
    const stored = loadIdentity();
    if (stored) this.userId = stored.user_id;
    if (this.cfg.autoPageview && isBrowser && !this.autoPageviewInitialized) {
      this.autoPageviewInitialized = true;
      this.pageview();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") this.flush();
      });
      window.addEventListener("beforeunload", () => this.flush());
    }
    if (this.cfg.autoWebVitals && isBrowser) {
      this.trackWebVitals();
    }
    if (this.cfg.autoErrors && isBrowser) {
      this.trackErrors();
    }
  }
  trackWebVitals() {
    if (!isBrowser) return;
    startWebVitals((metric) => {
      this.track("web_vital", {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_id: metric.id
      });
    });
  }
  trackErrors() {
    if (!isBrowser) return;
    startErrorTracking((err) => this.reportError(err));
  }
  // Manually report a caught error. Use in try/catch or framework error boundaries.
  captureException(error, props = {}) {
    const payload = captureToPayload(error, Object.keys(props).length ? props : void 0);
    this.reportError(payload);
  }
  reportError(err) {
    this.track("error", {
      error_message: err.message,
      error_type: err.name,
      error_stack: err.stack,
      error_source: err.source,
      error_lineno: err.lineno,
      error_colno: err.colno,
      error_kind: err.kind,
      error_handled: err.handled,
      error_fingerprint: err.fingerprint,
      ...err.extra || {}
    });
  }
  setConsent(status) {
    safeSet(CONSENT_KEY, status);
    if (status === "denied") {
      this.userId = null;
      clearIdentity();
    }
  }
  identify(p) {
    if (!p.user_id) {
      console.warn("[Analytics] identify: user_id \xE9 obrigat\xF3rio");
      return;
    }
    const hasIdProp = !!(p.id_prop && p.traits && p.id_prop in p.traits);
    if (p.id_prop && !hasIdProp) {
      console.warn(`[Analytics] identify: propriedade "${p.id_prop}" n\xE3o encontrada em traits \u2014 enviando mesmo assim sem r\xF3tulo`);
    } else if (!p.id_prop) {
      console.warn("[Analytics] identify: id_prop n\xE3o informado \u2014 o usu\xE1rio aparecer\xE1 pelo user_id no dashboard");
    }
    const now = Date.now();
    const FIVE_MIN = 5 * 60 * 1e3;
    if (this.lastIdentifyUserId === p.user_id && this.lastIdentifyTs > 0 && now - this.lastIdentifyTs < FIVE_MIN) {
      if (this.cfg.debug) {
        console.log("[Analytics] identify: throttled (mesmo user_id em <5min)");
      }
      return;
    }
    this.userId = p.user_id;
    this.lastIdentifyUserId = p.user_id;
    this.lastIdentifyTs = now;
    saveIdentity({ user_id: p.user_id, id_prop: hasIdProp ? p.id_prop : void 0, ts: now });
    this.track("identify", {
      ...p.traits || {},
      ...hasIdProp ? { id_prop: p.id_prop } : {}
    });
  }
  // Limpa a identidade persistida e rotaciona a sessão. Chame no logout para
  // que eventos do próximo usuário não sejam atribuídos ao anterior.
  reset() {
    void this.flush();
    this.userId = null;
    this.lastIdentifyUserId = null;
    this.lastIdentifyTs = 0;
    clearIdentity();
    if (isBrowser) this.sessId = resetSessionId();
  }
  pageview(props = {}) {
    if (!isBrowser) return;
    const currentPath = window.location.pathname;
    const now = Date.now();
    if (this.lastPageviewPath === currentPath && this.lastPageviewTs > 0 && now - this.lastPageviewTs < 2500) {
      if (this.cfg.debug) {
        console.log("[Analytics] pageview: throttled (mesmo path em <2.5s)");
      }
      return;
    }
    const existingPageview = this.q.find(
      (e2) => e2.event === "page_view" && e2.path === currentPath && e2.ts && now - e2.ts < 2500
    );
    if (existingPageview) {
      if (this.cfg.debug) {
        console.log("[Analytics] pageview: j\xE1 existe na fila");
      }
      return;
    }
    this.lastPageviewPath = currentPath;
    this.lastPageviewTs = now;
    const e = {
      event: "page_view",
      ts: now,
      url: window.location.href,
      path: currentPath,
      referrer: document.referrer || "",
      utm: pickUTM(),
      props
    };
    this.enqueue(e);
  }
  // Eventos de interação
  click(elementId, elementText, props = {}) {
    this.track("click", {
      element_id: elementId,
      element_text: elementText,
      ...props
    });
  }
  // Eventos de formulário
  formSubmit(formId, formName, props = {}) {
    this.track("form_submit", {
      form_id: formId,
      form_name: formName,
      ...props
    });
  }
  formStart(formId, formName, props = {}) {
    this.track("form_start", {
      form_id: formId,
      form_name: formName,
      ...props
    });
  }
  // Eventos de download/share
  download(fileName, fileType, props = {}) {
    this.track("download", {
      file_name: fileName,
      file_type: fileType,
      ...props
    });
  }
  share(method, contentType, itemId, props = {}) {
    this.track("share", {
      method,
      content_type: contentType,
      item_id: itemId,
      ...props
    });
  }
  // Eventos de busca
  search(query, category, props = {}) {
    this.track("search", {
      query,
      category,
      ...props
    });
  }
  // Eventos de autenticação
  signup(method, props = {}) {
    this.track("signup", {
      method,
      ...props
    });
  }
  login(method, props = {}) {
    this.track("login", {
      method,
      ...props
    });
  }
  logout(props = {}) {
    this.track("logout", props);
  }
  // Eventos de e-commerce
  addToCart(productId, productName, price, quantity, props = {}) {
    this.track("add_to_cart", {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
      ...props
    });
  }
  removeFromCart(productId, productName, props = {}) {
    this.track("remove_from_cart", {
      product_id: productId,
      product_name: productName,
      ...props
    });
  }
  viewItem(productId, productName, category, price, props = {}) {
    this.track("view_item", {
      product_id: productId,
      product_name: productName,
      category,
      price,
      ...props
    });
  }
  purchase(orderId, value, currency, items, props = {}) {
    this.track("purchase", {
      order_id: orderId,
      value,
      currency: currency || "USD",
      items,
      ...props
    });
  }
  beginCheckout(value, currency, props = {}) {
    this.track("begin_checkout", {
      value,
      currency: currency || "USD",
      ...props
    });
  }
  // Eventos de vídeo
  videoPlay(videoId, videoTitle, duration, props = {}) {
    this.track("video_play", {
      video_id: videoId,
      video_title: videoTitle,
      duration,
      ...props
    });
  }
  videoPause(videoId, currentTime, props = {}) {
    this.track("video_pause", {
      video_id: videoId,
      current_time: currentTime,
      ...props
    });
  }
  videoComplete(videoId, duration, props = {}) {
    this.track("video_complete", {
      video_id: videoId,
      duration,
      ...props
    });
  }
  // Eventos de navegação
  scroll(depth, props = {}) {
    this.track("scroll", {
      depth,
      ...props
    });
  }
  // Método genérico para eventos customizados
  track(name, props = {}) {
    const url = isBrowser ? window.location.href : "";
    const path = isBrowser ? window.location.pathname : "";
    const e = { event: name, ts: Date.now(), url, path, props };
    this.enqueue(e);
  }
  enqueue(e) {
    if (this.cfg.respectDNT && isBrowser && navigator.doNotTrack === "1") return;
    const consent = safeGet(CONSENT_KEY, null);
    if (consent === "denied") return;
    const payload = {
      ...basePayload(),
      ...e,
      anon_id: this.anonId,
      session_id: this.sessId,
      user_id: this.userId ?? void 0
    };
    const now = Date.now();
    const isDuplicate = this.q.some((existing) => {
      if (existing.event !== payload.event || existing.path !== payload.path) return false;
      if (!existing.ts || !payload.ts) return false;
      const timeDiff = Math.abs((payload.ts || now) - existing.ts);
      if (timeDiff > 500) return false;
      if (payload.event !== "page_view") {
        const existingProps = JSON.stringify(existing.props || {});
        const newProps = JSON.stringify(payload.props || {});
        return existingProps === newProps;
      }
      return true;
    });
    if (isDuplicate) {
      return;
    }
    this.q.push(payload);
    if (this.q.length >= (this.cfg.batchSize || 10)) this.flush();
    else this.armTimer();
  }
  armTimer() {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush();
    }, this.cfg.flushIntervalMs);
  }
  async flush() {
    if (this.isFlushing) {
      return;
    }
    if (this.q.length === 0) return;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isFlushing = true;
    try {
      const batch = this.q.splice(0, this.q.length);
      const body = { site_key: this.cfg.siteKey, batch };
      const country = detectCountry();
      const headers = country ? { "x-country": country } : {};
      await postJSON(this.cfg.endpoint, body, this.cfg.debug, headers);
    } finally {
      this.isFlushing = false;
      if (this.q.length > 0) {
        this.armTimer();
      }
    }
  }
};

// src/index.ts
if (typeof window !== "undefined") {
  ;
  window.Analytics = Analytics;
}
export {
  Analytics
};
