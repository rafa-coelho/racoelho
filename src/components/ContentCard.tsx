'use client';

import Link from 'next/link';
import { Calendar, ArrowUpRight, Zap, BookOpen } from 'lucide-react';
import { ContentMeta } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ComponentType } from 'react';

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
  featured?: boolean;
}

export default function ContentCard({ 
  item, 
  type, 
  LinkComponent = Link as unknown as ComponentType<CustomLinkProps>,
  featured = false 
}: ContentCardProps) {
  const href = `/${type === 'post' ? 'posts' : 'listas/desafios'}/${item.slug}`;
  
  const accentClass = type === 'post' ? 'accent-post' : 'accent-challenge';
  const colorClass = type === 'post' ? 'text-post' : 'text-challenge';
  const bgClass = type === 'post' ? 'bg-post' : 'bg-challenge';
  const Icon = type === 'post' ? BookOpen : Zap;
  const label = type === 'post' ? 'POST' : 'DESAFIO';
  
  const content = (
    <div className={`h-full flex flex-col card-modern overflow-hidden group ${accentClass} hover:scale-[1.02] transition-all duration-300`}>
      {item.coverImage && (
        <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-56'}`}>
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          
          {/* Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${bgClass} border ${type === 'post' ? 'border-post' : 'border-challenge'} text-white text-xs font-bold flex items-center gap-1`}>
            <Icon size={12} />
            {label}
          </div>

          {/* Arrow Icon */}
          <div className={`absolute top-4 right-4 w-12 h-12 rounded-full ${bgClass} backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}>
            <ArrowUpRight size={20} className="text-white" />
          </div>
        </div>
      )}
      
      <div className={`flex-1 flex flex-col ${featured ? 'p-8' : 'p-6'}`}>
        <h2 className={`font-bold mb-3 group-hover:${colorClass} transition-colors leading-tight ${featured ? 'text-3xl' : 'text-xl'} line-clamp-2`}>
          {item.title}
        </h2>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </div>
        </div>

        {item.excerpt && (
          <p className={`text-muted-foreground mb-5 leading-relaxed flex-1 ${featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
            {item.excerpt}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 text-xs font-medium rounded-full ${bgClass} ${colorClass} border ${type === 'post' ? 'border-post/20' : 'border-challenge/20'}`}
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${bgClass} ${colorClass}`}>
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <LinkComponent href={href} className="block h-full">
      {content}
    </LinkComponent>
  );
}
