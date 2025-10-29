import { v4 as uuidv4 } from 'uuid';
import { getPocketBaseServer } from '@/lib/pocketbase-server';

// Interface para os parâmetros de busca de token
interface FindTokenParams {
  email: string;
  slug: string;
}

// Interface para os parâmetros de registro de token
interface RegisterTokenParams {
  name: string;
  email: string;
  slug: string;
}

// Interface para os parâmetros de validação de token
interface ValidateTokenParams {
  token: string;
  slug: string;
}

// Interface para os dados do token
interface TokenData {
  email: string;
  name: string;
  slug: string;
  valid: boolean;
  createdAt: string;
  expiresAt: string;
}

/**
 * Busca um token já existente para determinado e-mail e slug.
 *
 * @param params - Parâmetros de busca.
 * @returns Retorna o token existente ou null se não encontrado.
 */
export async function findTokenByEmailAndSlug({ email, slug }: FindTokenParams): Promise<string | null> {
  try {
    const pb = await getPocketBaseServer();
    const nowIso = new Date().toISOString();
    const rec = await pb.collection('access_tokens').getFirstListItem(
      `email = "${email}" && slug = "${slug}" && valid = true && expiresAt > "${nowIso}"`
    );
    return rec?.id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Registra um token para download de um eBook.
 * Se o e-mail já tiver um token válido para o mesmo slug, retorna esse token.
 *
 * @param params - Parâmetros de registro.
 * @returns Retorna o token (existente ou novo).
 */
export async function registerEbookToken({ name, email, slug }: RegisterTokenParams): Promise<string> {
  try {
    // Reutiliza token válido existente
    const existingToken = await findTokenByEmailAndSlug({ email, slug });
    if (existingToken) {
      return existingToken;
    }

    const pb = await getPocketBaseServer();
    const tokenData: TokenData = {
      email,
      name,
      slug,
      valid: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    };

    const created = await pb.collection('access_tokens').create(tokenData as any);
    // Usa o id do PocketBase como token
    return created.id as string;
  } catch (error) {
    console.error('Erro ao registrar token:', error);
    throw new Error('Falha ao registrar token para acesso');
  }
}

/**
 * Valida um token para download de um eBook.
 *
 * @param params - Parâmetros de validação.
 * @returns Retorna true se o token for válido, false caso contrário.
 */
export async function validateEbookToken({ token, slug }: ValidateTokenParams): Promise<boolean> {
  try {
    const pb = await getPocketBaseServer();
    const rec = await pb.collection('access_tokens').getOne(token);
    if (!rec) return false;

    const valid = !!rec.valid;
    const sameSlug = rec.slug === slug;
    const notExpired = rec.expiresAt ? new Date(rec.expiresAt) > new Date() : true;

    return Boolean(valid && sameSlug && notExpired);
  } catch (error) {
    return false;
  }
}