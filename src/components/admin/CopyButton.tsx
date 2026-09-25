"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

/** Botão que copia `value` para a área de transferência com feedback visual. */
export default function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback antigo
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* silencioso */
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Copiado!" : `Copiar${label ? ` ${label}` : ""}`}
      aria-label={copied ? "Copiado" : `Copiar${label ? ` ${label}` : ""}`}
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-md border transition-colors shrink-0",
        copied
          ? "border-rc-green-border-strong bg-rc-green-surface text-rc-green"
          : "border-rc-border-chip text-rc-ink-5 hover:bg-rc-nav-hover hover:text-rc-ink",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
