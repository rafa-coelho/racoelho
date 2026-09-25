"use client";
import { useId, useMemo, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  previewClassName?: string;
  layout?: "stacked" | "split";
  editorMinHeightClass?: string;
};

const editorClasses =
  "w-full rounded-[10px] border border-rc-border-strong bg-rc-input p-3.5 font-mono text-[13.5px] leading-[1.65] text-rc-ink placeholder:text-rc-ink-5 outline-none transition-colors duration-150 focus:border-rc-blue-link";
const previewClasses = "rounded-[10px] border border-rc-border-strong bg-rc-sunken p-4 md:p-5";

type Tab = "editor" | "preview";

export default function MarkdownEditor({ value, onChange, className, previewClassName, layout = "stacked", editorMinHeightClass = "min-h-[60vh]" }: Props) {
  const content = useMemo(() => value || "", [value]);
  const [showPreview, setShowPreview] = useState(true);
  const [tab, setTab] = useState<Tab>("editor");
  const uid = useId();

  if (layout === "split") {
    // Abaixo de lg: editor e preview em abas. A partir de lg: lado a lado.
    const tabBtn = (t: Tab, label: string) => (
      <button
        type="button"
        role="tab"
        id={`${uid}-tab-${t}`}
        aria-selected={tab === t}
        aria-controls={`${uid}-panel-${t}`}
        onClick={() => setTab(t)}
        className={cn(
          "min-h-[44px] flex-1 rounded-[8px] font-mono text-[12px] uppercase tracking-[.08em] transition-colors duration-150",
          tab === t ? "bg-rc-nav-hover text-rc-ink" : "text-rc-ink-4 hover:text-rc-ink-2",
        )}
      >
        {label}
      </button>
    );

    return (
      <div>
        <div role="tablist" aria-label="Modo do editor" className="mb-3 flex gap-1 rounded-[10px] border border-rc-border-strong bg-rc-sunken p-1 lg:hidden">
          {tabBtn("editor", "Editor")}
          {tabBtn("preview", "Preview")}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div id={`${uid}-panel-editor`} role="tabpanel" aria-labelledby={`${uid}-tab-editor`} className={cn(tab !== "editor" && "hidden lg:block")}>
            <textarea
              aria-label="Conteúdo em Markdown"
              className={cn(editorClasses, editorMinHeightClass, className)}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Escreva em Markdown..."
            />
          </div>
          <div id={`${uid}-panel-preview`} role="tabpanel" aria-labelledby={`${uid}-tab-preview`} className={cn(previewClasses, "min-w-0", tab !== "preview" && "hidden lg:block", previewClassName)}>
            {content.trim() ? <MarkdownRenderer content={content} /> : <p className="text-[14px] text-rc-ink-5">Nada para pré-visualizar ainda.</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-rc-ink-4">Editor</span>
        <button type="button" className="min-h-[36px] rounded-[8px] border border-rc-border-strong bg-rc-surface-3 px-3 text-[12.5px] text-rc-ink-3 hover:border-rc-border-hover hover:text-rc-ink" onClick={() => setShowPreview(v => !v)}>
          {showPreview ? "Ocultar preview" : "Mostrar preview"}
        </button>
      </div>
      <textarea
        aria-label="Conteúdo em Markdown"
        className={cn(editorClasses, editorMinHeightClass, className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva em Markdown..."
      />
      {showPreview && (
        <div className={cn(previewClasses, previewClassName)}>
          <MarkdownRenderer content={content} />
        </div>
      )}
    </div>
  );
}
