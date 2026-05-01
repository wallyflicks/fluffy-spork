// ── Achievement Definitions ───────────────────────────────────────────────────
// path: SVG path string(s) for the icon (24x24 viewBox, stroke style)
// fill: true = use fill, false = use stroke only

export const ACHIEVEMENTS = [
  // ── First Steps ────────────────────────────────────────────────────────────
  {
    id: 'first_word', name: 'First Word', group: 'First Steps',
    desc: 'Completed your first ever session',
    condition: 'Complete your first session',
    path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  },
  {
    id: 'clean_start', name: 'Clean Start', group: 'First Steps',
    desc: 'Finished a session with zero filler words',
    condition: 'Complete a session with zero filler words',
    path: ['M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z', 'M9 12l2 2 4-4'],
  },
  {
    id: 'quick_thinker', name: 'Quick Thinker', group: 'First Steps',
    desc: 'Answered in under 45 seconds',
    condition: 'Complete a session in under 45 seconds',
    path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    id: 'roast_survivor', name: 'Roast Survivor', group: 'First Steps',
    desc: 'Completed a Roast mode session',
    condition: 'Complete a session in Roast mode',
    path: 'M12 22C6.5 22 2 17.5 2 12c0-3 1.5-5.5 3-7.5.5 1.5 1.5 2.5 2.5 3C7 5 10 3 12 2c1.5 3.5 4 5.5 4 9.5.5-1 .5-2 .3-3 1.7 2 3.7 4.5 3.7 6.5 0 4.4-3.6 7.5-7.7 7.5z',
  },
  {
    id: 'explorer', name: 'Explorer', group: 'First Steps',
    desc: 'Tried every available category',
    condition: 'Complete at least one session in every category',
    path: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M16.24 7.76l-5.66 2.83-2.83 5.66L12 12l4.24-4.24z'],
  },

  // ── Score Milestones ───────────────────────────────────────────────────────
  {
    id: 'getting_there', name: 'Getting There', group: 'Score Milestones',
    desc: 'Scored 70 or above for the first time',
    condition: 'Score 70 or above',
    path: 'M12 19V5m0 0-7 7m7-7 7 7',
  },
  {
    id: 'sharp', name: 'Sharp', group: 'Score Milestones',
    desc: 'Scored 80 or above for the first time',
    condition: 'Score 80 or above',
    path: 'M12 2l9.09 9.09L12 22 2.91 11.09z',
  },
  {
    id: 'excellent', name: 'Excellent', group: 'Score Milestones',
    desc: 'Scored 85 or above for the first time',
    condition: 'Score 85 or above',
    path: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17.2l-6.2 4.1 2.4-7.4L2 9.4h7.6z',
  },
  {
    id: 'elite', name: 'Elite', group: 'Score Milestones',
    desc: 'Scored 90 or above for the first time',
    condition: 'Score 90 or above',
    path: ['M3 19h18', 'M5 19V11l7-8 7 8v8'],
  },
  {
    id: 'perfect_run', name: 'Perfect Run', group: 'Score Milestones',
    desc: 'Scored 95 or above for the first time',
    condition: 'Score 95 or above',
    path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zm7.5-1.5-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
  },
  {
    id: 'debate_champion', name: 'Debate Champion', group: 'Score Milestones',
    desc: 'Scored 85+ on a Hard Debate prompt',
    condition: 'Score 85+ on a Hard Debate session',
    path: ['M3 6h18', 'M8 6V4h8v2', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'],
  },
  {
    id: 'business_ready', name: 'Business Ready', group: 'Score Milestones',
    desc: 'Scored 85+ on a Hard Business prompt',
    condition: 'Score 85+ on a Hard Business session',
    path: ['M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'],
  },
  {
    id: 'case_closed', name: 'Case Closed', group: 'Score Milestones',
    desc: 'Scored 85+ on a Case Competition prompt',
    condition: 'Score 85+ on a Case Competition session',
    path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9 12l2 2 4-4'],
  },
  {
    id: 'interview_ready', name: 'Interview Ready', group: 'Score Milestones',
    desc: 'Scored 85+ on a Hard Interview prompt',
    condition: 'Score 85+ on a Hard Interview session',
    path: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  },

  // ── Consistency ────────────────────────────────────────────────────────────
  {
    id: 'on_a_roll', name: 'On a Roll', group: 'Consistency',
    desc: 'Completed 3 sessions in a single day',
    condition: 'Complete 3 sessions in one day',
    path: ['M5 12a7 7 0 1 0 0-.01', 'M12 12a7 7 0 1 0 0-.01', 'M19 12a7 7 0 1 0 0-.01'],
  },
  {
    id: 'coming_back', name: 'Coming Back', group: 'Consistency',
    desc: 'Practiced on 3 different days',
    condition: 'Complete sessions on 3 different calendar days',
    path: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  },
  {
    id: 'week_warrior', name: 'Week Warrior', group: 'Consistency',
    desc: 'Maintained a 7-day streak',
    condition: 'Practice every day for 7 days in a row',
    path: ['M3 17h4V9H3z', 'M10 17h4V5h-4z', 'M17 17h4v-8h-4z'],
  },
  {
    id: 'two_week_run', name: 'Two Week Run', group: 'Consistency',
    desc: 'Maintained a 14-day streak',
    condition: 'Practice every day for 14 days in a row',
    path: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'],
  },
  {
    id: 'monthly_legend', name: 'Monthly Legend', group: 'Consistency',
    desc: 'Maintained a 30-day streak',
    condition: 'Practice every day for 30 days in a row',
    path: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  },
  {
    id: 'twenty_down', name: 'Twenty Down', group: 'Consistency',
    desc: 'Completed 20 total sessions',
    condition: 'Complete 20 sessions total',
    path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v4l3 3'],
  },
  {
    id: 'fifty_strong', name: 'Fifty Strong', group: 'Consistency',
    desc: 'Completed 50 total sessions',
    condition: 'Complete 50 sessions total',
    path: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6m6 0h1.5a2.5 2.5 0 0 1 0 5H12m0 0H9.5A2.5 2.5 0 0 0 7 11.5v0A2.5 2.5 0 0 0 9.5 14H12m0-9v14m6-9h1.5a2.5 2.5 0 0 1 0 5H18',
  },
  {
    id: 'centurion', name: 'Centurion', group: 'Consistency',
    desc: 'Completed 100 total sessions',
    condition: 'Complete 100 sessions total',
    path: ['M6 3v18', 'M21 3H6l6 9-6 9h15'],
  },

  // ── Improvement ────────────────────────────────────────────────────────────
  {
    id: 'glow_up', name: 'Glow Up', group: 'Improvement',
    desc: 'Improved score by 15+ points vs your previous session in the same category',
    condition: 'Improve by 15+ points compared to your previous session in the same category',
    path: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
  },
  {
    id: 'consistency_king', name: 'Consistency King', group: 'Improvement',
    desc: 'Scored within 5 points of your average across 10 sessions in a row',
    condition: 'Score within 5 points of your average for 10 consecutive sessions',
    path: ['M8 6h13', 'M8 12h13', 'M8 18h13'],
  },
  {
    id: 'filler_slayer', name: 'Filler Slayer', group: 'Improvement',
    desc: 'Went from 8+ fillers in one session to 0 in the very next session',
    condition: 'Go from 8+ filler words to zero in your very next session',
    path: ['M18 6 6 18', 'M6 6l12 12'],
  },
  {
    id: 'speed_demon', name: 'Speed Demon', group: 'Improvement',
    desc: 'Spoke at 160+ WPM with a score above 75',
    condition: 'Speak at 160+ words per minute with a score over 75',
    path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  },
  {
    id: 'slow_burn', name: 'Slow Burn', group: 'Improvement',
    desc: 'Spoke at under 120 WPM with a score above 80',
    condition: 'Speak under 120 words per minute with a score over 80',
    path: ['M6 2v6', 'M18 2v6', 'M6 22v-6', 'M18 22v-6', 'M6 8h12l-6 4 6 4H6'],
  },
  {
    id: 'comeback_kid', name: 'Comeback Kid', group: 'Improvement',
    desc: 'Scored below 50 then above 80 in your very next session',
    condition: 'Score below 50 then score above 80 in the very next session',
    path: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  },
  {
    id: 'hard_mode_hero', name: 'Hard Mode Hero', group: 'Improvement',
    desc: 'Completed 10 Hard difficulty sessions',
    condition: 'Complete 10 sessions on Hard difficulty',
    path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9 12l2 2 4-4M12 8v1'],
  },
  {
    id: 'voice_type_unlocked', name: 'Voice Type Unlocked', group: 'Improvement',
    desc: 'Got your speaking voice type revealed',
    condition: 'Complete 5 sessions to reveal your speaking type',
    path: ['M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  },

  // ── Social ─────────────────────────────────────────────────────────────────
  {
    id: 'leaderboard', name: 'Leaderboard', group: 'Social',
    desc: 'Posted a score to the global leaderboard',
    condition: 'Post a score to the global leaderboard',
    path: ['M8 17H2v5h6v-5z', 'M15 11H9v11h6V11z', 'M22 5h-6v17h6V5z'],
  },
  {
    id: 'top_10', name: 'Top 10', group: 'Social',
    desc: 'Appeared in the global top 10',
    condition: 'Appear in the global top 10 on the leaderboard',
    path: ['M8.21 13.89 7 23l5-3 5 3-1.21-9.11', 'M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z'],
  },
  {
    id: 'roast_royale', name: 'Roast Royale', group: 'Social',
    desc: 'Completed 5 Roast mode sessions',
    condition: 'Complete 5 sessions in Roast mode',
    path: 'M5 21h14M3 13l4-7 5 4 5-4 4 7H3z',
  },
  {
    id: 'challenge_accepted', name: 'Challenge Accepted', group: 'Social',
    desc: 'Completed a friend challenge session',
    condition: 'Complete a challenge from a friend',
    path: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
  },
  {
    id: 'head_to_head', name: 'Head to Head', group: 'Social',
    desc: 'Completed a head-to-head session',
    condition: 'Complete a head-to-head session against another speaker',
    path: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  },
]

// ── Checker ───────────────────────────────────────────────────────────────────
// sessions: full array (including newSession already appended)
// newSession: the session just completed

export function checkNewAchievements(sessions, newSession) {
  const stored = JSON.parse(localStorage.getItem('orivox_achievements') || '[]')
  const unlockedIds = new Set(stored.map(a => a.id))
  const now = new Date().toLocaleDateString('en-CA')
  const newly = []

  const unlock = (id) => {
    if (unlockedIds.has(id)) return
    const ach = ACHIEVEMENTS.find(a => a.id === id)
    if (!ach) return
    unlockedIds.add(id)
    stored.push({ id, unlockedAt: now })
    newly.push(ach)
  }

  const score = newSession.displayScore ?? newSession.score ?? 0
  const allCategories = ['General','Interview','Storytelling','Debate','Business','Motivational','Law','Politics','Case Competition']

  // ── First Steps ──────────────────────────────────────────────────────────
  if (sessions.length >= 1)                        unlock('first_word')
  if ((newSession.fillerWordCount ?? 0) === 0)     unlock('clean_start')
  if ((newSession.speakDuration ?? 999) <= 45)     unlock('quick_thinker')
  if (newSession.category === 'Roast')             unlock('roast_survivor')

  const practicedCats = new Set(sessions.map(s => s.category))
  if (allCategories.every(c => practicedCats.has(c)))  unlock('explorer')

  // ── Score Milestones ─────────────────────────────────────────────────────
  if (score >= 70)  unlock('getting_there')
  if (score >= 80)  unlock('sharp')
  if (score >= 85)  unlock('excellent')
  if (score >= 90)  unlock('elite')
  if (score >= 95)  unlock('perfect_run')

  if (score >= 85 && newSession.difficulty === 'Hard' && newSession.category === 'Debate')           unlock('debate_champion')
  if (score >= 85 && newSession.difficulty === 'Hard' && newSession.category === 'Business')         unlock('business_ready')
  if (score >= 85 && newSession.category === 'Case Competition')                                     unlock('case_closed')
  if (score >= 85 && newSession.difficulty === 'Hard' && newSession.category === 'Interview')        unlock('interview_ready')

  // ── Consistency ──────────────────────────────────────────────────────────
  const todaySessions = sessions.filter(s => s.date === now)
  if (todaySessions.length >= 3)  unlock('on_a_roll')

  const uniqueDays = new Set(sessions.map(s => s.date))
  if (uniqueDays.size >= 3)   unlock('coming_back')

  const streak = parseInt(localStorage.getItem('orivox_streak_count') || '0', 10)
  if (streak >= 7)   unlock('week_warrior')
  if (streak >= 14)  unlock('two_week_run')
  if (streak >= 30)  unlock('monthly_legend')

  if (sessions.length >= 20)   unlock('twenty_down')
  if (sessions.length >= 50)   unlock('fifty_strong')
  if (sessions.length >= 100)  unlock('centurion')

  // ── Improvement ──────────────────────────────────────────────────────────
  // Glow Up: 15+ point improvement vs previous session in same category
  const prevSameCat = sessions.filter(s => s.category === newSession.category && s.id !== newSession.id)
  if (prevSameCat.length > 0) {
    const prev = prevSameCat[prevSameCat.length - 1]
    const prevScore = prev.displayScore ?? prev.score ?? 0
    if (score - prevScore >= 15)  unlock('glow_up')
  }

  // Consistency King: within 5 of average for last 10 sessions
  if (sessions.length >= 10) {
    const last10 = sessions.slice(-10)
    const avg = last10.reduce((s, x) => s + (x.displayScore ?? x.score ?? 0), 0) / 10
    if (last10.every(s => Math.abs((s.displayScore ?? s.score ?? 0) - avg) <= 5))  unlock('consistency_king')
  }

  // Filler Slayer: 8+ fillers → 0 in next session
  if (sessions.length >= 2) {
    const prevSession = sessions[sessions.length - 2]
    if ((prevSession.fillerWordCount ?? 0) >= 8 && (newSession.fillerWordCount ?? 0) === 0 &&
        prevSession.category === newSession.category)  unlock('filler_slayer')
  }

  // Speed Demon / Slow Burn
  const wpm = newSession.wpm ?? 0
  if (wpm >= 160 && score > 75)   unlock('speed_demon')
  if (wpm > 0 && wpm < 120 && score > 80)  unlock('slow_burn')

  // Comeback Kid: <50 then >80
  if (sessions.length >= 2) {
    const prev = sessions[sessions.length - 2]
    const prevScore = prev.displayScore ?? prev.score ?? 0
    if (prevScore < 50 && score > 80)  unlock('comeback_kid')
  }

  // Hard Mode Hero: 10 Hard sessions
  const hardCount = sessions.filter(s => s.difficulty === 'Hard').length
  if (hardCount >= 10)  unlock('hard_mode_hero')

  // Voice Type Unlocked
  if (localStorage.getItem('orivox_voice_type'))  unlock('voice_type_unlocked')

  // ── Social (leaderboard checked separately in the post flow) ─────────────
  if (localStorage.getItem('orivox_leaderboard_posted'))  unlock('leaderboard')

  localStorage.setItem('orivox_achievements', JSON.stringify(stored))
  return newly
}
