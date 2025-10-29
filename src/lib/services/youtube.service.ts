import type { YoutubeVideo } from '@/lib/types';

export async function getLatestYoutubeVideos(max: number = 3): Promise<YoutubeVideo[]> {
  try {
    const channelId = 'UCXXClhhG-T-DKeT09EP8ZNg';
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(feedUrl, { next: { revalidate: 60 * 60 } });
    if (!res.ok) {
      console.error('Failed to fetch YouTube RSS');
      return [];
    }
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    const videos: YoutubeVideo[] = [];
    for (const entry of entries) {
      const linkMatch = entry.match(/<link rel=["']alternate["'] href=["']([^"']+)["']/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const href = linkMatch ? linkMatch[1] : '';
      const title = titleMatch ? titleMatch[1] : '';
      if (/\/shorts\//.test(href)) {
        continue;
      }
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const videoId = idMatch ? idMatch[1] : '';
      videos.push({
        id: videoId,
        title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        link: href || `https://openyoutu.be/${videoId}`,
        published: publishedMatch ? publishedMatch[1] : '',
      });
      if (videos.length >= max) break;
    }

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos', error);
    return [];
  }
}


