import Parser from "rss-parser";

const parser = new Parser();

export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  thumbnail: string | null;
  categories?: string[];
}

export async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const feed = await parser.parseURL(
      "https://medium.com/feed/@fleizean"
    );

    return feed.items.slice(0, 6).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      contentSnippet: item.contentSnippet || "",
      thumbnail: 
        item.enclosure?.url ||
        item["content:encoded"]?.match(/<img.*?src="(.*?)"/)?.[ 1] ||
        null,
      categories: item.categories || [],
    }));
  } catch (error) {
    console.error("Error fetching Medium posts:", error);
    return [];
  }
}
