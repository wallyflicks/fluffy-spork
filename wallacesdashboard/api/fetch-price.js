// Fetches a product page server-side and parses common price meta tags.
// Returns { price: number | null }.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ price: null });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    if (!response.ok) return res.json({ price: null });

    const html = await response.text();

    // og:price:amount  (property first or content first)
    let m = html.match(/property=["']og:price:amount["'][^>]*content=["']([0-9.,]+)["']/i)
          || html.match(/content=["']([0-9.,]+)["'][^>]*property=["']og:price:amount["']/i);
    if (m) return res.json({ price: parseFloat(m[1].replace(/,/g, '')) });

    // product:price:amount
    m = html.match(/property=["']product:price:amount["'][^>]*content=["']([0-9.,]+)["']/i)
      || html.match(/content=["']([0-9.,]+)["'][^>]*property=["']product:price:amount["']/i);
    if (m) return res.json({ price: parseFloat(m[1].replace(/,/g, '')) });

    // itemprop="price" with content attribute
    m = html.match(/itemprop=["']price["'][^>]*content=["']([0-9.,]+)["']/i)
      || html.match(/content=["']([0-9.,]+)["'][^>]*itemprop=["']price["']/i);
    if (m) return res.json({ price: parseFloat(m[1].replace(/,/g, '')) });

    return res.json({ price: null });
  } catch {
    return res.json({ price: null });
  }
};
