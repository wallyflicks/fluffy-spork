// Serverless proxy for Yahoo Finance — runs server-side so no CORS issues.
// Browser calls /.netlify/functions/stock-price?ticker=AMD
const https = require('https');

exports.handler = async function (event) {
  const ticker = (event.queryStringParameters && event.queryStringParameters.ticker || '').trim().toUpperCase();
  if (!ticker) {
    return { statusCode: 400, body: JSON.stringify({ error: 'ticker required' }) };
  }

  const result = await fetchYahoo(ticker);
  if (result) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(result),
    };
  }
  return {
    statusCode: 502,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'price unavailable', ticker }),
  };
};

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

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
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
