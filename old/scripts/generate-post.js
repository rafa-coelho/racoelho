const fs = require('fs');

const args = process.argv.slice(2);

function generatePost(title) {
  const nomalizedTitle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, "-").toLowerCase();

  const frontMatter = `---
title: "${title}"
excerpt: "Lorem ipsum."
coverImage: "/assets/blog/${nomalizedTitle}/banner.png"
date: "${new Date(Date.now()).toISOString()}"
keywords: programação, dev, desenvolvimento, 
author:
  name: "racoelho"
  picture: "https://github.com/rafa-coelho.png"
ogImage:
  url: "/assets/blog/${nomalizedTitle}/banner.png"
---
`

  fs.writeFile(`./_posts/${nomalizedTitle}.md`, frontMatter, (err) => {
    if (err) throw err;
    console.log(`Created ${nomalizedTitle}.md!`);
    console.log("Don't forget to update the excerpt, coverImage path, and ogImage path in the front matter!");
  });

  fs.mkdir(`./public/assets/blog/${nomalizedTitle}`, () => {});
}

generatePost(args[0]);
