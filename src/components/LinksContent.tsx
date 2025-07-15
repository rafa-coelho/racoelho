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
    // <Layout>
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

        {/* Regular Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-8">
          {
            regularLinks.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center flex-col gap-2 justify-center w-full px-4 py-3 rounded-lg glass-panel hover:scale-[1.02] transition-all duration-300"
              >
                {/* <ExternalLink size={16} /> */}
                <span className="font-medium text-center w-full">{link.title}</span>
              </a>
            ))
          }
        </div>



        {/* Highlight Items */}
        {
          highlightItems.length > 0
            ? (
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
            )
            : null}

        {/* Latest Videos */}
        {videos.length > 0 && (
          <div className="w-full mt-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Últimos Vídeos</h2>
              <a href="https://www.youtube.com/@racoelhoo" target="_blank" className="text-sm text-primary hover:underline">Ver mais</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map(video => (
                <a key={video.id} href={video.link} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border hover:border-primary transition-colors">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                  <div className="p-3 bg-card">
                    <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Challenges */}
        {challenges.length > 0 && (
          <div className="w-full mt-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Últimos Desafios</h2>
              <a href="/listas/desafios" className="text-sm text-primary hover:underline">Ver mais</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {challenges.map(c => (
                <ContentCard key={c.slug} item={c} type="challenge" />
              ))}
            </div>
          </div>
        )}

        {/* Latest Posts */}
        {posts.length > 0 && (
          <div className="w-full mt-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Últimos Posts</h2>
              <a href="/posts" className="text-sm text-primary hover:underline">Ver mais</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map(p => (
                <ContentCard key={p.slug} item={p} type="post" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
    // </Layout>
  );
} 