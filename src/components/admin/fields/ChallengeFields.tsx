'use client';

import type { ChallengeDifficulty } from '@/lib/types';
import { CheckboxField, Field, NumberField, SelectField, numberToField, toNumberOrNull } from './Field';
import { TextListEditor, cleanTextList, toTextList } from './ListEditor';
import { TagsInput, toStringList } from './TagsInput';

export interface ChallengeExtra {
  number: string;
  difficulty: '' | ChallengeDifficulty;
  estimatedHours: string;
  stack: string[];
  deliverables: { text: string }[];
  criteria: { text: string }[];
  comingSoon: boolean;
}

export const emptyChallengeExtra: ChallengeExtra = {
  number: '',
  difficulty: '',
  estimatedHours: '',
  stack: [],
  deliverables: [],
  criteria: [],
  comingSoon: false,
};

// Valores antigos (easy/medium/hard) viram os novos.
const LEGACY_DIFFICULTY: Record<string, ChallengeDifficulty> = { easy: 'facil', medium: 'medio', hard: 'dificil' };

export function challengeExtraFromRecord(rec: any): ChallengeExtra {
  const d = rec?.difficulty;
  return {
    number: numberToField(rec?.number),
    difficulty: d === 'facil' || d === 'medio' || d === 'dificil' ? d : LEGACY_DIFFICULTY[d] ?? '',
    estimatedHours: numberToField(rec?.estimatedHours),
    stack: toStringList(rec?.stack),
    deliverables: toTextList(rec?.deliverables),
    criteria: toTextList(rec?.criteria),
    comingSoon: !!rec?.comingSoon,
  };
}

// Payload para o PB. Vazios viram null/[]/"" (não quebram a validação).
export function challengeExtraToPayload(v: ChallengeExtra) {
  return {
    number: toNumberOrNull(v.number, true),
    difficulty: v.difficulty,
    estimatedHours: toNumberOrNull(v.estimatedHours),
    stack: v.stack,
    deliverables: cleanTextList(v.deliverables),
    criteria: cleanTextList(v.criteria),
    comingSoon: v.comingSoon,
  };
}

export function ChallengeExtraFields({ value, onChange }: { value: ChallengeExtra; onChange: (v: ChallengeExtra) => void }) {
  const set = <K extends keyof ChallengeExtra>(k: K, v: ChallengeExtra[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberField id="ch-number" label="Número" hint="Ordem na trilha (#01). Obrigatório para publicados." value={value.number} onChange={(v) => set('number', v)} step={1} min={0} placeholder="1" />
        <SelectField
          id="ch-difficulty"
          label="Dificuldade"
          value={value.difficulty}
          onChange={(v) => set('difficulty', v as ChallengeExtra['difficulty'])}
          emptyLabel="—"
          options={[
            { value: 'facil', label: 'Fácil' },
            { value: 'medio', label: 'Médio' },
            { value: 'dificil', label: 'Difícil' },
          ]}
        />
        <NumberField id="ch-hours" label="Horas estimadas" hint='Exibido como "~6h".' value={value.estimatedHours} onChange={(v) => set('estimatedHours', v)} step="any" min={0} placeholder="6" />
      </div>

      <Field label="Stack" htmlFor="ch-stack" hint="Enter ou vírgula para adicionar.">
        <TagsInput id="ch-stack" value={value.stack} onChange={(v) => set('stack', v)} placeholder="Docker, Traefik…" />
      </Field>

      <Field label="O que você vai construir (entregáveis)">
        <TextListEditor items={value.deliverables} onChange={(v) => set('deliverables', v)} addLabel="Adicionar entregável" emptyLabel="Nenhum entregável." placeholder="Ex.: API REST com autenticação" />
      </Field>

      <Field label="Critérios de aceite">
        <TextListEditor items={value.criteria} onChange={(v) => set('criteria', v)} addLabel="Adicionar critério" emptyLabel="Nenhum critério." placeholder="Ex.: Deploy com um comando" />
      </Field>

      <CheckboxField label="Em breve" hint="Aparece na trilha bloqueado, sem link e sem conteúdo." checked={value.comingSoon} onChange={(v) => set('comingSoon', v)} />
    </div>
  );
}
