import { getPocketBaseServer } from '@/lib/pocketbase-server';
import type { ChallengeSubmission, ChallengeSubmissionStatus } from '@/lib/types';

const COLLECTION = 'challenge_submissions';

export const REPO_HOSTS = ['github.com', 'gitlab.com', 'bitbucket.org'];
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function map(rec: any): ChallengeSubmission {
  return {
    id: rec.id,
    challenge: rec.challenge,
    challengeTitle: rec.expand?.challenge?.title,
    challengeSlug: rec.expand?.challenge?.slug,
    name: rec.name,
    email: rec.email,
    repoUrl: rec.repoUrl,
    demoUrl: rec.demoUrl || undefined,
    notes: rec.notes || undefined,
    status: rec.status || 'new',
    reviewNote: rec.reviewNote || undefined,
    created: rec.created,
  };
}

export const challengeSubmissionService = {
  // Duplicata (mesmo email + mesmo desafio) atualiza o registro existente.
  async upsert(input: { challenge: string; name: string; email: string; repoUrl: string; demoUrl?: string; notes?: string }) {
    const pb = await getPocketBaseServer();
    const email = input.email.toLowerCase().replace(/"/g, '');
    const existing = await pb
      .collection(COLLECTION)
      .getFirstListItem(`challenge="${input.challenge}" && email="${email}"`)
      .catch(() => null);
    const data = { ...input, email, status: 'new' as ChallengeSubmissionStatus };
    const rec = existing ? await pb.collection(COLLECTION).update(existing.id, data) : await pb.collection(COLLECTION).create(data);
    return map(rec);
  },

  async list(filter?: { challenge?: string; status?: ChallengeSubmissionStatus }): Promise<ChallengeSubmission[]> {
    const pb = await getPocketBaseServer();
    const parts: string[] = [];
    if (filter?.challenge) parts.push(`challenge="${filter.challenge.replace(/"/g, '')}"`);
    if (filter?.status) parts.push(`status="${filter.status}"`);
    const items = await pb.collection(COLLECTION).getFullList({ filter: parts.join(' && ') || undefined, sort: '-created', expand: 'challenge' });
    return items.map(map);
  },

  async countNew(): Promise<number> {
    const pb = await getPocketBaseServer();
    const res = await pb.collection(COLLECTION).getList(1, 1, { filter: 'status="new"', fields: 'id' }).catch(() => null);
    return res?.totalItems || 0;
  },
};
