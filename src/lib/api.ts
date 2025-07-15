/**
 * Internal API for fetching and processing markdown content
 */

import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import { parseMarkdownFile } from './markdown';

// Types for content items
export interface ContentMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
}

export interface ContentItem extends ContentMeta {
  content: string;
}

// Type for social links
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

// Types for linktree items
export interface LinkTreeItem {
  title: string;
  url: string;
  description?: string;
  type: 'link' | 'highlight';
  icon?: string;
  image?: string;
}

// Type for setup items
export interface SetupItem {
  name: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  price?: string;
}

// Types for sales page blocks
export interface SalesPageBlock {
  type: 'header' | 'text' | 'image' | 'pricing' | 'features' | 'testimonials' | 'cta' | 'faq' | 'form';
  title?: string;
  content?: string;
  image?: string;
  price?: string;
  items?: Array<{
    title: string;
    description: string;
  }>;
  apiUrl?: string;
  fields?: Array<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }>;
  submitText?: string;
  successMessage?: string;
}

export interface SalesPage {
  title: string;
  slug: string;
  blocks: SalesPageBlock[];
  ctaText: string;
  ctaUrl: string;
  paymentUrl: string;
}

// Interface para os ebooks
export interface Ebook {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  downloadUrl: string;
}

// Função para buscar um ebook pelo slug
export function getEbookBySlug(slug: string): Ebook | null {
  // Simula a busca do ebook no banco de dados
  const ebooks: Ebook[] = [
    {
      slug: 'melhorando-linkedin',
      title: 'Melhorando seu LinkedIn para Desenvolvedores',
      description: 'Aprenda a criar um perfil profissional no LinkedIn que se destaque e atraia as melhores oportunidades.',
      coverImage: '/assets/ebooks/melhorando-linkedin-cover.jpg',
      downloadUrl: 'melhorando-linkedin.pdf',
    },
  ];

  return ebooks.find((ebook) => ebook.slug === slug) || null;
}

// Definindo diretórios
const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');
const challengesDirectory = path.join(contentDirectory, 'challenges');
const salesPagesDirectory = path.join(contentDirectory, 'sales-pages');

// Fetch markdown content helper
export async function fetchMarkdownContent(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown content: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return '';
  }
}

// Posts
export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []): Partial<ContentItem> {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  
  const post = parseMarkdownFile(fullPath);
  if (!post) {
    return { slug: realSlug };
  }

  const selectedFields: Partial<ContentItem> = {};

  if (fields.length === 0) {
    return post;
  }

  fields.forEach((field) => {
    if (field in post) {
      const value = post[field as keyof ContentItem];
      if (value !== undefined) {
        (selectedFields as any)[field] = value;
      }
    }
  });

  return selectedFields;
}

export function getAllPosts(fields: string[] = [], limit: number = 0): ContentMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .filter((post): post is ContentMeta =>
      post.title !== undefined &&
      post.slug !== undefined &&
      post.date !== undefined &&
      post.excerpt !== undefined
    )
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return limit > 0 ? posts.slice(0, limit) : posts;
}

// Challenges
export function getChallengeSlugs() {
  return fs.readdirSync(challengesDirectory);
}

export function getChallengeBySlug(slug: string, fields: string[] = []): Partial<ContentItem> {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(challengesDirectory, `${realSlug}.md`);
  
  const challenge = parseMarkdownFile(fullPath);
  if (!challenge) {
    return { slug: realSlug };
  }

  const selectedFields: Partial<ContentItem> = {};

  if (fields.length === 0) {
    return challenge;
  }

  fields.forEach((field) => {
    if (field in challenge) {
      const value = challenge[field as keyof ContentItem];
      if (value !== undefined) {
        (selectedFields as any)[field] = value;
      }
    }
  });

  return selectedFields;
}

export function getAllChallenges(fields: string[] = [], limit: number = 0): ContentMeta[] {
  const slugs = getChallengeSlugs();
  const challenges = slugs
    .map((slug) => getChallengeBySlug(slug, fields));

  const filtered = challenges.filter((challenge): challenge is ContentMeta =>
    challenge.title !== undefined &&
    challenge.slug !== undefined &&
    challenge.date !== undefined &&
    challenge.excerpt !== undefined
  )
    .sort((challenge1, challenge2) => (challenge1.date > challenge2.date ? -1 : 1));
    
  return limit > 0 ? filtered.slice(0, limit) : filtered;
}

// Setup Items
export function getSetupItems() {
  const setupPath = path.join(contentDirectory, 'setup.json');
  const fileContents = fs.readFileSync(setupPath, 'utf8');
  return JSON.parse(fileContents) as SetupItem[];
}

// LinkTree
export function getLinkTreeData() {
  const socialLinksPath = path.join(contentDirectory, 'social-links.json');
  const linkItemsPath = path.join(contentDirectory, 'link-items.json');

  const socialLinks = JSON.parse(fs.readFileSync(socialLinksPath, 'utf8')) as SocialLink[];
  const linkItems = JSON.parse(fs.readFileSync(linkItemsPath, 'utf8')) as LinkTreeItem[];

  return { socialLinks, linkItems };
}

// Sales Pages
export function getSalesPageSlugs(): string[] {
  const salesPagesDirectory = path.join(process.cwd(), 'content', 'sales-pages');
  
  try {
    const fileNames = fs.readdirSync(salesPagesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => fileName.replace(/\.json$/, ''));
  } catch (error) {
    console.error('Error reading sales pages directory:', error);
    return [];
  }
}

export function getSalesPageBySlug(slug: string): SalesPage {
  const salesPagesDirectory = path.join(process.cwd(), 'content', 'sales-pages');
  const fullPath = path.join(salesPagesDirectory, `${slug}.json`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as SalesPage;
  } catch (error) {
    console.error(`Error reading sales page ${slug}:`, error);
    throw new Error(`Sales page ${slug} not found`);
  }
}

export function getAllSalesPages() {
  const slugs = getSalesPageSlugs();
  return slugs.map(slug => getSalesPageBySlug(slug));
}

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  published: string;
}

export async function getLatestYoutubeVideos(max: number = 3): Promise<YoutubeVideo[]> {
  try {
    // ID do canal Rafael Coelho (@racoelhoo)
    const channelId = 'UCXXClhhG-T-DKeT09EP8ZNg';
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(feedUrl, { next: { revalidate: 60 * 60 } });
    if (!res.ok) {
      console.error('Failed to fetch YouTube RSS');
      return [];
    }
    const xml = await res.text();

    // Parse simples para extrair tags <entry>
    const entries = xml.split('<entry>').slice(1);
    const videos: YoutubeVideo[] = entries.slice(0, max).map((entry) => {
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const linkMatch = entry.match(/<link rel='alternate' href='([^']+)'/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const videoId = idMatch ? idMatch[1] : '';
      return {
        id: videoId,
        title: titleMatch ? titleMatch[1] : 'Video',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        link: linkMatch ? linkMatch[1] : `https://youtu.be/${videoId}`,
        published: publishedMatch ? publishedMatch[1] : '',
      };
    });

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos', error);
    return [];
  }
}
