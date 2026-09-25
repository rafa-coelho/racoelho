import { Pill, type PillTone } from '@/components/rc';
import type { ChallengeSubmissionStatus } from '@/lib/types';

export const SUBMISSION_STATUS: Record<ChallengeSubmissionStatus, { label: string; tone: PillTone }> = {
  new: { label: 'Nova', tone: 'amber' },
  reviewed: { label: 'Revisada', tone: 'blue' },
  featured: { label: 'Destaque', tone: 'green' },
  rejected: { label: 'Rejeitada', tone: 'neutral' },
};

export const SUBMISSION_STATUS_ORDER: ChallengeSubmissionStatus[] = ['new', 'reviewed', 'featured', 'rejected'];

export function SubmissionStatusPill({ status }: { status: ChallengeSubmissionStatus }) {
  const meta = SUBMISSION_STATUS[status] || SUBMISSION_STATUS.new;
  return <Pill tone={meta.tone}>{meta.label}</Pill>;
}
