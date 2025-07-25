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

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="content-container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="font-bold text-xl">
              {BLOG_NAME}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden border-t">
            <nav className="content-container py-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block py-2 text-base font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
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

      {/* Footer */}
      <footer className="border-t">
        <div className="content-container py-8">
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-4">
            {SocialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-accent transition-colors"
                aria-label={social.name}
                title={social.name}
              >
                {GetSocialIcon(social.name)}
              </a>
            ))}
          </div>

          {/* Copyright and Version Info */}
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              {BLOG_NAME} <br /> 
              2024{new Date().getFullYear() > 2024 ? `- ${new Date().getFullYear()}` : ''}
            </p>
            <p className="text-sm">
              v{packageJson.version} • Build: {packageJson.buildDate}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
