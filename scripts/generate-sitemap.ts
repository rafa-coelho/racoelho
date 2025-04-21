import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';
import path from 'path';

const BLOG_URL = 'https://racoelho.com.br';
const LANG = 'pt-BR';

async function generate(): Promise<void> {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  
  // Buscar páginas do App Router
  const pages = await globby([
    'src/app/**/*.tsx',
    'src/app/**/*.ts',
    'src/content/posts/*.md',
    'src/content/challenges/*.md',
    '!src/app/**/_*.tsx',
    '!src/app/**/_*.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
  ]);

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map((page: string) => {
            // Converter caminhos de arquivo para URLs
            let route = page
              .replace('src/app', '')
              .replace('src/content/posts', '/posts')
              .replace('src/content/challenges', '/listas/desafios')
              .replace('.tsx', '')
              .replace('.ts', '')
              .replace('.md', '')
              .replace('page', '')
              .replace('index', '');

            // Remover barras duplicadas
            route = route.replace(/\/+/g, '/');
            
            // Remover barra final
            if (route.endsWith('/')) {
              route = route.slice(0, -1);
            }

            const lastModifiedDate = new Date(Date.now())
              .toLocaleString(LANG)
              .split(' ')[0]
              .replace(',', '');

            return `
              <url>
                  <loc>${`${BLOG_URL}${route}`}</loc>
                  <lastmod>${lastModifiedDate}</lastmod>
                  <changefreq>monthly</changefreq>
                  <priority>${route === '' ? '1.0' : '0.8'}</priority>
              </url>
            `;
          })
          .join('')}
    </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  writeFileSync('public/sitemap.xml', formatted);
  console.log('Sitemap gerado com sucesso!');

  const robotsTxt = `User-agent: * 
Sitemap: ${BLOG_URL}/sitemap.xml`;
  writeFileSync('public/robots.txt', robotsTxt);
  console.log('Robots.txt gerado com sucesso!');
}

generate().catch((error) => {
  console.error('Erro ao gerar o sitemap:', error);
  process.exit(1);
}); 