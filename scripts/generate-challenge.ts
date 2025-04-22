import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

function generateChallenge(title: string): void {
  if (!title) {
    console.error('Por favor, forneça um título para o desafio.');
    process.exit(1);
  }

  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const normalizedTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-')
    .toLowerCase();
  const date = new Date(Date.now()).toISOString();

  const contentDirectory = path.join(process.cwd(), 'src', 'content', 'challenges');
  const assetsDirectory = path.join(process.cwd(), 'public', 'assets', 'challenges', normalizedTitle);

  const frontMatter = `---
id: "${id}"
title: "${title}"
keywords: desafios, desafios programação, portfolio, portfolio de programador, programação, ideias de projeto
categories:
description: 
level:
link: 
coverImage: "/assets/challenges/${normalizedTitle}/banner.png"
ogImage:
  url: "/assets/challenges/${normalizedTitle}/banner.png"
date: "${date}"
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
    console.log("Não se esqueça de atualizar o conteúdo no arquivo MD!");
  });

  // Criar diretório para imagens
  fs.mkdir(assetsDirectory, { recursive: true }, (err) => {
    if (err) throw err;
    console.log(`Diretório para imagens de ${normalizedTitle} criado!`);
  });
}

generateChallenge(args[0]); 