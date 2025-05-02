import { nanoid } from 'nanoid';

export enum SocialPrefix {
    YOUTUBE = 'yt',
    INSTAGRAM = 'ig',
    TIKTOK = 'tt',
    THREADS = 'th',
    BLUESKY = 'bs',
    FACEBOOK = 'fb',
    X = 'xx',
}

export const SOCIAL_NETWORKS = {
    youtube: {
        name: 'YouTube',
        prefix: SocialPrefix.YOUTUBE,
        patterns: ['youtube.com', 'youtu.be'],
    },
    instagram: {
        name: 'Instagram',
        prefix: SocialPrefix.INSTAGRAM,
        patterns: ['instagram.com'],
    },
    tiktok: {
        name: 'TikTok',
        prefix: SocialPrefix.TIKTOK,
        patterns: ['tiktok.com'],
    },
    facebook: {
        name: 'Facebook',
        prefix: SocialPrefix.FACEBOOK,
        patterns: ['facebook.com', 'fb.com'],
    },
    twitter: {
        name: 'Twitter',
        prefix: SocialPrefix.X,
        patterns: ['twitter.com', 'x.com'],
    },
    threads: {
        name: 'Threads',
        prefix: SocialPrefix.THREADS,
        patterns: ['threads.net'],
    },
    bluesky: {
        name: 'Bluesky',
        prefix: SocialPrefix.BLUESKY,
        patterns: ['bsky.app'],
    },
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateShortUrl(url: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao encurtar URL');
    }

    const data = await response.json();
    return data.shortId;
}

export async function getOriginalUrl(shortId: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/url?id=${shortId}`);

    if (!response.ok) {
        return '';
    }

    const data = await response.json();
    return data.url;
}

export function getSocialPrefix(url: string): SocialPrefix | null {
    for (const [prefix, network] of Object.entries(SOCIAL_NETWORKS)) {
        if (network.patterns.some(pattern => url.includes(pattern))) {
            return network.prefix;
        }
    }
    return null;
}

// Função para codificar uma URL em um formato curto
export function encodeUrl(url: string): string {
    try {
        // Converter a URL para Base64 e remover caracteres especiais
        const base64 = btoa(encodeURIComponent(url));
        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '|')
            .replace(/=+$/, '');
    } catch (error) {
        console.error('Erro ao codificar URL:', error);
        return '';
    }
}

// Função para decodificar uma URL codificada
export function decodeUrl(encoded: string): string {
    try {
        // Restaurar caracteres especiais e adicionar padding se necessário
        const base64 = encoded
            .replace(/-/g, '+')
            .replace(/\|/g, '/');
        
        // Adicionar padding se necessário
        const padding = base64.length % 4;
        const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;
        
        // Decodificar de Base64 e depois decodificar a URL
        return decodeURIComponent(atob(paddedBase64));
    } catch (error) {
        console.error('Erro ao decodificar URL:', error);
        return '';
    }
}

// Função para gerar um ID curto a partir de uma URL
export function generateShortId(url: string): string {
    // Gerar um hash curto da URL
    const hash = hashString(url);
    
    // Codificar a URL em Base64
    const encoded = encodeUrl(url);
    
    // Combinar o hash com os primeiros caracteres da URL codificada
    return `${hash.substring(0, 4)}${encoded.substring(0, 8)}`;
}

// Função para gerar um hash simples de uma string
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Converter para inteiro de 32 bits
    }
    
    // Converter para hexadecimal e remover o sinal negativo
    return Math.abs(hash).toString(16);
}

export async function getRedirectionUrls(shortId: string): Promise<[deepLink: string, fallbackUrl: string]> {
    const prefix = shortId.slice(0, 2).toUpperCase() as SocialPrefix;
    
    const originalUrl = await getOriginalUrl(shortId);
    if (!originalUrl) {
        return ["", ""];
    }

    let deepLink = "";
    let fallbackUrl = originalUrl;

    try {
        const url = new URL(originalUrl);
        
        switch (prefix.toLowerCase()) {
            case SocialPrefix.YOUTUBE:
                if (url.pathname.startsWith('/@')) {
                    // Canais no formato @username
                    const channelName = url.pathname.slice(2); // Remove o @
                    deepLink = `vnd.youtube:channel/${channelName}`;
                    fallbackUrl = `https://youtube.com/@${channelName}`;
                } else if (url.pathname.startsWith('/channel/')) {
                    // Canais com ID
                    const channelId = url.pathname.split('/channel/')[1];
                    deepLink = `vnd.youtube:channel/${channelId}`;
                    fallbackUrl = `https://youtube.com/channel/${channelId}`;
                } else if (url.pathname === '/watch' && url.searchParams.has('v')) {
                    // Vídeos
                    const videoId = url.searchParams.get('v');
                    deepLink = `vnd.youtube:${videoId}`;
                    fallbackUrl = `https://youtube.com/watch?v=${videoId}`;
                } else if (url.pathname.startsWith('/playlist')) {
                    // Playlists
                    const playlistId = url.searchParams.get('list');
                    if (playlistId) {
                        deepLink = `vnd.youtube:playlist/${playlistId}`;
                        fallbackUrl = `https://youtube.com/playlist?list=${playlistId}`;
                    }
                } else {
                    // Outros formatos (como shorts, etc)
                    fallbackUrl = originalUrl;
                }
                break;
    
            case SocialPrefix.INSTAGRAM:
                if (url.pathname.includes('/p/') || url.pathname.includes('/reel/')) {
                    fallbackUrl = `https://instagram.com${url.pathname}`;
                } else {
                    const username = url.pathname.split('/').filter(Boolean)[0];
                    deepLink = `instagram://user?username=${username}`;
                    fallbackUrl = `https://instagram.com/${username}`;
                }
                break;
    
            case SocialPrefix.TIKTOK:
                if (url.pathname.includes('/video/')) {
                    fallbackUrl = `https://tiktok.com/${url.pathname}`;
                } else {
                    fallbackUrl = `https://tiktok.com/${url.pathname}`;
                }
                break;
        }
    } catch (error) {
        console.error('Erro ao processar URL para redirecionamento:', error);
        return ["", originalUrl];
    }

    return [deepLink, fallbackUrl];
}