// PocketBase Auth Helper
import PocketBase from 'pocketbase';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || '';

export function getPocketBase(): PocketBase {
  return new PocketBase(PB_URL);
}

export async function signInWithOAuth(provider: string) {
  if (typeof window === 'undefined') return;
  
  const pb = getPocketBase();
  const authData = await pb.admins.authWithOAuth2({
    provider,
    redirectUrl: window.location.origin + '/admin/auth/callback',
  });
  
  // OAuth will redirect, this won't execute
  console.log('OAuth auth started');
}

export async function signInWithPassword(email: string, password: string) {
  console.log('[Auth] Attempting login with:', email);
  
  try {
    // Usar API route para salvar cookie no servidor
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    console.log('[Auth] Login successful');
    
    // Salvar também no localStorage para client-side
    if (typeof window !== 'undefined') {
      const pb = getPocketBase();
      pb.authStore.save(data.token, { id: '', email } as any);
      localStorage.setItem('pb_auth', JSON.stringify({
        token: data.token,
        model: { id: '', email },
      }));
    }
    
    return data;
  } catch (error: any) {
    console.error('[Auth] Login failed:', error);
    throw new Error(error?.message || 'Login failed');
  }
}

export async function signOut() {
  if (typeof window === 'undefined') return;
  
  // Limpar cookie via API
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('[Auth] Error logging out:', error);
  }
  
  const pb = getPocketBase();
  pb.authStore.clear();
  localStorage.removeItem('pb_auth');
  
  window.location.href = '/admin/login';
}

export function getPocketBaseClient(): PocketBase {
  const pb = getPocketBase();
  
  // Try to restore auth from localStorage
  if (typeof window !== 'undefined') {
    const savedAuth = localStorage.getItem('pb_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.token && authData.model) {
          pb.authStore.save(authData.token, authData.model);
        }
      } catch (error) {
        console.error('[Auth] Failed to restore auth:', error);
      }
    }
  }
  
  return pb;
}

/**
 * Retorna um cliente PocketBase público (sem autenticação)
 * Usado para operações que não requerem autenticação, como tracking de views
 */
export function getPublicPocketBaseClient(): PocketBase {
  return new PocketBase(PB_URL);
}

export async function checkAuth(): Promise<boolean> {
  try {
    const pb = getPocketBaseClient();
    
    // Check if authenticated
    if (!pb.authStore.isValid) {
      console.log('[Auth] Not authenticated');
      return false;
    }
    
    // Try to refresh to validate token
    await pb.admins.authRefresh();
    console.log('[Auth] Token is valid');
    
    return true;
  } catch (error) {
    console.error('[Auth] Error:', error);
    return false;
  }
}

