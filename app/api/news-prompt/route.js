// ── In-memory cache ───────────────────────────────────────────────────────────
let _cache = null;
let _cacheDate = null;

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml',       source: 'BBC News' },
  { url: 'https://rss.cbc.ca/lineup/topstories.xml',    source: 'CBC News' },
  { url: 'https://feeds.reuters.com/reuters/topNews',   source: 'Reuters'  },
]

const FALLBACKS = [
  'World leaders gather to debate climate strategy and carbon reduction targets',
  'Scientists announce major breakthrough in renewable energy storage technology',
  'Global markets respond as central banks signal shift in interest rate policy',
  'New study reveals surprising findings about the impact of social media on wellbeing',
  'Tech giants face fresh scrutiny over data privacy practices and AI governance',
  'Health officials warn of rising rates of a preventable disease in younger populations',
  'International trade negotiations stall as key economies clash over tariffs',
]

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
}

function stripHtml(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).trim()
}

function parseHeadlines(xml, source) {
  const headlines = []

  // Extract all <item> blocks first, then pull title from each
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []

  for (const item of items) {
    // Handle CDATA and plain title
    const m = item.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
             || item.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    if (!m) continue

    const raw = stripHtml(m[1] || '')
    if (!raw || raw.length < 20) continue
    // Skip very short word-count headlines (likely just a name)
    if (raw.split(/\s+/).length <= 3) continue
    // Skip feed-level title artifacts
    if (/^(RSS|Feed|News|Headlines?|Top Stories?)$/i.test(raw)) continue

    headlines.push({ headline: raw, source })
    if (headlines.length >= 10) break
  }

  return headlines
}

function buildPrompt(headline) {
  return `React to this headline: ${headline}. Share your opinion, what you think it means, and whether you think it is good or bad news.`
}

function pickByDate(arr, dateStr) {
  const seed = dateStr.split('-').reduce((a, b) => a + parseInt(b, 10), 0)
  return arr[seed % arr.length]
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  // Serve cache if same day
  if (_cache && _cacheDate === today) {
    return Response.json(_cache, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  let headlines = []

  for (const feed of RSS_FEEDS) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Orivox/1.0)' },
      })
      clearTimeout(timer)
      if (!res.ok) continue
      const xml = await res.text()
      headlines = parseHeadlines(xml, feed.source)
      if (headlines.length >= 5) break
    } catch {
      // timeout or network error — try next feed
    }
  }

  // Fallback if all feeds failed
  if (headlines.length === 0) {
    const fallback = pickByDate(FALLBACKS, today)
    const result = {
      headline: fallback,
      source: 'Daily Briefing',
      prompt: buildPrompt(fallback),
      date: today,
      all: FALLBACKS.map(h => ({ headline: h, source: 'Daily Briefing', prompt: buildPrompt(h) })),
    }
    return Response.json(result, { headers: { 'Cache-Control': 'public, max-age=3600' } })
  }

  const selected = pickByDate(headlines, today)
  const result = {
    headline: selected.headline,
    source: selected.source,
    prompt: buildPrompt(selected.headline),
    date: today,
    all: headlines.map(h => ({ headline: h.headline, source: h.source, prompt: buildPrompt(h.headline) })),
  }

  _cache = result
  _cacheDate = today

  return Response.json(result, { headers: { 'Cache-Control': 'public, max-age=3600' } })
}
