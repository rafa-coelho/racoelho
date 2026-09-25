# Staging (Railway)

Ambiente isolado de produção, no projeto `racoelho` do Railway, ambiente `staging`.

| Serviço | Origem | O que faz |
|---|---|---|
| `pocketbase-staging` | este repo, `deploy/staging/pocketbase` | PocketBase próprio (volume próprio). O superuser vem de `PB_ADMIN_EMAIL`/`PB_ADMIN_PASSWORD`. |
| `site-staging` | este repo, branch do rebranding | Next.js. No build roda `npm run staging:prepare` e depois `npm run build`. |

`staging:prepare` = `pb:migrate` → `pb:migrate:rebranding` → `staging:seed`.
O seed copia só o conteúdo **público** do PocketBase de origem (`SOURCE_PB_URL`, ex.: produção)
pela API pública, incluindo arquivos. Não usa credenciais de produção e não escreve nela.

## Variáveis do `site-staging`

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_ENV` | `staging` (noindex + selo "staging") |
| `PB_URL`, `NEXT_PUBLIC_PB_URL` | URL pública do `pocketbase-staging` (o build não enxerga a rede privada) |
| `PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD` | as mesmas do `pocketbase-staging` |
| `SOURCE_PB_URL` | URL pública do PocketBase de origem do conteúdo |
| `STAGING_FLAGS_ON` | flags ligadas no staging, separadas por vírgula |
| `NEXT_PUBLIC_SITE_URL` | URL pública do `site-staging` |

Sem `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_ADS_*`, ConvertKit ou SMTP: analytics e anúncios
ficam desligados e formulários que dependem desses serviços retornam erro tratado.
