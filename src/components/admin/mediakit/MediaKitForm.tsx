'use client';

import { useEffect, useState } from 'react';
import { Check, ExternalLink, FileText } from 'lucide-react';
import { pbCreate, pbList, pbUpdate } from '@/lib/pocketbase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatShortDate } from '@/components/rc';
import { CheckboxField, Field, FormSection, ListEditor, rcBtnPrimary, rcBtnSecondary, rcInput, rcSelect, rcTextarea, TextField } from '@/components/admin/fields';
import type { MediaKitFeatured } from '@/lib/types';
import { DEFAULT_CONTACT, FEATURED_MAX, FEATURED_TYPES, draftFromRecord, draftToPayload, emptyDraft, type MediaKitDraft } from './mediakit-form';

const COLLECTION = 'mediakit';

// Input compacto dentro dos itens de lista, com rótulo mono.
function ItemInput({ label, value, onChange, placeholder, type = 'text', className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[.08em] text-rc-ink-5">{label}</span>
      <input type={type} className={rcInput} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ItemTextarea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[.08em] text-rc-ink-5">{label}</span>
      <textarea className={rcTextarea} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function MediaKitForm() {
  const { toast } = useToast();
  const [draft, setDraft] = useState<MediaKitDraft>(emptyDraft);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await pbList(COLLECTION, { page: 1, perPage: 1, sort: '-updated' });
        if (!mounted) return;
        const rec = res.items[0];
        if (rec) {
          setRecordId(rec.id);
          setDraft(draftFromRecord(rec));
          setUpdatedAt((rec as any).updatedAt || (rec as any).updated || null);
        }
      } catch (e: any) {
        if (mounted) setLoadError(e?.message || 'Erro ao carregar');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const set = <K extends keyof MediaKitDraft>(k: K, v: MediaKitDraft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const payload = draftToPayload(draft);
      const rec = recordId ? await pbUpdate(COLLECTION, recordId, payload) : await pbCreate(COLLECTION, payload);
      setRecordId(rec.id);
      setUpdatedAt(payload.updatedAt);
      setDirty(false);
      // Invalida o cache público (fire-and-forget)
      fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: 'mediakit' }),
      }).catch(() => {});
      toast({ title: 'Media kit salvo', description: recordId ? 'Alterações gravadas.' : 'Registro criado.' });
    } catch (error: any) {
      console.error('Error saving mediakit:', error);
      const detail = error?.response?.data ? Object.entries(error.response.data).map(([k, v]: any) => `${k}: ${v?.message || v}`).join(' · ') : '';
      toast({ title: 'Erro ao salvar', description: detail || error?.message || 'Tenta de novo.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-16 text-center font-mono text-[12px] uppercase tracking-[.08em] text-rc-ink-5">Carregando media kit…</p>;
  }

  if (loadError) {
    return (
      <div className="rounded-rc-card border border-rc-border-card bg-rc-surface p-6">
        <p className="text-[15px] text-rc-ink">Não deu para carregar o media kit.</p>
        <p className="mt-1 font-mono text-[12px] text-rc-ink-5">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-4">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-rc-eyebrow uppercase text-rc-ink-5">Admin · registro único</span>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-.025em] text-rc-ink md:text-[30px]">Media kit</h1>
          <p className="mt-1 text-[13.5px] text-rc-ink-4">
            {recordId ? (updatedAt ? `Atualizado em ${formatShortDate(updatedAt)}` : 'Registro existente') : 'Ainda não existe — será criado ao salvar.'}
            {dirty && <span className="ml-2 text-rc-amber">· alterações não salvas</span>}
          </p>
        </div>
        <a href="/mediakit?preview=1" target="_blank" rel="noopener noreferrer" className={cn(rcBtnSecondary, 'self-start md:self-auto')}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> Pré-visualizar
        </a>
      </header>

      <FormSection title="01 · Apresentação">
        <TextField id="mk-headline" label="Headline" value={draft.headline} onChange={(v) => set('headline', v)} placeholder="Título do hero" />
        <Field label="Resumo" htmlFor="mk-summary">
          <textarea id="mk-summary" className={rcTextarea} rows={4} value={draft.summary} onChange={(e) => set('summary', e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField id="mk-email" type="email" label="Email de contato" value={draft.contactEmail} onChange={(v) => set('contactEmail', v)} placeholder={DEFAULT_CONTACT} />
          <TextField id="mk-availability" label="Disponibilidade" value={draft.availability} onChange={(v) => set('availability', v)} placeholder="Ex.: agenda aberta para o próximo trimestre" />
        </div>
      </FormSection>

      <FormSection title="02 · Números por canal" description="Sem número, o público vê “—”. Não preencha com estimativa.">
        <ListEditor
          items={draft.channels}
          onChange={(v) => set('channels', v)}
          createItem={() => ({ network: '', handle: '', url: '', followers: '', note: '' })}
          addLabel="Adicionar canal"
          emptyLabel="Nenhum canal."
          itemTitle={(c) => c.network}
          renderItem={(c, update) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ItemInput label="Rede" value={c.network} onChange={(v) => update({ network: v })} placeholder="YouTube" />
              <ItemInput label="Handle" value={c.handle} onChange={(v) => update({ handle: v })} placeholder="@racoelho" />
              <ItemInput label="URL" type="url" value={c.url} onChange={(v) => update({ url: v })} placeholder="https://" className="sm:col-span-2" />
              <ItemInput label="Seguidores (opcional)" value={c.followers} onChange={(v) => update({ followers: v.replace(/[^\d.,]/g, '') })} placeholder="—" />
              <ItemInput label="Nota (opcional)" value={c.note || ''} onChange={(v) => update({ note: v })} />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="03 · O que eu produzo">
        <ListEditor
          items={draft.formats}
          onChange={(v) => set('formats', v)}
          createItem={() => ({ tag: '', title: '', description: '', exampleLabel: '', exampleUrl: '' })}
          addLabel="Adicionar formato"
          emptyLabel="Nenhum formato."
          itemTitle={(f) => f.title}
          renderItem={(f, update) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
              <ItemInput label="Tag" value={f.tag} onChange={(v) => update({ tag: v })} placeholder="vídeo" />
              <ItemInput label="Título" value={f.title} onChange={(v) => update({ title: v })} />
              <div className="sm:col-span-2">
                <ItemTextarea label="Descrição" value={f.description} onChange={(v) => update({ description: v })} />
              </div>
              <ItemInput label="Rótulo do exemplo" value={f.exampleLabel || ''} onChange={(v) => update({ exampleLabel: v })} />
              <ItemInput label="URL do exemplo" type="url" value={f.exampleUrl || ''} onChange={(v) => update({ exampleUrl: v })} placeholder="https://" />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="04 · Conteúdo em destaque" description={`Até ${FEATURED_MAX} peças.`}>
        <ListEditor
          items={draft.featured}
          onChange={(v) => set('featured', v)}
          createItem={(): MediaKitFeatured => ({ type: 'video', title: '', url: '', coverImage: '' })}
          max={FEATURED_MAX}
          addLabel="Adicionar destaque"
          emptyLabel="Nenhum destaque."
          itemTitle={(f) => f.title}
          renderItem={(f, update) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10.5px] uppercase tracking-[.08em] text-rc-ink-5">Tipo</span>
                <select className={rcSelect} value={f.type} onChange={(e) => update({ type: e.target.value as MediaKitFeatured['type'] })}>
                  {FEATURED_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <ItemInput label="Título" value={f.title} onChange={(v) => update({ title: v })} />
              <ItemInput label="URL" type="url" value={f.url} onChange={(v) => update({ url: v })} placeholder="https://" className="sm:col-span-2" />
              <ItemInput label="URL da capa (opcional)" type="url" value={f.coverImage || ''} onChange={(v) => update({ coverImage: v })} placeholder="https://" className="sm:col-span-2" />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="05 · Marcas" description="Logo por URL (exibido em monocromático). Sem logo, aparece o nome.">
        <ListEditor
          items={draft.brands}
          onChange={(v) => set('brands', v)}
          createItem={() => ({ name: '', url: '', logo: '' })}
          addLabel="Adicionar marca"
          emptyLabel="Nenhuma marca."
          itemTitle={(b) => b.name}
          renderItem={(b, update) => (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ItemInput label="Nome" value={b.name} onChange={(v) => update({ name: v })} />
              <ItemInput label="Site (opcional)" type="url" value={b.url || ''} onChange={(v) => update({ url: v })} placeholder="https://" />
              <ItemInput label="URL do logo (opcional)" type="url" value={b.logo || ''} onChange={(v) => update({ logo: v })} placeholder="https://" className="sm:col-span-2" />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="06 · Como funciona" description="Com “Textos revisados” desligado, esta seção não aparece no público.">
        <BlockList items={draft.process} onChange={(v) => set('process', v)} addLabel="Adicionar etapa" />
      </FormSection>

      <FormSection title="07 · Meu jeito de trabalhar" description="Com “Textos revisados” desligado, esta seção não aparece no público.">
        <BlockList items={draft.principles} onChange={(v) => set('principles', v)} addLabel="Adicionar princípio" />
      </FormSection>

      <FormSection title="08 · Publicação">
        <CheckboxField
          label="Textos revisados"
          hint="Liga “Como funciona” e “Meu jeito de trabalhar” no público e remove o selo “texto proposto · revisar”. Enquanto desligado, a página pública fica noindex."
          checked={draft.reviewed}
          onChange={(v) => set('reviewed', v)}
        />
        <div className="flex items-start gap-3 rounded-[10px] border border-rc-amber-border-soft bg-rc-amber-surface-2 px-3.5 py-3">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-rc-amber" aria-hidden="true" />
          <p className="text-[13.5px] leading-[1.55] text-rc-ink-2">
            <span className="font-mono text-[11.5px] uppercase tracking-[.08em] text-rc-amber">PDF: aguardando decisão</span>
            <br />
            Upload manual ou geração a partir da página ainda não foi decidido. Sem PDF, o botão “Baixar PDF” fica escondido.
          </p>
        </div>
      </FormSection>

      {/* Barra de ações */}
      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] md:bottom-4 z-10 -mx-4 flex items-center justify-end gap-2 border-t border-rc-border bg-rc-bg px-4 py-3 md:mx-0 md:rounded-rc-card md:border md:px-5">
        <a href="/mediakit?preview=1" target="_blank" rel="noopener noreferrer" className={rcBtnSecondary} title="Mostra a versão salva">
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Pré-visualizar</span>
          <span className="sr-only sm:hidden">Pré-visualizar</span>
        </a>
        <button type="button" className={cn(rcBtnPrimary, 'flex-1 sm:flex-none')} onClick={onSave} disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar'} <Check className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function BlockList({ items, onChange, addLabel }: { items: { title: string; text: string }[]; onChange: (v: { title: string; text: string }[]) => void; addLabel: string }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      createItem={() => ({ title: '', text: '' })}
      addLabel={addLabel}
      emptyLabel="Nenhum item."
      itemTitle={(b) => b.title}
      renderItem={(b, update) => (
        <div className="space-y-3">
          <ItemInput label="Título" value={b.title} onChange={(v) => update({ title: v })} />
          <ItemTextarea label="Texto" value={b.text} onChange={(v) => update({ text: v })} />
        </div>
      )}
    />
  );
}
