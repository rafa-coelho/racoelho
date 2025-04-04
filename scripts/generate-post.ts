import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

function generatePost(title: string): void {
  if (!title) {
    console.error('Por favor, forneça um título para o post.');
    process.exit(1);
  }

  const normalizedTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-')
    .toLowerCase();

  const contentDirectory = path.join(process.cwd(), 'src', 'content', 'posts');
  const assetsDirectory = path.join(process.cwd(), 'public', 'assets', 'blog', normalizedTitle);

  const frontMatter = `---
title: "${title}"
excerpt: "Lorem ipsum."
coverImage: "/assets/blog/${normalizedTitle}/banner.png"
date: "${new Date(Date.now()).toISOString()}"
keywords: programação, dev, desenvolvimento
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/${normalizedTitle}/banner.png"
---

`;

  // Criar diretório de conteúdo se não existir
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }

  const filePath = path.join(contentDirectory, `${normalizedTitle}.md`);

  fs.writeFile(filePath, frontMatter, (err) => {
    if (err) throw err;
    console.log(`Criado ${normalizedTitle}.md!`);
    console.log("Não se esqueça de atualizar o excerpt, coverImage path e ogImage path no front matter!");
  });

  // Criar diretório para imagens
  fs.mkdir(assetsDirectory, { recursive: true }, (err) => {
    if (err) throw err;
    console.log(`Diretório para imagens de ${normalizedTitle} criado!`);
  });
}

generatePost(args[0]); 