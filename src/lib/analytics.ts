import { headers } from 'next/headers';
import crypto from 'crypto';

export interface ViewData {
  sessionId: string;
  viewerId: string;
  ip: string;
  userAgent: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

/**
 * Extrai dados de analytics da requisição
 * - sessionId: Hash único baseado em IP + UserAgent (identifica sessão única)
 * - viewerId: ID do browser persistido no localStorage (identifica usuário único)
 * - Geolocalização via headers da Vercel
 * - Device, Browser, OS parseados do User Agent
 */
export async function getViewData(viewerId: string): Promise<ViewData> {
  const headersList = await headers();
  
  // Extrai IP da requisição
  const ip = 
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    headersList.get('cf-connecting-ip') || // CloudFlare
    'unknown';
  
  // Extrai User Agent
  const userAgent = headersList.get('user-agent') || 'unknown';
  
  // Gera Session ID único baseado em IP + UserAgent
  // Isso garante que a mesma pessoa no mesmo dispositivo/browser = mesma sessão
  const sessionId = crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}`)
    .digest('hex');
  
  // Parse do User Agent para extrair device, browser, OS
  const { device, browser, os } = parseUserAgent(userAgent);
  
  // Geolocalização via headers da Vercel (disponível automaticamente)
  const country = headersList.get('x-vercel-ip-country') || undefined;
  const city = headersList.get('x-vercel-ip-city') || undefined;
  
  return {
    sessionId,
    viewerId,
    ip,
    userAgent,
    country,
    city,
    device,
    browser,
    os,
  };
}

/**
 * Parseia User Agent para extrair informações de device, browser e OS
 * Detecção simples mas suficiente para analytics básicos
 */
function parseUserAgent(ua: string) {
  const uaLower = ua.toLowerCase();
  
  // Detecção de Device
  let device = 'desktop';
  if (/mobile|android|iphone/i.test(ua)) {
    device = 'mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    device = 'tablet';
  }
  
  // Detecção de Browser
  let browser = 'unknown';
  if (uaLower.includes('edg')) {
    browser = 'edge';
  } else if (uaLower.includes('chrome')) {
    browser = 'chrome';
  } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
    browser = 'safari';
  } else if (uaLower.includes('firefox')) {
    browser = 'firefox';
  } else if (uaLower.includes('opera') || uaLower.includes('opr')) {
    browser = 'opera';
  }
  
  // Detecção de OS
  let os = 'unknown';
  if (uaLower.includes('windows')) {
    os = 'windows';
  } else if (uaLower.includes('mac os') || uaLower.includes('macos')) {
    os = 'macos';
  } else if (uaLower.includes('linux') && !uaLower.includes('android')) {
    os = 'linux';
  } else if (uaLower.includes('android')) {
    os = 'android';
  } else if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ios')) {
    os = 'ios';
  }
  
  return { device, browser, os };
}

/**
 * Valida se um viewerId é válido (formato UUID)
 */
export function isValidViewerId(viewerId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(viewerId);
}
