import NewsletterContent from '@/components/NewsletterContent';
import { featureFlagService } from '@/lib/services/feature-flag.service';
import { newsletterArchiveService, type NewsletterIssue } from '@/lib/services/newsletter-archive.service';

// Página dinâmica (flag lida a cada request, com cache de 1 min no service);
// as chamadas ao ConvertKit ficam no data cache por 1h (next.revalidate no fetch).
export const revalidate = 0;

export default async function Newsletter() {
  // Arquivo de edições (flag newsletter_archive). Sem edições públicas, a seção não aparece.
  let issues: NewsletterIssue[] = [];
  if (await featureFlagService.isEnabled('newsletter_archive')) {
    issues = await newsletterArchiveService.getRecent(5);
  }

  return <NewsletterContent issues={issues} />;
}
