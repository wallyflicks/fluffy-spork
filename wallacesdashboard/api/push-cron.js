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

function getVancouverDayOfWeek() {
  // Returns JS day-of-week (0=Sun, 1=Mon, ..., 6=Sat) in Vancouver timezone
  const vanDateStr = getVancouverDate();
  const [y, m, d] = vanDateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

// Returns true if the given Vancouver time falls inside the user's sleep window
function isInSleepWindow(sleepSchedule, vanHour, vanMinute, vanDayOfWeek) {
  if (!sleepSchedule) return false;
  let bedtime, wakeUp;
  if (sleepSchedule.customByDay && Array.isArray(sleepSchedule.days) && sleepSchedule.days.length === 7) {
    // Mon-Sun array: 0=Mon…5=Sat, 6=Sun. JS getDay(): 0=Sun, 1=Mon…6=Sat.
    const dayIdx = vanDayOfWeek === 0 ? 6 : vanDayOfWeek - 1;
    const dayData = sleepSchedule.days[dayIdx] || {};
    bedtime = dayData.bedtime || '23:30';
    wakeUp  = dayData.wakeUp  || '08:00';
  } else {
    bedtime = sleepSchedule.defaultBedtime || '23:30';
    wakeUp  = sleepSchedule.defaultWakeUp  || '08:00';
  }
  const [bH, bM] = bedtime.split(':').map(Number);
  const [wH, wM] = wakeUp.split(':').map(Number);
  const cur  = vanHour * 60 + vanMinute;
  const bed  = bH * 60 + bM;
  const wake = wH * 60 + wM;
  // Overnight window (most common: e.g. 23:30 → 08:00)
  if (bed > wake) return cur >= bed || cur < wake;
  // Same-day window (e.g. nap: 14:00 → 15:30)
  return cur >= bed && cur < wake;
}

function matchesTime(configTime, defaultTime, vanHour, vanMinute) {
  const t = configTime || defaultTime;
  const [h, m] = t.split(':').map(Number);
  return h === vanHour && m === vanMinute;
}

function getNotificationsToFire(settings, vanHour, vanMinute, journalDoneToday, workoutDoneToday) {
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

  // Evening check-in
  if (s.eveningCheckIn && s.eveningCheckIn.enabled) {
    if (matchesTime(s.eveningCheckIn.time, '20:00', vanHour, vanMinute)) {
      out.push({ tag: 'eveningCheckIn', title: '🌆 Evening check-in', body: 'End of day check-in — how did today go?' });
    }
  }

  // Workout missed — only fire if workout not already done
  if (s.workoutMissed && s.workoutMissed.enabled && !workoutDoneToday) {
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
  const vanDow = getVancouverDayOfWeek();

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

  // Check if workout was done today (for workout-missed notification)
  let workoutDoneToday = false;
  try {
    // Check 1: workout_history table (set when "Mark workout done" is pressed)
    const whRes = await fetch(
      SUPA_URL + '/rest/v1/workout_history?date=eq.' + vanDate + '&select=date',
      { headers: SB_HEADERS }
    );
    if (whRes.ok) {
      const whRows = await whRes.json();
      if (whRows.length > 0) workoutDoneToday = true;
    }
  } catch (e) {
    console.warn('[push-cron] workout_history check failed:', e.message);
  }
  if (!workoutDoneToday) {
    try {
      // Check 2: po_coach_v1 sets logged today (synced to app_state key="gym")
      const gymRes = await fetch(
        SUPA_URL + '/rest/v1/app_state?key=eq.gym&select=data',
        { headers: SB_HEADERS }
      );
      if (gymRes.ok) {
        const gymRows = await gymRes.json();
        if (gymRows.length > 0 && gymRows[0].data) {
          const coachV1 = gymRows[0].data['po_coach_v1'] || {};
          const logs = coachV1.logs || {};
          const hasSets = Object.values(logs).some(arr =>
            Array.isArray(arr) && arr.some(l => (l.date || '').slice(0, 10) === vanDate)
          );
          if (hasSets) workoutDoneToday = true;
        }
      }
    } catch (e) {
      console.warn('[push-cron] gym app_state check failed:', e.message);
    }
  }

  // Subscription renewal reminders — fetch finance bundle once
  const subRenewals = [];
  try {
    const finRes = await fetch(SUPA_URL + '/rest/v1/app_state?key=eq.finance&select=data', { headers: SB_HEADERS });
    if (finRes.ok) {
      const finRows = await finRes.json();
      const subs = (finRows[0]?.data?.finance_subscriptions) || [];
      subs.forEach(s => {
        if (!s.billingDate) return;
        // Roll forward stale dates before computing diff
        let bd = new Date(s.billingDate + 'T12:00:00');
        const vanToday = new Date(vanDate + 'T12:00:00');
        while (bd <= vanToday) {
          s.billingCycle === 'yearly' ? bd.setFullYear(bd.getFullYear() + 1) : bd.setMonth(bd.getMonth() + 1);
        }
        const billingDate = bd.toISOString().slice(0, 10);
        const remindDays = s.remindDaysBefore ?? 3;
        const diff = Math.round((new Date(billingDate + 'T00:00:00') - new Date(vanDate + 'T00:00:00')) / 86400000);
        if (diff === remindDays || (diff === 1 && remindDays !== 1)) {
          subRenewals.push({ name: s.name, days: diff, cost: s.costMonthly });
        }
      });
    }
  } catch (e) { console.warn('[push-cron] subscription check failed:', e.message); }

  // ── Done → Posted auto-transition ─────────────────────────────────
  // Runs every morning: any content video with status "Done" whose post_date
  // is today or earlier gets promoted to "Posted" and earns its deal income.
  try {
    const contRes = await fetch(
      SUPA_URL + '/rest/v1/app_state?key=eq.content&select=data',
      { headers: SB_HEADERS }
    );
    if (contRes.ok) {
      const contRows = await contRes.json();
      if (contRows.length && contRows[0].data) {
        const bundle = contRows[0].data;
        const cvs    = bundle['content_videos'] || [];
        const vids   = bundle['ugc_videos']     || [];
        const deals  = bundle['ugc_deals']      || [];
        let changed  = false;

        for (const v of cvs) {
          if (v.status !== 'Done') continue;
          if (!v.post_date || v.post_date > vanDate) continue;

          v.status = 'Posted';
          changed  = true;

          if (v.video_log_id) continue; // earnings entry already exists

          const deal = v.brand ? deals.find(d => d.brand_name === v.brand) : null;
          if (!deal) continue;

          const usedEditor  = !!(v.used_editor || (v.cv_editor_cost != null && Number(v.cv_editor_cost) > 0));
          const editorDeduct = usedEditor ? (Number(v.cv_editor_cost) || 3.0) : 0;
          const netTotal     = Number(deal.rate_per_video) - editorDeduct;
          const newId        = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

          vids.push({
            id:           newId,
            deal_id:      deal.id,
            brand_name:   deal.brand_name,
            date:         v.post_date,
            status:       'Approved',
            flat_rate:    Number(deal.rate_per_video),
            view_bonus:   0,
            views_earned: 0,
            bonus:        0,
            total:        netTotal,
            notes:        v.title || '',
            editor_cost:  usedEditor ? (Number(v.cv_editor_cost) || 3.0) : null,
            created_at:   new Date().toISOString()
          });
          v.video_log_id = newId;
        }

        if (changed) {
          bundle['content_videos'] = cvs;
          bundle['ugc_videos']     = vids;
          await fetch(SUPA_URL + '/rest/v1/app_state?on_conflict=key', {
            method: 'POST',
            headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates' },
            body: JSON.stringify({ key: 'content', data: bundle, updated_at: new Date().toISOString() })
          });
          console.log('[push-cron] Done→Posted: promoted', cvs.filter(v => v.status === 'Posted' && v.video_log_id).length, 'videos');
        }
      }
    }
  } catch (e) {
    console.warn('[push-cron] Done→Posted transition failed:', e.message);
  }

  const r = await fetch(SUPA_URL + '/rest/v1/push_subscriptions?select=*', { headers: SB_HEADERS });
  if (!r.ok) {
    const detail = await r.text();
    return res.status(500).json({ error: 'Supabase read failed', detail });
  }
  const subscriptions = await r.json();

  let sent = 0;

  for (const row of subscriptions) {
    // Skip all notifications during sleep window
    const settings = row.notification_settings || {};
    if (isInSleepWindow(settings.sleepSchedule, van.hour, van.minute, vanDow)) {
      console.log('[push-cron] Sleep window active — skipping all notifications for endpoint', row.endpoint.slice(-20));
      continue;
    }

    const notifications = getNotificationsToFire(settings, van.hour, van.minute, journalDoneToday, workoutDoneToday);

    // Subscription renewal reminders (always-on, not behind a toggle)
    if (subRenewals.length > 0) {
      let body;
      if (subRenewals.length === 1) {
        const r = subRenewals[0];
        const dStr = r.days === 1 ? 'tomorrow' : `in ${r.days} days`;
        body = `${r.name} renews ${dStr} — $${Number(r.cost).toFixed(2)}/mo. Cancel now if you don't want it.`;
      } else {
        const names = subRenewals.map(r => `${r.name} (${r.days}d)`).join(', ');
        body = `Upcoming renewals: ${names}. Check Finance to cancel.`;
      }
      notifications.push({ tag: 'subRenewal', title: '💳 Subscription renewal', body });
    }

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
