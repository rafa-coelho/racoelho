/* @racoelho/analytics — tipos do build vendorizado (rafa-coelho/analytics@97b90ec). Não edite à mão. */
type Viewport = {
    w: number;
    h: number;
};
type Screen = {
    w: number;
    h: number;
};
type EventBase = {
    event: string;
    ts?: number;
    url?: string;
    path?: string;
    referrer?: string;
    anon_id?: string;
    session_id?: string;
    user_id?: string | null;
    lang?: string;
    tz?: string;
    viewport?: Partial<Viewport>;
    screen?: Partial<Screen>;
    utm?: Record<string, string>;
    props?: Record<string, unknown>;
    ua_string?: string;
};
type Config = {
    siteKey: string;
    endpoint?: string;
    batchSize?: number;
    flushIntervalMs?: number;
    respectDNT?: boolean;
    autoPageview?: boolean;
    autoWebVitals?: boolean;
    autoErrors?: boolean;
    debug?: boolean;
};
type WebVitalName = 'LCP' | 'FCP' | 'CLS' | 'INP' | 'TTFB';
type WebVitalRating = 'good' | 'needs-improvement' | 'poor';
type IdentifyPayload = {
    user_id: string;
    traits?: Record<string, unknown>;
    id_prop?: string;
};

declare class Analytics {
    private cfg;
    private q;
    private timer;
    private isFlushing;
    private anonId;
    private sessId;
    private userId;
    private lastPageviewPath;
    private autoPageviewInitialized;
    private lastPageviewTs;
    private lastIdentifyTs;
    private lastIdentifyUserId;
    constructor(cfg: Config);
    trackWebVitals(): void;
    trackErrors(): void;
    captureException(error: unknown, props?: Record<string, unknown>): void;
    private reportError;
    setConsent(status: 'granted' | 'denied'): void;
    identify(p: IdentifyPayload): void;
    reset(): void;
    pageview(props?: Record<string, unknown>): void;
    click(elementId?: string, elementText?: string, props?: Record<string, unknown>): void;
    formSubmit(formId?: string, formName?: string, props?: Record<string, unknown>): void;
    formStart(formId?: string, formName?: string, props?: Record<string, unknown>): void;
    download(fileName?: string, fileType?: string, props?: Record<string, unknown>): void;
    share(method?: string, contentType?: string, itemId?: string, props?: Record<string, unknown>): void;
    search(query?: string, category?: string, props?: Record<string, unknown>): void;
    signup(method?: string, props?: Record<string, unknown>): void;
    login(method?: string, props?: Record<string, unknown>): void;
    logout(props?: Record<string, unknown>): void;
    addToCart(productId?: string, productName?: string, price?: number, quantity?: number, props?: Record<string, unknown>): void;
    removeFromCart(productId?: string, productName?: string, props?: Record<string, unknown>): void;
    viewItem(productId?: string, productName?: string, category?: string, price?: number, props?: Record<string, unknown>): void;
    purchase(orderId?: string, value?: number, currency?: string, items?: Array<{
        product_id?: string;
        product_name?: string;
        price?: number;
        quantity?: number;
    }>, props?: Record<string, unknown>): void;
    beginCheckout(value?: number, currency?: string, props?: Record<string, unknown>): void;
    videoPlay(videoId?: string, videoTitle?: string, duration?: number, props?: Record<string, unknown>): void;
    videoPause(videoId?: string, currentTime?: number, props?: Record<string, unknown>): void;
    videoComplete(videoId?: string, duration?: number, props?: Record<string, unknown>): void;
    scroll(depth?: number, props?: Record<string, unknown>): void;
    track(name: string, props?: Record<string, unknown>): void;
    private enqueue;
    private armTimer;
    flush(): Promise<void>;
}

declare global {
    interface Window {
        Analytics?: any;
    }
}

export { Analytics, type Config, type EventBase, type IdentifyPayload, type Screen, type Viewport, type WebVitalName, type WebVitalRating };
