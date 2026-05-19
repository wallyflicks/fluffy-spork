// Vercel serverless function — ZenQuotes proxy (avoids CORS).
// GET /api/quote → { quote: "...", author: "..." }

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const upstream = await fetch('https://zenquotes.io/api/today', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });
    if (!upstream.ok) throw new Error('upstream ' + upstream.status);
    const data = await upstream.json();
    const item = Array.isArray(data) ? data[0] : data;
    if (!item || !item.q) throw new Error('bad payload');
    return res.status(200).json({ quote: item.q, author: item.a || 'Unknown' });
  } catch (e) {
    // Fallback — never surface an error to the client
    return res.status(200).json({
      quote: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain',
    });
  }
};
