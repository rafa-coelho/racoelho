# Scripts de Geração

Este diretório contém scripts para automatizar tarefas comuns no site.

## Scripts Disponíveis

### Gerar Post

Cria um novo arquivo de post com front matter preenchido e diretório para imagens.

```bash
npm run generate:post "Título do Post"
```

### Gerar Desafio

Cria um novo arquivo de desafio com front matter preenchido e diretório para imagens.

```bash
npm run generate:challenge "Título do Desafio"
```

### Gerar RSS

Gera o arquivo feed.xml com base nos posts existentes.

```bash
npm run generate:rss
```

### Gerar Sitemap

Gera o arquivo sitemap.xml e robots.txt com base nas páginas existentes.

```bash
npm run generate:sitemap
```

### Gerar Todos

Executa a geração de RSS e Sitemap em sequência.

```bash
npm run generate:all
```

## Estrutura de Arquivos

Os scripts geram arquivos nas seguintes pastas:

- Posts: `src/content/posts/`
- Desafios: `src/content/challenges/`
- Imagens de Posts: `public/assets/blog/[slug]/`
- Imagens de Desafios: `public/assets/challenges/[slug]/`
- Feed RSS: `public/feed.xml`
- Sitemap: `public/sitemap.xml`
- Robots.txt: `public/robots.txt` 