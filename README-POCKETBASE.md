# Configuração PocketBase

## Variáveis de Ambiente Necessárias

Para usar o PocketBase como fonte de conteúdo, crie um arquivo `.env.local` na raiz do projeto com:

```env
# Fonte de conteúdo: 'fs' para filesystem ou 'pb' para PocketBase
NEXT_PUBLIC_CONTENT_SOURCE=pb

# URL do PocketBase
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090

# Credenciais admin do PocketBase
NEXT_PUBLIC_PB_ADMIN_EMAIL=seu-email@admin.com
NEXT_PUBLIC_PB_ADMIN_PASSWORD=sua-senha
```

## Como Migrar para PocketBase

### 1. Configurar PocketBase

Execute o script de migração para criar as collections:

```bash
npm run pb:migrate
```

### 2. Importar Conteúdo

Importe os assets (imagens, arquivos) para o PocketBase:

```bash
npm run pb:import-assets
```

### 3. Ativar PocketBase

Crie o arquivo `.env.local` com as variáveis acima e defina:

```env
NEXT_PUBLIC_CONTENT_SOURCE=pb
```

### 4. Reiniciar o Servidor

```bash
npm run dev
```

## Recursos Implementados

- ✅ Cache em memória com TTL configurável
- ✅ Server-side authentication
- ✅ Preview mode para admin (`?preview=true`)
- ✅ Cache por coleção com invalidação automática
- ✅ Suporte a drafts para admin autenticado
- ✅ Compatibilidade com filesystem (fallback)

## Services Disponíveis

- `contentService` - Posts e Challenges
- `challengeService` - Challenges
- `salesService` - Sales Pages
- `setupService` - Setup Items
- `linkService` - Link Items
- `socialService` - Social Links

Todos com suporte a:
- Cache inteligente
- Preview mode
- Autenticação admin

