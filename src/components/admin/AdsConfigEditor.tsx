'use client';

import { useState, useEffect } from 'react';
import { AdsMetadata, AdsPageConfig } from '@/lib/types/ads-config';
import { SlotType } from '@/lib/services/adOrchestrator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface AdsConfigEditorProps {
  value: AdsMetadata;
  onChange: (value: AdsMetadata) => void;
}

const ALL_SLOTS: SlotType[] = ['header', 'inline', 'sidebar-top', 'sidebar-mid', 'sidebar-bottom', 'footer'];

const SLOT_LABELS: Record<SlotType, string> = {
  'header': 'Header',
  'inline': 'Inline (no conteúdo)',
  'sidebar-top': 'Sidebar Top',
  'sidebar-mid': 'Sidebar Mid',
  'sidebar-bottom': 'Sidebar Bottom',
  'footer': 'Footer',
};

function PageConfigSection({
  title,
  description,
  config,
  onChange,
}: {
  title: string;
  description: string;
  config: AdsPageConfig | undefined;
  onChange: (config: AdsPageConfig | undefined) => void;
}) {
  const [maxPerPage, setMaxPerPage] = useState<string>(config?.maxPerPage?.toString() || '');
  const [enabledSlots, setEnabledSlots] = useState<SlotType[]>(config?.enabledSlots || []);

  // Sincroniza estado quando config externo muda
  useEffect(() => {
    setMaxPerPage(config?.maxPerPage?.toString() || '');
    setEnabledSlots(config?.enabledSlots || []);
  }, [config?.maxPerPage, config?.enabledSlots]);

  const updateConfig = (newMaxPerPage: string, newEnabledSlots: SlotType[]) => {
    const newConfig: AdsPageConfig = {};
    
    if (newMaxPerPage && newMaxPerPage.trim() !== '') {
      const num = parseInt(newMaxPerPage, 10);
      if (!isNaN(num) && num > 0) {
        newConfig.maxPerPage = num;
      }
    }
    
    if (newEnabledSlots.length > 0) {
      newConfig.enabledSlots = newEnabledSlots;
    }
    
    onChange(Object.keys(newConfig).length > 0 ? newConfig : undefined);
  };

  const handleMaxPerPageChange = (value: string) => {
    setMaxPerPage(value);
    updateConfig(value, enabledSlots);
  };

  const handleSlotToggle = (slot: SlotType, checked: boolean) => {
    const newEnabledSlots = checked
      ? [...enabledSlots, slot]
      : enabledSlots.filter(s => s !== slot);
    setEnabledSlots(newEnabledSlots);
    updateConfig(maxPerPage, newEnabledSlots);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`maxPerPage-${title}`}>Quantidade máxima de anúncios por página</Label>
          <Input
            id={`maxPerPage-${title}`}
            type="number"
            min="0"
            placeholder="Sem limite"
            value={maxPerPage}
            onChange={(e) => handleMaxPerPageChange(e.target.value)}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Deixe vazio para não limitar. Limite aplicado apenas a anúncios internos.
          </p>
        </div>

        <div>
          <Label>Slots habilitados</Label>
          <p className="text-xs text-muted-foreground mb-3">
            Selecione quais slots de anúncios devem ser exibidos. Deixe vazio para permitir todos.
          </p>
          <div className="space-y-2">
            {ALL_SLOTS.map((slot) => (
              <div key={slot} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${slot}`}
                  checked={enabledSlots.includes(slot)}
                  onCheckedChange={(checked) => handleSlotToggle(slot, checked as boolean)}
                />
                <Label
                  htmlFor={`${title}-${slot}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {SLOT_LABELS[slot]}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdsConfigEditor({ value, onChange }: AdsConfigEditorProps) {
  const [config, setConfig] = useState<AdsMetadata>(value || {});

  // Sincroniza quando value externo muda
  useEffect(() => {
    setConfig(value || {});
  }, [value]);

  const handleConfigChange = (section: 'global' | 'posts' | 'challenges', newConfig: AdsPageConfig | undefined) => {
    const updated = { ...config, [section]: newConfig };
    setConfig(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <PageConfigSection
        title="Configuração Global"
        description="Configuração padrão usada como fallback quando não houver configuração específica para posts ou challenges"
        config={config.global}
        onChange={(newConfig) => handleConfigChange('global', newConfig)}
      />

      <PageConfigSection
        title="Posts"
        description="Configuração específica para páginas de posts. Se não configurado, usa a configuração global."
        config={config.posts}
        onChange={(newConfig) => handleConfigChange('posts', newConfig)}
      />

      <PageConfigSection
        title="Challenges"
        description="Configuração específica para páginas de challenges. Se não configurado, usa a configuração global."
        config={config.challenges}
        onChange={(newConfig) => handleConfigChange('challenges', newConfig)}
      />
    </div>
  );
}

