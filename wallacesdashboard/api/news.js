// Fetches 10 RSS feeds server-side, parses into articles, caches in Supabase for the day.
// No paid APIs or API keys required — all feeds are public RSS.

const SUPA_URL = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const SB_HDR = {
  'Content-Type': 'application/json',
  'apikey': SUPA_KEY,
  'Authorization': 'Bearer ' + SUPA_KEY,
  'Prefer': 'resolution=merge-duplicates',
};

const FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/rss.xml',                                                       source: 'BBC News',     category: 'World'     },
  { url: 'https://feeds.apnews.com/rss/apf-topnews',                                                    source: 'AP News',      category: 'World'     },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml',                                              source: 'BBC Business', category: 'Business'  },
  { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',                               source: 'BBC Science',  category: 'Science'   },
  { url: 'https://feeds.bbci.co.uk/news/health/rss.xml',                                                source: 'BBC Health',   category: 'Health'    },
  { url: 'https://news.ycombinator.com/rss',                                                            source: 'Hacker News',  category: 'Tech'      },
  { url: 'https://techcrunch.com/feed/',                                                                 source: 'TechCrunch',   category: 'Startups'  },
  { url: 'https://www.theverge.com/rss/index.xml',                                                      source: 'The Verge',    category: 'Tech'      },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/',                                       source: 'MarketWatch',  category: 'Investing' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',         source: 'CNBC Finance', category: 'Investing' },
];

function getToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

/* Minimal regex-based RSS 2.0 + Atom parser — no npm dependencies needed. */
function extractTag(block, tag) {
  const rx = new RegExp(`<${tag}(?:\\s[^>]*)?>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*<\\/${tag}>`, 'i');
  const m = block.match(rx);
  if (!m) return '';
  return m[1]
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLink(block) {
  // <link>url</link>
  const plain = extractTag(block, 'link');
  if (plain && plain.startsWith('http')) return plain;
  // Atom: <link href="url" rel="alternate"/>
  const href = block.match(/<link[^>]+href=["']([^"']+)["'][^/]*\/?>/i);
  if (href) return href[1];
  // <guid isPermaLink="true">url</guid> or just a URL in guid
  const guid = extractTag(block, 'guid');
  if (guid && guid.startsWith('http')) return guid;
  return '';
}

function parseXML(xml, source, category, maxPerFeed) {
  maxPerFeed = maxPerFeed || 12;
  const items = [];
  const blockRx = /<(?:item|entry)(?:\s[^>]*)?>[\s\S]*?<\/(?:item|entry)>/gi;
  let m;
  while ((m = blockRx.exec(xml)) !== null && items.length < maxPerFeed) {
    const block = m[0];
    const title = extractTag(block, 'title');
    const link  = extractLink(block);
    if (!title || !link) continue;
    const rawDesc = (
      extractTag(block, 'description') ||
      extractTag(block, 'summary') ||
      extractTag(block, 'content')
    );
    const description = rawDesc.slice(0, 300);
    const pubDate = (
      extractTag(block, 'pubDate') ||
      extractTag(block, 'published') ||
      extractTag(block, 'updated') ||
      ''
    );
    items.push({ title, description, link, pubDate, source, category });
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WallaceDashboard/1.0; RSS reader)',
        'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const xml = await res.text();
    return parseXML(xml, feed.source, feed.category);
  } catch (e) {
    console.warn(`[news] ${feed.source} failed: ${e.message}`);
    return [];
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const force = req.query && req.query.force === '1';
  const today = getToday();
  const cacheKey = 'news_' + today;

  // ── Check Supabase cache first ──────────────────────────────────────
  if (!force) {
    try {
      const r = await fetch(
        SUPA_URL + '/rest/v1/app_state?key=eq.' + encodeURIComponent(cacheKey) + '&select=data',
        { headers: SB_HDR }
      );
      if (r.ok) {
        const rows = await r.json();
        if (rows && rows.length && rows[0].data && Array.isArray(rows[0].data.articles)) {
          res.setHeader('X-News-Cache', 'HIT');
          return res.status(200).json(rows[0].data);
        }
      }
    } catch (e) {
      console.warn('[news] Supabase cache read error:', e.message);
    }
  }

  // ── Fetch all feeds in parallel ─────────────────────────────────────
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const allArticles = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  // Deduplicate by URL
  const seen = new Set();
  const articles = allArticles.filter(a => {
    if (!a.link || seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  const sourceStats = results.map((r, i) => ({
    source: FEEDS[i].source,
    ok: r.status === 'fulfilled',
    count: r.status === 'fulfilled' ? r.value.length : 0,
  }));

  const payload = {
    articles,
    fetchedAt: new Date().toISOString(),
    date: today,
    sources: sourceStats,
  };

  // ── Store in Supabase (fire-and-forget) ─────────────────────────────
  fetch(SUPA_URL + '/rest/v1/app_state?on_conflict=key', {
    method: 'POST',
    headers: SB_HDR,
    body: JSON.stringify({ key: cacheKey, data: payload, updated_at: new Date().toISOString() }),
  }).catch(e => console.warn('[news] Supabase cache write error:', e.message));

  res.setHeader('X-News-Cache', 'MISS');
  return res.status(200).json(payload);
};
