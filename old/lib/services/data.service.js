import { db } from './firebase'; // Ajuste o caminho conforme seu projeto
import { v4 as uuidv4 } from 'uuid';

/**
 * Busca um token já existente para determinado e-mail e slug.
 *
 * @param {object} params - Parâmetros de busca.
 * @param {string} params.email - E-mail do usuário.
 * @param {string} params.slug - Identificador do eBook.
 * @returns {Promise<string|null>} Retorna o token existente ou null se não encontrado.
 */
export async function findTokenByEmailAndSlug ({ email, slug }) {
    const querySnapshot = await db.collection('ebook_tokens')
        .where('email', '==', email)
        .where('slug', '==', slug)
        .where('valid', '==', true)
        .limit(1)
        .get();

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return doc.id;
}

/**
 * Registra um token para download de um eBook.
 * Se o e-mail já tiver um token válido para o mesmo slug, retorna esse token.
 *
 * @param {object} params - Parâmetros de registro.
 * @param {string} params.name - Nome do usuário.
 * @param {string} params.email - E-mail do usuário.
 * @param {string} params.slug - Identificador do eBook.
 * @returns {Promise<string>} Retorna o token (existente ou novo).
 */
export async function registerEbookToken ({ name, email, slug }) {
    // Primeiro, verifica se já existe um token para esse e-mail/slug
    const existingToken = await findTokenByEmailAndSlug({ email, slug });
    if (existingToken) {
        return existingToken; // Retorna o token antigo
    }

    // Caso não exista, cria um novo token
    const token = uuidv4();
    await db.collection('ebook_tokens').doc(token).set({
        email,
        name,
        slug,
        createdAt: new Date(),
        valid: true,
    });

    return token;
}

/**
 * Valida um token para download de um eBook.
 *
 * @param {object} params - Parâmetros de validação.
 * @param {string} params.token - O token a ser validado.
 * @param {string} params.slug - Identificador do eBook (para comparar).
 * @returns {Promise<boolean>} Retorna `true` se o token for válido, caso contrário `false`.
 */
export async function validateEbookToken ({ token, slug }) {
    const docRef = db.collection('ebook_tokens').doc(token);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return false;
    }

    const tokenData = docSnap.data();
    if (!tokenData.valid || tokenData.slug !== slug) {
        return false;
    }

    // Se quiser invalidar depois do primeiro uso, descomente:
    // await docRef.update({ valid: false });

    return true;
}
