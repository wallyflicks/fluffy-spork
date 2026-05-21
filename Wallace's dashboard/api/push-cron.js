// Vercel cron: runs every 5 minutes, checks the user's notification schedule,
// and sends web push messages from the server so they arrive even when the
// app is closed.

const webpush = require('web-push');

const SUPA_URL  = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const SB = {
  'Content-Type': 'application/json',
  'apikey': SUPA_ANON,
  'Authorization': 'Bearer ' + SUPA_ANON,
  'Prefer': 'resolution=merge-duplicates',
};

const VAPID_PUBLIC  = 'BFLtDZ_5fRK7JWam1L4czjVl6IJQWqWeyUr5F2jqFeYhmhcdIIHXjQRSNNHx_fzoLqg4K5Bi14LMVpX26grTjLw';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = 'mailto:wallacechenga@gmail.com';

async function sbGet(path) {
  const r = await fetch(SUPA_URL + path, {
    headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON },
  });
  const rows = await r.json();
  return Array.isArray(rows) && rows.length ? rows[0].data : null;
}

async function sbUpsert(key, data) {
  await fetch(SUPA_URL + '/rest/v1/app_state?on_conflict=key', {
    method: 'POST',
    headers: SB,
    body: JSON.stringify({ key, data, updated_at: new Date().toISOString() }),
  });
}

module.exports = async function handler(req, res) {
  if (!VAPID_PRIVATE) {
    return res.status(500).json({ error: 'VAPID_PRIVATE_KEY env var not set' });
  }

  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

  // Read push subscription + settings from Supabase
  const pushData = await sbGet('/rest/v1/app_state?key=eq.push_subscription&select=data');
  if (!pushData || !pushData.subscription || !pushData.settings) {
    return res.status(200).json({ ok: true, msg: 'No subscription stored' });
  }

  const { subscription, settings, timezone } = pushData;
  const tz = timezone || 'UTC';

  // Current time in user's local timezone
  const now = new Date();
  const localParts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const curHour = parseInt(localParts.find(p => p.type === 'hour').value, 10);
  const curMin  = parseInt(localParts.find(p => p.type === 'minute').value, 10);

  // Today's date in user's timezone (YYYY-MM-DD)
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(now);

  // Already-fired record for today
  const sentData = await sbGet('/rest/v1/app_state?key=eq.notifSentToday&select=data');
  const fired = (sentData && sentData.date === todayStr) ? (sentData.fired || {}) : {};

  // Water count from health state
  let waterCount = 0, waterTarget = 8;
  try {
    const healthData = await sbGet('/rest/v1/app_state?key=eq.health&select=data');
    if (healthData && healthData['po_water_v1']) {
      const w = healthData['po_water_v1'];
      waterCount = (w.logs || {})[todayStr] || 0;
      waterTarget = 8; // rough default; server doesn't have full profile calculation
    }
  } catch {}

  const toSend = [];

  // Water: fires at the top of each interval-hour slot (e.g. every 2h → 6,8,10,12...)
  if ((settings.waterReminder || {}).enabled && waterCount < waterTarget) {
    const intervalH = parseInt((settings.waterReminder || {}).interval) || 2;
    const slotStart = curHour - (curHour % intervalH);
    const slotKey   = `water_${slotStart}`;
    if (!fired[slotKey] && curMin < 5) {
      toSend.push({
        tag: slotKey,
        title: '💧 Drink water',
        body: `${waterCount} of ~${waterTarget} bottles logged today — stay hydrated.`,
      });
    }
  }

  // Time-based notifications: fire within a 5-minute window of configured time
  function shouldFire(key, time) {
    if (fired[key]) return false;
    if (!time) return false;
    const [th, tm] = time.split(':').map(Number);
    if (isNaN(th)) return false;
    const diff = (curHour * 60 + curMin) - (th * 60 + tm);
    return diff >= 0 && diff < 5;
  }

  const timeBased = [
    { key: 'todo',          s: settings.todoReminder,    title: '✅ To-do reminder',   body: 'Check your tasks for today.' },
    { key: 'bedtime',       s: settings.bedtimeReminder, title: '🌙 Bedtime',           body: 'Time to wind down — log your sleep tonight.' },
    { key: 'gym',           s: settings.gymReminder,     title: '🏋️ Gym',              body: 'Gym day — get it done.' },
    { key: 'deepwork',      s: settings.deepWorkReminder,title: '🧠 Deep Work',         body: 'Lock in for deep work.' },
    { key: 'eveningCheckIn',s: settings.eveningCheckIn,  title: '🌆 Evening check-in',  body: 'End of day check-in.' },
    { key: 'workoutMissed', s: settings.workoutMissed,   title: '💪 Workout missed',    body: "Haven't hit the gym yet today — still time." },
    { key: 'planTomorrow',  s: settings.planTomorrow,    title: '📋 Plan tomorrow',     body: 'Have you planned tomorrow yet? Write it tonight.' },
  ];

  for (const { key, s, title, body } of timeBased) {
    if ((s || {}).enabled && shouldFire(key, (s || {}).time)) {
      toSend.push({ tag: key, title, body });
    }
  }

  // Send
  const sent = [];
  for (const notif of toSend) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({ title: notif.title, body: notif.body, tag: notif.tag, url: '/index.html' })
      );
      sent.push(notif.tag);
      fired[notif.tag] = true;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription expired — remove it so we stop trying
        await fetch(SUPA_URL + '/rest/v1/app_state?key=eq.push_subscription', {
          method: 'DELETE',
          headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON },
        });
        return res.status(200).json({ ok: true, msg: 'Subscription expired, removed' });
      }
      console.error('[push-cron] send error:', err.message);
    }
  }

  // Persist fired state so we don't double-send
  if (sent.length > 0) {
    await sbUpsert('notifSentToday', { date: todayStr, fired });
  }

  return res.status(200).json({ ok: true, sent, curTime: `${curHour}:${curMin}`, tz });
};
