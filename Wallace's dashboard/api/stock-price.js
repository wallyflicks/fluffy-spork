// Vercel serverless function — Yahoo Finance proxy (no CORS issues).
// Tries ticker as-is, then .TO (TSX), then .V (TSX Venture).
// GET /api/stock-price?ticker=VFV
const https = require('https');

export default async function handler(req, res) {
  const raw = ((req.query && req.query.ticker) || '').trim().toUpperCase();
  if (!raw) {
    return res.status(400).json({ error: 'ticker required' });
  }

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
}

function fetchYahoo(ticker) {
  return new Promise((resolve) => {
    const path = `/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const options = {
      hostname: 'query1.finance.yahoo.com',
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 8000,
    };

    const req = https.request(options, (r) => {
      let body = '';
      r.on('data', (chunk) => { body += chunk; });
      r.on('end', () => {
        try {
          const json = JSON.parse(body);
          const meta = json?.chart?.result?.[0]?.meta;
          if (!meta || !meta.regularMarketPrice) { resolve(null); return; }
          resolve({
            ticker,
            price: meta.regularMarketPrice,
            prevClose: meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice,
          });
        } catch { resolve(null); }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}
