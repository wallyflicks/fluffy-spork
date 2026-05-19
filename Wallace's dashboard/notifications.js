// notifications.js — loaded on every page
// Registers service worker, schedules local notifications based on saved settings.
(function () {
  'use strict';

  const ICON = '/icons/w-192.png';
  const NOTIF_KEY = 'notifSettings';
  const FIRED_KEY = 'notifFiredToday'; // { type_YYYY-MM-DD: true }

  // ── Service Worker registration ─────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => { window.__swReg = reg; })
        .catch(() => {});
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

  function showNotification(title, body, tag) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    markFired(tag);
    const opts = { body, icon: ICON, badge: ICON, tag, renotify: true };
    // Prefer service worker notification (works when app is backgrounded on iOS PWA)
    const reg = window.__swReg || (navigator.serviceWorker && navigator.serviceWorker.controller);
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SHOW_NOTIFICATION', title, body, tag });
    } else if (window.__swReg) {
      window.__swReg.showNotification(title, opts);
    } else {
      new Notification(title, opts);
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
    setTimeout(() => {
      const tag = 'deepwork';
      if (hasFiredToday(tag)) return;
      try {
        const sessions = JSON.parse(localStorage.getItem('dw_sessions')) || [];
        const todayHas = sessions.some(s => (s.startTime || '').slice(0,10) === todayStr());
        if (!todayHas) showNotification('🧠 Deep Work', 'No deep work yet today — lock in.', tag);
      } catch { showNotification('🧠 Deep Work', 'No deep work yet today — lock in.', tag); }
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
    if (result === 'granted') boot();
    return result;
  };
})();
