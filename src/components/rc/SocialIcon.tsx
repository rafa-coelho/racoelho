import { Github, Instagram, Linkedin, Mail, Twitter, Youtube, Globe } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { cn } from '@/lib/utils';

// Ícones sociais no traço do lucide (tiktok não existe no lucide, cai no react-icons).
export function SocialIcon({ name, className }: { name: string; className?: string }) {
  const cls = cn('h-[17px] w-[17px]', className);
  switch (name.toLowerCase()) {
    case 'github':
      return <Github className={cls} strokeWidth={1.75} aria-hidden="true" />;
    case 'linkedin':
      return <Linkedin className={cls} strokeWidth={1.75} aria-hidden="true" />;
    case 'youtube':
      return <Youtube className={cls} strokeWidth={1.75} aria-hidden="true" />;
    case 'instagram':
      return <Instagram className={cls} strokeWidth={1.75} aria-hidden="true" />;
    case 'twitter':
    case 'x':
      return <Twitter className={cls} strokeWidth={1.75} aria-hidden="true" />;
    case 'email':
      return <Mail className={cls} strokeWidth={1.75} aria-hidden="true" />;
    case 'tiktok':
      return <FaTiktok className={cls} aria-hidden="true" />;
    default:
      return <Globe className={cls} strokeWidth={1.75} aria-hidden="true" />;
  }
}
