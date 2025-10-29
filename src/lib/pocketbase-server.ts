// PocketBase Server-Side Helper
// Para uso em Server Components e API Routes

import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || process.env.NEXT_PUBLIC_PB_URL || '';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || '';

// Cache de instância do cliente para evitar múltiplas conexões
let serverClient: PocketBase | null = null;

/**
 * Retorna uma instância autenticada do PocketBase para server-side
 * Usa variáveis de ambiente para autenticação admin
 */
export async function getPocketBaseServer(): Promise<PocketBase> {
  if (serverClient && serverClient.authStore.isValid) {
    return serverClient;
  }

  const pb = new PocketBase(PB_URL);
  // Evitar cancelamento automático de requisições concorrentes
  pb.autoCancellation(false);
  
  // Autenticar como admin usando credenciais de ambiente
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    serverClient = pb;
    return pb;
  } catch (error) {
    console.error('[PocketBase Server] Failed to authenticate:', error);
    throw new Error('Failed to authenticate with PocketBase');
  }
}

/**
 * Verifica se o usuário está autenticado como admin através de cookies
 * Retorna o token de autenticação se válido
 */
export async function getAdminSession(): Promise<string | null> {
  try {
    const { cookies: getCookies } = await import('next/headers');
    const cookieStore = getCookies();
    const authCookie = cookieStore.get('pb_auth');
    
    if (!authCookie?.value) {
      return null;
    }

    // Verificar se o token está válido fazendo uma requisição autenticada
    const pb = new PocketBase(PB_URL);
    // Evitar cancelamento automático de requisições concorrentes
    pb.autoCancellation(false);
    // loadFromCookie espera a string completa do header: "pb_auth=<valor>"
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
    
    if (pb.authStore.isValid) {
      // Tentar refresh para validar o token
      try {
        await pb.authStore.model?.id; // Trigger refresh if needed
        return pb.authStore.token;
      } catch {
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('[PocketBase Server] Error getting admin session:', error);
    return null;
  }
}

/**
 * Verifica se o usuário é admin baseado nos cookies
 */
export async function isAdmin(): Promise<boolean> {
  const token = await getAdminSession();
  return token !== null;
}

/**
 * Cria um cliente PocketBase autenticado para requests específicos
 * Pode ser usado para bypass de regras através de autenticação admin
 */
export async function getAuthenticatedClient(): Promise<PocketBase> {
  const session = await getAdminSession();
  
  if (session) {
    // Cliente com autenticação do usuário
    const pb = new PocketBase(PB_URL);
    // Evitar cancelamento automático de requisições concorrentes
    pb.autoCancellation(false);
    const { cookies: getCookies } = await import('next/headers');
    const cookieStore = getCookies();
    const authCookie = cookieStore.get('pb_auth');
    if (authCookie?.value) {
      pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
    }
    return pb;
  }
  
  // Fallback para admin server-side
  return getPocketBaseServer();
}

/**
 * Helper para buscar dados com suporte a preview (admin vê drafts)
 */
export async function pbListWithPreview(
  collection: string,
  params?: {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
    fields?: string;
  },
  isPreview: boolean = false
) {
  let pb: PocketBase;
  if (isPreview) {
    try {
      pb = await getAuthenticatedClient();
    } catch {
      pb = await getPocketBaseServer();
    }
  } else {
    pb = await getPocketBaseServer();
  }
  
  return await pb.collection(collection).getList(
    params?.page || 1,
    params?.perPage || 20,
    {
      filter: params?.filter,
      sort: params?.sort,
      fields: params?.fields,
    }
  );
}

/**
 * Helper para buscar item por ID com suporte a preview
 */
export async function pbGetByIdWithPreview(
  collection: string,
  id: string,
  isPreview: boolean = false
) {
  const pb = isPreview ? await getAuthenticatedClient() : await getPocketBaseServer();
  return await pb.collection(collection).getOne(id);
}

/**
 * Helper para buscar item por filtro com suporte a preview
 */
export async function pbFirstByFilterWithPreview(
  collection: string,
  filter: string,
  fields?: string,
  isPreview: boolean = false
) {
  const pb = isPreview ? await getAuthenticatedClient() : await getPocketBaseServer();
  return await pb.collection(collection).getFirstListItem(filter, { fields });
}

