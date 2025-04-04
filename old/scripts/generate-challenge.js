const fs = require('fs');
const path = require('path');

const challengesDirectory = path.join(process.cwd(), '_challenges');
const challengesImagesDirectory = path.join(process.cwd(), 'public', 'assets', 'challenges');

const args = process.argv.slice(2);

function generateProject (title) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const normalizedTitle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, "-").toLowerCase();
    const date = new Date(Date.now()).toISOString();

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

    if(!fs.existsSync(challengesDirectory)) {
        fs.mkdirSync(challengesDirectory);
    }

    const filePath = path.join(challengesDirectory, `${normalizedTitle}.md`);

    fs.writeFile(filePath, frontMatter, (err) => {
        if (err) throw err;
        console.log(`Created ${normalizedTitle}.md!`);
        console.log("Don't forget to update the content in the MD file!");
    });

    const imageDir = path.join(challengesImagesDirectory, normalizedTitle);
    fs.mkdir(imageDir, { recursive: true }, (err) => {
        if (err) throw err;
        console.log(`Created directory for ${normalizedTitle} images!`);
    });
}

generateProject(args[0]);
