import { NextResponse } from 'next/server'
import { contentService } from '@/lib/services/content.service'
import { SITE_URL, BLOG_NAME, AUTHOR } from '@/lib/config/constants'
// Render faremos simples: usar markdown bruto em CDATA (sem depender de libs)

export const revalidate = 900 // 15 min
export const dynamic = 'force-dynamic' // Sempre buscar dados atualizados

function escapeCdata(s: string) {
  return s.replace(/]]>/g, ']]]]><![CDATA[>')
}

export async function GET() {
  // Buscar apenas posts publicados para o feed
  const metas = await contentService.getAllPosts([], false)

  const items = await Promise.all(
    metas.map(async (p) => {
      const full = await contentService.getPostBySlug(p.slug, ['title','slug','date','excerpt','content','coverImage','tags'], false)
      const link = `${SITE_URL}/posts/${p.slug}`
      const description = full?.excerpt || ''
      const html = full?.content || ''
      const categories = (full?.tags || []).map(t => `<category>${t}</category>`).join('')
      // Validar coverImage antes de usar (evitar URLs com undefined)
      const image = full?.coverImage && !full.coverImage.includes('undefined') 
        ? `<enclosure url="${full.coverImage}" type="image/${full.coverImage.endsWith('.png') ? 'png' : 'jpeg'}" />` 
        : ''
      return `
        <item>
          <title>${full?.title || p.title}</title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <description>${description}</description>
          <content:encoded><![CDATA[${escapeCdata(html)}]]></content:encoded>
          ${categories}
          ${image}
          ${p.date ? `<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ''}
          <author>${AUTHOR}</author>
        </item>
      `
    })
  )

  const lastBuildDate = metas.length ? new Date(metas[0].date || Date.now()).toUTCString() : new Date().toUTCString()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>${BLOG_NAME}</title>
      <link>${SITE_URL}</link>
      <description>Feed de ${BLOG_NAME}</description>
      <lastBuildDate>${lastBuildDate}</lastBuildDate>
      ${items.join('\n')}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': 'inline; filename=feed.xml',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=900',
    }
  })
}


