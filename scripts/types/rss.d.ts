declare module 'rss' {
  interface RSSOptions {
    title: string;
    description?: string;
    feed_url: string;
    site_url: string;
    image_url?: string;
    managingEditor?: string;
    webMaster?: string;
    copyright?: string;
    language?: string;
    categories?: string[];
    pubDate?: string;
    ttl?: string;
    custom_namespaces?: Record<string, string>;
  }

  interface RSSItem {
    title: string;
    description?: string;
    url?: string;
    guid?: string;
    categories?: string[];
    author?: string;
    date?: string;
    lat?: number;
    long?: number;
    enclosure?: {
      url: string;
      type?: string;
      length?: number;
    };
  }

  class RSS {
    constructor(options: RSSOptions);
    item(item: RSSItem): void;
    xml(options?: { indent: boolean }): string;
  }

  export default RSS;
} 