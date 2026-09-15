'use strict';

// ══════════════════════════════════════════════════════════════════
// Shared UGC deal/video data model — single source of truth used by
// content.html (full deal management UI) and index.html (Quick Log
// widget). Keeping this in one file means both pages read/write the
// exact same localStorage keys and Supabase bundle, and log videos
// through the exact same function.
// ══════════════════════════════════════════════════════════════════

// ── Supabase ─────────────────────────────────────────────────────
const SUPA_URL    = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPA_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const CONTENT_KEY = 'content';
const SB_H  = { 'Content-Type': 'application/json', 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Prefer': 'resolution=merge-duplicates' };
const SB_RH = { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY };

// ── localStorage keys ─────────────────────────────────────────────
const LS_DEALS    = 'ugc_deals';
const LS_PAYMENTS = 'ugc_payments';
const LS_VIDEOS   = 'ugc_videos';
const LS_CV       = 'content_videos';
const LS_EDITOR_PAYMENTS = 'ugc_editor_payments';
const LS_EDITOR_RESET_AT = 'ugc_editor_reset_at';
const LS_EDITOR_TZ       = 'ugc_editor_tz';
const FX_LS_KEY = 'content_fx_usd_cad';

const DEFAULT_MAX_PER_DAY = 3;

// ── Helpers ───────────────────────────────────────────────────────
function uid()      { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function todayVan() { return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' }); }
function monthOf(d) { return (d || todayVan()).slice(0, 7); }
function esc(s)     { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function ls(k)      { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } }
function lsSet(k,v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── USD/CAD exchange rate (cached daily) ───────────────────────────
let _fxRate = null;
async function ensureFxRate() {
  const cached = JSON.parse(localStorage.getItem(FX_LS_KEY) || 'null');
  if (cached && cached.date === todayVan()) {
    _fxRate = cached.rate;
    return _fxRate;
  }
  try {
    const resp = await fetch('https://api.frankfurter.app/latest?from=USD&to=CAD');
    const json = await resp.json();
    _fxRate = json.rates.CAD;
    localStorage.setItem(FX_LS_KEY, JSON.stringify({ rate: _fxRate, date: todayVan() }));
  } catch {
    _fxRate = (cached && cached.rate) || 1.38;
  }
  return _fxRate;
}
function dealToCad(amount, dealCurrency) {
  if ((dealCurrency || 'CAD') === 'CAD') return amount;
  return amount * (_fxRate || 1.38);
}

// ── Cloud sync (whole content bundle) ──────────────────────────────
async function fetchFromCloud() {
  const res = await fetch(`${SUPA_URL}/rest/v1/app_state?key=eq.${CONTENT_KEY}&select=data`, { headers: SB_RH });
  if (!res.ok) throw new Error('fetch failed ' + res.status);
  const rows = await res.json();
  return (rows.length && rows[0].data) ? rows[0].data : null;
}
async function pushToCloud() {
  const bundle = {
    [LS_DEALS]:           ls(LS_DEALS),
    [LS_PAYMENTS]:        ls(LS_PAYMENTS),
    [LS_VIDEOS]:          ls(LS_VIDEOS),
    [LS_CV]:              ls(LS_CV),
    [LS_EDITOR_PAYMENTS]: ls(LS_EDITOR_PAYMENTS),
    [LS_EDITOR_RESET_AT]: localStorage.getItem(LS_EDITOR_RESET_AT) || null,
    [LS_EDITOR_TZ]:       localStorage.getItem(LS_EDITOR_TZ) !== null ? Number(localStorage.getItem(LS_EDITOR_TZ)) : 7,
  };
  const res = await fetch(`${SUPA_URL}/rest/v1/app_state?on_conflict=key`, {
    method: 'POST', headers: SB_H,
    body: JSON.stringify({ key: CONTENT_KEY, data: bundle, updated_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error('push failed ' + res.status);
}

// Pull the freshest cloud bundle into localStorage. Call this right before any
// deal/video mutation (see withFreshBundle) so a stale tab can never resurrect
// something that was deleted from another tab/device in the meantime.
async function refreshBundleFromCloud() {
  try {
    const bundle = await fetchFromCloud();
    if (bundle) {
      if (Array.isArray(bundle[LS_DEALS]))           lsSet(LS_DEALS,           bundle[LS_DEALS]);
      if (Array.isArray(bundle[LS_PAYMENTS]))        lsSet(LS_PAYMENTS,        bundle[LS_PAYMENTS]);
      if (Array.isArray(bundle[LS_VIDEOS]))          lsSet(LS_VIDEOS,          bundle[LS_VIDEOS]);
      if (Array.isArray(bundle[LS_CV]))              lsSet(LS_CV,              bundle[LS_CV]);
      if (Array.isArray(bundle[LS_EDITOR_PAYMENTS])) lsSet(LS_EDITOR_PAYMENTS, bundle[LS_EDITOR_PAYMENTS]);
    }
  } catch (e) { /* offline — proceed with whatever is already local */ }
}

// Read-modify-write: refresh from cloud, apply the mutation to the now-fresh
// local arrays, then push the result back. This is the pattern every
// deal/video/payment mutation should go through.
async function withFreshBundle(mutator) {
  await refreshBundleFromCloud();
  await mutator();
  await pushToCloud();
}

// ── Deals ───────────────────────────────────────────────────────────
function getAllDeals()    { return ls(LS_DEALS); }
function getActiveDeals() { return ls(LS_DEALS).filter(d => !d.status || d.status === 'Active'); }
function getDeal(id)      { return ls(LS_DEALS).find(d => d.id === id) || null; }
function getDealMaxPerDay(deal) {
  const n = Number(deal && deal.max_per_day);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_PER_DAY;
}

function videosToday(dealId)     { const t = todayVan(); return ls(LS_VIDEOS).filter(v => v.deal_id === dealId && v.date === t); }
function videosThisMonth(dealId) { const m = monthOf(todayVan()); return ls(LS_VIDEOS).filter(v => v.deal_id === dealId && v.status === 'Approved' && monthOf(v.date) === m).length; }
function totalEarnedFromDeal(dealId) { return ls(LS_VIDEOS).filter(v => v.deal_id === dealId && v.status === 'Approved').reduce((s,v) => s + Number(v.total), 0); }

// Sum of all approved videos' totals (stored in CAD) logged today, across every deal.
function totalEarnedTodayCad() {
  const t = todayVan();
  return ls(LS_VIDEOS).filter(v => v.date === t && v.status === 'Approved').reduce((s,v) => s + Number(v.total || 0), 0);
}

// Patch a deal's fields (e.g. { max_per_day }) and sync — goes through the same
// fresh-bundle-first pattern as every other deal mutation.
async function updateDeal(dealId, patch) {
  await withFreshBundle(() => {
    const deals = ls(LS_DEALS);
    const idx = deals.findIndex(d => d.id === dealId);
    if (idx < 0) return;
    deals[idx] = { ...deals[idx], ...patch };
    lsSet(LS_DEALS, deals);
  });
}

// ── Core video logging ──────────────────────────────────────────────
// Same logic as content.html's "+ Log Video" form. opts: { date, status, bonus, usedEditor, editorCost, notes }
async function logVideoForDeal(dealId, opts = {}) {
  const deal = getDeal(dealId);
  if (!deal) throw new Error('Deal not found: ' + dealId);

  const date       = opts.date || todayVan();
  const status     = opts.status || 'Approved';
  const manBonus   = Number(opts.bonus) || 0;
  const notes      = (opts.notes || '').trim();
  const usedEditor = !!opts.usedEditor;
  const editorCost = usedEditor ? (Number(opts.editorCost) || 3.00) : null;
  const flat       = Number(deal.rate_per_video);
  const flatCad    = dealToCad(flat, deal.currency);
  const bonusCad   = dealToCad(manBonus, deal.currency);
  const total      = flatCad + bonusCad - (usedEditor ? editorCost : 0);

  const row = {
    id: uid(), deal_id: dealId, brand_name: deal.brand_name,
    date, status, flat_rate: flatCad, view_bonus: 0, views_earned: 0, bonus: bonusCad, total, notes,
    editor_cost: editorCost,
    created_at: new Date().toISOString()
  };

  await withFreshBundle(() => {
    const videos = ls(LS_VIDEOS);
    videos.push(row);
    lsSet(LS_VIDEOS, videos);
  });

  return row;
}

// Undo the most recently logged video for a deal — but only if it was logged
// today, so this can never delete an older historical entry by accident.
// Returns the removed row, or null if there was nothing to undo.
async function undoLastVideoToday(dealId) {
  let removed = null;
  await withFreshBundle(() => {
    const videos = ls(LS_VIDEOS);
    const today = todayVan();
    let latestIdx = -1, latestTime = -Infinity;
    videos.forEach((v, i) => {
      if (v.deal_id === dealId && v.date === today) {
        const t = Date.parse(v.created_at || '') || 0;
        if (t >= latestTime) { latestTime = t; latestIdx = i; }
      }
    });
    if (latestIdx === -1) return;
    removed = videos[latestIdx];
    videos.splice(latestIdx, 1);
    lsSet(LS_VIDEOS, videos);
  });
  return removed;
}
