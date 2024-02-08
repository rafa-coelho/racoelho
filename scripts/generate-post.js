const fs = require('fs');

const args = process.argv.slice(2);

function generatePost(title) {

  function capitalizeFirstWordLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const sentenceCaseTitle = capitalizeFirstWordLetter(title);
  const formattedTitle = sentenceCaseTitle.split('-').join(' ');

  const frontMatter = `---
title: "${formattedTitle}"
excerpt: "Lorem ipsum."
coverImage: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/Capa%20Geral%20-%20Aug%202023.png?updatedAt=1707360098513"
date: "${new Date(Date.now()).toISOString()}"
author:
  name: "racoelho"
  picture: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/1688439289672.jpeg?updatedAt=1701730648991"
ogImage:
  url: "https://ik.imagekit.io/wphcyip3g/racoelho_dev/Capa%20Geral%20-%20Aug%202023.png?updatedAt=1707360098513"
---
`

  fs.writeFile(`./_posts/${title}.md`, frontMatter, (err) => {
    if (err) throw err;
    console.log(`Created ${title}.md!`);
    console.log("Don't forget to update the excerpt, coverImage path, and ogImage path in the front matter!");
  });
}

generatePost(args[0]);
