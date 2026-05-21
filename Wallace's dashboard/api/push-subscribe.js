// Stores / removes the browser push subscription in Supabase so the
// server-side cron can send notifications when the app is closed.

const SUPA_URL  = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const SB = {
  'Content-Type': 'application/json',
  'apikey': SUPA_ANON,
  'Authorization': 'Bearer ' + SUPA_ANON,
  'Prefer': 'resolution=merge-duplicates',
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { subscription, settings, timezone } = req.body || {};
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing subscription' });
    }
    const r = await fetch(
      SUPA_URL + '/rest/v1/app_state?on_conflict=key',
      {
        method: 'POST',
        headers: SB,
        body: JSON.stringify({
          key: 'push_subscription',
          data: { subscription, settings, timezone },
          updated_at: new Date().toISOString(),
        }),
      }
    );
    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: 'Supabase write failed', detail: err });
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await fetch(SUPA_URL + '/rest/v1/app_state?key=eq.push_subscription', {
      method: 'DELETE',
      headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON },
    });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
