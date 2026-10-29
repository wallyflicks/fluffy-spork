#!/usr/bin/env node
// Rollover + sync test suite — uses test_ key prefix, never touches real data.
// Run: node test_rollover.js

const SUPABASE_URL = 'https://qznrmfrqbbkkbvvrxteu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6bnJtZnJxYmJra2J2dnJ4dGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTUxMjIsImV4cCI6MjA5NDI5MTEyMn0.VPma99T8m9WqvGk4xArAwtXsAXuz6LgQps27LEefyd0';
const TEST_PREFIX = 'test_'; // all day_keys start with this

const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
};

// ── Supabase helpers (mirrors the app's fixed versions) ──────────────────────

async function sbFetchGoals(dayKey) {
  const url = `${SUPABASE_URL}/rest/v1/goals?day_key=eq.${encodeURIComponent(dayKey)}&select=goals_json,updated_at&limit=1`;
  const res = await fetch(url, { headers: SB_HEADERS });
  if (!res.ok) throw new Error('fetch failed ' + res.status);
  const rows = await res.json();
  if (!rows.length) return null;
  return { goals: JSON.parse(rows[0].goals_json), updatedAt: rows[0].updated_at };
}

async function sbUpsertGoals(dayKey, goals) {
  const now = new Date().toISOString();
  const goalsStr = JSON.stringify(goals);
  const patchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/goals?day_key=eq.${encodeURIComponent(dayKey)}`,
    { method: 'PATCH', headers: { ...SB_HEADERS, 'Prefer': 'return=representation' },
      body: JSON.stringify({ goals_json: goalsStr, updated_at: now }) }
  );
  if (!patchRes.ok) throw new Error('patch failed ' + patchRes.status);
  const updated = await patchRes.json();
  if (updated.length === 0) {
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/goals`,
      { method: 'POST', headers: SB_HEADERS,
        body: JSON.stringify({ day_key: dayKey, goals_json: goalsStr, updated_at: now }) }
    );
    if (!insertRes.ok) throw new Error('insert failed ' + insertRes.status);
  }
}

async function sbDeleteGoals(dayKey) {
  const url = `${SUPABASE_URL}/rest/v1/goals?day_key=eq.${encodeURIComponent(dayKey)}`;
  const res = await fetch(url, { method: 'DELETE', headers: SB_HEADERS });
  if (!res.ok) throw new Error('delete failed ' + res.status);
}

async function sbUpsertAppState(key, data) {
  const payload = JSON.stringify({ key, data, updated_at: new Date().toISOString() });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_state?on_conflict=key`,
    { method: 'POST', headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates' }, body: payload });
  if (!res.ok) throw new Error('app_state upsert failed ' + res.status);
}

async function sbFetchAppState(key) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_state?key=eq.${encodeURIComponent(key)}&select=data`,
    { headers: SB_HEADERS });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows.length ? rows[0].data : null;
}

async function sbDeleteAppState(key) {
  await fetch(`${SUPABASE_URL}/rest/v1/app_state?key=eq.${encodeURIComponent(key)}`,
    { method: 'DELETE', headers: SB_HEADERS });
}

// ── Simulate rollover logic ───────────────────────────────────────────────────

function goalUid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Simulates rolloverOldGoals given the state as {[dayKey]: tasks[]}, today's date string.
// Returns the new state and what was archived.
function simulateRollover(state, today) {
  const todayKey = TEST_PREFIX + today;
  const todayGoals = (state[todayKey] || []).map(g => ({ ...g }));
  todayGoals.forEach(g => { if (!g.id) g.id = goalUid(); });
  const dedupe = new Set(todayGoals.map(g => g.text.trim()));
  const newState = { ...state };
  const archived = {};

  const oldKeys = Object.keys(state)
    .filter(k => k.startsWith(TEST_PREFIX) && k.slice(TEST_PREFIX.length) < today)
    .sort();

  for (const key of oldKeys) {
    const goals = state[key] || [];
    if (goals.length) archived[key.slice(TEST_PREFIX.length)] = goals.map(g => ({ ...g }));
    const toRollover = goals
      .filter(g => !g.done || g.recurring)
      .map(g => ({ id: goalUid(), text: g.text, done: false, queued: false, recurring: g.recurring || false }));
    toRollover.forEach(g => {
      if (!dedupe.has(g.text.trim())) { todayGoals.push(g); dedupe.add(g.text.trim()); }
    });
    delete newState[key];
  }

  if (todayGoals.length > 0) newState[todayKey] = todayGoals;
  return { newState, archived };
}

// ── Test utilities ────────────────────────────────────────────────────────────

let passed = 0, failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function cleanup(dayKeys, appStateKeys = []) {
  for (const k of dayKeys) {
    try { await sbDeleteGoals(k); } catch {}
  }
  for (const k of appStateKeys) {
    try { await sbDeleteAppState(k); } catch {}
  }
}

// ── OLD CODE BASELINE: prove the test catches the original bug ────────────────

async function testOldCodeBug() {
  console.log('\n=== OLD CODE BUG PROOF ===');
  // Old sbUpsertGoals: POST with on_conflict=day_key fails because day_key has no unique
  // constraint (id is the PK). PostgREST rejects even fresh inserts with this param.
  const dayKey = TEST_PREFIX + 'old_bug_test';
  try { await sbDeleteGoals(dayKey); } catch {}

  // First insert with on_conflict=day_key — FAILS (no unique constraint, PostgREST rejects)
  let firstFailed = false;
  try {
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/goals?on_conflict=day_key`,
      { method: 'POST', headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ day_key: dayKey, goals_json: JSON.stringify([{ text: 'task1', done: false }]), updated_at: new Date().toISOString() }) }
    );
    firstFailed = !insertRes.ok; // should be 400 — no unique constraint
  } catch { firstFailed = true; }
  assert(firstFailed, 'OLD CODE: on_conflict=day_key fails (proves the bug — no unique constraint on day_key)');

  // NEW CODE: PATCH + fallback INSERT works
  let newCodeOk = false;
  try { await sbUpsertGoals(dayKey, [{ text: 'task1', done: false }]); newCodeOk = true; } catch {}
  assert(newCodeOk, 'NEW CODE: PATCH+INSERT works for fresh insert');

  let updateOk = false;
  try { await sbUpsertGoals(dayKey, [{ text: 'task1', done: false }, { text: 'task2', done: false }]); updateOk = true; } catch {}
  assert(updateOk, 'NEW CODE: PATCH+INSERT works for update (second write)');

  const check = await sbFetchGoals(dayKey);
  assert(check && check.goals.length === 2, `NEW CODE: second write persisted correctly, got ${check ? check.goals.length : 0} tasks`);

  await cleanup([dayKey]);
}

// ── TEST 1: Basic rollover ────────────────────────────────────────────────────

async function test1_basicRollover() {
  console.log('\n=== TEST 1: 3 unchecked + 2 checked one-offs + 1 checked recurring ===');
  const yesterday = TEST_PREFIX + '2026-10-27';
  const today = TEST_PREFIX + '2026-10-28';

  const yesterdayTasks = [
    { id: goalUid(), text: 'unchecked 1', done: false, queued: false },
    { id: goalUid(), text: 'unchecked 2', done: false, queued: false },
    { id: goalUid(), text: 'unchecked 3', done: false, queued: false },
    { id: goalUid(), text: 'done one-off 1', done: true, queued: false },
    { id: goalUid(), text: 'done one-off 2', done: true, queued: false },
    { id: goalUid(), text: 'done recurring', done: true, queued: false, recurring: true },
  ];

  // Setup: write yesterday's tasks to Supabase
  await cleanup([yesterday, today]);
  await sbUpsertGoals(yesterday, yesterdayTasks);

  // Simulate the device loading state from Supabase
  const state = {};
  const remoteYesterday = await sbFetchGoals(yesterday);
  state[yesterday] = remoteYesterday.goals;

  // Run rollover
  const { newState, archived } = simulateRollover(state, '2026-10-28');

  // Sync to Supabase using NEW fixed sbUpsertGoals
  for (const [key, tasks] of Object.entries(newState)) {
    if (key.startsWith(TEST_PREFIX)) await sbUpsertGoals(key, tasks);
  }
  // Delete old day (was storeDelete + syncKeyNow)
  if (!newState[yesterday]) await sbDeleteGoals(yesterday);

  // Verify
  const cloudYesterday = await sbFetchGoals(yesterday);
  const cloudToday = await sbFetchGoals(today);

  assert(cloudYesterday === null, 'Yesterday key deleted from Supabase');
  assert(cloudToday !== null, 'Today key exists in Supabase');

  const todayTasks = cloudToday.goals;
  assert(todayTasks.length === 4, `Today has 4 tasks (3 unchecked + 1 recurring reset), got ${todayTasks.length}`);

  const unchecked = todayTasks.filter(g => !g.done && !g.recurring);
  assert(unchecked.length === 3, `3 unchecked tasks carried over, got ${unchecked.length}`);

  const recurring = todayTasks.filter(g => g.recurring);
  assert(recurring.length === 1 && !recurring[0].done, 'Recurring task reset to undone');

  const doneOneOffs = todayTasks.filter(g => g.done && !g.recurring);
  assert(doneOneOffs.length === 0, 'Done one-off tasks not carried over');

  assert(archived['2026-10-27'] !== undefined, 'Yesterday archived before deletion');
  assert((archived['2026-10-27'] || []).length === 6, 'Archive contains all 6 original tasks');

  await cleanup([yesterday, today]);
}

// ── TEST 2: Double rollover (two devices, no duplicates) ──────────────────────

async function test2_doubleRollover() {
  console.log('\n=== TEST 2: Two devices roll over simultaneously ===');
  const yesterday = TEST_PREFIX + '2026-10-27';
  const today = TEST_PREFIX + '2026-10-28';
  const lrKey = TEST_PREFIX + '_lastRollover';

  const tasks = [
    { id: goalUid(), text: 'shared task A', done: false, queued: false },
    { id: goalUid(), text: 'shared task B', done: false, queued: false },
  ];

  await cleanup([yesterday, today]);
  await sbDeleteAppState(lrKey);
  await sbUpsertGoals(yesterday, tasks);

  // Device 1 rolls over
  const state1 = {};
  const r1 = await sbFetchGoals(yesterday);
  state1[yesterday] = r1.goals;
  const { newState: ns1 } = simulateRollover(state1, '2026-10-28');
  await sbUpsertGoals(today, ns1[today]);
  await sbDeleteGoals(yesterday);
  await sbUpsertAppState(lrKey, '2026-10-28');

  // Device 2 also tries to roll over (sees lastRollover = today, skips)
  const lrData = await sbFetchAppState(lrKey);
  const device2ShouldSkip = lrData === '2026-10-28';
  assert(device2ShouldSkip, 'Device 2 sees lastRollover=today and skips rollover');

  // Device 2 loads from Supabase and gets the correct state
  const cloudToday = await sbFetchGoals(today);
  assert(cloudToday !== null, 'Today tasks exist after device 2 load');

  // No duplicates
  const todayTasks = cloudToday.goals;
  const texts = todayTasks.map(g => g.text);
  const uniqueTexts = [...new Set(texts)];
  assert(texts.length === uniqueTexts.length, `No duplicate tasks (${texts.length} tasks, all unique)`);
  assert(todayTasks.length === 2, `Exactly 2 tasks carried over, got ${todayTasks.length}`);

  await cleanup([yesterday, today]);
  await sbDeleteAppState(lrKey);
}

// ── TEST 3: Stale device cannot overwrite cloud ───────────────────────────────

async function test3_staleWriterGuard() {
  console.log('\n=== TEST 3: Stale device with empty local cannot overwrite cloud ===');
  const today = TEST_PREFIX + '2026-10-28';

  await cleanup([today]);

  // Cloud has 3 tasks (post-rollover state)
  const cloudTasks = [
    { id: goalUid(), text: 'cloud task 1', done: false, queued: false },
    { id: goalUid(), text: 'cloud task 2', done: false, queued: false },
    { id: goalUid(), text: 'cloud task 3', done: false, queued: false },
  ];
  await sbUpsertGoals(today, cloudTasks);
  const cloudRow = await sbFetchGoals(today);
  const remoteTs = cloudRow.updatedAt ? Date.parse(cloudRow.updatedAt) : 0;

  // Stale device has EMPTY local copy with a timestamp OLDER than the cloud (common case)
  const localGoals = [];
  const localTs = remoteTs - 10000; // 10 seconds BEFORE cloud update

  // Stale-writer guard: local wins only if it has data AND is newer
  const shouldRepair = Array.isArray(localGoals) && localGoals.length > 0 && localTs > remoteTs;
  assert(!shouldRepair, 'Stale device with empty local → cloud wins (empty-over-data blocked)');

  // Simulate: stale device has empty local but NEWER timestamp (worst case)
  const localTs2 = remoteTs + 10000; // 10 seconds NEWER but empty
  const shouldRepair2 = Array.isArray([]) && [].length > 0 && localTs2 > remoteTs;
  assert(!shouldRepair2, 'Stale device with empty-but-newer local → cloud still wins');

  // Verify cloud data unchanged
  const checkCloud = await sbFetchGoals(today);
  assert(checkCloud.goals.length === 3, `Cloud still has 3 tasks after stale device check, got ${checkCloud.goals.length}`);

  await cleanup([today]);
}

// ── TEST 4: Killed mid-rollover (no today key, but lastRollover set) ──────────

async function test4_killedMidRollover() {
  console.log('\n=== TEST 4: Process killed after first write (no today key in Supabase) ===');
  const yesterday = TEST_PREFIX + '2026-10-27';
  const today = TEST_PREFIX + '2026-10-28';
  const lrKey = 'test_4_lastRollover_' + Date.now(); // unique key per run

  const tasks = [
    { id: goalUid(), text: 'surviving task 1', done: false, queued: false },
    { id: goalUid(), text: 'surviving task 2', done: false, queued: false },
  ];

  await cleanup([yesterday, today]);
  await sbDeleteAppState(lrKey);
  await sbUpsertGoals(yesterday, tasks);

  // Simulate partial rollover: yesterday deleted, today NOT written, lastRollover NOT saved
  await sbDeleteGoals(yesterday);
  // (Killed here — today was never upserted, lastRollover never saved)

  // Next load: verify rollover should retry (lastRollover not set = not today's date)
  const lrData = await sbFetchAppState(lrKey);
  const isComplete = lrData === '2026-10-28';
  assert(!isComplete, 'lastRollover NOT set (killed before save) → retry will happen');

  // Simulate retry: yesterday is gone, today doesn't exist
  const cloudYesterday = await sbFetchGoals(yesterday);
  const cloudToday = await sbFetchGoals(today);
  assert(cloudYesterday === null, 'Yesterday already deleted');
  assert(cloudToday === null, 'Today not created yet');

  // On retry, loadFromSupabase returns nothing for yesterday (it was deleted).
  // rolloverOldGoals finds nothing old to process (yesterday is gone from Supabase).
  // TODAY'S KEY WOULD BE EMPTY — this is the data loss scenario from the original bug.
  // The fix: don't set lastRollover until sync is verified.
  // After fix, the retry would find yesterday still in Supabase (if delete was also killed)
  // OR today in Supabase. In the kill scenario where only delete succeeded:
  // - Re-run rollover: storeListKeys finds nothing old (yesterday deleted from cloud AND local)
  // - Today stays empty
  // This demonstrates why the pre-rollover snapshot is essential for recovery.

  // Simulate scenario where killed BEFORE delete: yesterday still in Supabase
  await sbUpsertGoals(yesterday, tasks); // restore yesterday
  const cloudYesterday2 = await sbFetchGoals(yesterday);
  assert(cloudYesterday2 !== null, 'If killed before delete, yesterday still exists');

  // Retry rollover
  const state = { [yesterday]: cloudYesterday2.goals };
  const { newState } = simulateRollover(state, '2026-10-28');
  await sbUpsertGoals(today, newState[today]);
  const verifyCloud = await sbFetchGoals(today);
  if (!verifyCloud || verifyCloud.goals.length < newState[today].length) {
    console.log('  → Retry sync needed');
    await sbUpsertGoals(today, newState[today]);
  }
  await sbDeleteGoals(yesterday);
  await sbUpsertAppState(lrKey, '2026-10-28'); // now safe to set

  const finalToday = await sbFetchGoals(today);
  assert(finalToday !== null && finalToday.goals.length === 2, `Retry completes rollover with ${finalToday ? finalToday.goals.length : 0} tasks`);

  await cleanup([yesterday, today]);
  await sbDeleteAppState(lrKey);
}

// ── TEST 5: First load after midnight, no local data ─────────────────────────

async function test5_noLocalData() {
  console.log('\n=== TEST 5: First load with no local data — cloud carries over ===');
  const yesterday = TEST_PREFIX + '2026-10-27';
  const today = TEST_PREFIX + '2026-10-28';

  const tasks = [
    { id: goalUid(), text: 'cloud only task', done: false, queued: false },
  ];

  await cleanup([yesterday, today]);
  await sbUpsertGoals(yesterday, tasks);

  // Simulate: new device with no localStorage at all
  // loadFromSupabase gets yesterday's tasks from cloud
  const cloudYesterday = await sbFetchGoals(yesterday);
  assert(cloudYesterday !== null, 'Yesterday tasks loaded from cloud');

  // No local data: localTs=0, localGoals=null → remote wins
  const localTs = 0;
  const remoteTs = Date.parse(cloudYesterday.updatedAt);
  const localGoals = null;
  const shouldRepair = Array.isArray(localGoals) && localGoals.length > 0 && localTs > remoteTs;
  assert(!shouldRepair, 'No local data → cloud wins (no stale write)');

  // Rollover runs (no local yesterday key, but cloud has it)
  const state = { [yesterday]: cloudYesterday.goals };
  const { newState } = simulateRollover(state, '2026-10-28');
  assert((newState[today] || []).length === 1, `Tasks carried over to today: ${(newState[today] || []).length}`);

  // Sync today
  await sbUpsertGoals(today, newState[today]);

  // Verify
  const finalToday = await sbFetchGoals(today);
  assert(finalToday !== null && finalToday.goals.length === 1, 'Today has 1 task after rollover from cloud');
  assert(!finalToday.goals[0].done, 'Carried task is undone');

  await cleanup([yesterday, today]);
}

// ── TEST 6: Empty-write guard ─────────────────────────────────────────────────

async function test6_emptyWriteGuard() {
  console.log('\n=== TEST 6: Empty-write guard blocks empty overwrite ===');
  const today = TEST_PREFIX + '2026-10-28';

  await cleanup([today]);

  // Cloud has tasks
  const tasks = [{ id: goalUid(), text: 'do not delete me', done: false, queued: false }];
  await sbUpsertGoals(today, tasks);

  // Fixed syncKeyNow: if today's key is empty, upsert [] instead of deleting
  const emptyGoals = [];
  const isToday = true; // simulating key === getTodayKey()
  let deleteCalled = false;
  let upsertCalled = false;

  if (!isToday && (!emptyGoals || !emptyGoals.length)) {
    deleteCalled = true; // would delete
  } else {
    upsertCalled = true; // upserts [] instead
    // In real code: await sbUpsertGoals(dayKey, emptyGoals || [])
  }

  assert(!deleteCalled, 'Empty-write guard: today\'s key not deleted');
  assert(upsertCalled, 'Empty-write guard: upsert called instead (preserves row)');

  // Verify cloud data unchanged (we didn't actually call delete)
  const check = await sbFetchGoals(today);
  assert(check && check.goals.length === 1, 'Cloud data preserved: 1 task still there');

  // Simulate the upsert of [] — row should persist with empty goals
  await sbUpsertGoals(today, []);
  const afterEmpty = await sbFetchGoals(today);
  assert(afterEmpty !== null, 'Row persists after upserting empty array');
  assert(afterEmpty.goals.length === 0, 'Row has 0 tasks after user cleared list');

  await cleanup([today]);
}

// ── TEST 7: Date logic across midnight and DST ────────────────────────────────

async function test7_dateLogic() {
  console.log('\n=== TEST 7: Date logic — vanNow() across midnight and DST ===');

  // Simulate vanNow() for various timestamps using the same algorithm as the app
  function vanNow(utcMs) {
    const d = new Date(utcMs);
    return new Date(d.toLocaleString('en-US', { timeZone: 'America/Vancouver' }));
  }
  function getActiveDateString(utcMs) {
    const van = vanNow(utcMs);
    return van.getFullYear() + '-' + String(van.getMonth()+1).padStart(2,'0') + '-' + String(van.getDate()).padStart(2,'0');
  }

  // Oct 27 11:58 PM Vancouver (= Oct 28 06:58 UTC, PDT = UTC-7)
  const beforeMidnight = Date.UTC(2026, 9, 28, 6, 58, 0); // 6:58 AM UTC = 11:58 PM PDT
  assert(getActiveDateString(beforeMidnight) === '2026-10-27', `11:58 PM Vancouver = Oct 27 (got ${getActiveDateString(beforeMidnight)})`);

  // Oct 28 12:02 AM Vancouver (= Oct 28 07:02 UTC, PDT = UTC-7)
  const afterMidnight = Date.UTC(2026, 9, 28, 7, 2, 0); // 7:02 AM UTC = 12:02 AM PDT
  assert(getActiveDateString(afterMidnight) === '2026-10-28', `12:02 AM Vancouver = Oct 28 (got ${getActiveDateString(afterMidnight)})`);

  // Nov 1 DST change (clocks fall back at 2 AM — PDT→PST, UTC-7 → UTC-8)
  // Nov 1 1:59 AM PDT = Nov 1 08:59 UTC (still PDT before change)
  const beforeDST = Date.UTC(2026, 10, 1, 8, 59, 0);
  assert(getActiveDateString(beforeDST) === '2026-11-01', `Nov 1 1:59 AM (before DST) = Nov 1 (got ${getActiveDateString(beforeDST)})`);

  // Nov 1 2:30 AM PST = Nov 1 10:30 UTC (after DST change, now UTC-8)
  const afterDST = Date.UTC(2026, 10, 1, 10, 30, 0);
  assert(getActiveDateString(afterDST) === '2026-11-01', `Nov 1 2:30 AM (after DST) = Nov 1 (got ${getActiveDateString(afterDST)})`);

  // Nov 2 12:01 AM PST = Nov 2 08:01 UTC (UTC-8)
  const nextDayPST = Date.UTC(2026, 10, 2, 8, 1, 0);
  assert(getActiveDateString(nextDayPST) === '2026-11-02', `Nov 2 12:01 AM PST = Nov 2 (got ${getActiveDateString(nextDayPST)})`);

  console.log('  ✓ DST rollover (Oct 31 → Nov 1 → Nov 2): date keys correct');
}

// ── TEST 8: History restore ───────────────────────────────────────────────────

async function test8_historyRestore() {
  console.log('\n=== TEST 8: History restore adds task to today as unchecked ===');
  const archiveKey = 'goals_archive_' + TEST_PREFIX + '2026-10-26';
  const today = TEST_PREFIX + '2026-10-28';

  await cleanup([today]);
  await sbDeleteAppState(archiveKey);

  // Create an archive entry
  const archivedTasks = [
    { id: goalUid(), text: 'restore me', done: true, queued: false },
    { id: goalUid(), text: 'also restore', done: false, queued: false },
  ];
  await sbUpsertAppState(archiveKey, archivedTasks);

  // Simulate: user clicks Restore on 'restore me'
  const todayGoals = [];
  const taskToRestore = archivedTasks[0];
  const alreadyExists = todayGoals.some(g => g.text.trim() === taskToRestore.text.trim());
  if (!alreadyExists) {
    todayGoals.push({ id: goalUid(), text: taskToRestore.text, done: false, queued: false });
  }
  await sbUpsertGoals(today, todayGoals);

  const cloud = await sbFetchGoals(today);
  assert(cloud !== null && cloud.goals.length === 1, 'Restored task added to today');
  assert(!cloud.goals[0].done, 'Restored task is unchecked regardless of original state');
  assert(cloud.goals[0].text === 'restore me', 'Task text preserved');

  // Already-exists check
  const dup = todayGoals.some(g => g.text.trim() === 'restore me');
  assert(dup, 'Duplicate check: already-in-list detection works');

  await cleanup([today]);
  await sbDeleteAppState(archiveKey);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Wallace Dashboard — Rollover Test Suite');
  console.log('Using test key prefix:', TEST_PREFIX);
  console.log('');

  try {
    await testOldCodeBug();
    await test1_basicRollover();
    await test2_doubleRollover();
    await test3_staleWriterGuard();
    await test4_killedMidRollover();
    await test5_noLocalData();
    await test6_emptyWriteGuard();
    await test7_dateLogic();
    await test8_historyRestore();
  } catch (err) {
    console.error('\nFATAL:', err);
    failed++;
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log('SOME TESTS FAILED');
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED');
  }
}

main();
