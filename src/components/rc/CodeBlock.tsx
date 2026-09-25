'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Tema de sintaxe sobre os tokens rc (cores via variáveis CSS).
const rcCodeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': { color: 'var(--rc-ink-2)', background: 'none', fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace' },
  'pre[class*="language-"]': { color: 'var(--rc-ink-2)', background: 'none' },
  comment: { color: 'var(--rc-ink-5)', fontStyle: 'italic' },
  prolog: { color: 'var(--rc-ink-5)' },
  doctype: { color: 'var(--rc-ink-5)' },
  cdata: { color: 'var(--rc-ink-5)' },
  punctuation: { color: 'var(--rc-ink-4)' },
  keyword: { color: 'var(--rc-blue-link)' },
  operator: { color: 'var(--rc-ink-3)' },
  boolean: { color: 'var(--rc-amber)' },
  number: { color: 'var(--rc-amber)' },
  constant: { color: 'var(--rc-amber)' },
  string: { color: 'var(--rc-green)' },
  char: { color: 'var(--rc-green)' },
  'attr-value': { color: 'var(--rc-green)' },
  builtin: { color: 'var(--rc-green)' },
  'class-name': { color: 'var(--rc-blue-soft)' },
  function: { color: 'var(--rc-blue-soft)' },
  tag: { color: 'var(--rc-blue-link)' },
  'attr-name': { color: 'var(--rc-blue-soft)' },
  property: { color: 'var(--rc-ink-2)' },
  variable: { color: 'var(--rc-ink-2)' },
  regex: { color: 'var(--rc-amber)' },
  important: { color: 'var(--rc-amber)', fontWeight: 'bold' },
};

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <div className="my-[18px] overflow-hidden rounded-xl border border-rc-border-card bg-rc-sunken md:my-6">
      <div className="flex items-center justify-between border-b border-rc-border-card py-1 pl-[13px] pr-1 font-mono text-[10.5px] text-rc-ink-5 md:pl-3.5 md:text-[11px]">
        <span>{language || 'code'}</span>
        <button type="button" onClick={copy} className="h-9 rounded-md px-2.5 transition-colors hover:text-rc-ink" aria-label="Copiar código">
          {copied ? 'copiado' : 'copiar'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={rcCodeTheme}
        PreTag="div"
        customStyle={{ margin: 0, padding: '16px', background: 'transparent', fontSize: '13.5px', lineHeight: 1.75, overflowX: 'auto' }}
        codeTagProps={{ className: 'text-[11.5px] md:text-[13.5px]' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
