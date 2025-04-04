import { writeFileSync } from 'fs';
import RSS from 'rss';
import globby from 'globby';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const BLOG_URL = 'https://racoelho.com.br';
const BLOG_TITLE = 'Blog Racoelho';
const BLOG_DESCRIPTION = 'Blog do Racoelho';

async function generate(): Promise<void> {
  const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');
  const allBlogs = await globby(['*.md'], { cwd: postsDirectory });

  const feed = new RSS({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site_url: BLOG_URL,
    feed_url: `${BLOG_URL}/feed.xml`,
    language: 'pt-BR',
    pubDate: new Date().toUTCString(),
  });

  allBlogs.forEach((post: string) => {
    const filePath = path.join(postsDirectory, post);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const slug = post.replace('.md', '');
    
    feed.item({
      title: data.title,
      url: `${BLOG_URL}/posts/${slug}`,
      date: data.date,
      description: data.excerpt,
      author: data.author?.name || 'racoelho',
      guid: slug,
    });
  });

  writeFileSync('public/feed.xml', feed.xml({ indent: true }));
  console.log('Feed RSS gerado com sucesso!');
}

generate().catch((error) => {
  console.error('Erro ao gerar o feed RSS:', error);
  process.exit(1);
}); 