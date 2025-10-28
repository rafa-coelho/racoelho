"use client";
import { useMemo, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  previewClassName?: string;
  layout?: "stacked" | "split";
  editorMinHeightClass?: string;
};

export default function MarkdownEditor({ value, onChange, className, previewClassName, layout = "stacked", editorMinHeightClass = "min-h-[60vh]" }: Props) {
  const content = useMemo(() => value || "", [value]);
  const [showPreview, setShowPreview] = useState(true);

  if (layout === "split") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea
          className={`w-full ${editorMinHeightClass} rounded-md border border-white/10 bg-card/30 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/50 ${className||""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escreva em Markdown..."
        />
        <div className={`rounded-md border border-white/10 bg-card/30 p-4 ${previewClassName||""}`}>
          <MarkdownRenderer content={content} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Editor</span>
        <button className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10" onClick={() => setShowPreview(v => !v)}>
          {showPreview ? "Ocultar preview" : "Mostrar preview"}
        </button>
      </div>
      <textarea
        className={`w-full ${editorMinHeightClass} rounded-md border border-white/10 bg-card/30 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/50 ${className||""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva em Markdown..."
      />
      {showPreview && (
        <div className={`rounded-md border border-white/10 bg-card/30 p-4 ${previewClassName||""}`}>
          <MarkdownRenderer content={content} />
        </div>
      )}
    </div>
  );
}


