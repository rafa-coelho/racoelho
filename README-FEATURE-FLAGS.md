# Sistema de Feature Flags

Sistema de feature flags implementado seguindo princípios SOLID, permitindo controle granular de funcionalidades no blog.

## 🎯 Arquitetura

### Estrutura de Arquivos

```
src/
  lib/
    types/
      feature-flags.ts          # Types e interfaces
    services/
      feature-flags/
        IFeatureFlagProvider.ts # Interface do provider
        JsonFeatureFlagProvider.ts # Implementação JSON
        FeatureFlagService.ts   # Service principal
        index.ts                # Exports
  hooks/
    use-feature-flag.ts         # Hooks React
content/
  feature-flags.json            # Configurações (mockadas)
```

## 🚀 Features Disponíveis

| Flag | Descrição | Status Padrão |
|------|-----------|---------------|
| `share` | Botões de compartilhamento (Threads, X, LinkedIn, WhatsApp) | ✅ Habilitado |
| `newsletter` | CTAs e formulários de newsletter | ✅ Habilitado |
| `ads` | Sistema de anúncios (mockados + Google Ads) | ✅ Habilitado |
| `analytics` | Google Analytics e tracking | ✅ Habilitado |

## 📝 Uso nos Componentes

### Hook Simples

```tsx
import { useFeatureFlag } from '@/hooks/use-feature-flag';

function MyComponent() {
  const { enabled, loading } = useFeatureFlag('share');
  
  if (loading) return <div>Carregando...</div>;
  if (!enabled) return null;
  
  return <ShareButtons />;
}
```

### Hook com Metadados

```tsx
import { useFeatureFlagWithMetadata } from '@/hooks/use-feature-flag';

function AdsComponent() {
  const { flag, loading } = useFeatureFlagWithMetadata('ads');
  
  if (!flag?.enabled) return null;
  
  const mockPriority = flag.metadata?.mockPriority ?? 0.7;
  // Use os metadados...
}
```

### Hook para Múltiplas Flags

```tsx
import { useFeatureFlags } from '@/hooks/use-feature-flag';

function PostContent() {
  const { flags, loading } = useFeatureFlags(['share', 'newsletter', 'ads']);
  
  if (loading) return <LoadingState />;
  
  return (
    <>
      {flags.share && <ShareButtons />}
      {flags.newsletter && <NewsletterCTA />}
      {flags.ads && <AdSlot />}
    </>
  );
}
```

## 🔧 Configuração

### Alterar Estado de uma Flag

Edite `content/feature-flags.json`:

```json
{
  "flags": [
    {
      "key": "share",
      "enabled": false,  // ← Desabilita compartilhamento
      "description": "...",
      "metadata": { ... }
    }
  ]
}
```

### Adicionar Nova Flag

1. Adicione o tipo em `src/lib/types/feature-flags.ts`:

```typescript
export type FeatureFlagKey = 
  | 'share'
  | 'newsletter'
  | 'ads'
  | 'minha-nova-feature'; // ← Nova flag
```

2. Adicione a configuração em `content/feature-flags.json`:

```json
{
  "key": "minha-nova-feature",
  "enabled": true,
  "description": "Descrição da feature",
  "metadata": {
    "customField": "valor"
  }
}
```

3. Use no componente:

```tsx
const { enabled } = useFeatureFlag('minha-nova-feature');
if (enabled) {
  // Renderiza a nova feature
}
```

## 🔄 Trocar Provider (JSON → PocketBase/Firebase)

O sistema foi projetado para fácil substituição do provider:

### 1. Criar Novo Provider

```typescript
// src/lib/services/feature-flags/PocketBaseFeatureFlagProvider.ts
import { IFeatureFlagProvider } from './IFeatureFlagProvider';
import { FeatureFlagKey, FeatureFlag } from '@/lib/types/feature-flags';
import PocketBase from 'pocketbase';

export class PocketBaseFeatureFlagProvider implements IFeatureFlagProvider {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('https://seu-pocketbase.com');
  }

  async isEnabled(key: FeatureFlagKey): Promise<boolean> {
    const record = await this.pb.collection('feature_flags').getFirstListItem(`key="${key}"`);
    return record.enabled;
  }

  async getAllFlags(): Promise<FeatureFlag[]> {
    const records = await this.pb.collection('feature_flags').getFullList();
    return records as FeatureFlag[];
  }

  async getFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
    try {
      const record = await this.pb.collection('feature_flags').getFirstListItem(`key="${key}"`);
      return record as FeatureFlag;
    } catch {
      return null;
    }
  }
}
```

### 2. Registrar Novo Provider

```typescript
// src/lib/services/feature-flags/FeatureFlagService.ts
import { PocketBaseFeatureFlagProvider } from './PocketBaseFeatureFlagProvider';

// No constructor:
private constructor(provider?: IFeatureFlagProvider, cacheExpiryMs: number = 60000) {
  this.provider = provider || new PocketBaseFeatureFlagProvider(); // ← Trocar aqui
  // ...
}
```

✅ **Nenhuma mudança necessária em componentes ou hooks!**

## 🎨 Cache

O `FeatureFlagService` implementa cache em memória com expiração configurável:

- **Padrão**: 60 segundos
- **Benefício**: Evita múltiplas leituras do mesmo arquivo/API
- **Invalidação**: Automática após expiração

### Debug do Cache

```typescript
import { featureFlagService } from '@/lib/services/feature-flags';

const status = featureFlagService.getCacheStatus();
console.log(status);
// {
//   size: 3,
//   lastUpdate: 1234567890,
//   expiresIn: 45000,
//   flags: { share: true, newsletter: true, ads: true }
// }
```

### Limpar Cache Manualmente

```typescript
featureFlagService.clearCache();
```

### Atualizar Flag Específica

```typescript
await featureFlagService.refreshFlag('share');
```

## 📊 Componentes Atualizados

- ✅ `BlogPostContent.tsx` - Posts do blog
- ✅ `ChallengeContent.tsx` - Desafios práticos

Todas as instâncias de compartilhamento, newsletter e anúncios agora respeitam as feature flags.

## 🧪 Extensibilidade (SOLID)

O sistema segue princípios SOLID:

- **S** (Single Responsibility): Cada provider tem uma única responsabilidade
- **O** (Open/Closed): Aberto para extensão, fechado para modificação
- **L** (Liskov Substitution): Qualquer provider pode substituir outro
- **I** (Interface Segregation): Interface mínima e coesa
- **D** (Dependency Inversion): Depende de abstrações (IFeatureFlagProvider)

## 🎯 Próximos Passos

1. ✅ Implementado JSON provider
2. ⏳ Adicionar PocketBase provider (quando necessário)
3. ⏳ Adicionar Firebase provider (quando necessário)
4. ⏳ Dashboard de gerenciamento de flags (opcional)
5. ⏳ A/B testing (opcional)

---

**Desenvolvido com 💙 seguindo as melhores práticas de arquitetura de software**

