const webPush = require('web-push');

const SUPA_URL  = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const VAPID_PUBLIC_KEY = 'BFLtDZ_5fRK7JWam1L4czjVl6IJQWqWeyUr5F2jqFeYhmhcdIIHXjQRSNNHx_fzoLqg4K5Bi14LMVpX26grTjLw';

const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPA_ANON,
  'Authorization': 'Bearer ' + SUPA_ANON,
};

function getVancouverTime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Vancouver',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const hour   = parseInt(parts.find(p => p.type === 'hour').value);
  const minute = parseInt(parts.find(p => p.type === 'minute').value);
  return { hour: hour === 24 ? 0 : hour, minute };
}

function getVancouverDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

function matchesTime(configTime, defaultTime, vanHour, vanMinute) {
  const t = configTime || defaultTime;
  const [h, m] = t.split(':').map(Number);
  return h === vanHour && m === vanMinute;
}

function getNotificationsToFire(settings, vanHour, vanMinute, journalDoneToday) {
  const s = settings || {};
  const out = [];

  // Water reminder — interval in hours; fires at hour 0, interval, 2*interval, ...
  if (s.waterReminder && s.waterReminder.enabled) {
    const interval = Math.max(1, parseInt(s.waterReminder.interval) || 2);
    if (vanMinute === 0 && vanHour % interval === 0) {
      out.push({ tag: 'water', title: '💧 Drink water', body: 'Time for a glass of water — stay hydrated.' });
    }
  }

  // To-do reminder
  if (s.todoReminder && s.todoReminder.enabled) {
    if (matchesTime(s.todoReminder.time, '09:00', vanHour, vanMinute)) {
      out.push({ tag: 'todo', title: '✅ To-do reminder', body: 'Check your tasks for today.' });
    }
  }

  // Bedtime reminder
  if (s.bedtimeReminder && s.bedtimeReminder.enabled) {
    if (matchesTime(s.bedtimeReminder.time, '22:30', vanHour, vanMinute)) {
      out.push({ tag: 'bedtime', title: '🌙 Bedtime', body: 'Time to wind down — log your sleep tonight.' });
    }
  }

  // Gym reminder
  if (s.gymReminder && s.gymReminder.enabled) {
    if (matchesTime(s.gymReminder.time, '08:00', vanHour, vanMinute)) {
      out.push({ tag: 'gym', title: '🏋️ Gym', body: 'Gym day — get it done.' });
    }
  }

  // Deep work reminder
  if (s.deepWorkReminder && s.deepWorkReminder.enabled) {
    if (matchesTime(s.deepWorkReminder.time, '09:00', vanHour, vanMinute)) {
      const target = parseFloat(s.deepWorkReminder.targetHours || 2);
      out.push({ tag: 'deepwork', title: '🧠 Deep Work', body: `${target}h deep work target today — lock in.` });
    }
  }

  // Evening check-in
  if (s.eveningCheckIn && s.eveningCheckIn.enabled) {
    if (matchesTime(s.eveningCheckIn.time, '20:00', vanHour, vanMinute)) {
      out.push({ tag: 'eveningCheckIn', title: '🌆 Evening check-in', body: 'End of day check-in — how did today go?' });
    }
  }

  // Workout missed
  if (s.workoutMissed && s.workoutMissed.enabled) {
    if (matchesTime(s.workoutMissed.time, '19:00', vanHour, vanMinute)) {
      out.push({ tag: 'workoutMissed', title: '💪 Workout missed', body: "Haven't hit the gym yet today — still time." });
    }
  }

  // Plan tomorrow
  if (s.planTomorrow && s.planTomorrow.enabled) {
    if (matchesTime(s.planTomorrow.time, '21:30', vanHour, vanMinute)) {
      out.push({ tag: 'planTomorrow', title: '📋 Plan tomorrow', body: 'Have you planned tomorrow yet? Write it tonight.' });
    }
  }

  // Journal reminder — only fires if today's entry not yet written
  if (s.journalReminder && s.journalReminder.enabled) {
    if (matchesTime(s.journalReminder.time, '21:30', vanHour, vanMinute) && !journalDoneToday) {
      out.push({ tag: 'journal', title: '📓 Journal', body: 'Time to journal — log your W/L for the day.' });
    }
  }

  return out;
}

module.exports = async function handler(req, res) {
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPrivateKey) {
    return res.status(500).json({ error: 'VAPID_PRIVATE_KEY not set' });
  }

  webPush.setVapidDetails('mailto:wallacechenga@gmail.com', VAPID_PUBLIC_KEY, vapidPrivateKey);

  const van = getVancouverTime();

  // Check if today's journal entry exists (to conditionally fire journal reminder)
  const vanDate = getVancouverDate();
  let journalDoneToday = false;
  try {
    const jRes = await fetch(
      SUPA_URL + '/rest/v1/journal_entries?date=eq.' + vanDate + '&select=date',
      { headers: SB_HEADERS }
    );
    if (jRes.ok) {
      const jRows = await jRes.json();
      journalDoneToday = jRows.length > 0;
    }
  } catch (e) {
    console.warn('[push-cron] journal check failed:', e.message);
  }

  const r = await fetch(SUPA_URL + '/rest/v1/push_subscriptions?select=*', { headers: SB_HEADERS });
  if (!r.ok) {
    const detail = await r.text();
    return res.status(500).json({ error: 'Supabase read failed', detail });
  }
  const subscriptions = await r.json();

  let sent = 0;

  for (const row of subscriptions) {
    const notifications = getNotificationsToFire(row.notification_settings, van.hour, van.minute, journalDoneToday);
    for (const notif of notifications) {
      const pushSub = {
        endpoint: row.endpoint,
        keys: { p256dh: row.keys_p256dh, auth: row.keys_auth },
      };
      const payload = JSON.stringify({
        title: notif.title,
        body:  notif.body,
        tag:   notif.tag,
        icon:  '/icons/w-192.png',
        badge: '/icons/w-192.png',
        data:  { url: '/index.html' },
      });
      try {
        await webPush.sendNotification(pushSub, payload);
        sent++;
      } catch (err) {
        // 410 Gone / 404 = subscription expired — clean it up
        if (err.statusCode === 410 || err.statusCode === 404) {
          fetch(
            SUPA_URL + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(row.endpoint),
            { method: 'DELETE', headers: SB_HEADERS }
          ).catch(() => {});
        }
        console.error('[push-cron] send error for tag', notif.tag, ':', err.statusCode || err.message);
      }
    }
  }

  return res.status(200).json({ success: true, sent });
};
