'use client';

import React, { ReactNode } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';
import Layout from './Layout';
import { SocialLink, LinkTreeItem } from '@/lib/api';

interface LinksContentProps {
  socialLinks: SocialLink[];
  linkItems: LinkTreeItem[];
}

export const GetSocialIcon = (iconName: string): ReactNode => {
  switch (iconName.toLowerCase()) {
    case 'github':
      return <FaGithub />;
    case 'linkedin':
      return <FaLinkedin />;
    case 'twitter':
      return <FaTwitter />;
    case 'instagram':
      return <FaInstagram />;
    case 'tiktok':
      return <FaTiktok />;
    case 'youtube':
      return <FaYoutube />;
    case 'email':
      return <FaEnvelope />;
    default:
      return <FaGithub />;
  }
};

export default function LinksContent({ socialLinks, linkItems }: LinksContentProps) {
  const highlightItems = linkItems.filter(item => item.type === 'highlight');
  const regularLinks = linkItems.filter(item => item.type === 'link');

  

  return (
    <Layout>
      <div className="content-container py-12">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <div className="mb-4 text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary">
              <img
                src="https://github.com/rafa-coelho.png"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Perfil';
                }}
              />
            </div>
            <h1 className="text-2xl font-bold mb-4">Rafael Coelho</h1>

            <div className="flex justify-center gap-4 mb-2">
              {socialLinks.map((social) => {
                return (
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
                );
              })}
            </div>
          </div>

          {/* Highlight Items */}
          {highlightItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {highlightItems.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel rounded-lg p-4 text-center hover:shadow-glass-hover transition-all duration-300"
                >
                  {item.image && (
                    <div className="mb-3 flex justify-center">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </a>
              ))}
            </div>
          ) : null}

          {/* Regular Links */}
          <div className="space-y-3 w-full">
            {regularLinks.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg glass-panel hover:scale-[1.02] transition-all duration-300"
              >
                <span className="font-medium">{link.title}</span>
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 