import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase.service';

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
    const querySnapshot = await db.collection('ebook_tokens')
      .where('email', '==', email)
      .where('slug', '==', slug)
      .where('valid', '==', true)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error('Erro ao buscar token:', error);
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
    // Primeiro, verifica se já existe um token para esse e-mail/slug
    const existingToken = await findTokenByEmailAndSlug({ email, slug });
    if (existingToken) {
      return existingToken; // Retorna o token antigo
    }

    // Caso não exista, cria um novo token
    const token = uuidv4();
    const tokenData: TokenData = {
      email,
      name,
      slug,
      valid: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
    };
    
    await db.collection('ebook_tokens').doc(token).set(tokenData);
    
    return token;
  } catch (error) {
    console.error('Erro ao registrar token:', error);
    throw new Error('Falha ao registrar token para download do ebook');
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
    const docRef = db.collection('ebook_tokens').doc(token);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false;
    }

    const data = doc.data() as TokenData;
    
    // Verifica se o token é válido e corresponde ao slug
    if (!data.valid || data.slug !== slug) {
      return false;
    }

    // Verifica se o token não expirou
    const expiresAt = new Date(data.expiresAt);
    if (expiresAt < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
} 