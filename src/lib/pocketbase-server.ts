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
 * Inclui retry automático para lidar com timeouts
 */
export async function getPocketBaseServer(retries = 3): Promise<PocketBase> {
  if (serverClient && serverClient.authStore.isValid) {
    return serverClient;
  }

  const pb = new PocketBase(PB_URL);
  // Evitar cancelamento automático de requisições concorrentes
  pb.autoCancellation(false);
  
  // Autenticar como admin usando credenciais de ambiente com retry
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      serverClient = pb;
      return pb;
    } catch (error: any) {
      const isTimeout = error?.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || error?.status === 0;
      const isLastAttempt = attempt === retries;
      
      if (isTimeout && !isLastAttempt) {
        console.warn(`[PocketBase Server] Auth timeout (attempt ${attempt}/${retries}), retrying in ${attempt}s...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Backoff exponencial
        continue;
      }
      
      console.error('[PocketBase Server] Failed to authenticate:', error);
      throw new Error(`Failed to authenticate with PocketBase after ${retries} attempts`);
    }
  }
  
  throw new Error('Failed to authenticate with PocketBase');
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
    
    if (pb.authStore.isValid && pb.authStore.token) {
      // Se o token é válido, verificar se é admin
      const model = pb.authStore.model;
      
      // Se não tem model, não é válido
      if (!model) {
        return null;
      }
      
      // Verificar se é admin: collectionName pode ser 'admins' ou '_superusers'
      // _superusers é usado quando autenticado via pb.admins.authWithPassword()
      const isAdminUser = model.collectionName === 'admins' || 
                         model.collectionName === '_superusers' ||
                         model.collectionId === '_pb_users_auth_' ||
                         (model as any).avatar !== undefined;
      
      if (isAdminUser) {
        return pb.authStore.token;
      } else {
        // Tentar verificar se tem permissões de admin fazendo uma requisição
        try {
          // Se conseguir acessar admins, é admin
          await pb.collection('admins').getList(1, 1);
          return pb.authStore.token;
        } catch {
          return null;
        }
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
  
  // Se isPreview é true, tentar usar cliente autenticado do usuário
  if (isPreview) {
    try {
      const session = await getAdminSession();
      if (session) {
        // Cliente com autenticação do usuário via cookie
        pb = new PocketBase(PB_URL);
        pb.autoCancellation(false);
        const { cookies: getCookies } = await import('next/headers');
        const cookieStore = getCookies();
        const authCookie = cookieStore.get('pb_auth');
        if (authCookie?.value) {
          pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
        }
      } else {
        // Se não há sessão, usar admin server-side
        pb = await getPocketBaseServer();
      }
    } catch (error) {
      // Em caso de erro, usar admin server-side como fallback
      pb = await getPocketBaseServer();
    }
  } else {
    // Modo público, sempre usar admin server-side
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
  let pb: PocketBase;
  
  if (isPreview) {
    try {
      const session = await getAdminSession();
      if (session) {
        pb = new PocketBase(PB_URL);
        pb.autoCancellation(false);
        const { cookies: getCookies } = await import('next/headers');
        const cookieStore = getCookies();
        const authCookie = cookieStore.get('pb_auth');
        if (authCookie?.value) {
          pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
        }
      } else {
        pb = await getPocketBaseServer();
      }
    } catch {
      pb = await getPocketBaseServer();
    }
  } else {
    pb = await getPocketBaseServer();
  }
  
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
  let pb: PocketBase;
  
  if (isPreview) {
    try {
      const session = await getAdminSession();
      if (session) {
        pb = new PocketBase(PB_URL);
        pb.autoCancellation(false);
        const { cookies: getCookies } = await import('next/headers');
        const cookieStore = getCookies();
        const authCookie = cookieStore.get('pb_auth');
        if (authCookie?.value) {
          pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
        }
      } else {
        pb = await getPocketBaseServer();
      }
    } catch {
      pb = await getPocketBaseServer();
    }
  } else {
    pb = await getPocketBaseServer();
  }
  
  return await pb.collection(collection).getFirstListItem(filter, { fields });
}

