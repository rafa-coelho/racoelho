'use client';

import { useEffect, useState } from 'react';
import { Field } from './Field';

// Ícone do próprio produto (favicon/app icon). Tem prioridade sobre o ícone lucide nos cards.
export function LogoField({ id, file, onChange, existingUrl }: { id: string; file: File | null; onChange: (f: File | null) => void; existingUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);

  useEffect(() => {
    if (!file) {
      setPreview(existingUrl ?? null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, existingUrl]);

  return (
    <Field label="Logo (opcional)" htmlFor={id} hint="PNG quadrado (256px), até 1MB. Sem logo, o card usa o ícone acima.">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-rc-border-strong bg-rc-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview ? <img src={preview} alt="" className="h-full w-full object-contain" /> : <span className="font-mono text-[11px] text-rc-ink-5">—</span>}
        </span>
        <input
          id={id}
          type="file"
          accept="image/png,image/webp,image/jpeg"
          className="text-[13px] text-rc-ink-3 file:mr-3 file:rounded-lg file:border file:border-rc-border-strong file:bg-rc-input file:px-3 file:py-1.5 file:text-[13px] file:text-rc-ink-2"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </Field>
  );
}
