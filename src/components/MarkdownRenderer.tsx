import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={cn('markdown-content', className)}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="my-4 leading-relaxed" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            target={props.href?.startsWith('http') ? '_blank' : undefined}
            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul className="my-4 pl-5 list-disc space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="my-4 pl-5 list-decimal space-y-2" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="mb-1" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-muted pl-4 my-4 italic"
            {...props}
          />
        ),
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match;
          
          return !isInline ? (
            <SyntaxHighlighter
              language={match ? match[1] : ''}
              style={vscDarkPlus as any}
              PreTag="div"
              className="rounded-md my-4 text-sm"
              showLineNumbers
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className="px-1 py-0.5 rounded bg-muted font-mono text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
        img: ({ node, ...props }) => (
          <img
            className="max-w-full h-auto rounded-lg my-6 mx-auto"
            loading="lazy"
            {...props}
            alt={props.alt || 'Image'}
          />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-8 border-muted" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
