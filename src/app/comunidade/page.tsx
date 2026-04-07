import ComunidadeContent from '@/components/ComunidadeContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comunidade',
  description: 'Entre na comunidade Racoelho no Discord. Teste o jogo, jogue com a galera e troque ideia sobre dev, games e tech.',
};

export default function ComunidadePage() {
  return <ComunidadeContent />;
}
