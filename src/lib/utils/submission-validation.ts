// Validação pura do envio de solução — usada no cliente e no servidor.

export const REPO_HOSTS = ['github.com', 'gitlab.com', 'bitbucket.org'];
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NOTES_MAX = 1000;

// Repositório precisa ser github/gitlab/bitbucket com owner e repo no path.
export function isValidRepoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    const host = url.hostname.replace(/^www\./, '');
    if (!REPO_HOSTS.includes(host)) return false;
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.length >= 2;
  } catch {
    return false;
  }
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export interface SubmissionInput {
  name: string;
  email: string;
  repoUrl: string;
  demoUrl?: string;
  notes?: string;
}

// Mesmas mensagens da API. Retorna erro por campo (vazio = válido).
export function validateSubmission(input: SubmissionInput): Partial<Record<keyof SubmissionInput, string>> {
  const errors: Partial<Record<keyof SubmissionInput, string>> = {};
  if (input.name.trim().length < 2) errors.name = 'Nome é obrigatório';
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Email inválido';
  if (!isValidRepoUrl(input.repoUrl.trim())) errors.repoUrl = 'Repositório precisa ser do GitHub, GitLab ou Bitbucket';
  const demo = (input.demoUrl || '').trim();
  if (demo && !isValidUrl(demo)) errors.demoUrl = 'URL de demo inválida';
  if ((input.notes || '').trim().length > NOTES_MAX) errors.notes = `Observações: máximo de ${NOTES_MAX} caracteres`;
  return errors;
}
