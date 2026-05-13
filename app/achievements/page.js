'use client'
import { useState, useEffect } from 'react'
import PageNav from '../../components/PageNav'
import { ACHIEVEMENTS } from '../../lib/achievements'
import { getProgram } from '../../lib/programs'
import { supabase } from '../../lib/supabase'

// ── Styles ────────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;--orange-border:#FFD4BC;--green:#2D7A4F;--green-dim:#E8F5EE;
      --yellow:#F5C842;--yellow-dim:#FFF9E0;--red:#E84040;--red-dim:#FFECEC;
      --blue:#3B82F6;--blue-dim:#EFF6FF;
      --text:#1A1A2E;--muted:#8A7E74;--border:#E8DDD4;
      --shadow:4px 4px 0 rgba(0,0,0,0.10);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    .fadeUp{animation:fadeUp .45s cubic-bezier(.22,.68,0,1.2) both}
    .slideIn{animation:slideIn .4s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.06s}.d2{animation-delay:.13s}.d3{animation-delay:.20s}
    .d4{animation-delay:.27s}.d5{animation-delay:.34s}
    ::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .dot-bg{position:fixed;inset:0;background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);background-size:30px 30px;opacity:.5;pointer-events:none;z-index:0;}
    .ach-row{display:flex;align-items:center;gap:16px;padding:14px 20px;border-radius:14px;transition:background .15s;cursor:default;}
    .ach-row:hover{background:var(--bg);}
    .ach-row.unlocked:hover{background:var(--orange-dim);}
    .stat-card{background:var(--card);border:2.5px solid var(--border);border-radius:18px;box-shadow:var(--shadow);padding:20px;text-align:center;}
    .showcase-slot{background:var(--bg);border:2px dashed var(--border);border-radius:16px;padding:20px;display:flex;flex-direction:column;align-items:center;gap:8px;min-height:120px;justify-content:center;transition:border-color .15s;}
    .showcase-slot.filled{background:var(--orange-dim);border:2px solid var(--orange-border);}
    .showcase-slot:hover{border-color:var(--orange);}
    .pill-scroll{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin;}
    .pill-scroll::-webkit-scrollbar{height:4px}
    .pill-scroll::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:2px}
    .recent-pill{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:50px;background:var(--card);border:1.5px solid var(--border);white-space:nowrap;flex-shrink:0;}
    @media(max-width:640px){
      .stats-grid{grid-template-columns:1fr 1fr!important;}
      .showcase-grid{grid-template-columns:1fr!important;}
      .ach-row{padding:12px 14px;gap:12px;}
    }
  `}</style>
)

// ── Speaking title config ─────────────────────────────────────────────────────
const TITLES = [
  { min:0,   max:5,   label:'Newcomer',              next:'Developing Speaker', nextAt:6  },
  { min:6,   max:15,  label:'Developing Speaker',    next:'Rising Voice',       nextAt:16 },
  { min:16,  max:30,  label:'Rising Voice',          next:'Confident Communicator', nextAt:31 },
  { min:31,  max:50,  label:'Confident Communicator',next:'Skilled Orator',     nextAt:51 },
  { min:51,  max:75,  label:'Skilled Orator',        next:'Advanced Speaker',   nextAt:76 },
  { min:76,  max:100, label:'Advanced Speaker',      next:'Elite Communicator', nextAt:101 },
  { min:101, max:150, label:'Elite Communicator',    next:'Master Speaker',     nextAt:151 },
  { min:151, max:199, label:'Master Speaker',        next:'Orivox Legend',      nextAt:201 },
  { min:200, max:Infinity, label:'Orivox Legend',   next:null,                 nextAt:null },
]

function getBaseTitle(count) {
  return TITLES.find(t => count >= t.min && count <= t.max) || TITLES[0]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function computeLongestStreak(sessions) {
  if (!sessions.length) return 0
  const dates = [...new Set(sessions.map(s => s.date))].sort()
  let best = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]) - new Date(dates[i-1])) / 86400000
    cur = diff === 1 ? cur + 1 : 1
    best = Math.max(best, cur)
  }
  return best
}

function fmtDuration(secs) {
  if (secs < 60) return `${secs}s`
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60)
  if (h === 0) return `${m} min`
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`
}

function timeAgo(dateStr) {
  const d = new Date(dateStr + 'T12:00:00'), now = new Date()
  const days = Math.floor((now - d) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days/7)} week${Math.floor(days/7)>1?'s':''} ago`
  return `${Math.floor(days/30)} month${Math.floor(days/30)>1?'s':''} ago`
}

// ── Badge icon ────────────────────────────────────────────────────────────────
function BadgeIcon({ ach, size = 22, color = 'currentColor' }) {
  const paths = Array.isArray(ach.path) ? ach.path : [ach.path]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => <path key={i} d={d}/>)}
    </svg>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AchievementsPage() {
  const [sessions, setSessions] = useState([])
  const [unlockedMap, setUnlockedMap] = useState({}) // id → { unlockedAt }
  const [showcase, setShowcase] = useState([null, null, null])
  const [selectedBadge, setSelectedBadge] = useState(null) // for pin UI
  const [completedPrograms, setCompletedPrograms] = useState([])
  const [isTopTen, setIsTopTen] = useState(false)

  const unlockedIds = new Set(Object.keys(unlockedMap))
  const totalUnlocked = unlockedIds.size

  useEffect(() => {
    try { setSessions(JSON.parse(localStorage.getItem('orivox_sessions') || '[]')) } catch {}
    try {
      const stored = JSON.parse(localStorage.getItem('orivox_achievements') || '[]')
      const map = {}
      stored.forEach(a => { map[a.id] = { unlockedAt: a.unlockedAt || '' } })
      setUnlockedMap(map)
    } catch {}
    try {
      const sc = JSON.parse(localStorage.getItem('orivox_showcase') || 'null')
      if (Array.isArray(sc)) setShowcase(sc.length === 3 ? sc : [...sc, null, null].slice(0, 3))
    } catch {}
    try {
      setCompletedPrograms(JSON.parse(localStorage.getItem('orivox_completed_programs') || '[]'))
    } catch {}
    // Check top-10 on leaderboard
    const username = localStorage.getItem('orivox_username')
    if (username && username !== 'Anonymous') {
      supabase.from('scores').select('player_name,score').order('score', { ascending: false }).limit(10)
        .then(({ data }) => {
          if (data?.some(r => r.player_name === username)) setIsTopTen(true)
        }).catch(() => {})
    }
  }, [])

  // Computed stats
  const totalSessions = sessions.length
  const totalSpeakSecs = sessions.reduce((s, x) => s + (x.speakDuration || 0), 0)
  const longestStreak = computeLongestStreak(sessions)
  const bestScore = sessions.length ? Math.max(...sessions.map(s => s.score || 0)) : 0
  const avgScore = sessions.length ? Math.round(sessions.reduce((s, x) => s + (x.score || 0), 0) / sessions.length) : 0

  // Speaking title
  const baseTitle = getBaseTitle(totalSessions)
  let speakingTitle = baseTitle.label
  let titleAccent = 'var(--orange)'
  if (isTopTen)                   { speakingTitle = 'Global Top 10'; titleAccent = '#7C3AED' }
  else if (longestStreak >= 30)   { speakingTitle = 'Streak Champion'; titleAccent = '#2D7A4F' }
  else if (completedPrograms.length > 0) { speakingTitle = 'Program Graduate'; titleAccent = '#1D4ED8' }
  else if (totalSessions >= 200 && avgScore > 80) { speakingTitle = 'Orivox Legend'; titleAccent = '#D97706' }
  const progressToNext = baseTitle.nextAt
    ? Math.min(100, Math.round(((totalSessions - baseTitle.min) / (baseTitle.nextAt - baseTitle.min)) * 100))
    : 100
  const sessionsToNext = baseTitle.nextAt ? Math.max(0, baseTitle.nextAt - totalSessions) : 0

  // Showcase helpers
  const saveShowcase = (slots) => {
    setShowcase(slots)
    localStorage.setItem('orivox_showcase', JSON.stringify(slots))
  }
  const pinBadge = (id) => {
    const emptyIdx = showcase.indexOf(null)
    if (showcase.includes(id)) { // unpin
      saveShowcase(showcase.map(s => s === id ? null : s))
    } else if (emptyIdx !== -1) {
      const next = [...showcase]; next[emptyIdx] = id; saveShowcase(next)
    } else { // replace first slot
      saveShowcase([id, showcase[1], showcase[2]])
    }
    setSelectedBadge(null)
  }

  // Recently unlocked
  const recentlyUnlocked = Object.entries(unlockedMap)
    .filter(([, v]) => v.unlockedAt)
    .sort((a, b) => (b[1].unlockedAt > a[1].unlockedAt ? 1 : -1))
    .slice(0, 5)
    .map(([id, v]) => ({ id, ...v, ach: ACHIEVEMENTS.find(a => a.id === id) }))
    .filter(x => x.ach)

  // Groups
  const groups = [...new Set(ACHIEVEMENTS.map(a => a.group))]

  return (
    <>
      <G/>
      <PageNav active="/achievements"/>
      <div className="dot-bg"/>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '32px 20px 100px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fadeUp" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1 className="fredoka" style={{ fontSize: 34, color: 'var(--text)', lineHeight: 1 }}>Achievements</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{totalUnlocked} of {ACHIEVEMENTS.length} unlocked</p>
          </div>
        </div>

        {/* ── SECTION 1: Speaking Title ── */}
        <div className="fadeUp d1" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderLeft: `5px solid ${titleAccent}`, borderRadius: 20, boxShadow: 'var(--shadow)', padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'Fredoka, sans-serif', marginBottom: 6 }}>Your Speaking Title</div>
          <div className="fredoka" style={{ fontSize: 32, color: titleAccent, marginBottom: baseTitle.nextAt ? 16 : 0, lineHeight: 1.1 }}>{speakingTitle}</div>
          {baseTitle.nextAt && (
            <>
              <div style={{ height: 7, borderRadius: 4, background: 'var(--border)', overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${progressToNext}%`, background: titleAccent, borderRadius: 4, transition: 'width .8s cubic-bezier(.22,.68,0,1.2)' }}/>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {sessionsToNext > 0
                  ? <><strong style={{ color: 'var(--text)' }}>{sessionsToNext} sessions</strong> until <strong style={{ color: 'var(--text)' }}>{baseTitle.next}</strong></>
                  : <span style={{ color: titleAccent, fontWeight: 700 }}>Next title reached — complete another session</span>}
              </div>
            </>
          )}
          {!baseTitle.nextAt && <div style={{ fontSize: 13, color: 'var(--muted)' }}>You have reached the highest title. Legendary.</div>}
        </div>

        {/* ── SECTION 2: Stats Row ── */}
        <div className="stats-grid fadeUp d2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
          {[
            ['Sessions', totalSessions, <svg key="s" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>],
            ['Speaking Time', fmtDuration(totalSpeakSecs), <svg key="t" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>],
            ['Best Streak', `${longestStreak} days`, <svg key="st" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><path d="M3 17h4V9H3z"/><path d="M10 17h4V5h-4z"/><path d="M17 17h4v-8h-4z"/></svg>],
            ['Best Score', bestScore || '—', <svg key="sc" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>],
          ].map(([label, value, icon]) => (
            <div key={label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{icon}</div>
              <div className="fredoka" style={{ fontSize: 22, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── SECTION 3: Showcase ── */}
        <div className="fadeUp d3" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow)', padding: '22px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div className="fredoka" style={{ fontSize: 18, color: 'var(--text)' }}>My Showcase</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Click any unlocked badge to pin it here</div>
            </div>
          </div>
          <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {showcase.map((id, i) => {
              const ach = id ? ACHIEVEMENTS.find(a => a.id === id) : null
              return (
                <div key={i} className={`showcase-slot${ach ? ' filled' : ''}`}
                  onClick={() => ach && setSelectedBadge(ach.id)}>
                  {ach ? (
                    <>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,107,43,.18)', border: '2px solid var(--orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BadgeIcon ach={ach} size={24} color="var(--orange)"/>
                      </div>
                      <div className="fredoka" style={{ fontSize: 13, textAlign: 'center', color: 'var(--orange)', lineHeight: 1.3 }}>{ach.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.4 }}>{ach.desc}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Empty slot</div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── SECTION 4: Recently Unlocked ── */}
        {recentlyUnlocked.length > 0 && (
          <div className="fadeUp d4" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow)', padding: '20px 24px', marginBottom: 16 }}>
            <div className="fredoka" style={{ fontSize: 18, color: 'var(--text)', marginBottom: 12 }}>Recently Unlocked</div>
            <div className="pill-scroll">
              {recentlyUnlocked.map(({ id, ach, unlockedAt }) => (
                <div key={id} className="recent-pill">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--orange-dim)', border: '1.5px solid var(--orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BadgeIcon ach={ach} size={14} color="var(--orange)"/>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{ach.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{timeAgo(unlockedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 5: All Achievements ── */}
        <div className="fadeUp d5">
          {groups.map(group => (
            <div key={group} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: 'var(--orange)', fontFamily: 'Fredoka, sans-serif', marginBottom: 8, paddingLeft: 4 }}>{group}</div>
              <div style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 18, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                {ACHIEVEMENTS.filter(a => a.group === group).map((ach, idx, arr) => {
                  const unlocked = unlockedIds.has(ach.id)
                  const info = unlockedMap[ach.id]
                  const isSelected = selectedBadge === ach.id
                  const inShowcase = showcase.includes(ach.id)
                  return (
                    <div key={ach.id}
                      onClick={() => { if (unlocked) setSelectedBadge(isSelected ? null : ach.id) }}
                      className={`ach-row${unlocked ? ' unlocked' : ''}`}
                      style={{ borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: unlocked ? 'pointer' : 'default', background: isSelected ? 'var(--orange-dim)' : undefined }}>
                      {/* Icon */}
                      <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: unlocked ? 'rgba(255,107,43,.12)' : 'rgba(0,0,0,.04)', border: `2px solid ${unlocked ? 'var(--orange-border)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BadgeIcon ach={ach} size={24} color={unlocked ? 'var(--orange)' : '#C4B8AF'}/>
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: unlocked ? 'var(--text)' : 'var(--muted)', marginBottom: 2, fontFamily: 'Fredoka, sans-serif' }}>{ach.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{unlocked ? ach.desc : ach.condition}</div>
                        {isSelected && (
                          <button
                            style={{ marginTop: 8, background: inShowcase ? 'var(--card)' : 'var(--orange)', color: inShowcase ? 'var(--orange)' : '#fff', border: `1.5px solid ${inShowcase ? 'var(--orange)' : 'var(--orange)'}`, borderRadius: 50, padding: '4px 14px', fontSize: 12, fontFamily: 'Fredoka, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                            onClick={e => { e.stopPropagation(); pinBadge(ach.id) }}>
                            {inShowcase ? 'Remove from showcase' : 'Pin to showcase'}
                          </button>
                        )}
                      </div>
                      {/* Status */}
                      <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 60 }}>
                        {unlocked ? (
                          <>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-dim)', border: '1.5px solid #b8dfc8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                            </div>
                            {info?.unlockedAt && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{timeAgo(info.unlockedAt)}</div>}
                          </>
                        ) : (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', opacity: .6 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Tap-outside dismiss */}
      {selectedBadge && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }} onClick={() => setSelectedBadge(null)}/>
      )}
    </>
  )
}
