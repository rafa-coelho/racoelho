import PocketBase from 'pocketbase';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || '';

export async function isAdmin(): Promise<boolean> {
  // Server-side
  if (typeof window === 'undefined') {
    try {
      const { getAdminSession } = await import('@/lib/pocketbase-server');
      const token = await getAdminSession();
      return token !== null;
    } catch {
      return false;
    }
  }

  // Client-side
  try {
    const pb = new PocketBase(PB_URL);
    const saved = localStorage.getItem('pb_auth');
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    if (parsed?.token && parsed?.model) {
      pb.authStore.save(parsed.token, parsed.model);
      return pb.authStore.isValid === true;
    }
    return false;
  } catch {
    return false;
  }
}


