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
    { name: 'Links', href: '/links' },
    { name: 'Newsletter', href: '/newsletter' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
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

          {/* Copyright */}
          <div className="pt-8 text-center text-muted-foreground">
            <div className="flex justify-center gap-4 mb-4">
              
            
            {
              SocialLinks.map((social) => (
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
              ))
            }
            </div>
            <p>
              {BLOG_NAME} <br /> 2024{new Date().getFullYear() > 2024 ? `- ${new Date().getFullYear()}` : ''}

            </p>
          </div>

          <footer className="mt-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} {packageJson.name} • v{packageJson.version} • Build: {packageJson.buildDate}
            </p>
          </footer>
        </div>
      </footer>
    </div>
  );
}
