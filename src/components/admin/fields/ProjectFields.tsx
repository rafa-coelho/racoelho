'use client';

import type { ProjectKind, ProjectStage } from '@/lib/types';
import { PROJECT_KIND_LABEL } from '@/lib/types';
import { Field, SelectField } from './Field';
import { IconField } from './IconField';
import { TagsInput, toStringList } from './TagsInput';

type Accent = 'blue' | 'green' | 'amber';

export interface ProjectExtra {
  kind: '' | ProjectKind;
  icon: string;
  accent: '' | Accent;
  stage: '' | ProjectStage;
  stack: string[];
}

export const emptyProjectExtra: ProjectExtra = { kind: '', icon: '', accent: '', stage: '', stack: [] };

const pick = <T extends string>(v: unknown, allowed: readonly T[]): T | '' => (allowed.includes(v as T) ? (v as T) : '');

export function projectExtraFromRecord(rec: any): ProjectExtra {
  return {
    kind: pick(rec?.kind, ['saas', 'open-source', 'ferramenta', 'experimento'] as const),
    icon: typeof rec?.icon === 'string' ? rec.icon : '',
    accent: pick(rec?.accent, ['blue', 'green', 'amber'] as const),
    stage: pick(rec?.stage, ['live', 'wip', 'arquivado'] as const),
    stack: toStringList(rec?.stack),
  };
}

export function projectExtraToPayload(v: ProjectExtra) {
  return { kind: v.kind, icon: v.icon.trim(), accent: v.accent, stage: v.stage, stack: v.stack };
}

export function ProjectExtraFields({ value, onChange, title }: { value: ProjectExtra; onChange: (v: ProjectExtra) => void; title: string }) {
  const set = <K extends keyof ProjectExtra>(k: K, v: ProjectExtra[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectField
          id="pj-kind"
          label="Tipo"
          value={value.kind}
          onChange={(v) => set('kind', v as ProjectExtra['kind'])}
          emptyLabel="—"
          options={(Object.keys(PROJECT_KIND_LABEL) as ProjectKind[]).map((k) => ({ value: k, label: PROJECT_KIND_LABEL[k] }))}
        />
        <SelectField
          id="pj-stage"
          label="Estágio"
          hint="Independente do status de publicação."
          value={value.stage}
          onChange={(v) => set('stage', v as ProjectExtra['stage'])}
          emptyLabel="— (live)"
          options={[
            { value: 'live', label: 'No ar' },
            { value: 'wip', label: 'Em construção' },
            { value: 'arquivado', label: 'Arquivado' },
          ]}
        />
        <SelectField
          id="pj-accent"
          label="Cor"
          value={value.accent}
          onChange={(v) => set('accent', v as ProjectExtra['accent'])}
          emptyLabel="— (âmbar)"
          options={[
            { value: 'blue', label: 'Azul' },
            { value: 'green', label: 'Verde' },
            { value: 'amber', label: 'Âmbar' },
          ]}
        />
      </div>

      <IconField id="pj-icon" value={value.icon} onChange={(v) => set('icon', v)} accent={value.accent || undefined} title={title} />

      <Field label="Stack" htmlFor="pj-stack" hint="Enter ou vírgula para adicionar.">
        <TagsInput id="pj-stack" value={value.stack} onChange={(v) => set('stack', v)} placeholder="Next.js, PocketBase…" />
      </Field>
    </div>
  );
}
