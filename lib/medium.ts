import { unstable_cache } from 'next/cache';
import Parser from 'rss-parser';

const parser = new Parser();

export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  thumbnail: string | null;
  categories?: string[];
}

// Sayfalar her istekte render edildiği için feed bir saat önbellekte tutulur.
// Hata fırlatılırsa önbelleğe yazılmaz; boş liste bir saat boyunca takılı kalmaz.
const fetchMediumPosts = unstable_cache(
  async (): Promise<MediumPost[]> => {
    const feed = await parser.parseURL('https://medium.com/feed/@fleizean');

    return feed.items.slice(0, 6).map((item) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      contentSnippet: item.contentSnippet || '',
      thumbnail:
        item.enclosure?.url || item['content:encoded']?.match(/<img.*?src="(.*?)"/)?.[1] || null,
      categories: item.categories || [],
    }));
  },
  ['medium-posts'],
  { revalidate: 3600 }
);

export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    return await fetchMediumPosts();
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}
