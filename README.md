# Blog Racoelho

Blog sobre desenvolvimento de software, programação e tecnologia.

## Tecnologias

- [Next.js 14](https://nextjs.org/) com App Router
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Firebase](https://firebase.google.com/) para autenticação e banco de dados

## Como executar

1. Clone o repositório:
```bash
git clone https://github.com/rafa-coelho/racoelho-site.git
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Scripts disponíveis

- `npm run dev`: Executa o projeto em modo de desenvolvimento
- `npm run build`: Cria uma build de produção
- `npm run start`: Executa o projeto em modo de produção
- `npm run lint`: Executa o linter
- `npm run generate:post`: Gera um novo arquivo de post
- `npm run generate:challenge`: Gera um novo arquivo de desafio
- `npm run generate:rss`: Gera o feed RSS
- `npm run generate:sitemap`: Gera o sitemap.xml e robots.txt
- `npm run generate:all`: Executa a geração de RSS e Sitemap

## Estrutura do projeto

```
src/
  ├── app/              # Páginas e rotas do Next.js (App Router)
  ├── components/       # Componentes reutilizáveis
  ├── content/          # Conteúdo do blog (posts e desafios)
  │   ├── posts/        # Posts do blog
  │   └── challenges/   # Desafios de programação
  ├── lib/              # Funções utilitárias e configurações
  │   ├── api/          # Funções para acessar a API
  │   ├── config/       # Configurações do site
  │   └── utils/        # Funções utilitárias
  └── styles/           # Estilos globais

scripts/                 # Scripts para geração de conteúdo
  ├── generate-post.ts      # Gera novos posts
  ├── generate-challenge.ts # Gera novos desafios
  ├── generate-rss.ts       # Gera o feed RSS
  ├── generate-sitemap.ts   # Gera o sitemap.xml
  └── types/                # Definições de tipos para os scripts

public/                 # Arquivos estáticos
  ├── assets/           # Imagens e outros recursos
  │   ├── blog/         # Imagens dos posts
  │   └── challenges/   # Imagens dos desafios
  ├── feed.xml          # Feed RSS
  ├── sitemap.xml       # Sitemap
  └── robots.txt        # Arquivo robots.txt
```

## Funcionalidades

- **Blog**: Posts sobre desenvolvimento de software e tecnologia
- **Desafios**: Desafios de programação para praticar
- **SEO**: Meta tags otimizadas para cada página
- **RSS**: Feed RSS para acompanhar os novos posts
- **Sitemap**: Sitemap.xml para melhor indexação
- **Analytics**: Rastreamento de eventos e cliques
- **Tema escuro/claro**: Suporte a temas claro e escuro

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
