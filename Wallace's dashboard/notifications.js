// notifications.js — loaded on every page
// Registers service worker, subscribes to server-side Web Push, and schedules
// local fallback notifications for when the page is open.
(function () {
  'use strict';

  const ICON = '/icons/w-192.png';
  const NOTIF_KEY = 'notifSettings';
  const FIRED_KEY = 'notifFiredToday'; // { type_YYYY-MM-DD: true }
  const VAPID_PUBLIC_KEY = 'BFLtDZ_5fRK7JWam1L4czjVl6IJQWqWeyUr5F2jqFeYhmhcdIIHXjQRSNNHx_fzoLqg4K5Bi14LMVpX26grTjLw';

  // ── Converts a base64url VAPID public key to a Uint8Array ───────────────
  function vapidKey(b64) {
    const pad = '='.repeat((4 - b64.length % 4) % 4);
    const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
  }

  // ── Subscribe this device to server-side Web Push ───────────────────────
  async function subscribePush() {
    if (!('PushManager' in window)) return null;
    try {
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey(VAPID_PUBLIC_KEY),
        });
      }
      return sub;
    } catch (e) {
      console.warn('[push] Subscribe failed:', e.message);
      return null;
    }
  }

  // ── Send subscription + settings to Vercel so the cron can push ─────────
  window.syncPushSubscription = async function (settings) {
    if (Notification.permission !== 'granted') return;
    const sub = await subscribePush();
    if (!sub) return;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), settings, timezone }),
      });
      console.log('[push] Subscription synced to server');
    } catch (e) {
      console.warn('[push] Sync failed:', e.message);
    }
  };

  // ── Service Worker registration ─────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          window.__swReg = reg;
          console.log('[SW] Registered, scope:', reg.scope);
        })
        .catch(e => console.warn('[SW] Registration failed:', e));
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function getSettings() {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || {}; } catch { return {}; }
  }
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function hasFiredToday(tag) {
    try {
      const f = JSON.parse(localStorage.getItem(FIRED_KEY)) || {};
      return !!f[tag + '_' + todayStr()];
    } catch { return false; }
  }
  function markFired(tag) {
    try {
      const f = JSON.parse(localStorage.getItem(FIRED_KEY)) || {};
      // Prune keys older than 2 days
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 2);
      const cutStr = cutoff.toISOString().slice(0,10);
      Object.keys(f).forEach(k => { if (k.slice(-10) < cutStr) delete f[k]; });
      f[tag + '_' + todayStr()] = true;
      localStorage.setItem(FIRED_KEY, JSON.stringify(f));
    } catch {}
  }

  async function showNotification(title, body, tag) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log('[notif] Skipped — permission:', Notification.permission);
      return;
    }
    console.log('[notif] Firing:', tag, '|', title);
    markFired(tag);
    const opts = { body, icon: ICON, badge: ICON, tag, renotify: true, data: { url: '/index.html' } };
    // Use registration.showNotification() — most reliable on iOS PWA (works backgrounded)
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, opts);
        console.log('[notif] Shown via SW registration');
        return;
      } catch (e) {
        console.warn('[notif] SW showNotification failed:', e);
      }
    }
    // Fallback: basic Notification API (foreground only)
    try {
      new Notification(title, opts);
      console.log('[notif] Shown via basic Notification API');
    } catch (e) {
      console.error('[notif] All notification methods failed:', e);
    }
  }

  // ── ms until a HH:MM time today (or tomorrow if past) ────────────────────
  function msUntil(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target.getTime() - now.getTime();
  }

  // ── Individual schedulers ────────────────────────────────────────────────
  function scheduleWaterReminder(s) {
    if (!s.enabled) return;
    const hours = parseInt(s.interval) || 2;
    const ms = hours * 60 * 60 * 1000;
    function check() {
      const tag = 'water_' + new Date().getHours();
      if (!hasFiredToday(tag)) {
        // Check if under target
        try {
          const water = JSON.parse(localStorage.getItem('po_water_v1')) || {};
          const logs = water.logs || {};
          const today = todayStr();
          const count = logs[today] || 0;
          const target = 8; // rough default
          if (count < target) showNotification('💧 Drink water', `${count} of ~${target} servings logged today — stay hydrated.`, 'water');
        } catch { showNotification('💧 Drink water', 'Time for a glass of water!', 'water'); }
      }
      setTimeout(check, ms);
    }
    setTimeout(check, ms);
  }

  function scheduleTodoReminder(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '09:00');
    setTimeout(() => {
      const tag = 'todo';
      if (hasFiredToday(tag)) return;
      try {
        const goals = JSON.parse(localStorage.getItem('goals:' + todayStr())) || [];
        const left = goals.filter(g => !g.done).length;
        if (left > 0) showNotification('✅ To-do reminder', `You have ${left} task${left !== 1 ? 's' : ''} left today.`, tag);
      } catch { showNotification('✅ To-do reminder', 'Check your tasks for today.', tag); }
    }, delay);
  }

  function scheduleBedtimeReminder(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '22:30');
    setTimeout(() => {
      const tag = 'bedtime';
      if (hasFiredToday(tag)) return;
      showNotification('🌙 Bedtime', 'Time to wind down — log your sleep tonight.', tag);
    }, delay);
  }

  function scheduleGymReminder(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '08:00');
    setTimeout(() => {
      const tag = 'gym';
      if (hasFiredToday(tag)) return;
      // Determine if training or rest day using gym state
      try {
        const state = JSON.parse(localStorage.getItem('po_coach_v1')) || {};
        const rotation = state.splitRotation || [];
        const anchor = state.splitAnchor || {};
        let msg = 'Gym day — get it done.';
        if (anchor.date && anchor.index != null && rotation.length) {
          const anchorDate = new Date(anchor.date);
          const today = new Date(); today.setHours(0,0,0,0); anchorDate.setHours(0,0,0,0);
          const daysDiff = Math.round((today - anchorDate) / 86400000);
          const idx = ((anchor.index + daysDiff) % rotation.length + rotation.length) % rotation.length;
          const split = rotation[idx] || '';
          if (split.toLowerCase() === 'rest') {
            const restMsgs = ['Rest day — recover well.', 'No gym today, recharge.', 'Active rest day — stay loose.'];
            msg = restMsgs[new Date().getDate() % restMsgs.length];
          }
        }
        showNotification('🏋️ Gym', msg, tag);
      } catch { showNotification('🏋️ Gym', 'Gym day — get it done.', tag); }
    }, delay);
  }

  function scheduleDeepWorkReminder(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '09:00');
    const targetHours = parseFloat(s.targetHours || localStorage.getItem('deepWorkDailyTarget') || 2);
    setTimeout(() => {
      const tag = 'deepwork';
      if (hasFiredToday(tag)) return;
      try {
        const sessions = JSON.parse(localStorage.getItem('dw_sessions')) || [];
        const today = todayStr();
        const todayMinutes = sessions
          .filter(s => (s.startTime || '').slice(0,10) === today)
          .reduce((sum, s) => sum + (s.durationMin || 0), 0);
        const todayHours = todayMinutes / 60;
        const remaining = Math.max(0, targetHours - todayHours);
        if (remaining > 0.1) {
          const remStr = remaining < 1 ? `${Math.round(remaining * 60)}m` : `${remaining.toFixed(1).replace('.0','')}h`;
          showNotification('🧠 Deep Work', `${remStr} of deep work left today — lock in.`, tag);
        }
      } catch {
        showNotification('🧠 Deep Work', `${targetHours}h deep work target — lock in.`, tag);
      }
    }, delay);
  }

  function scheduleEveningCheckIn(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '20:00');
    setTimeout(() => {
      const tag = 'eveningCheckIn';
      if (hasFiredToday(tag)) return;
      try {
        const today = todayStr();
        const goals = JSON.parse(localStorage.getItem('goals:' + today) || '[]');
        if (!goals.length) return; // no tasks set — don't fire
        const left = goals.filter(g => !g.done).length;
        const msg = left > 0
          ? `You have ${left} task${left !== 1 ? 's' : ''} left today — finish strong.`
          : 'All tasks done today — good work.';
        showNotification('🌆 Evening check-in', msg, tag);
      } catch { showNotification('🌆 Evening check-in', 'End of day check-in.', tag); }
    }, delay);
  }

  function scheduleWorkoutMissed(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '19:00');
    setTimeout(() => {
      const tag = 'workoutMissed';
      if (hasFiredToday(tag)) return;
      try {
        const gymState = JSON.parse(localStorage.getItem('po_coach_v1') || 'null') || {};
        const rotation = gymState.splitRotation || [];
        const anchor   = gymState.splitAnchor   || {};
        // Detect rest day
        if (anchor.date && anchor.index != null && rotation.length) {
          const anchorDate = new Date(anchor.date);
          const today = new Date(); today.setHours(0,0,0,0); anchorDate.setHours(0,0,0,0);
          const daysDiff = Math.round((today - anchorDate) / 86400000);
          const idx = ((anchor.index + daysDiff) % rotation.length + rotation.length) % rotation.length;
          if ((rotation[idx] || '').toLowerCase() === 'rest') return; // rest day — don't fire
        }
        // Check if any sets logged today across all exercises
        const logs = gymState.logs || {};
        const today = todayStr();
        const hasSets = Object.values(logs).some(arr =>
          Array.isArray(arr) && arr.some(l => (l.date || '').slice(0, 10) === today)
        );
        if (!hasSets) showNotification('💪 Workout missed', "Haven't hit the gym yet today — still time.", tag);
      } catch { showNotification('💪 Workout missed', "Haven't hit the gym yet today — still time.", tag); }
    }, delay);
  }

  function schedulePlanTomorrow(s) {
    if (!s.enabled) return;
    const delay = msUntil(s.time || '21:30');
    setTimeout(() => {
      const tag = 'planTomorrow';
      if (hasFiredToday(tag)) return;
      try {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowKey = 'goals:' + tomorrow.getFullYear() + '-' +
          String(tomorrow.getMonth()+1).padStart(2,'0') + '-' +
          String(tomorrow.getDate()).padStart(2,'0');
        const tomorrowGoals = JSON.parse(localStorage.getItem(tomorrowKey) || '[]');
        if (!tomorrowGoals.length) {
          showNotification('📋 Plan tomorrow', 'Have you planned tomorrow yet? Write it tonight.', tag);
        }
      } catch { showNotification('📋 Plan tomorrow', 'Have you planned tomorrow yet? Write it tonight.', tag); }
    }, delay);
  }

  // ── Boot: schedule all enabled reminders ─────────────────────────────────
  function boot() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const s = getSettings();
    scheduleWaterReminder(s.waterReminder || {});
    scheduleTodoReminder(s.todoReminder || {});
    scheduleBedtimeReminder(s.bedtimeReminder || {});
    scheduleGymReminder(s.gymReminder || {});
    scheduleDeepWorkReminder(s.deepWorkReminder || {});
    scheduleEveningCheckIn(s.eveningCheckIn   || {});
    scheduleWorkoutMissed(s.workoutMissed     || {});
    schedulePlanTomorrow(s.planTomorrow       || {});
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // Expose permission request for notifications page
  window.requestNotifPermission = async function () {
    if (!('Notification' in window)) return 'unsupported';
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      boot();
      window.syncPushSubscription(getSettings());
    }
    return result;
  };
})();
