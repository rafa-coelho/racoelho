'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="content-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-foreground">
            Dev Creator
          </Link>

          <div className="flex gap-6">
            <Link 
              href="/" 
              className={cn('nav-link', isActive('/') && 'active')}
            >
              Home
            </Link>
            <Link 
              href="/posts" 
              className={cn('nav-link', isActive('/posts') && 'active')}
            >
              Blog
            </Link>
            <Link 
              href="/listas/desafios" 
              className={cn('nav-link', isActive('/listas/desafios') && 'active')}
            >
              Desafios
            </Link>
            <Link 
              href="/links" 
              className={cn('nav-link', isActive('/links') && 'active')}
            >
              Links
            </Link>
            <Link 
              href="/setup" 
              className={cn('nav-link', isActive('/setup') && 'active')}
            >
              Setup
            </Link>
            <Link 
              href="/newsletter" 
              className={cn('nav-link', isActive('/newsletter') && 'active')}
            >
              Newsletter
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 