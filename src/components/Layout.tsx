'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOG_NAME } from "@/lib/config/constants";
import { SocialLink } from '@/lib/api';
import packageJson from '../../package.json';
import Script from 'next/script';
import { GA_TRACKING_ID } from "@/lib/gtag";
import { AnalyticsWrapper } from "./Analytics";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import { Logo, SocialIcon } from "@/components/rc";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/posts' },
  { name: 'Desafios', href: '/listas/desafios' },
  { name: 'Projetos', href: '/projetos' },
  { name: 'Setup', href: '/setup' },
  { name: 'Vagas', href: '/vagas' },
  { name: 'Comunidade', href: '/comunidade' },
];

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Feature Flags
  const { enabled: newsletterEnabled } = useFeatureFlag('newsletter');

  // Fetch social links from API
  useEffect(() => {
    fetch('/api/social-links')
      .then(res => res.json())
      .then(data => setSocialLinks(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading social links:', err));
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    // devolve o foco ao botão que abriu o drawer
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-rc-bg text-rc-ink">
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
      <AnalyticsWrapper />

      <header className="sticky top-0 z-40 w-full border-b border-rc-border bg-rc-bg/[.92] backdrop-blur-md">
        <div className="rc-container flex h-14 items-center justify-between md:h-[66px]">
          <Logo />

          <nav className="hidden items-center gap-1.5 text-[14.5px] md:flex" aria-label="Principal">
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    "rounded-lg px-[13px] py-2 transition-colors duration-150 ease-out",
                    active
                      ? "bg-rc-blue-chip text-rc-ink"
                      : "text-rc-nav-ink hover:bg-rc-nav-hover hover:text-rc-ink"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="-mr-2.5 flex items-center gap-0.5 md:hidden">
            <Link
              href="/posts#busca"
              className="grid h-11 w-11 place-items-center text-rc-ink-3"
              aria-label="Buscar artigos"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="grid h-11 w-11 place-items-center text-rc-ink"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={isMenuOpen}
              aria-controls="rc-mobile-menu"
            >
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <MobileDrawer
          pathname={pathname}
          onClose={closeMenu}
          socialLinks={socialLinks}
          newsletterEnabled={newsletterEnabled}
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      <Footer socialLinks={socialLinks} />
    </div>
  );
}

function MobileDrawer({
  pathname,
  onClose,
  socialLinks,
  newsletterEnabled,
}: {
  pathname: string | null;
  onClose: () => void;
  socialLinks: SocialLink[];
  newsletterEnabled: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Foco preso no drawer, Esc fecha, scroll da página travado.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-rc-canvas/80" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        id="rc-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-0 flex flex-col bg-rc-bg"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-rc-border px-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="-mr-2.5 grid h-11 w-11 place-items-center text-rc-ink"
            aria-label="Fechar menu"
          >
            <X className="h-[22px] w-[22px]" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 overflow-y-auto px-4 pt-[18px] text-[19px] font-medium tracking-[-.02em]" aria-label="Principal">
          {navigation.map((item, index) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  "flex h-[54px] items-center gap-3.5 rounded-xl px-3.5",
                  active ? "bg-rc-blue-chip text-rc-ink" : "text-rc-ink-2"
                )}
              >
                <span className={cn("w-[22px] font-mono text-[11px] tracking-normal", active ? "text-rc-blue-link" : "text-rc-ink-6")}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3.5 border-t border-rc-border px-4 pb-[calc(26px+env(safe-area-inset-bottom))] pt-5">
          {newsletterEnabled && (
            <Link
              href="/newsletter"
              onClick={onClose}
              className="grid h-[50px] place-items-center rounded-xl bg-rc-blue text-[15.5px] font-semibold text-white"
            >
              Assinar a newsletter
            </Link>
          )}
          {socialLinks.length > 0 && (
            <div className="flex gap-2">
              {socialLinks.slice(0, 4).map((social, index) => (
                <a
                  key={`${social.name}-${index}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid h-11 flex-1 place-items-center rounded-[11px] border border-rc-border-chip bg-rc-surface-2 text-rc-ink-3"
                >
                  <SocialIcon name={social.icon || social.name} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer({ socialLinks }: { socialLinks: SocialLink[] }) {
  const year = new Date().getFullYear();
  const footerLinks = [...navigation.slice(1), { name: 'Links', href: '/links' }];

  return (
    <footer className="mt-[30px] border-t border-rc-border md:mt-[76px] md:bg-rc-footer">
      <div className="rc-container grid grid-cols-1 gap-[18px] pb-0 pt-6 md:grid-cols-[1.5fr_1fr_1fr] md:gap-10 md:pb-[26px] md:pt-[46px]">
        <div className="hidden md:block">
          <Logo size="sm" />
          <p className="mt-3.5 max-w-[40ch] text-[14.5px] leading-[1.65] text-rc-ink-4">
            Conteúdo sobre desenvolvimento, tecnologia e desafios de programação para impulsionar sua carreira em tech.
          </p>
        </div>

        {/* Links rápidos */}
        <nav aria-label="Links rápidos" className="text-[14px] text-rc-ink-4 md:text-[14.5px]">
          <span className="mb-3.5 hidden font-mono text-rc-eyebrow uppercase text-rc-ink-5 md:block">Links rápidos</span>
          <ul className="grid grid-cols-2 gap-x-3.5 gap-y-[9px] md:grid-cols-1 md:gap-y-2.5">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors duration-150 hover:text-rc-ink">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Conecte-se */}
        <div className="text-[14.5px] text-rc-ink-4">
          <span className="mb-3.5 hidden font-mono text-rc-eyebrow uppercase text-rc-ink-5 md:block">Conecte-se</span>
          {/* desktop: lista em texto */}
          <ul className="hidden flex-col gap-2.5 md:flex">
            {socialLinks.map((social, index) => (
              <li key={`${social.name}-${index}`}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="transition-colors duration-150 hover:text-rc-ink">
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
          {/* mobile: ícones de 44px */}
          <div className="flex gap-2 md:hidden">
            {socialLinks.slice(0, 5).map((social, index) => (
              <a
                key={`${social.name}-${index}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="grid h-11 w-11 place-items-center rounded-[11px] border border-rc-border-chip bg-rc-surface-2 text-rc-ink-3"
              >
                <SocialIcon name={social.icon || social.name} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="rc-container flex flex-col gap-1 pb-[30px] pt-[18px] font-mono text-[11px] text-rc-ink-6 md:flex-row md:justify-between md:pb-[38px] md:pt-0 md:text-[11.5px]">
        <span>© 2024–{year} {BLOG_NAME}. Todos os direitos reservados.</span>
        <span className="hidden md:inline">v{packageJson.version} · build {packageJson.buildDate}</span>
      </div>
    </footer>
  );
}
