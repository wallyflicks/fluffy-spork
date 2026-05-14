// Cinematic Mode — ambient background, weather, quote, page transitions, count-up
(function () {
  'use strict';

  const PREF_KEY = 'pref_cinematic';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const QUOTES = [
    "Do not wait; the time will never be 'just right.' Start where you stand.",
    "Discipline is the bridge between goals and accomplishment.",
    "You don't rise to the level of your goals, you fall to the level of your systems.",
    "The man who moves a mountain begins by carrying away small stones.",
    "Hard choices, easy life. Easy choices, hard life.",
    "Focus on the process. The outcome will follow.",
    "What you do every day matters more than what you do once in a while.",
    "The successful warrior is the average man, with laser-like focus.",
    "Don't count the days, make the days count.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Energy and persistence conquer all things.",
    "Do something today that your future self will thank you for.",
    "The pain you feel today is the strength you'll feel tomorrow.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never came from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do what you have to do until you can do what you want to do.",
    "The key to success is to focus on goals, not obstacles.",
    "It's going to be hard, but hard is not impossible.",
    "Don't wish for it. Work for it.",
    "Little things make big days.",
    "You are capable of more than you know.",
    "Act as if what you do makes a difference. It does.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Be stronger than your strongest excuse.",
    "The only bad workout is the one that didn't happen.",
    "Your future is created by what you do today, not tomorrow.",
    "You didn't come this far to only come this far.",
    "Strive for progress, not perfection.",
    "It always seems impossible until it's done.",
    "The secret of getting ahead is getting started.",
    "You are your only limit.",
    "Make each day your masterpiece.",
    "Champions keep playing until they get it right.",
    "Fall seven times, stand up eight.",
    "The difference between ordinary and extraordinary is that little extra.",
    "Motivation gets you started. Habit keeps you going.",
    "You've survived 100% of your hardest days so far.",
    "Success is not final; failure is not fatal: it is the courage to continue that counts.",
    "Absorb what is useful, discard what is useless, add what is essentially your own.",
    "To improve is to change; to be perfect is to change often.",
    "Set your goals high, and don't stop till you get there.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "One day or day one — you decide."
  ];

  // Time-of-day gradient stops
  function timeGradient() {
    const h = new Date().getHours();
    if (h >= 6  && h < 11) return ['#1a1200', '#2a1800']; // morning gold
    if (h >= 11 && h < 17) return ['#001a2a', '#0a0a1a']; // midday blue
    if (h >= 17 && h < 21) return ['#1a0a00', '#0a0018']; // sunset
    return ['#000510', '#050010'];                          // night
  }

  // WMO weather code → icon
  function wxIcon(code) {
    if (code === 0)               return '☀️';
    if (code <= 2)                return '🌤️';
    if (code <= 3)                return '☁️';
    if (code <= 48)               return '🌫️';
    if (code <= 57)               return '🌦️';
    if (code <= 67)               return '🌧️';
    if (code <= 77)               return '🌨️';
    if (code <= 82)               return '🌧️';
    if (code <= 99)               return '⛈️';
    return '🌡️';
  }

  // ── CSS ──────────────────────────────────────────────────────────────────────
  const CSS = `
#cin-bg {
  position: fixed; inset: 0; z-index: -3; pointer-events: none;
  transition: background 4s ease;
}
#cin-grain {
  position: fixed; inset: 0; z-index: 9997; pointer-events: none;
  opacity: 0; transition: opacity 0.6s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}
.cin-on #cin-bg { display: block; }
.cin-on #cin-grain { opacity: 0.028; }

.cin-quote-card {
  display: none;
  padding: 14px 18px; margin-bottom: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.03);
  font-size: 13px; line-height: 1.55;
  color: rgba(255,255,255,0.55);
  font-style: italic;
  letter-spacing: 0.01em;
}
.cin-on .cin-quote-card { display: block; }

.cin-toggle-btn {
  flex: 0 0 auto;
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.4);
  font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}
.cin-toggle-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
.cin-on .cin-toggle-btn { color: #fbbf24; border-color: rgba(251,191,36,0.3); background: rgba(251,191,36,0.08); }

.cin-weather-pill {
  flex: 0 0 auto;
  display: none;
  align-items: center; gap: 5px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
  font-size: 12px; font-weight: 600;
  color: rgba(255,255,255,0.65);
  white-space: nowrap;
}
.cin-on .cin-weather-pill { display: flex; }

@media (prefers-reduced-motion: no-preference) {
  .cin-page-exit {
    animation: cinExit 0.22s ease forwards;
  }
  .cin-page-enter {
    animation: cinEnter 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
}
@keyframes cinExit  { to { opacity: 0; transform: translateY(6px); } }
@keyframes cinEnter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 480px) {
  .cin-weather-pill { display: none !important; }
}
`;

  // ── State ────────────────────────────────────────────────────────────────────
  let active = false;
  let weatherFetched = false;

  function isOn() { return localStorage.getItem(PREF_KEY) === '1'; }

  // ── Background ───────────────────────────────────────────────────────────────
  function updateBg() {
    const bg = document.getElementById('cin-bg');
    if (!bg) return;
    const [c1, c2] = timeGradient();
    bg.style.background = `radial-gradient(ellipse at 30% 20%, ${c1} 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${c2} 0%, transparent 55%), var(--bg, #050506)`;
  }

  // ── Weather ──────────────────────────────────────────────────────────────────
  async function fetchWeather() {
    if (weatherFetched || !navigator.geolocation) return;
    weatherFetched = true;
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 }));
      const { latitude: lat, longitude: lon } = pos.coords;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,weather_code`;
      const data = await fetch(url).then(r => r.json());
      const temp = Math.round(data.current.temperature_2m);
      const icon = wxIcon(data.current.weather_code);
      const pill = document.getElementById('cin-weather');
      if (pill) pill.innerHTML = `<span>${icon}</span><span>${temp}°</span>`;
    } catch (_) { weatherFetched = false; }
  }

  // ── Quote ────────────────────────────────────────────────────────────────────
  function injectQuote() {
    if (!document.querySelector('.page-shell')) return; // only index.html
    if (document.getElementById('cin-quote')) return;
    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((Date.now() - start) / 86400000);
    const text = QUOTES[day % QUOTES.length];
    const div = document.createElement('div');
    div.id = 'cin-quote';
    div.className = 'cin-quote-card';
    div.textContent = `"${text}"`;
    const shell = document.querySelector('.page-shell');
    if (shell) shell.insertBefore(div, shell.firstChild);
  }

  // ── Page transitions ─────────────────────────────────────────────────────────
  function initTransitions() {
    if (REDUCED) return;
    document.body.classList.add('cin-page-enter');
    setTimeout(() => document.body.classList.remove('cin-page-enter'), 400);
    document.addEventListener('click', e => {
      if (!active) return;
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript') || href.startsWith('mailto')) return;
      if (a.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('cin-page-exit');
      setTimeout(() => { window.location.href = href; }, 220);
    }, true);
  }

  // ── Toggle ───────────────────────────────────────────────────────────────────
  function enable() {
    active = true;
    document.documentElement.classList.add('cin-on');
    updateBg();
    fetchWeather();
    injectQuote();
    localStorage.setItem(PREF_KEY, '1');
  }

  function disable() {
    active = false;
    document.documentElement.classList.remove('cin-on');
    localStorage.setItem(PREF_KEY, '0');
  }

  function toggle() { isOn() ? disable() : enable(); }

  // ── Count-up (global helper for other scripts) ───────────────────────────────
  window.cinCountUp = function (el, target, duration) {
    if (!el) return;
    if (REDUCED) { el.textContent = target; return; }
    duration = duration || 700;
    const start = Date.now();
    const from = parseFloat(el.textContent) || 0;
    function step() {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * ease);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  // ── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Background layer
    const bg = document.createElement('div');
    bg.id = 'cin-bg';
    document.body.insertBefore(bg, document.body.firstChild);

    // Grain layer
    const grain = document.createElement('div');
    grain.id = 'cin-grain';
    document.body.appendChild(grain);

    // Wait for topbar to exist, then inject buttons
    function injectTopbarItems() {
      const topbar = document.getElementById('topbar');
      if (!topbar) { setTimeout(injectTopbarItems, 80); return; }

      // Weather pill
      const weather = document.createElement('div');
      weather.id = 'cin-weather';
      weather.className = 'cin-weather-pill';
      weather.textContent = '—°';
      topbar.insertBefore(weather, topbar.firstChild);

      // Toggle button
      const btn = document.createElement('button');
      btn.id = 'cin-toggle-btn';
      btn.className = 'cin-toggle-btn';
      btn.title = 'Cinematic mode';
      btn.setAttribute('aria-label', 'Toggle cinematic mode');
      btn.innerHTML = '✦';
      btn.addEventListener('click', toggle);
      topbar.appendChild(btn);
    }
    injectTopbarItems();

    // Restore saved state
    if (isOn()) enable();
    else active = false;

    initTransitions();

    // Update gradient on tab focus
    document.addEventListener('visibilitychange', () => { if (!document.hidden && active) updateBg(); });
    setInterval(() => { if (active) updateBg(); }, 10 * 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
