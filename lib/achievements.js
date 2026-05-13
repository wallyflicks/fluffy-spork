// ── Achievement Definitions ───────────────────────────────────────────────────
// path: SVG path string(s) for the icon (24x24 viewBox, stroke style)

export const ACHIEVEMENTS = [
  // ── First Steps ─────────────────────────────────────────────────────────────
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
    id: 'explorer', name: 'Explorer', group: 'First Steps',
    desc: 'Tried every available category',
    condition: 'Complete at least one session in every category',
    path: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M16.24 7.76l-5.66 2.83-2.83 5.66L12 12l4.24-4.24z'],
  },

  // ── Score Milestones ────────────────────────────────────────────────────────
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
    id: 'interview_ace', name: 'Interview Ace', group: 'Score Milestones',
    desc: 'Scored 85+ on a Hard Interview prompt',
    condition: 'Score 85+ on a Hard Interview session',
    path: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  },
  {
    id: 'clean_sheet', name: 'Clean Sheet', group: 'Score Milestones',
    desc: 'Completed a session with zero filler words and zero hedging phrases',
    condition: 'Finish a session with no fillers and no hedging language',
    path: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'],
  },
  {
    id: 'hard_earned', name: 'Hard Earned', group: 'Score Milestones',
    desc: 'Scored above 85 on a Hard difficulty session',
    condition: 'Score 85+ on any Hard difficulty session',
    path: ['M3 17l5-10 4 6 3-4 5 8H3z'],
  },
  {
    id: 'clutch', name: 'Clutch', group: 'Score Milestones',
    desc: 'Scored above 85 after a previous session in the same category scored below 40',
    condition: 'Bounce back from below 40 to above 85 in the same category',
    path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  },

  // ── Consistency ─────────────────────────────────────────────────────────────
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

  // ── Improvement ─────────────────────────────────────────────────────────────
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

  // ── Exploration ─────────────────────────────────────────────────────────────
  {
    id: 'law_student', name: 'Law Student', group: 'Exploration',
    desc: 'Completed 5 Law sessions',
    condition: 'Complete 5 sessions in the Law category',
    path: ['M12 3l-8 4v5c0 5.25 3.41 10.16 8 12 4.59-1.84 8-6.75 8-12V7l-8-4z'],
  },
  {
    id: 'politician', name: 'Politician', group: 'Exploration',
    desc: 'Completed 5 Politics sessions',
    condition: 'Complete 5 sessions in the Politics category',
    path: ['M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M8 21h8', 'M12 19v2'],
  },
  {
    id: 'storyteller_pro', name: 'Storyteller Pro', group: 'Exploration',
    desc: 'Completed 5 Storytelling sessions',
    condition: 'Complete 5 sessions in the Storytelling category',
    path: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3-3h7z'],
  },
  {
    id: 'motivator', name: 'Motivator', group: 'Exploration',
    desc: 'Completed 5 Motivational sessions',
    condition: 'Complete 5 sessions in the Motivational category',
    path: ['M18 8h1a4 4 0 0 1 0 8h-1', 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z', 'M6 1v3', 'M10 1v3', 'M14 1v3'],
  },
  {
    id: 'news_junkie', name: 'News Junkie', group: 'Exploration',
    desc: 'Completed 3 News prompt sessions',
    condition: 'Complete 3 sessions using a news headline prompt',
    path: ['M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M7 7h10', 'M7 11h10', 'M7 15h6'],
  },
  {
    id: 'script_reader', name: 'Script Reader', group: 'Exploration',
    desc: 'Completed your first Script mode session',
    condition: 'Complete a session using Script mode',
    path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  },
  {
    id: 'warmed_up', name: 'Warmed Up', group: 'Exploration',
    desc: 'Completed a vocal warm-up before a session',
    condition: 'Do a vocal warm-up before starting a session',
    path: ['M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M4.93 22.93l3.54-3.54', 'M19.07 22.93l-3.54-3.54', 'M12 19v4'],
  },
  {
    id: 'eye_contact_badge', name: 'Eye Contact', group: 'Exploration',
    desc: 'Completed a session with eye contact tracking enabled',
    condition: 'Enable eye tracking and complete a session',
    path: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  },
  {
    id: 'night_owl', name: 'Night Owl', group: 'Exploration',
    desc: 'Completed a session between midnight and 5am',
    condition: 'Practice between midnight and 5am',
    path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  },
  {
    id: 'early_bird', name: 'Early Bird', group: 'Exploration',
    desc: 'Completed a session before 7am',
    condition: 'Practice before 7am',
    path: ['M12 2v2', 'M12 20v2', 'M4.93 4.93l1.41 1.41', 'M17.66 17.66l1.41 1.41', 'M2 12h2', 'M20 12h2', 'M6.34 17.66l-1.41 1.41', 'M19.07 4.93l-1.41 1.41', 'M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z'],
  },
  {
    id: 'weekend_warrior', name: 'Weekend Warrior', group: 'Exploration',
    desc: 'Completed sessions on both Saturday and Sunday of the same weekend',
    condition: 'Practice on both Saturday and Sunday of the same weekend',
    path: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 14h2v2H8z', 'M14 14h2v2h-2z'],
  },
  {
    id: 'lunchtime_learner', name: 'Lunchtime Learner', group: 'Exploration',
    desc: 'Completed a session between 12pm and 1pm',
    condition: 'Practice during your lunch hour (12–1pm)',
    path: ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z', 'M12 6v6', 'M12 12h4'],
  },

  // ── Programs ─────────────────────────────────────────────────────────────────
  {
    id: 'cert_filler_word_champion', name: 'Filler Word Champion', group: 'Programs',
    desc: 'Completed the Filler Word Eliminator program',
    condition: 'Finish the Filler Word Eliminator 7-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_first_words_graduate', name: 'First Words Graduate', group: 'Programs',
    desc: 'Completed the First Words program',
    condition: 'Finish the First Words 7-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_quick_thinker_prog', name: 'Quick Thinker (Program)', group: 'Programs',
    desc: 'Completed the Quick Thinker program',
    condition: 'Finish the Quick Thinker 7-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_confidence_starter', name: 'Confidence Starter', group: 'Programs',
    desc: 'Completed the Confidence Starter program',
    condition: 'Finish the Confidence Starter 10-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_structure_master', name: 'Structure Master', group: 'Programs',
    desc: 'Completed the Structure Master program',
    condition: 'Finish the Structure Master 14-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_interview_ready', name: 'Interview Ready (Program)', group: 'Programs',
    desc: 'Completed the Interview Ready program',
    condition: 'Finish the Interview Ready 21-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_debate_foundations_graduate', name: 'Debate Foundations Graduate', group: 'Programs',
    desc: 'Completed the Debate Foundations program',
    condition: 'Finish the Debate Foundations 14-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_storyteller', name: 'Storyteller', group: 'Programs',
    desc: 'Completed the Storytelling Basics program',
    condition: 'Finish the Storytelling Basics 10-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_business_communicator', name: 'Business Communicator', group: 'Programs',
    desc: 'Completed the Business Communication program',
    condition: 'Finish the Business Communication 21-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_case_competition_champion', name: 'Case Competition Champion', group: 'Programs',
    desc: 'Completed the Case Competition Mastery program',
    condition: 'Finish the Case Competition Mastery 30-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_filler_free', name: 'Filler Free', group: 'Programs',
    desc: 'Completed the Filler Word Advanced program',
    condition: 'Finish the Filler Word Advanced 14-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_wordsmith', name: 'Wordsmith', group: 'Programs',
    desc: 'Completed the Vocabulary Builder program',
    condition: 'Finish the Vocabulary Builder 14-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_pressure_tested', name: 'Pressure Tested', group: 'Programs',
    desc: 'Completed the Pressure Training program',
    condition: 'Finish the Pressure Training 21-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_leadership_voice', name: 'Leadership Voice', group: 'Programs',
    desc: 'Completed the Leadership Voice program',
    condition: 'Finish the Leadership Voice 21-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'cert_political_speaker', name: 'Political Speaker', group: 'Programs',
    desc: 'Completed the Political Speaker program',
    condition: 'Finish the Political Speaker 14-day program',
    path: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'],
  },
  {
    id: 'program_collector', name: 'Program Collector', group: 'Programs',
    desc: 'Completed 3 different programs',
    condition: 'Finish any 3 programs',
    path: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2z'],
  },
  {
    id: 'dedicated', name: 'Dedicated', group: 'Programs',
    desc: 'Completed 5 different programs',
    condition: 'Finish any 5 programs',
    path: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2z'],
  },
  {
    id: 'completionist', name: 'Completionist', group: 'Programs',
    desc: 'Completed all 15 programs',
    condition: 'Finish every single program on Orivox',
    path: ['M2 4l4 8 6-10 6 10 4-8v14H2z'],
  },

  // ── Challenge ────────────────────────────────────────────────────────────────
  {
    id: 'challenger', name: 'Challenger', group: 'Challenge',
    desc: 'Sent your first friend challenge',
    condition: 'Challenge a friend to beat your score',
    path: ['M14.5 17.5L3 6V3h3l11.5 11.5', 'M13 19l2-2', 'M6 6l2-2', 'M17.5 21.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  },
  {
    id: 'accepted', name: 'Accepted', group: 'Challenge',
    desc: 'Completed a received challenge session',
    condition: 'Accept and complete a challenge from a friend',
    path: 'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z',
  },
  {
    id: 'friendly_rival', name: 'Friendly Rival', group: 'Challenge',
    desc: 'Completed 10 challenge sessions total',
    condition: 'Complete 10 challenge sessions',
    path: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  },
]

// Program cert ID → achievement ID map
export const PROGRAM_CERT_MAP = {
  'filler-word-eliminator':    'cert_filler_word_champion',
  'first-words':               'cert_first_words_graduate',
  'quick-thinker':             'cert_quick_thinker_prog',
  'confidence-starter':        'cert_confidence_starter',
  'structure-master':          'cert_structure_master',
  'interview-ready':           'cert_interview_ready',
  'debate-foundations':        'cert_debate_foundations_graduate',
  'storytelling-basics':       'cert_storyteller',
  'business-communication':    'cert_business_communicator',
  'case-competition-mastery':  'cert_case_competition_champion',
  'filler-word-advanced':      'cert_filler_free',
  'vocabulary-builder':        'cert_wordsmith',
  'pressure-training':         'cert_pressure_tested',
  'leadership-voice':          'cert_leadership_voice',
  'political-speaker':         'cert_political_speaker',
}

// ── Checker ───────────────────────────────────────────────────────────────────
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

  // ── First Steps ─────────────────────────────────────────────────────────────
  if (sessions.length >= 1) unlock('first_word')
  if ((newSession.fillerWordCount ?? 0) === 0) unlock('clean_start')
  if ((newSession.speakDuration ?? 999) <= 45) unlock('quick_thinker')
  const practicedCats = new Set(sessions.map(s => s.category))
  if (allCategories.every(c => practicedCats.has(c))) unlock('explorer')

  // ── Score Milestones ─────────────────────────────────────────────────────────
  if (score >= 70) unlock('getting_there')
  if (score >= 80) unlock('sharp')
  if (score >= 85) unlock('excellent')
  if (score >= 90) unlock('elite')
  if (score >= 95) unlock('perfect_run')
  if (score >= 85 && newSession.difficulty === 'Hard' && newSession.category === 'Debate')    unlock('debate_champion')
  if (score >= 85 && newSession.difficulty === 'Hard' && newSession.category === 'Business')  unlock('business_ready')
  if (score >= 85 && newSession.category === 'Case Competition')                              unlock('case_closed')
  if (score >= 85 && newSession.difficulty === 'Hard' && newSession.category === 'Interview') unlock('interview_ace')
  if ((newSession.fillerWordCount ?? 0) === 0 && (newSession.hedgingCount ?? 0) === 0 && sessions.length > 0) unlock('clean_sheet')
  if (score >= 85 && newSession.difficulty === 'Hard') unlock('hard_earned')
  if (sessions.length >= 2) {
    const prev = sessions.slice(-2, -1)[0] ?? null
    const prevSc = prev ? (prev.displayScore ?? prev.score ?? 0) : 99
    if (prev?.category === newSession.category && prevSc < 40 && score > 85) unlock('clutch')
  }

  // ── Consistency ──────────────────────────────────────────────────────────────
  const todaySessions = sessions.filter(s => s.date === now)
  if (todaySessions.length >= 3) unlock('on_a_roll')
  const uniqueDays = new Set(sessions.map(s => s.date))
  if (uniqueDays.size >= 3) unlock('coming_back')
  const streak = parseInt(localStorage.getItem('orivox_streak_count') || '0', 10)
  if (streak >= 7)  unlock('week_warrior')
  if (streak >= 14) unlock('two_week_run')
  if (streak >= 30) unlock('monthly_legend')
  if (sessions.length >= 20)  unlock('twenty_down')
  if (sessions.length >= 50)  unlock('fifty_strong')
  if (sessions.length >= 100) unlock('centurion')

  // ── Improvement ─────────────────────────────────────────────────────────────
  const prevSameCat = sessions.filter(s => s.category === newSession.category && s.id !== newSession.id)
  if (prevSameCat.length > 0) {
    const prev = prevSameCat[prevSameCat.length - 1]
    if (score - (prev.displayScore ?? prev.score ?? 0) >= 15) unlock('glow_up')
  }
  if (sessions.length >= 10) {
    const last10 = sessions.slice(-10)
    const avg = last10.reduce((s, x) => s + (x.displayScore ?? x.score ?? 0), 0) / 10
    if (last10.every(s => Math.abs((s.displayScore ?? s.score ?? 0) - avg) <= 5)) unlock('consistency_king')
  }
  if (sessions.length >= 2) {
    const prev = sessions[sessions.length - 2]
    if ((prev.fillerWordCount ?? 0) >= 8 && (newSession.fillerWordCount ?? 0) === 0 &&
        prev.category === newSession.category) unlock('filler_slayer')
  }
  const wpm = newSession.wpm ?? 0
  if (wpm >= 160 && score > 75) unlock('speed_demon')
  if (wpm > 0 && wpm < 120 && score > 80) unlock('slow_burn')
  if (sessions.length >= 2) {
    const prev = sessions[sessions.length - 2]
    if ((prev.displayScore ?? prev.score ?? 0) < 50 && score > 80) unlock('comeback_kid')
  }
  if (sessions.filter(s => s.difficulty === 'Hard').length >= 10) unlock('hard_mode_hero')
  if (localStorage.getItem('orivox_voice_type')) unlock('voice_type_unlocked')

  // ── Exploration ──────────────────────────────────────────────────────────────
  const catCount = (cat) => sessions.filter(s => s.category === cat).length
  if (catCount('Law') >= 5)          unlock('law_student')
  if (catCount('Politics') >= 5)     unlock('politician')
  if (catCount('Storytelling') >= 5) unlock('storyteller_pro')
  if (catCount('Motivational') >= 5) unlock('motivator')
  if (catCount('News') >= 3)         unlock('news_junkie')
  if (newSession.category === 'Script') unlock('script_reader')
  if (newSession.warmupDone)         unlock('warmed_up')
  if (newSession.eyeContactPercent != null) unlock('eye_contact_badge')

  // Time-based badges using session ID as timestamp
  try {
    const ts = parseInt(newSession.id)
    if (!isNaN(ts)) {
      const d = new Date(ts)
      const h = d.getHours()
      if (h >= 0 && h < 5)    unlock('night_owl')
      if (h < 7)               unlock('early_bird')
      if (h === 12)            unlock('lunchtime_learner')
      // Weekend warrior — check if both Sat and Sun appear in same week across all sessions
      const weekendSessions = sessions.map(s => {
        const t = parseInt(s.id)
        if (isNaN(t)) return null
        const sd = new Date(t)
        const day = sd.getDay() // 0=Sun,6=Sat
        if (day !== 0 && day !== 6) return null
        const mon = new Date(sd)
        mon.setDate(sd.getDate() - (day === 0 ? 6 : day - 1))
        return { isSat: day === 6, isSun: day === 0, wk: mon.toISOString().slice(0, 10) }
      }).filter(Boolean)
      const wkMap = {}
      for (const ws of weekendSessions) {
        if (!wkMap[ws.wk]) wkMap[ws.wk] = {}
        if (ws.isSat) wkMap[ws.wk].sat = true
        if (ws.isSun) wkMap[ws.wk].sun = true
      }
      if (Object.values(wkMap).some(w => w.sat && w.sun)) unlock('weekend_warrior')
    }
  } catch {}

  // ── Programs ─────────────────────────────────────────────────────────────────
  try {
    const completed = JSON.parse(localStorage.getItem('orivox_completed_programs') || '[]')
    for (const cp of completed) {
      const achId = PROGRAM_CERT_MAP[cp.programId]
      if (achId) unlock(achId)
    }
    if (completed.length >= 3)  unlock('program_collector')
    if (completed.length >= 5)  unlock('dedicated')
    if (completed.length >= 15) unlock('completionist')
  } catch {}

  localStorage.setItem('orivox_achievements', JSON.stringify(stored))
  return newly
}
