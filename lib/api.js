import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts')
const challengesDirectory = join(process.cwd(), '_challenges')

export function getPostSlugs () {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug (slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const items = {}

  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (data[field]) {
      items[field] = data[field]
    }
  });

  items['draft'] = data.draft || false;

  return items
}

export function getAllPosts (fields = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .filter((post) => !post.draft)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getLinks () {
  return {
    highlighted: [
      {
        title: "CodeCrafters",
        description: "Aprenda a programar com projetos práticos",
        image: "https://app.codecrafters.io/assets/7408d202b2bb110054fc.svg",
        url: "https://app.codecrafters.io/join?via=rafa-coelho",
      },
      // {
      //   title: "Vagas",
      //   description: "Confira vagas selecionadas para as áreas de TI",
      //   image: "https://app.codecrafters.io/assets/7408d202b2bb110054fc.svg",
      //   url: "/jobs",
      // }
      {
        title: "Give me a Raise",
        description: "Peça seu aumento em grande estilo",
        image: "/raise.ico",
        url: "https://givemearaise.xyz/",
      }
    ],
    general: [
      {
        title: "Newsletter de Tecnologia",
        description: "Se você não tem tempo de ler, eu compilo pra você!",
        url: "/newsletter",
      },
      {
        title: "Meu Blog",
        description: "Artigos sobre programação, tecnologia e desenvolvimento pessoal",
        url: "/posts",
      },
      {
        title: "Desafios de Programação",
        description: "Desafios de programação para você se desafiar e criar um bom portfólio",
        url: "/listas/desafios",
      },
      {
        title: "Meu setup",
        url: "/setup",
      }
    ]
  };
}

export function getChallengeSlugs () {
  return fs.readdirSync(challengesDirectory);
}

export function getAllChallenges (fields = []) {
  const slugs = getChallengeSlugs()
  const challenge = slugs
    .map((slug) => getChallengeBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return challenge;
}


export function getChallengeBySlug (slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(challengesDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items = {};

  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (data[field]) {
      items[field] = data[field]
    }
  });

  items['draft'] = data.draft || false;

  return items
};


export function getSetupLinks () {
  return {
    general: [
      {
        title: "Microfone FIFINE K688",
        url: "https://s.click.aliexpress.com/e/_oE2nV2R",
      },
      {
        title: "Mixer de áudio FIFINE SC3",
        url: "https://s.click.aliexpress.com/e/_olwG3cj",
      },
      {
        title: "Teclado Mecânico Redragon",
        url: "https://s.click.aliexpress.com/e/_on7VBFZ",
      },
      {
        title: "Mouse Redragon",
        url: "https://s.click.aliexpress.com/e/_ootnbCT",
      },
      {
        title: "Webcam Logitech c920e",
        url: "https://s.click.aliexpress.com/e/_oC9D4p1",
      },
    ]
  };
}
