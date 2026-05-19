// Vercel serverless function — Yahoo Finance proxy (no CORS issues).
// Tries ticker as-is, then .TO (TSX), then .V (TSX Venture).
// GET /api/stock-price?ticker=VFV

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Module-level crumb cache — reused across warm invocations
let _crumbCache = null;

async function getYahooCrumb() {
  const now = Date.now();
  if (_crumbCache && _crumbCache.expiresAt > now) return _crumbCache;

  const homeRes = await fetch('https://finance.yahoo.com/', {
    headers: { 'User-Agent': UA, 'Accept': 'text/html' },
    redirect: 'follow',
  });

  // Collect Set-Cookie headers (Node 18 fetch returns first match from .get())
  const rawCookie = homeRes.headers.get('set-cookie') || '';
  const cookie = rawCookie.split(/,(?=[^ ])/).map(c => c.split(';')[0].trim()).filter(Boolean).join('; ');

  const crumbRes = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'User-Agent': UA, 'Cookie': cookie },
  });
  if (!crumbRes.ok) throw new Error(`crumb ${crumbRes.status}`);
  const crumb = (await crumbRes.text()).trim();
  if (!crumb) throw new Error('empty crumb');

  _crumbCache = { crumb, cookie, expiresAt: now + 55 * 60 * 1000 };
  return _crumbCache;
}

async function fetchYahoo(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;

  // Try without crumb first (faster, works on many IPs)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      if (meta?.regularMarketPrice) {
        return {
          price: meta.regularMarketPrice,
          prevClose: meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice,
        };
      }
    }
  } catch { /* fall through to crumb attempt */ }

  // Retry with crumb if first attempt failed
  try {
    const { crumb, cookie } = await getYahooCrumb();
    const urlWithCrumb = `${url}&crumb=${encodeURIComponent(crumb)}`;
    const res = await fetch(urlWithCrumb, {
      headers: { 'User-Agent': UA, 'Cookie': cookie, 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    return {
      price: meta.regularMarketPrice,
      prevClose: meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice,
    };
  } catch { return null; }
}

module.exports = async function handler(req, res) {
  const raw = ((req.query && req.query.ticker) || '').trim().toUpperCase();
  if (!raw) return res.status(400).json({ error: 'ticker required' });

  const candidates = [raw];
  if (!raw.includes('.')) candidates.push(raw + '.TO', raw + '.V');

  for (const ticker of candidates) {
    const result = await fetchYahoo(ticker);
    if (result) {
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.status(200).json({ ...result, resolvedTicker: ticker });
    }
  }

  return res.status(502).json({ error: 'price unavailable', ticker: raw });
};
