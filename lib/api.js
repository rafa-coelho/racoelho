import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const items = {}

  // Ensure only the minimal needed data is exposed
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

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .filter((post) => !post.draft)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getLinks() {
  return {
    highlighted: [
      {
        title: "CodeCrafters",
        description: "Aprenda a programar com projetos práticos",
        image: "https://app.codecrafters.io/assets/7408d202b2bb110054fc.svg",
        url: "https://app.codecrafters.io/join?via=rafa-coelho",
      },
    ],
    general: [
      {
        title: "Newsletter de Tecnologia",
        description: "Se você não tem tempo de ler, eu compilo pra você!",
        url: "https://racoelho.com.br/newsletter",
      },
      {
        title: "Meu Blog",
        description: "Artigos sobre programação, tecnologia e desenvolvimento pessoal",
        url: "https://racoelho.com.br/posts",
      },
    ]
  };
}
