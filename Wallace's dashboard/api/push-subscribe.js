// Saves / removes a browser push subscription in the push_subscriptions table.
// Called from notifications.js whenever the user grants permission or changes settings.

const SUPA_URL  = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const SB = {
  'Content-Type': 'application/json',
  'apikey': SUPA_ANON,
  'Authorization': 'Bearer ' + SUPA_ANON,
  // Upsert on the unique endpoint column
  'Prefer': 'resolution=merge-duplicates',
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { endpoint, keys_p256dh, keys_auth, notification_settings } = req.body || {};
    if (!endpoint || !keys_p256dh || !keys_auth) {
      return res.status(400).json({ error: 'Missing endpoint or keys' });
    }

    const r = await fetch(SUPA_URL + '/rest/v1/push_subscriptions?on_conflict=endpoint', {
      method: 'POST',
      headers: SB,
      body: JSON.stringify({ endpoint, keys_p256dh, keys_auth, notification_settings: notification_settings || {} }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return res.status(500).json({ error: 'Supabase write failed', detail });
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });
    await fetch(
      SUPA_URL + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(endpoint),
      { method: 'DELETE', headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON } }
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
