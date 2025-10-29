# 📦 Importação Automática de Assets

Este script automatiza a importação de imagens e arquivos locais para o PocketBase.

## 🚀 Como usar

1. Certifique-se de que o PocketBase está rodando
2. Configure as variáveis de ambiente no `.env`:
   ```env
   NEXT_PUBLIC_PB_URL=http://localhost:8090
   NEXT_PUBLIC_PB_ADMIN_EMAIL=seu@email.com
   NEXT_PUBLIC_PB_ADMIN_PASSWORD=suasenha
   ```

3. Execute o comando:
   ```bash
   npm run pb:import-assets
   ```

## ✨ O que o script faz

### 1. Posts
- Busca todos os posts em `content/posts/`
- Para cada post no PocketBase, tenta fazer upload da `coverImage` se existir localmente
- Imagens devem estar em `public/assets/blog/*/banner.png`

### 2. Challenges
- Busca todos os challenges em `content/challenges/`
- Para cada challenge no PocketBase, tenta fazer upload da `coverImage` se existir localmente
- Imagens devem estar em `public/assets/challenges/*/banner.png`

### 3. Assets Públicos
- Lista todos os arquivos em `public/assets/`
- Mostra um relatório de quais arquivos existem localmente

## ⚠️ Importante

- O script **NÃO sobrescreve** registros existentes no PocketBase
- Apenas faz upload de imagens que estão no filesystem local
- Use este script **apenas uma vez** para migração inicial
- Depois disso, use a interface admin do PocketBase para gerenciar assets

## 🔧 Estrutura de Pastas Esperada

```
content/
  posts/
    meu-post.md          (referência: coverImage: "/assets/blog/meu-post/banner.png")
  challenges/
    meu-desafio.md       (referência: coverImage: "/assets/challenges/meu-desafio/banner.png")

public/
  assets/
    blog/
      meu-post/
        banner.png
    challenges/
      meu-desafio/
        banner.png
```

