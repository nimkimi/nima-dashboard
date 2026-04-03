export interface FeedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  score?: number;
  comments?: number;
  pubDate?: string;
}

interface HnFeed {
  label: string;
  ariaLabel: string;
  type: 'hn';
}

interface RssFeed {
  label: string;
  ariaLabel: string;
  type: 'rss';
  url: string;
  fallbackUrl: string;
}

export type Feed = HnFeed | RssFeed;

export const FEEDS: Record<string, Feed> = {
  hn: {
    label: '⚡ HN',
    ariaLabel: 'Hacker News',
    type: 'hn',
  },
  ai: {
    label: '🤖 AI & Tech',
    ariaLabel: 'AI and Technology',
    type: 'rss',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    fallbackUrl: 'https://venturebeat.com/category/ai/feed/',
  },
  business: {
    label: '💼 Business',
    ariaLabel: 'Business',
    type: 'rss',
    url: 'https://www.cnbc.com/id/10001147/device/rss/rss.html',
    fallbackUrl: 'http://feeds.bbci.co.uk/news/business/rss.xml',
  },
};

const PROXY_BUILDERS = [
  (feedUrl: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
  (feedUrl: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`,
];

async function fetchFeedXml(feedUrl: string): Promise<string> {
  let lastError: unknown = null;

  for (const buildProxyUrl of PROXY_BUILDERS) {
    try {
      const res = await fetch(buildProxyUrl(feedUrl), { cache: 'no-store' });
      if (!res.ok) throw new Error(`Proxy request failed: ${res.status}`);

      const raw = await res.text();
      let xmlText = raw;

      if (raw.trim().startsWith('{')) {
        const parsed = JSON.parse(raw) as { contents?: string };
        xmlText = parsed?.contents ?? '';
      }

      if (!xmlText || !xmlText.trim().startsWith('<')) {
        throw new Error('Empty or invalid XML response');
      }

      return xmlText;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('Unable to fetch feed XML');
}

export async function fetchHN(limit = 15): Promise<FeedItem[]> {
  const topIds = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(
    (r) => r.json() as Promise<number[]>
  );

  const stories = await Promise.all(
    topIds.slice(0, limit).map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
    )
  );

  return stories
    .filter((s) => s && s.url)
    .map((s) => ({
      id: String(s.id),
      title: s.title,
      url: s.url,
      source: s.by ? `by ${s.by}` : 'Hacker News',
      score: s.score,
      comments: s.descendants ?? 0,
    }));
}

export async function fetchRSS(feedUrl: string): Promise<FeedItem[]> {
  const xmlText = await fetchFeedXml(feedUrl);
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');

  if (xml.querySelector('parsererror')) throw new Error('Failed to parse feed XML');

  const items = [
    ...Array.from(xml.querySelectorAll('item')),
    ...Array.from(xml.querySelectorAll('entry')),
  ];

  if (!items.length) throw new Error('No feed items found');

  return items
    .slice(0, 15)
    .map((item, i) => {
      const title = item.querySelector('title')?.textContent?.trim() ?? 'No title';
      const link =
        item.querySelector('link[rel="alternate"]')?.getAttribute('href') ??
        item.querySelector('link')?.getAttribute('href') ??
        item.querySelector('link')?.textContent?.trim() ??
        '#';
      const source =
        item.querySelector('source')?.textContent?.trim() ??
        xml.querySelector('title')?.textContent?.trim() ??
        'News';
      const pubDate =
        item.querySelector('pubDate')?.textContent ??
        item.querySelector('published')?.textContent ??
        item.querySelector('updated')?.textContent ??
        '';

      return {
        id: `${feedUrl}-${i}`,
        title,
        url: link,
        source,
        pubDate: pubDate ? new Date(pubDate).toLocaleDateString() : '',
      };
    })
    .filter((item) => item.url && item.url !== '#');
}
