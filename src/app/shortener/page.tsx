import { Metadata } from 'next';
import LinkShortener from '@/components/LinkShortener';

export const metadata: Metadata = {
  title: 'Gerador de Links Curtos | Rafael Coelho',
  description: 'Crie links curtos e personalizados para suas redes sociais e sites favoritos.',
  openGraph: {
    title: 'Gerador de Links Curtos | Rafael Coelho',
    description: 'Crie links curtos e personalizados para suas redes sociais e sites favoritos.',
    type: 'website',
  },
};

export default function LinkShortenerPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Gerador de Links Curtos</h1>
        <p className="text-muted-foreground mb-8">
          Crie links curtos e personalizados para suas redes sociais e sites favoritos.
        </p>
        
        <LinkShortener />
      </div>
    </div>
  );
} 