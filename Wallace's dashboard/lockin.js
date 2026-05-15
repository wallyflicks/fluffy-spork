// Lock In Mode — Pomodoro focus overlay
(function () {
  'use strict';

  const LS_SESSIONS = 'lockin_sessions'; // { [YYYY-MM-DD]: count }
  const LS_MINUTES  = 'lockin_minutes';  // { [YYYY-MM-DD]: minutes }

  const DEFAULT_WORK  = 25 * 60;
  const DEFAULT_BREAK = 5  * 60;

  const FOCUS_QUOTES = [
    "Lock in. The work doesn't care about your mood.",
    "Eliminate the noise. What remains is the signal.",
    "You have one job right now. Do it.",
    "Discipline is doing it when you don't feel like it.",
    "The mind is everything. What you think, you become.",
    "Focus is not saying yes to one thing — it's saying no to everything else.",
    "Deep work is the superpower of the 21st century.",
    "The present moment is the only place where work gets done.",
    "Shut the door. Put in the time. The results will speak.",
    "You are what you repeatedly do. Excellence is not an act, but a habit.",
    "One hour of deep focus beats eight hours of distraction.",
    "The obstacle is the way.",
    "All you have is now. Use it.",
    "No shortcuts. No excuses. No regrets.",
    "Champions train in silence.",
    "Every minute you're not working, someone else is.",
    "Be so good they can't ignore you.",
    "Your future self is watching. Don't let him down.",
    "Suffer the pain of discipline or suffer the pain of regret.",
    "The cave you fear to enter holds the treasure you seek.",
    "Do the hard thing first. The rest gets easier.",
    "Concentrate all your thoughts upon the work at hand.",
    "A man who dares to waste one hour of time has not discovered the value of life.",
    "Either you run the day, or the day runs you.",
    "Stay hard.",
    "Act. Don't react.",
    "The quality of your attention determines the quality of your work.",
    "Focused, fast, relentless.",
    "You're closer than you think. Keep going.",
    "Make it count."
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function dateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  function activeDateKey() {
    const now = new Date();
    const d = new Date(now);
    if (now.getHours() < 6) d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  function getSessions() { try { return JSON.parse(localStorage.getItem(LS_SESSIONS)) || {}; } catch { return {}; } }
  function getMinutes()  { try { return JSON.parse(localStorage.getItem(LS_MINUTES))  || {}; } catch { return {}; } }

  function addSession() {
    const s = getSessions(); const dk = dateKey();
    s[dk] = (s[dk] || 0) + 1;
    localStorage.setItem(LS_SESSIONS, JSON.stringify(s));
  }

  function addMinutes(m) {
    const s = getMinutes(); const dk = dateKey();
    s[dk] = (s[dk] || 0) + m;
    localStorage.setItem(LS_MINUTES, JSON.stringify(s));
  }

  function getTodayGoals() {
    try { return JSON.parse(localStorage.getItem('goals:' + activeDateKey())) || []; } catch { return []; }
  }

  function saveTodayGoals(goals) {
    localStorage.setItem('goals:' + activeDateKey(), JSON.stringify(goals));
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function fmtTime(secs) { return pad(Math.floor(secs / 60)) + ':' + pad(secs % 60); }

  // ── Global stats API (used by index.html) ─────────────────────────────────────
  window.getLockInStats = function () {
    const sessions = getSessions();
    const minutes  = getMinutes();
    const dk = dateKey();
    let weekMins = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      weekMins += (minutes[k] || 0);
    }
    return {
      sessionsToday: sessions[dk] || 0,
      minsToday: minutes[dk] || 0,
      hoursWeek: (weekMins / 60).toFixed(1)
    };
  };

  // ── CSS ───────────────────────────────────────────────────────────────────────
  const CSS = `
#lockin-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: #03040a;
  display: none; flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  color: #fafafa;
  overflow: hidden;
}
#lockin-overlay.is-open { display: flex; }

.li-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  flex: 1; min-height: 0;
  gap: 0;
}
@media (max-width: 700px) {
  .li-grid { grid-template-columns: 1fr; }
  .li-sidebar { display: none; }
}

.li-main {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 32px 24px; gap: 20px;
  position: relative;
}

/* Mode badge */
.li-mode-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
  color: rgba(255,255,255,0.35); text-transform: uppercase;
}
.li-mode-badge.work  { color: #6ee7b7; }
.li-mode-badge.break { color: #7dd3fc; }

/* Timer */
.li-timer-ring {
  position: relative; width: 200px; height: 200px;
}
.li-timer-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
.li-timer-ring-track { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 6; }
.li-timer-ring-fill  { fill: none; stroke: #6ee7b7; stroke-width: 6; stroke-linecap: round;
  stroke-dasharray: 565; stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear, stroke 0.4s;
}
.li-timer-ring-fill.break { stroke: #7dd3fc; }
.li-timer-text {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 2px;
}
.li-timer-display {
  font-size: 48px; font-weight: 300; letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: #fff;
}
.li-timer-sessions {
  font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 600;
  letter-spacing: 0.1em;
}

/* Controls */
.li-controls { display: flex; gap: 10px; align-items: center; }
.li-btn {
  padding: 10px 22px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #fafafa; font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, transform 0.1s;
}
.li-btn:hover  { background: rgba(255,255,255,0.1); }
.li-btn:active { transform: scale(0.96); }
.li-btn.primary { background: #6ee7b7; color: #000; border-color: transparent; }
.li-btn.primary:hover { background: #5fd4a6; }

/* Custom duration */
.li-custom-row {
  display: flex; gap: 8px; align-items: center;
  font-size: 12px; color: rgba(255,255,255,0.4);
}
.li-custom-row input {
  width: 52px; padding: 5px 8px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05); color: #fff;
  font-family: inherit; font-size: 13px; text-align: center;
}
.li-custom-row input:focus { outline: none; border-color: rgba(110,231,183,0.5); }

/* Quote */
.li-quote {
  max-width: 380px; text-align: center;
  font-size: 13px; font-style: italic;
  color: rgba(255,255,255,0.3); line-height: 1.55;
  min-height: 40px;
}

/* Completion flash */
.li-complete-msg {
  display: none; position: absolute; inset: 0;
  background: rgba(3,4,10,0.85);
  align-items: center; justify-content: center; flex-direction: column;
  gap: 12px; text-align: center;
}
.li-complete-msg.show { display: flex; }
.li-complete-title { font-size: 22px; font-weight: 600; color: #6ee7b7; }
.li-complete-sub   { font-size: 14px; color: rgba(255,255,255,0.5); }
@keyframes liPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.li-complete-title { animation: liPulse 1.6s ease-in-out infinite; }

/* Sound toggle */
.li-sound-btn {
  padding: 7px 14px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: transparent; color: rgba(255,255,255,0.4);
  font-family: inherit; font-size: 12px; font-weight: 500;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, color 0.15s;
}
.li-sound-btn.on { color: #7dd3fc; border-color: rgba(125,211,252,0.25); }
.li-sound-iframe { display: none; }

/* Sidebar */
.li-sidebar {
  border-left: 1px solid rgba(255,255,255,0.05);
  display: flex; flex-direction: column;
  padding: 28px 20px; gap: 16px; overflow-y: auto;
}
.li-sidebar-title {
  font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
  color: rgba(255,255,255,0.3); text-transform: uppercase;
}
.li-goal-item {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer;
}
.li-goal-check {
  width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.18); margin-top: 1px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
}
.li-goal-item.done .li-goal-check { background: #6ee7b7; border-color: #6ee7b7; color: #000; }
.li-goal-text {
  font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.4;
  flex: 1;
}
.li-goal-item.done .li-goal-text { color: rgba(255,255,255,0.3); text-decoration: line-through; }
.li-goals-empty { font-size: 13px; color: rgba(255,255,255,0.25); font-style: italic; }

/* Stats row in sidebar */
.li-stats-row {
  display: flex; gap: 12px; margin-top: auto; padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.li-stat { flex: 1; }
.li-stat-val { font-size: 20px; font-weight: 600; color: #fafafa; }
.li-stat-lbl { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 2px; letter-spacing: 0.05em; }

/* Top bar inside overlay */
.li-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px 0;
  flex-shrink: 0;
}
.li-topbar-left { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; color: rgba(255,255,255,0.3); }
.li-topbar-right { display: flex; gap: 8px; align-items: center; }
.li-exit-btn {
  padding: 7px 16px; border-radius: 8px;
  border: 1px solid rgba(255,138,138,0.2);
  background: transparent; color: rgba(255,138,138,0.6);
  font-family: inherit; font-size: 12px; font-weight: 600;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.li-exit-btn.confirm { background: rgba(255,138,138,0.12); color: #ff8a8a; border-color: rgba(255,138,138,0.4); }
.li-exit-btn:hover { background: rgba(255,138,138,0.08); }

/* Floating Lock In button (index.html only, bottom-right above nav) */
.lockin-float-btn {
  position: fixed;
  bottom: calc(90px + env(safe-area-inset-bottom, 0px));
  right: 16px;
  z-index: 1000;
  padding: 11px 20px;
  border-radius: 99px;
  border: 1px solid rgba(110,231,183,0.35);
  background: rgba(10,10,11,0.85);
  color: #6ee7b7;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  font-size: 13px; font-weight: 700;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  transition: background 0.15s, transform 0.1s;
  min-height: 44px;
}
.lockin-float-btn:hover  { background: rgba(20,20,22,0.92); }
.lockin-float-btn:active { transform: scale(0.96); }

.lockin-stats-widget {
  display: none;
  gap: 14px; padding: 10px 14px; border-radius: 10px;
  border: 1px solid rgba(110,231,183,0.1);
  background: rgba(110,231,183,0.04);
  margin-top: -8px; margin-bottom: 4px;
}
.lockin-stats-widget.has-data { display: flex; }
.lockin-stats-widget .lsw-item { display: flex; flex-direction: column; gap: 1px; }
.lockin-stats-widget .lsw-val  { font-size: 16px; font-weight: 600; color: #6ee7b7; }
.lockin-stats-widget .lsw-lbl  { font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.06em; }
`;

  // ── HTML ──────────────────────────────────────────────────────────────────────
  const HTML = `
<div id="lockin-overlay" role="dialog" aria-modal="true" aria-label="Lock In Mode">
  <div class="li-topbar">
    <span class="li-topbar-left">LOCK IN MODE</span>
    <div class="li-topbar-right">
      <button class="li-sound-btn" id="liSoundBtn">🎵 Lofi: off</button>
      <button class="li-exit-btn" id="liExitBtn">Exit</button>
    </div>
  </div>

  <div class="li-grid">
    <!-- Main focus area -->
    <div class="li-main">
      <div class="li-mode-badge work" id="liModeBadge">FOCUS SESSION</div>

      <div class="li-timer-ring">
        <svg viewBox="0 0 90 90" width="200" height="200">
          <circle class="li-timer-ring-track" cx="45" cy="45" r="90"/>
          <circle class="li-timer-ring-fill" id="liRingFill" cx="45" cy="45" r="90"/>
        </svg>
        <div class="li-timer-text">
          <div class="li-timer-display" id="liTimerDisplay">25:00</div>
          <div class="li-timer-sessions" id="liSessionCount">0 sessions</div>
        </div>
      </div>

      <div class="li-controls">
        <button class="li-btn primary" id="liStartPause">Start</button>
        <button class="li-btn" id="liReset">Reset</button>
      </div>

      <div class="li-custom-row">
        <span>Custom:</span>
        <input type="number" id="liCustomMins" value="25" min="1" max="120">
        <span>min</span>
        <button class="li-btn" style="padding:6px 12px;font-size:12px" id="liSetCustom">Set</button>
      </div>

      <div class="li-quote" id="liQuote"></div>

      <div class="li-complete-msg" id="liCompleteMsg">
        <div class="li-complete-title" id="liCompleteTitle">Session complete.</div>
        <div class="li-complete-sub" id="liCompleteSub">Rest 5 minutes. You've earned it.</div>
        <button class="li-btn primary" id="liCompleteNext">Start break</button>
      </div>
    </div>

    <!-- Sidebar: goals -->
    <div class="li-sidebar">
      <div class="li-sidebar-title">Today's goals</div>
      <div id="liGoalsList"></div>
      <div class="li-stats-row">
        <div class="li-stat"><div class="li-stat-val" id="liStatSessions">0</div><div class="li-stat-lbl">SESSIONS</div></div>
        <div class="li-stat"><div class="li-stat-val" id="liStatMins">0</div><div class="li-stat-lbl">MIN TODAY</div></div>
      </div>
    </div>
  </div>

  <iframe id="liLofiFrame" class="li-sound-iframe"
    src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&loop=1&playlist=jfKfPfyJRdk"
    allow="autoplay" title="Lofi music"></iframe>
</div>
`;

  // ── State ─────────────────────────────────────────────────────────────────────
  let timerRemaining = DEFAULT_WORK;
  let timerTotal = DEFAULT_WORK;
  let timerMode = 'work';
  let timerRunning = false;
  let timerInterval = null;
  let sessionWorkSecs = 0;
  let exitConfirm = false;
  let exitTimer = null;
  let soundOn = false;
  let quoteInterval = null;
  let quoteIndex = 0;

  // ── Timer ─────────────────────────────────────────────────────────────────────
  function renderTimer() {
    const el = document.getElementById('liTimerDisplay');
    const ring = document.getElementById('liRingFill');
    const badge = document.getElementById('liModeBadge');
    if (!el) return;
    el.textContent = fmtTime(timerRemaining);
    if (ring) {
      const circ = 2 * Math.PI * 90;
      const pct = timerRemaining / timerTotal;
      ring.style.strokeDasharray = String(circ);
      ring.style.strokeDashoffset = String(circ * (1 - pct));
      ring.classList.toggle('break', timerMode === 'break');
    }
    if (badge) {
      badge.textContent = timerMode === 'work' ? 'FOCUS SESSION' : 'BREAK TIME';
      badge.className = 'li-mode-badge ' + timerMode;
    }
    const doc = document.getElementById('liStartPause');
    if (doc) doc.textContent = timerRunning ? 'Pause' : 'Resume';
    renderStats();
  }

  function renderStats() {
    const sessions = getSessions();
    const minutes  = getMinutes();
    const dk = dateKey();
    const el1 = document.getElementById('liStatSessions');
    const el2 = document.getElementById('liStatMins');
    const elCount = document.getElementById('liSessionCount');
    const sc = sessions[dk] || 0;
    const sm = minutes[dk] || 0;
    if (el1) el1.textContent = sc;
    if (el2) el2.textContent = sm;
    if (elCount) elCount.textContent = sc + (sc === 1 ? ' session' : ' sessions');
  }

  function tick() {
    timerRemaining--;
    if (timerMode === 'work') sessionWorkSecs++;
    if (timerRemaining <= 0) {
      timerComplete();
    } else {
      renderTimer();
    }
  }

  function timerComplete() {
    clearInterval(timerInterval);
    timerRunning = false;
    if (timerMode === 'work') {
      const minsWorked = Math.floor(sessionWorkSecs / 60);
      sessionWorkSecs = 0;
      if (minsWorked > 0) { addSession(); addMinutes(minsWorked); }
      showComplete('Session complete. Rest 5 minutes.', false);
    } else {
      showComplete('Break over. Ready to lock in?', true);
    }
    renderTimer();
    updateMainPageStats();
  }

  function showComplete(msg, isBreakEnd) {
    const el = document.getElementById('liCompleteMsg');
    const title = document.getElementById('liCompleteTitle');
    const sub = document.getElementById('liCompleteSub');
    const btn = document.getElementById('liCompleteNext');
    if (!el) return;
    if (title) title.textContent = isBreakEnd ? 'Break complete.' : 'Session complete.';
    if (sub) sub.textContent = msg;
    if (btn) btn.textContent = isBreakEnd ? 'Start session' : 'Start break';
    el.classList.add('show');
  }

  function hideComplete() {
    const el = document.getElementById('liCompleteMsg');
    if (el) el.classList.remove('show');
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    const startBtn = document.getElementById('liStartPause');
    if (startBtn) startBtn.textContent = 'Pause';
    timerInterval = setInterval(tick, 1000);
  }

  function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    const startBtn = document.getElementById('liStartPause');
    if (startBtn) startBtn.textContent = 'Resume';
  }

  function resetTimer(mode, duration) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerMode = mode || 'work';
    timerTotal = duration || (timerMode === 'work' ? DEFAULT_WORK : DEFAULT_BREAK);
    timerRemaining = timerTotal;
    sessionWorkSecs = 0;
    hideComplete();
    renderTimer();
    const startBtn = document.getElementById('liStartPause');
    if (startBtn) startBtn.textContent = 'Start';
  }

  // ── Goals ─────────────────────────────────────────────────────────────────────
  function renderGoals() {
    const container = document.getElementById('liGoalsList');
    if (!container) return;
    const goals = getTodayGoals();
    if (!goals.length) {
      container.innerHTML = '<div class="li-goals-empty">No goals for today yet.</div>';
      return;
    }
    container.innerHTML = goals.map((g, i) => `
      <div class="li-goal-item${g.done ? ' done' : ''}" data-idx="${i}">
        <div class="li-goal-check">${g.done ? '✓' : ''}</div>
        <div class="li-goal-text">${g.text || ''}</div>
      </div>
    `).join('');
    container.querySelectorAll('.li-goal-item').forEach(item => {
      item.addEventListener('click', () => {
        const goals = getTodayGoals();
        const idx = parseInt(item.dataset.idx);
        if (goals[idx]) {
          goals[idx].done = !goals[idx].done;
          saveTodayGoals(goals);
          renderGoals();
        }
      });
    });
  }

  // ── Quotes ────────────────────────────────────────────────────────────────────
  function rotateQuote() {
    const el = document.getElementById('liQuote');
    if (!el) return;
    quoteIndex = (quoteIndex + 1) % FOCUS_QUOTES.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = '"' + FOCUS_QUOTES[quoteIndex] + '"';
      el.style.opacity = '1';
    }, 400);
  }

  function startQuotes() {
    quoteIndex = Math.floor(Math.random() * FOCUS_QUOTES.length);
    const el = document.getElementById('liQuote');
    if (el) el.textContent = '"' + FOCUS_QUOTES[quoteIndex] + '"';
    quoteInterval = setInterval(rotateQuote, 3 * 60 * 1000);
  }

  function stopQuotes() { clearInterval(quoteInterval); }

  // ── Sound ─────────────────────────────────────────────────────────────────────
  function toggleSound() {
    soundOn = !soundOn;
    const frame = document.getElementById('liLofiFrame');
    const btn = document.getElementById('liSoundBtn');
    if (frame) {
      const base = 'https://www.youtube.com/embed/jfKfPfyJRdk?loop=1&playlist=jfKfPfyJRdk';
      frame.src = soundOn ? base + '&autoplay=1' : base + '&autoplay=0';
    }
    if (btn) btn.className = 'li-sound-btn' + (soundOn ? ' on' : '');
    if (btn) btn.textContent = soundOn ? '🎵 Lofi: on' : '🎵 Lofi: off';
  }

  // ── Open / Close ──────────────────────────────────────────────────────────────
  function open() {
    const overlay = document.getElementById('lockin-overlay');
    if (!overlay) return;
    overlay.classList.add('is-open');
    document.body.classList.add('lockin-open');
    resetTimer('work', DEFAULT_WORK);
    renderGoals();
    startQuotes();
    renderStats();
    exitConfirm = false;
  }

  function close() {
    const overlay = document.getElementById('lockin-overlay');
    if (!overlay) return;
    pauseTimer();
    if (sessionWorkSecs > 60) {
      addMinutes(Math.floor(sessionWorkSecs / 60));
      sessionWorkSecs = 0;
    }
    overlay.classList.remove('is-open');
    document.body.classList.remove('lockin-open');
    stopQuotes();
    exitConfirm = false;
    clearTimeout(exitTimer);
    updateMainPageStats();
  }

  // ── Main page stats widget ────────────────────────────────────────────────────
  function updateMainPageStats() {
    const widget = document.getElementById('lockin-stats-widget');
    if (!widget) return;
    const stats = window.getLockInStats();
    if (stats.sessionsToday === 0 && parseFloat(stats.hoursWeek) === 0) {
      widget.classList.remove('has-data');
      return;
    }
    widget.classList.add('has-data');
    const v1 = widget.querySelector('[data-lsw="sessions"]');
    const v2 = widget.querySelector('[data-lsw="mins"]');
    const v3 = widget.querySelector('[data-lsw="week"]');
    if (v1) v1.textContent = stats.sessionsToday;
    if (v2) v2.textContent = stats.minsToday + 'm';
    if (v3) v3.textContent = stats.hoursWeek + 'h';
  }

  function injectMainPageWidget() {
    const shell = document.querySelector('.page-shell');
    if (!shell || document.getElementById('lockin-stats-widget')) return;
    const widget = document.createElement('div');
    widget.id = 'lockin-stats-widget';
    widget.className = 'lockin-stats-widget';
    widget.innerHTML = `
      <div class="lsw-item"><div class="lsw-val" data-lsw="sessions">0</div><div class="lsw-lbl">SESSIONS TODAY</div></div>
      <div class="lsw-item"><div class="lsw-val" data-lsw="mins">0m</div><div class="lsw-lbl">TIME TODAY</div></div>
      <div class="lsw-item"><div class="lsw-val" data-lsw="week">0h</div><div class="lsw-lbl">HRS THIS WEEK</div></div>
    `;
    // Insert after the score card on index, or near top of shell
    const scoreCard = document.getElementById('dailyScoreCard');
    if (scoreCard && scoreCard.nextSibling) {
      shell.insertBefore(widget, scoreCard.nextSibling);
    } else {
      shell.appendChild(widget);
    }
    updateMainPageStats();
  }

  // ── Boot ──────────────────────────────────────────────────────────────────────
  function init() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.innerHTML = HTML.trim();
    document.body.appendChild(wrap.firstChild);

    // Wire controls
    document.getElementById('liStartPause').addEventListener('click', () => {
      if (timerRunning) pauseTimer(); else startTimer();
    });

    document.getElementById('liReset').addEventListener('click', () => {
      const custom = parseInt(document.getElementById('liCustomMins').value) || 25;
      resetTimer('work', custom * 60);
    });

    document.getElementById('liSetCustom').addEventListener('click', () => {
      const mins = parseInt(document.getElementById('liCustomMins').value) || 25;
      resetTimer(timerMode, mins * 60);
    });

    document.getElementById('liCompleteNext').addEventListener('click', () => {
      hideComplete();
      if (timerMode === 'work') { resetTimer('break', DEFAULT_BREAK); }
      else { resetTimer('work', DEFAULT_WORK); }
      startTimer();
    });

    document.getElementById('liSoundBtn').addEventListener('click', toggleSound);

    document.getElementById('liExitBtn').addEventListener('click', () => {
      if (!exitConfirm) {
        exitConfirm = true;
        const btn = document.getElementById('liExitBtn');
        btn.textContent = 'Confirm exit?';
        btn.classList.add('confirm');
        exitTimer = setTimeout(() => {
          exitConfirm = false;
          btn.textContent = 'Exit';
          btn.classList.remove('confirm');
        }, 3000);
      } else {
        close();
      }
    });

    // Floating Lock In pill — only on index.html (has .page-shell)
    function injectFloatingBtn() {
      if (!document.querySelector('.page-shell')) return;
      if (document.getElementById('lockin-float-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'lockin-float-btn';
      btn.className = 'lockin-float-btn';
      btn.textContent = '⚡ Lock In';
      btn.setAttribute('aria-label', 'Enter Lock In mode');
      btn.addEventListener('click', open);
      document.body.appendChild(btn);
    }

    // Stats widget on index.html
    function tryInjectWidget() {
      const shell = document.querySelector('.page-shell');
      if (!shell) return;
      injectMainPageWidget();
      injectFloatingBtn();
    }
    setTimeout(tryInjectWidget, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
