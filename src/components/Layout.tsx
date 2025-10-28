'use client';

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BLOG_NAME } from "@/lib/config/constants";
import SocialLinks from "../../content/social-links.json";
import { GetSocialIcon } from "./LinksContent";
import packageJson from '../../package.json';
import Script from 'next/script';
import { GA_TRACKING_ID } from "@/lib/gtag";
import { AnalyticsWrapper } from "./Analytics";
import { useFeatureFlag } from "@/hooks/use-feature-flag";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Feature Flags
  const { enabled: newsletterEnabled } = useFeatureFlag('newsletter');

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/posts' },
    { name: 'Desafios', href: '/listas/desafios' },
    { name: 'Setup', href: '/setup' },
    // { name: 'Newsletter', href: '/newsletter' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
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

      {/* Header - Modern & Subtle */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="content-container">
          <div className="flex h-20 items-center justify-between">
            {/* Logo with Gradient */}
            <Link href="/" className="group flex items-center gap-3">
              
              <span className="font-bold text-xl group-hover:text-primary transition-colors hidden sm:block">
                {BLOG_NAME}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-link px-4 py-2 rounded-lg text-sm font-medium",
                    pathname === item.href && "active"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl animate-fade-in-down">
            <nav className="content-container py-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-all",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Modern Layout */}
      <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="content-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl">{BLOG_NAME}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Conteúdo sobre desenvolvimento, tecnologia e desafios de programação para impulsionar sua carreira em tech.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/links"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Links
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Newsletter Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Conecte-se</h3>
              <div className="flex gap-3 mb-6">
                {SocialLinks.slice(0, 5).map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary hover:scale-110 transition-all duration-300 text-lg"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {GetSocialIcon(social.name)}
                  </a>
                ))}
              </div>
              {newsletterEnabled && (
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                📬 Assinar Newsletter
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024{new Date().getFullYear() > 2024 ? `- ${new Date().getFullYear()}` : ''} {BLOG_NAME}. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              v{packageJson.version} • Build: {packageJson.buildDate}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
