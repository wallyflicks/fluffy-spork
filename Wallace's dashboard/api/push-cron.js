// Called every 5 minutes by cron-job.org (GET request).
// Reads all push subscriptions from Supabase, checks which notifications
// should fire right now in Vancouver time, and sends them via Web Push.

const webpush = require('web-push');

const SUPA_URL  = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const SB_READ   = { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON };
const SB_WRITE  = { ...SB_READ, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' };

const VAPID_PUBLIC  = 'BFLtDZ_5fRK7JWam1L4czjVl6IJQWqWeyUr5F2jqFeYhmhcdIIHXjQRSNNHx_fzoLqg4K5Bi14LMVpX26grTjLw';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL   = 'mailto:wallacechenga@gmail.com';
const TZ            = 'America/Vancouver';

// Returns true if curHour:curMin falls within a 5-minute window starting at configuredTime
function shouldFire(configuredTime, curHour, curMin, firedMap, key) {
  if (firedMap[key]) return false;
  if (!configuredTime) return false;
  const [th, tm] = configuredTime.split(':').map(Number);
  if (isNaN(th) || isNaN(tm)) return false;
  const diff = (curHour * 60 + curMin) - (th * 60 + tm);
  return diff >= 0 && diff < 5;
}

function buildNotifications(settings, curHour, curMin, todayStr, fired, waterCount, waterTarget) {
  const toSend = [];

  // Water: fires at the top of each N-hour slot (e.g. every 2h → 00,02,04,06,08,10,12...)
  if ((settings.waterReminder || {}).enabled && waterCount < waterTarget && curMin < 5) {
    const intervalH = parseInt((settings.waterReminder || {}).interval) || 2;
    if (curHour % intervalH === 0) {
      const slotKey = `water_${curHour}`;
      if (!fired[slotKey]) {
        toSend.push({
          tag: slotKey,
          title: '💧 Drink water',
          body: `${waterCount} of ~${waterTarget} bottles logged today — stay hydrated.`,
        });
      }
    }
  }

  const timeBased = [
    { key: 'todo',           s: settings.todoReminder,     title: '✅ To-do reminder',  body: 'Check your tasks for today.' },
    { key: 'bedtime',        s: settings.bedtimeReminder,  title: '🌙 Bedtime',          body: 'Time to wind down — log your sleep tonight.' },
    { key: 'gym',            s: settings.gymReminder,      title: '🏋️ Gym',             body: 'Gym day — get it done.' },
    { key: 'deepwork',       s: settings.deepWorkReminder, title: '🧠 Deep Work',        body: 'Lock in for deep work.' },
    { key: 'eveningCheckIn', s: settings.eveningCheckIn,   title: '🌆 Evening check-in', body: 'End of day check-in.' },
    { key: 'workoutMissed',  s: settings.workoutMissed,    title: '💪 Workout missed',   body: "Haven't hit the gym yet today — still time." },
    { key: 'planTomorrow',   s: settings.planTomorrow,     title: '📋 Plan tomorrow',    body: 'Have you planned tomorrow yet? Write it tonight.' },
  ];

  for (const { key, s, title, body } of timeBased) {
    if ((s || {}).enabled && shouldFire((s || {}).time, curHour, curMin, fired, key)) {
      toSend.push({ tag: key, title, body });
    }
  }

  return toSend;
}

module.exports = async function handler(req, res) {
  // Allow GET (cron-job.org) and HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!VAPID_PRIVATE) {
    return res.status(500).json({ error: 'VAPID_PRIVATE_KEY env var not set' });
  }

  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);

  // Current time in Vancouver
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const curHour  = parseInt(parts.find(p => p.type === 'hour').value,   10);
  const curMin   = parseInt(parts.find(p => p.type === 'minute').value, 10);
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now); // YYYY-MM-DD

  // All push subscriptions
  const subR = await fetch(SUPA_URL + '/rest/v1/push_subscriptions?select=*', { headers: SB_READ });
  const subscriptions = await subR.json();
  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return res.status(200).json({ success: true, sent: 0, msg: 'No subscriptions' });
  }

  // Already-fired record for today (shared across all subscriptions — single user)
  const sentR = await fetch(
    SUPA_URL + '/rest/v1/app_state?key=eq.notifSentToday&select=data',
    { headers: SB_READ }
  );
  const sentRows  = await sentR.json();
  const sentData  = Array.isArray(sentRows) && sentRows.length ? sentRows[0].data : {};
  const fired     = (sentData && sentData.date === todayStr) ? (sentData.fired || {}) : {};

  // Today's water count from Supabase health state
  let waterCount = 0, waterTarget = 8;
  try {
    const hr = await fetch(
      SUPA_URL + '/rest/v1/app_state?key=eq.health&select=data',
      { headers: SB_READ }
    );
    const hRows = await hr.json();
    if (Array.isArray(hRows) && hRows.length && hRows[0].data && hRows[0].data['po_water_v1']) {
      waterCount = (hRows[0].data['po_water_v1'].logs || {})[todayStr] || 0;
    }
  } catch {}

  let totalSent = 0;

  for (const row of subscriptions) {
    const { id, endpoint, keys_p256dh, keys_auth, notification_settings } = row;
    if (!endpoint || !keys_p256dh || !keys_auth) continue;

    const pushSub = { endpoint, keys: { p256dh: keys_p256dh, auth: keys_auth } };
    const settings = notification_settings || {};
    const toSend = buildNotifications(settings, curHour, curMin, todayStr, fired, waterCount, waterTarget);

    for (const notif of toSend) {
      try {
        await webpush.sendNotification(
          pushSub,
          JSON.stringify({ title: notif.title, body: notif.body, tag: notif.tag, url: '/index.html' })
        );
        totalSent++;
        fired[notif.tag] = true;
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired — delete it
          await fetch(
            SUPA_URL + '/rest/v1/push_subscriptions?id=eq.' + id,
            { method: 'DELETE', headers: SB_READ }
          );
        } else {
          console.error('[push-cron] send error for', endpoint, ':', err.message);
        }
      }
    }
  }

  // Persist fired state so we don't double-send in the next 5-min window
  if (totalSent > 0) {
    await fetch(SUPA_URL + '/rest/v1/app_state?on_conflict=key', {
      method: 'POST',
      headers: SB_WRITE,
      body: JSON.stringify({
        key: 'notifSentToday',
        data: { date: todayStr, fired },
        updated_at: now.toISOString(),
      }),
    });
  }

  return res.status(200).json({ success: true, sent: totalSent, curTime: `${curHour}:${String(curMin).padStart(2,'0')}`, tz: TZ });
};
