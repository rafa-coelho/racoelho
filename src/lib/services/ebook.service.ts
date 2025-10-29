import type { Ebook } from '@/lib/types';

export function getEbookBySlug(slug: string): Ebook | null {
  const ebooks: Ebook[] = [
    {
      slug: 'melhorando-linkedin',
      title: 'Melhorando seu LinkedIn para Desenvolvedores',
      description: 'Aprenda a criar um perfil profissional no LinkedIn que se destaque e atraia as melhores oportunidades.',
      coverImage: '/assets/ebooks/melhorando-linkedin-cover.jpg',
      downloadUrl: 'melhorando-linkedin.pdf',
    },
  ];

  return ebooks.find((ebook) => ebook.slug === slug) || null;
}


