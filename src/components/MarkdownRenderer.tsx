import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import MermaidBlock from './MermaidBlock';
import { CodeBlock } from './rc/CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function nodeText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child) : React.isValidElement(child) ? nodeText(child.props.children) : ''))
    .join('');
}

// Âncora estável para o sumário ("Neste artigo").
export function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Extrai os H2 do markdown (ignora blocos de código).
export function extractHeadings(markdown: string): { id: string; text: string }[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '');
  return Array.from(withoutCode.matchAll(/^##\s+(.+?)\s*#*\s*$/gm)).map((m) => {
    const text = m[1].replace(/[*_`[\]]/g, '').replace(/\(.*?\)/g, '').trim();
    return { id: slugifyHeading(text), text };
  });
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={cn('markdown-content text-rc-article-m text-rc-ink-3 md:text-rc-article', className)}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="mt-8 text-[26px] font-semibold tracking-[-.03em] text-rc-ink md:mt-10 md:text-[34px]" {...props} />
        ),
        h2: ({ node, children, ...props }) => (
          <h2
            id={slugifyHeading(nodeText(children))}
            className="mt-[30px] scroll-mt-24 text-[22px] font-semibold leading-[1.25] tracking-[-.025em] text-rc-ink md:mt-[38px] md:text-rc-h2-article"
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ node, ...props }) => (
          <h3 className="mt-6 text-lg font-semibold tracking-[-.02em] text-rc-ink md:mt-8 md:text-[21px]" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="mt-5 text-base font-semibold text-rc-ink md:text-lg" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mt-[18px] [text-wrap:pretty] md:mt-[22px]" {...props} />
        ),
        strong: ({ node, ...props }) => <strong className="font-semibold text-rc-ink" {...props} />,
        a: ({ node, ...props }) => (
          <a
            className="text-rc-blue-link underline decoration-rc-blue-border underline-offset-[3px] transition-colors hover:text-rc-blue-soft hover:decoration-rc-blue-link"
            target={props.href?.startsWith('http') ? '_blank' : undefined}
            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul className="mt-[18px] list-disc space-y-2 pl-5 marker:text-rc-ink-6 md:mt-[22px]" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="mt-[18px] list-decimal space-y-2 pl-5 marker:font-mono marker:text-rc-ink-6 md:mt-[22px]" {...props} />
        ),
        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="mt-[22px] rounded-r-xl border-l-[3px] border-rc-blue bg-rc-surface px-[18px] py-1 text-[16px] leading-[1.7] text-rc-ink-2 md:mt-[26px] md:px-[22px] md:py-1.5 md:text-[17px] [&>p]:my-3"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div className="mt-6 overflow-x-auto rounded-xl border border-rc-border-card">
            <table className="w-full text-[14.5px]" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="border-b border-rc-border-card bg-rc-surface" {...props} />,
        tbody: ({ node, ...props }) => <tbody className="divide-y divide-rc-border" {...props} />,
        tr: ({ node, ...props }) => <tr {...props} />,
        th: ({ node, ...props }) => (
          <th className="px-4 py-2.5 text-left font-mono text-[11.5px] font-normal uppercase tracking-[.08em] text-rc-ink-5" {...props} />
        ),
        td: ({ node, ...props }) => <td className="px-4 py-2.5" {...props} />,
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const text = String(children).replace(/\n$/, '');
          const isBlock = !!match || text.includes('\n');

          if (match && match[1] === 'mermaid') {
            return <MermaidBlock code={text} />;
          }

          return isBlock ? (
            <CodeBlock code={text} language={match?.[1]} />
          ) : (
            <code className="rounded-md border border-rc-border-chip bg-rc-tag px-1.5 py-0.5 font-mono text-[0.85em] text-rc-ink-2" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ node, children }) => <>{children}</>,
        img: ({ node, ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="mx-auto mt-6 h-auto max-w-full rounded-rc-card border border-rc-border-card" loading="lazy" {...props} alt={props.alt || ''} />
        ),
        hr: ({ node, ...props }) => <hr className="my-10 border-rc-border" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
