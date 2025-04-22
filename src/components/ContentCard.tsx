'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { ContentMeta } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ComponentType } from 'react';
import { LinkProps as NextLinkProps } from 'next/link';

type CustomLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

interface ContentCardProps {
  item: ContentMeta;
  type: 'post' | 'challenge';
  LinkComponent?: ComponentType<CustomLinkProps>;
}

export default function ContentCard({ item, type, LinkComponent = Link as unknown as ComponentType<CustomLinkProps> }: ContentCardProps) {
  const href = `/${type === 'post' ? 'posts' : 'listas/desafios'}/${item.slug}`;
  const content = (
    <>
      {item.coverImage && (
        <div className="mb-4 rounded-md overflow-hidden">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500"
            loading="lazy"
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2">{item.title}</h2>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </div>
      </div>

      {item.excerpt && (
        <p className="text-muted-foreground mb-4">{item.excerpt}</p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );

  return (
    <LinkComponent
      href={href}
      className="block p-6 border rounded-lg hover:border-primary transition-colors"
    >
      {content}
    </LinkComponent>
  );
}
