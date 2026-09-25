'use client';

import { CheckboxField, NumberField, SelectField, TextField, numberToField, toNumberOrNull } from './Field';

export interface SetupExtra {
  kind: '' | 'hardware' | 'software';
  detail: string;
  affiliate: boolean;
  order: string;
}

export const emptySetupExtra: SetupExtra = { kind: '', detail: '', affiliate: false, order: '' };

export function setupExtraFromRecord(rec: any): SetupExtra {
  return {
    kind: rec?.kind === 'hardware' || rec?.kind === 'software' ? rec.kind : '',
    detail: rec?.detail || '',
    affiliate: !!rec?.affiliate,
    order: numberToField(rec?.order),
  };
}

export function setupExtraToPayload(v: SetupExtra) {
  return { kind: v.kind, detail: v.detail.trim(), affiliate: v.affiliate, order: toNumberOrNull(v.order, true) };
}

export function SetupExtraFields({ value, onChange }: { value: SetupExtra; onChange: (v: SetupExtra) => void }) {
  const set = <K extends keyof SetupExtra>(k: K, v: SetupExtra[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="st-kind"
          label="Tipo"
          hint="Hardware vira linha com foto; software vira chip."
          value={value.kind}
          onChange={(v) => set('kind', v as SetupExtra['kind'])}
          emptyLabel="—"
          options={[
            { value: 'hardware', label: 'Hardware' },
            { value: 'software', label: 'Software' },
          ]}
        />
        <NumberField id="st-order" label="Ordem" value={value.order} onChange={(v) => set('order', v)} step={1} placeholder="0" />
      </div>
      <TextField id="st-detail" label="Detalhe" hint="Linha mono secundária." value={value.detail} onChange={(v) => set('detail', v)} placeholder="LG · 3440×1440" />
      <CheckboxField label="Link de afiliado" hint='Ganha rel="sponsored" e ativa o aviso de afiliados na página.' checked={value.affiliate} onChange={(v) => set('affiliate', v)} />
    </div>
  );
}
