import type { Metadata } from 'next';
import { vagaService } from '@/lib/services/vaga.service';
import VagasContent from '@/components/VagasContent';
import { BLOG_NAME, SITE_URL } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: `Vagas & Indicações | ${BLOG_NAME}`,
  description:
    'Vagas abertas para indicação. Conhece alguém bom? Me indica aqui que eu levo adiante — sem redirect.',
  alternates: { canonical: `${SITE_URL}/vagas` },
  openGraph: {
    title: `Vagas & Indicações | ${BLOG_NAME}`,
    description:
      'Vagas abertas para indicação. Conhece alguém bom? Me indica aqui que eu levo adiante.',
    url: `${SITE_URL}/vagas`,
    siteName: BLOG_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function VagasPage() {
  const vagas = vagaService.getAllVagas();
  const departments = vagaService.getDepartments();
  const techs = vagaService.getTopTechs(20);

  return <VagasContent vagas={vagas} departments={departments} techs={techs} />;
}
