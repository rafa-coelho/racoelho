import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/config/constants'
import { contentService } from '@/lib/services/content.service'
import { challengeService } from '@/lib/services/challenge.service'
import { salesService } from '@/lib/services/sales.service'

export const revalidate = 900

export async function GET() {
  const [posts, challenges] = await Promise.all([
    contentService.getAllPosts([], false),
    challengeService.getAllChallenges([], false),
  ])
  let sales: string[] = []
  try {
    sales = await salesService.getSalesPageSlugs()
  } catch {}

  const urls: Array<{ loc: string; lastmod?: string; priority?: string; changefreq?: string }> = []

  const add = (path: string, lastmod?: string, priority = '0.8', changefreq = 'weekly') => {
    urls.push({ loc: `${SITE_URL}${path}`, lastmod, priority, changefreq })
  }

  // Static
  add('/', undefined, '1.0', 'daily')
  add('/posts')
  add('/listas/desafios')
  add('/links')
  add('/setup')

  // Posts
  posts.forEach((p) => add(`/posts/${p.slug}`, p.date))
  // Challenges
  challenges.forEach((c) => add(`/listas/desafios/${c.slug}`, c.date))
  // Sales pages
  sales.forEach((s) => add(`/venda/${s}`))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (u) => `
      <url>
        <loc>${u.loc}</loc>
        ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
      </url>`
      )
      .join('\n')}
  </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
    },
  })
}


