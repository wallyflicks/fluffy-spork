const SUPA_URL  = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';

const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPA_ANON,
  'Authorization': 'Bearer ' + SUPA_ANON,
};

const BUFFER_GQL = 'https://api.bufferapp.com/graphql';

function getVancouverDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

async function bufferGql(apiKey, query, variables = {}) {
  const res = await fetch(BUFFER_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error('Buffer API HTTP ' + res.status);
  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error('Buffer GQL: ' + json.errors.map(e => e.message).join('; '));
  }
  return json.data;
}

// Client may pass key via x-buffer-key header (avoids Supabase round-trip and
// works immediately after saving, before pushToCloud completes). Cron path has
// no client so falls back to reading from the Supabase bundle.
async function getBufferApiKey(req) {
  const fromHeader = req && (req.headers['x-buffer-key'] || '');
  if (fromHeader) return fromHeader;
  try {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/app_state?key=eq.content&select=data`,
      { headers: SB_HEADERS }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return (rows[0] && rows[0].data && rows[0].data.buffer_api_key) || null;
  } catch {
    return null;
  }
}

// Fetch posts for the dashboard picker (scheduled + recent sent)
async function fetchBufferPostsForPicker(apiKey) {
  // Strategy 1: top-level posts query
  try {
    const data = await bufferGql(apiKey, `query {
      posts(statuses: [scheduled, sent, buffer], first: 50) {
        nodes {
          id
          text
          scheduledAt
          sentAt
          status
          channel { id name service }
        }
      }
    }`);
    const nodes = (data.posts && data.posts.nodes) || data.posts;
    if (Array.isArray(nodes)) {
      return nodes.map(p => ({
        id: p.id,
        text: p.text || '',
        scheduledAt: p.scheduledAt || p.sentAt || null,
        status: p.status || 'unknown',
        channel: (p.channel && (p.channel.name || p.channel.service)) || '',
      }));
    }
  } catch (e) {
    console.warn('[buffer-sync] top-level posts query failed:', e.message);
  }

  // Strategy 2: channels → posts per channel
  try {
    const chData = await bufferGql(apiKey, `query { channels { id name service } }`);
    const channels = chData.channels || [];
    const posts = [];
    for (const ch of channels) {
      try {
        const d2 = await bufferGql(apiKey,
          `query GetChPosts($channelId: ID!) {
            posts(channelId: $channelId, statuses: [scheduled, sent], first: 30) {
              nodes { id text scheduledAt sentAt status }
            }
          }`,
          { channelId: ch.id }
        );
        const nodes = (d2.posts && d2.posts.nodes) || d2.posts || [];
        nodes.forEach(p => posts.push({
          id: p.id,
          text: p.text || '',
          scheduledAt: p.scheduledAt || p.sentAt || null,
          status: p.status || 'unknown',
          channel: ch.name || ch.service || '',
        }));
      } catch { /* skip channel */ }
    }
    if (posts.length) return posts;
  } catch (e) {
    console.warn('[buffer-sync] channel strategy failed:', e.message);
  }

  throw new Error('Could not fetch Buffer posts — check API key permissions.');
}

// Check whether a specific post ID has been sent
async function checkBufferPostStatus(apiKey, postId) {
  try {
    const data = await bufferGql(apiKey,
      `query GetPost($id: ID!) {
        post(id: $id) { id status text scheduledAt sentAt }
      }`,
      { id: postId }
    );
    return data.post || null;
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-buffer-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const mode = (req.query && req.query.mode) || 'sync';
  const apiKey = await getBufferApiKey(req);

  // ── posts mode: list Buffer posts for the picker UI ──────────────
  if (mode === 'posts') {
    if (!apiKey) return res.status(200).json({ ok: false, error: 'no_key' });
    try {
      const posts = await fetchBufferPostsForPicker(apiKey);
      return res.status(200).json({ ok: true, posts });
    } catch (e) {
      return res.status(200).json({ ok: false, error: e.message });
    }
  }

  // ── sync mode (default / cron): promote Buffer-linked videos to Posted ──
  if (mode !== 'sync') return res.status(400).json({ error: 'unknown_mode' });

  if (!apiKey) {
    return res.status(200).json({ ok: true, skipped: 'no_key', promoted: 0 });
  }

  let bundle;
  try {
    const sbRes = await fetch(
      `${SUPA_URL}/rest/v1/app_state?key=eq.content&select=data`,
      { headers: SB_HEADERS }
    );
    if (!sbRes.ok) return res.status(500).json({ error: 'content_fetch_failed' });
    const rows = await sbRes.json();
    if (!rows.length || !rows[0].data) {
      return res.status(200).json({ ok: true, promoted: 0, checked: 0 });
    }
    bundle = rows[0].data;
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  const cvs   = bundle['content_videos'] || [];
  const vids  = bundle['ugc_videos']     || [];
  const deals = bundle['ugc_deals']      || [];
  const vanDate = getVancouverDate();

  // Fetch live fx rate for USD→CAD conversion (totals stored in CAD)
  let usdCadRate = 1.38;
  try {
    const fxRes = await fetch('https://api.frankfurter.app/latest?from=USD&to=CAD');
    if (fxRes.ok) { const fxJson = await fxRes.json(); usdCadRate = fxJson.rates.CAD || 1.38; }
  } catch { /* use fallback */ }
  const dealToCad = (amount, currency) =>
    (currency || 'CAD') === 'USD' ? amount * usdCadRate : amount;

  const linked = cvs.filter(v => v.buffer_post_id && v.status !== 'Posted');
  let promoted = 0;
  let changed  = false;

  for (const v of linked) {
    let post;
    try {
      post = await checkBufferPostStatus(apiKey, v.buffer_post_id);
    } catch {
      continue;
    }
    if (!post) continue;

    const isSent = (post.status || '').toLowerCase() === 'sent';
    if (!isSent) continue;

    const idx = cvs.findIndex(c => c.id === v.id);
    if (idx < 0) continue;

    cvs[idx].status = 'Posted';
    changed  = true;
    promoted++;

    if (cvs[idx].video_log_id) continue; // earnings already logged

    const deal = v.brand ? deals.find(d => d.brand_name === v.brand) : null;
    if (!deal) continue;

    const usedEditor   = !!(v.used_editor || (v.cv_editor_cost != null && Number(v.cv_editor_cost) > 0));
    const editorDeduct = usedEditor ? (Number(v.cv_editor_cost) || 3.0) : 0;
    const flatCad      = dealToCad(Number(deal.rate_per_video), deal.currency);
    const netTotal     = flatCad - editorDeduct;
    const logDate      = v.post_date || vanDate;
    const newId        = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    vids.push({
      id: newId, deal_id: deal.id, brand_name: deal.brand_name,
      date: logDate, status: 'Approved',
      flat_rate: flatCad,
      view_bonus: 0, views_earned: 0, bonus: 0,
      total: netTotal, notes: v.title || '',
      editor_cost: usedEditor ? (Number(v.cv_editor_cost) || 3.0) : null,
      created_at: new Date().toISOString(),
    });
    cvs[idx].video_log_id = newId;
  }

  if (changed) {
    bundle['content_videos'] = cvs;
    bundle['ugc_videos']     = vids;
    try {
      await fetch(`${SUPA_URL}/rest/v1/app_state?on_conflict=key`, {
        method: 'POST',
        headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ key: 'content', data: bundle, updated_at: new Date().toISOString() }),
      });
    } catch (e) {
      console.error('[buffer-sync] Supabase write failed:', e.message);
    }
  }

  console.log('[buffer-sync] sync done. checked=' + linked.length + ' promoted=' + promoted);
  return res.status(200).json({ ok: true, promoted, checked: linked.length });
};
