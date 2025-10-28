'use client';

import React, { ReactNode } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';
import Layout from './Layout';
import ContentCard from './ContentCard';
import { SocialLink, LinkTreeItem, ContentMeta, YoutubeVideo } from '@/lib/api';

interface LinksContentProps {
  socialLinks: SocialLink[];
  linkItems: LinkTreeItem[];
  videos?: YoutubeVideo[];
  posts?: ContentMeta[];
  challenges?: ContentMeta[];
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

export default function LinksContent({ socialLinks, linkItems, videos = [], posts = [], challenges = [] }: LinksContentProps) {
  const highlightItems = linkItems.filter(item => item.type === 'highlight');
  const regularLinks = linkItems.filter(item => item.type === 'link');

  return (
    <Layout>
    <div className="min-h-screen section-gradient-1 py-16">
      <div className="content-container max-w-3xl mx-auto">
        {/* Header Profile Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-glow-pulse"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
              <img
                src="https://github.com/rafa-coelho.png"
                alt="Rafael Coelho"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/128x128?text=RC';
                }}
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-3 gradient-text">Rafael Coelho</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Fullstack Developer • Tech Content Creator
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-3 mb-8">
            {socialLinks.map((social) => {
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 flex items-center justify-center rounded-xl bg-card/50 backdrop-blur-sm border border-white/10 hover:bg-primary hover:border-primary/50 hover:scale-110 transition-all duration-300 text-xl shadow-lg"
                  aria-label={social.name}
                  title={social.name}
                >
                  {GetSocialIcon(social.name)}
                </a>
              );
            })}
          </div>
        </div>

        {/* Regular Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {
            regularLinks.map((link, index) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-modern p-5 text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <span className="font-semibold group-hover:text-primary transition-colors">{link.title}</span>
                <ExternalLink size={16} className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
              </a>
            ))
          }
        </div>



        {/* Highlight Items */}
        {
          highlightItems.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-center">Em Destaque</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {highlightItems.map((item, index) => (
                    <a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-modern p-8 text-center group animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                    >
                      {item.image && (
                        <div className="mb-6 flex justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )
        }

        {/* Latest Videos */}
        {videos.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Últimos Vídeos</h2>
              <a 
                href="https://www.youtube.com/@racoelhoo" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Ver canal →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <a 
                  key={video.id} 
                  href={video.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="card-modern overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaYoutube className="text-white text-5xl" />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="line-clamp-2 font-medium group-hover:text-primary transition-colors">
                      {video.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Challenges */}
        {challenges.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Últimos Desafios</h2>
              <a 
                href="/listas/desafios" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Ver todos →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {challenges.map((c, index) => (
                <div 
                  key={c.slug}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <ContentCard item={c} type="challenge" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Posts */}
        {posts.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Últimos Posts</h2>
              <a 
                href="/posts" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Ver todos →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((p, index) => (
                <div 
                  key={p.slug}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                >
                  <ContentCard item={p} type="post" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
    </Layout>
  );
} 