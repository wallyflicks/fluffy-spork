'use client'
import { useState, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import PageNav from '../../components/PageNav'
import { ACHIEVEMENTS } from '../../lib/achievements'
import { getProgram } from '../../lib/programs'

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;--orange-border:#FFD4BC;--green:#2D7A4F;
      --green-light:#3A9962;--yellow:#F5C842;--yellow-dim:#FFF9E0;
      --red:#E84040;--red-dim:#FFECEC;--text:#1A1A2E;
      --muted:#8A7E74;--border:#E8DDD4;--shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes flameGlow{0%,100%{filter:drop-shadow(0 0 0 rgba(255,107,43,0))}50%{filter:drop-shadow(0 0 10px rgba(255,107,43,.65))}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    @media(prefers-reduced-motion:no-preference){.flame-icon{animation:flameGlow 2s ease-in-out infinite;will-change:filter}}
    .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}
    .d4{animation-delay:.38s}.d5{animation-delay:.48s}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .stat-card{
      background:var(--card);border:2.5px solid var(--border);border-radius:20px;
      box-shadow:var(--shadow);padding:24px 20px;text-align:center;
      transition:box-shadow .2s,transform .2s;
    }
    .stat-card:hover{box-shadow:7px 7px 0 rgba(0,0,0,0.13);transform:translateY(-3px)}
    .dot-bg{
      position:fixed;inset:0;
      background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);
      background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;
    }
    table{border-collapse:collapse;width:100%}
    th{background:var(--orange-dim);color:var(--text);font-family:'Fredoka',sans-serif;
       font-size:14px;font-weight:600;padding:12px 16px;text-align:left;
       border-bottom:2.5px solid var(--border);}
    th:first-child{border-radius:12px 0 0 0}
    th:last-child{border-radius:0 12px 0 0}
    td{padding:12px 16px;font-size:14px;border-bottom:1.5px solid var(--border);vertical-align:middle;}
    tr:last-child td{border-bottom:none}
    tr:last-child td:first-child{border-radius:0 0 0 12px}
    tr:last-child td:last-child{border-radius:0 0 12px 0}
    tbody tr.data-row{cursor:pointer}
    tbody tr.data-row:hover td{background:var(--orange-dim)}
    tbody tr.expanded-row td{background:var(--orange-dim)!important}
    tr.detail-row td{padding:0;border-bottom:2px solid var(--orange-border)}
    .chevron{transition:transform .2s ease;flex-shrink:0}
    .chevron.open{transform:rotate(180deg)}
    @media(max-width:600px){
      .stat-grid{grid-template-columns:1fr 1fr!important}
      .hide-mobile{display:none!important}
      td,th{padding:10px 10px;font-size:13px}
      .breakdown-grid{grid-template-columns:1fr 1fr!important}
      .feedback-grid{grid-template-columns:1fr!important}
    }
  `}</style>
)

function MiniBar({ label, val, max, color }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, padding: '12px 14px', border: `2px solid ${color}25` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: 13, fontFamily: 'Fredoka, sans-serif', color: 'var(--text)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'Fredoka, sans-serif' }}>
          {val}<span style={{ fontSize: 10, opacity: .55, fontWeight: 400 }}>/{max}</span>
        </span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: 'rgba(0,0,0,0.08)' }}>
        <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function scoreBadge(score) {
  if (score >= 80) return { bg: '#E8F7EE', color: '#2D7A4F', border: '#2D7A4F' }
  if (score >= 60) return { bg: '#FFF9E0', color: '#7A5500', border: '#F5C842' }
  return { bg: '#FFECEC', color: '#E84040', border: '#E84040' }
}

function CountUp({ to, duration = 900, delay = 300 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!to) return
    const tid = setTimeout(() => {
      let raf
      const start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
        const e = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(to * e))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }, delay)
    return () => clearTimeout(tid)
  }, [to])
  return val
}

function fmt(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}`
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA')
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA')
}

function calcStreak(sessions) {
  const valid = sessions.filter(s => s && typeof s.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.date))
  if (!valid.length) return 0
  const days = [...new Set(valid.map(s => s.date))].sort().reverse()
  const today = todayStr()
  const yesterday = yesterdayStr()
  if (days[0] !== today && days[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const a = new Date(days[i-1] + 'T12:00:00')
    const b = new Date(days[i] + 'T12:00:00')
    const diff = Math.round((a - b) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}

function mostPracticed(sessions) {
  if (!sessions.length) return '—'
  const counts = {}
  sessions.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function streakLostMessage(count) {
  if (count <= 1)  return 'You missed a day — streaks are built one session at a time'
  if (count <= 5)  return `Your ${count} day streak ended — you were building momentum, get back to it`
  if (count <= 13) return `Your ${count} day streak is gone — that one hurt. Start a new one today`
  if (count <= 29) return `Your ${count} day streak ended — that was a real run. Rebuild it`
  return `Your ${count} day streak is over — that was exceptional. You know you can do it again`
}

// ── Weekly report helpers ─────────────────────────────────────────────────────
function getMondayOf(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}
function weekBounds(monday) {
  const start = monday.toLocaleDateString('en-CA')
  const end = new Date(monday); end.setDate(monday.getDate() + 6)
  return { start, end: end.toLocaleDateString('en-CA') }
}
function sessionsInRange(sessions, start, end) {
  return sessions.filter(s => s.date >= start && s.date <= end)
}
function avgScore(sess) {
  if (!sess.length) return 0
  return Math.round(sess.reduce((a, s) => a + (s.displayScore ?? s.score ?? 0), 0) / sess.length)
}
function buildWeeklyReport(sessions) {
  const today = new Date()
  const thisMonday = getMondayOf(today)
  const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7)
  const twoMondaysAgo = new Date(lastMonday); twoMondaysAgo.setDate(lastMonday.getDate() - 7)
  const lastWeekRange = weekBounds(lastMonday)
  const prevWeekRange = weekBounds(twoMondaysAgo)
  const lastWeek = sessionsInRange(sessions, lastWeekRange.start, lastWeekRange.end)
  const prevWeek = sessionsInRange(sessions, prevWeekRange.start, prevWeekRange.end)
  const hasCompare = prevWeek.length > 0
  const best = lastWeek.length ? lastWeek.reduce((a, s) => (s.displayScore ?? s.score ?? 0) > (a.displayScore ?? a.score ?? 0) ? s : a, lastWeek[0]) : null
  const catCounts = {}; lastWeek.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1 })
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  // Most improved subscore
  const subkeys = ['clarity', 'structure', 'deliveryScore', 'confidence']
  const subLabels = { clarity: 'Clarity', structure: 'Structure', deliveryScore: 'Delivery', confidence: 'Confidence' }
  let bestSubkey = null, bestSubImprovement = -Infinity
  if (hasCompare && lastWeek.length) {
    const thisAvg = k => lastWeek.reduce((a, s) => a + (s[k] || 0), 0) / lastWeek.length
    const prevAvg = k => prevWeek.reduce((a, s) => a + (s[k] || 0), 0) / prevWeek.length
    subkeys.forEach(k => { const diff = thisAvg(k) - prevAvg(k); if (diff > bestSubImprovement) { bestSubImprovement = diff; bestSubkey = k } })
  }
  const totalFillers = lastWeek.reduce((a, s) => a + (s.fillerWordCount || 0), 0)
  const prevFillers = prevWeek.reduce((a, s) => a + (s.fillerWordCount || 0), 0)
  const lw = lastWeekRange; const fmt = d => { const [, m, day] = d.split('-'); const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${months[+m-1]} ${+day}` }
  return {
    dateRange: `${fmt(lw.start)} – ${fmt(lw.end)}`,
    sessionCount: lastWeek.length,
    avgThisWeek: avgScore(lastWeek),
    avgLastWeek: hasCompare ? avgScore(prevWeek) : null,
    best,
    topCat,
    mostImprovedLabel: bestSubkey ? subLabels[bestSubkey] : null,
    mostImprovedDelta: bestSubImprovement > 0 ? Math.round(bestSubImprovement * 10) / 10 : null,
    totalFillers,
    prevFillers,
    hasCompare,
  }
}

export default function Progress() {
  const [sessions, setSessions] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [voiceType, setVoiceType] = useState(null)
  const [streak, setStreak] = useState(0)
  const [streakLost, setStreakLost] = useState(false)
  const [lostStreakCount, setLostStreakCount] = useState(0)
  const [unlockedIds, setUnlockedIds] = useState(new Set())
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [hoveredBadge, setHoveredBadge] = useState(null)
  const [completedPrograms, setCompletedPrograms] = useState([])
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('orivox_sessions')
      setSessions(raw ? JSON.parse(raw) : [])
    } catch {
      setSessions([])
    }
    try {
      const vt = localStorage.getItem('orivox_voice_type')
      if (vt) setVoiceType(JSON.parse(vt))
    } catch {}
    // Completed programs
    try {
      const cp = JSON.parse(localStorage.getItem('orivox_completed_programs') || '[]')
      setCompletedPrograms(cp)
    } catch {}
    // Achievements
    try {
      const stored = JSON.parse(localStorage.getItem('orivox_achievements') || '[]')
      setUnlockedIds(new Set(stored.map(a => a.id)))
    } catch {}
    // Weekly report — show every Monday
    try {
      const allSess = JSON.parse(localStorage.getItem('orivox_sessions') || '[]')
      const todayStr = new Date().toLocaleDateString('en-CA')
      const isMonday = new Date().getDay() === 1
      const lastShown = localStorage.getItem('orivox_last_report_shown') || ''
      if (isMonday && lastShown !== todayStr && allSess.length > 0) {
        const report = buildWeeklyReport(allSess)
        if (report.sessionCount > 0 || report.avgThisWeek > 0) {
          setWeeklyReport(report)
          setShowWeeklyReport(true)
          localStorage.setItem('orivox_last_report_shown', todayStr)
        }
      }
    } catch {}
    // Load streak from dedicated keys — source of truth
    try {
      const count = parseInt(localStorage.getItem('orivox_streak_count') || '0', 10)
      const lastDate = localStorage.getItem('orivox_last_session_date') || ''
      const today = new Date().toLocaleDateString('en-CA')
      const d = new Date(); d.setDate(d.getDate() - 1)
      const yesterday = d.toLocaleDateString('en-CA')
      const isActive = lastDate === today || lastDate === yesterday
      if (!isActive && lastDate && count > 0) {
        // Streak broken — gap is 2+ days
        const lostShown = localStorage.getItem('orivox_streak_lost_shown') || ''
        localStorage.setItem('orivox_streak_count', '0')
        if (lostShown !== today) {
          setLostStreakCount(count)
          setStreakLost(true)
          localStorage.setItem('orivox_streak_lost_shown', today)
        }
        setStreak(0)
      } else {
        setStreak(isActive ? count : 0)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!sessions || sessions.length < 2) return
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date) || parseInt(a.id) - parseInt(b.id))

    const load = () => {
      if (!chartRef.current) return
      if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null }
      const Chart = window.Chart
      if (!Chart) return
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: sorted.map(s => fmt(s.date)),
          datasets: [{
            data: sorted.map(s => s.score),
            borderColor: '#FF6B2B',
            backgroundColor: 'rgba(255,107,43,0.10)',
            borderWidth: 2.5,
            pointBackgroundColor: sorted.map(s =>
              s.score >= 80 ? '#2D7A4F' : s.score >= 60 ? '#F5C842' : '#E84040'
            ),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.35,
          }],
        },
        options: {
          animation: { duration: 1200, easing: 'easeInOutCubic' },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1A1A2E',
              titleFont: { family: 'Fredoka', size: 14 },
              bodyFont: { family: 'Nunito', size: 13 },
              padding: 12,
              callbacks: {
                title: (items) => sorted[items[0].dataIndex]?.category + ' · ' + sorted[items[0].dataIndex]?.difficulty,
                label: (item) => `Score: ${item.raw}`,
              },
            },
          },
          scales: {
            y: {
              min: 0, max: 100,
              grid: { color: 'rgba(232,221,212,0.6)' },
              ticks: { font: { family: 'Nunito', size: 12 }, color: '#8A7E74', stepSize: 20 },
              border: { display: false },
            },
            x: {
              grid: { display: false },
              ticks: { font: { family: 'Nunito', size: 12 }, color: '#8A7E74', maxRotation: 45 },
              border: { display: false },
            },
          },
        },
      })
    }

    if (window.Chart) {
      load()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js'
      script.onload = load
      document.head.appendChild(script)
    }

    return () => { chartInstance.current?.destroy(); chartInstance.current = null }
  }, [sessions])

  if (sessions === null) {
    return (
      <>
        <G />
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fredoka" style={{ fontSize: 22, color: 'var(--muted)' }}>Loading…</div>
        </div>
      </>
    )
  }

  const avgScore = sessions.length ? Math.round(sessions.reduce((a, s) => a + s.score, 0) / sessions.length) : 0
  const best = sessions.length ? sessions.reduce((a, s) => s.score > a.score ? s : a, sessions[0]) : null
  const topCat = mostPracticed(sessions)
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date) || parseInt(b.id) - parseInt(a.id))

  return (
    <>
      <G />
      <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
        <div className="dot-bg" />

        <PageNav active="/progress" />

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px', position: 'relative', zIndex: 1 }}>

          {/* Page title */}
          <div className="fadeUp" style={{ marginBottom: 36 }}>
            <h1 className="fredoka" style={{ fontSize: 'clamp(32px,6vw,48px)', color: 'var(--text)', marginBottom: 6 }}>Your Progress</h1>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>Every session tracked, right here in your browser.</p>
          </div>

          {/* Streak */}
          {streakLost ? (
            <div className="fadeUp d1" style={{
              background: '#FFF1F1', border: '2.5px solid var(--red)',
              borderRadius: 20, padding: '20px 28px', marginBottom: 20,
              boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width:44,height:44,borderRadius:'50%',background:'#FFECEC',border:'2.5px solid var(--red)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E84040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"/>
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2"/>
                  <line x1="4" y1="20" x2="20" y2="4"/>
                </svg>
              </div>
              <div>
                <div className="fredoka" style={{ fontSize: 24, color: 'var(--red)' }}>Streak lost</div>
                <div style={{ fontSize: 13, color: '#9A3030', marginTop: 2 }}>{streakLostMessage(lostStreakCount)}</div>
                <Link href="/" style={{
                  display: 'inline-block', marginTop: 12,
                  background: 'var(--red)', color: '#fff',
                  borderRadius: 12, padding: '8px 18px',
                  fontSize: 13, fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
                  textDecoration: 'none',
                }}>Start a new streak</Link>
              </div>
            </div>
          ) : (
            <div className="fadeUp d1" style={{
              background: streak > 0 ? 'var(--yellow-dim)' : 'var(--card)',
              border: `2.5px solid ${streak > 0 ? 'var(--yellow)' : 'var(--border)'}`,
              borderRadius: 20, padding: '20px 28px', marginBottom: 20,
              boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {streak > 0
                ? <div style={{ width:44,height:44,borderRadius:'50%',background:'#FFF0E8',border:'2.5px solid var(--orange)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <svg className="flame-icon" width="22" height="22" viewBox="0 0 24 24" fill="var(--orange)" stroke="none"><path d="M12 23c-4.4 0-8-3.6-8-8 0-2.8 1.4-5.5 3-7.5.5 1.5 1.5 2.5 2.5 3C9 8.5 10 6 12 2c1.5 3.5 4 5.5 4 9.5.5-1 .5-2 .3-3C18 10.5 20 13 20 15c0 4.4-3.6 8-8 8z"/></svg>
                  </div>
                : <div style={{ width:44,height:44,borderRadius:'50%',background:'var(--border)',border:'2.5px solid var(--muted)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  </div>
              }
              <div>
                {streak > 0 ? (
                  <>
                    <div className="fredoka" style={{ fontSize: 24, color: '#7A5500' }}>{streak} day streak</div>
                    <div style={{ fontSize: 13, color: '#A07820', marginTop: 2 }}>Keep it up — practice again today to extend it</div>
                  </>
                ) : (
                  <>
                    <div className="fredoka" style={{ fontSize: 20, color: 'var(--muted)' }}>No streak yet — practice today to start one</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Complete one session daily to build your streak</div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="fadeUp d2 stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
            <div className="stat-card">
              <div className="fredoka" style={{ fontSize: 36, color: 'var(--orange)', lineHeight: 1, marginBottom: 4 }}><CountUp to={sessions.length} delay={400} /></div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="fredoka" style={{ fontSize: 36, color: sessions.length ? (avgScore >= 80 ? 'var(--green)' : avgScore >= 60 ? '#CC6600' : 'var(--red)') : 'var(--muted)', lineHeight: 1, marginBottom: 4 }}>
                {sessions.length ? <CountUp to={avgScore} delay={500} /> : '—'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Average Score</div>
            </div>
            <div className="stat-card">
              <div className="fredoka" style={{ fontSize: sessions.length ? 22 : 36, color: 'var(--text)', lineHeight: 1, marginBottom: 4, paddingTop: sessions.length ? 7 : 0 }}>{topCat}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Most Practiced</div>
            </div>
          </div>

          {/* Personal best */}
          {best && (
            <div className="fadeUp d3" style={{
              background: '#E8F7EE', border: '2.5px solid var(--green)',
              borderRadius: 20, padding: '18px 28px', marginBottom: 20,
              boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width:44,height:44,borderRadius:'50%',background:'#E8F7EE',border:'2.5px solid var(--green)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4H4v5c0 2.2 1.8 4 4 4M17 4h3v5c0 2.2-1.8 4-4 4"/><path d="M7 13c0 2.8 2.2 5 5 5s5-2.2 5-5V4H7v9z"/></svg>
              </div>
              <div>
                <div className="fredoka" style={{ fontSize: 20, color: 'var(--green)' }}>
                  Personal best: {best.score}
                </div>
                <div style={{ fontSize: 13, color: '#3A7A4F', marginTop: 2 }}>
                  {best.category} · {best.difficulty} · {fmt(best.date)}
                </div>
              </div>
            </div>
          )}

          {/* Speaking Type */}
          {voiceType && (
            <div className="fadeUp d4" style={{
              background: 'var(--card)', border: '2.5px solid var(--orange)',
              borderRadius: 20, padding: '24px 28px', marginBottom: 20,
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--orange)', marginBottom: 4, fontFamily: 'Fredoka, sans-serif' }}>Speaking Type</p>
                  <h3 className="fredoka" style={{ fontSize: 26, color: 'var(--text)', marginBottom: 4 }}>{voiceType.type}</h3>
                  <p style={{ fontSize: 14, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 14 }}>"{voiceType.tagline}"</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={{ background: '#E8F7EE', borderRadius: 12, padding: '12px 14px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Strength</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{voiceType.strengths}</p>
                    </div>
                    <div style={{ background: 'var(--orange-dim)', borderRadius: 12, padding: '12px 14px' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>Work On</p>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{voiceType.weakness}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}><strong style={{ color: 'var(--text)' }}>Tip:</strong> {voiceType.tip}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>Unlocked after 5 sessions. Complete more sessions to retake.</p>
                <button
                  onClick={() => { localStorage.removeItem('orivox_voice_type'); setVoiceType(null); }}
                  style={{ fontSize: 13, color: 'var(--orange)', background: 'none', border: '1.5px solid var(--orange-border)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
                  Retake
                </button>
              </div>
            </div>
          )}

          {/* Achievements */}
          {(() => {
            const groups = [...new Set(ACHIEVEMENTS.map(a => a.group))]
            return (
              <div className="fadeUp d4" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 22, boxShadow: 'var(--shadow)', padding: '24px 28px', marginBottom: 20 }}>
                <div className="fredoka" style={{ fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>Achievements</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{unlockedIds.size} of {ACHIEVEMENTS.length} unlocked</div>
                {groups.map(group => (
                  <div key={group} style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--orange)', marginBottom: 12, fontFamily: 'Fredoka, sans-serif' }}>{group}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 10 }}>
                      {ACHIEVEMENTS.filter(a => a.group === group).map(ach => {
                        const unlocked = unlockedIds.has(ach.id)
                        const paths = Array.isArray(ach.path) ? ach.path : [ach.path]
                        return (
                          <div key={ach.id} onMouseEnter={() => setHoveredBadge(ach.id)} onMouseLeave={() => setHoveredBadge(null)}
                            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px', borderRadius: 14, background: unlocked ? 'var(--orange-dim)' : 'var(--bg)', border: `2px solid ${unlocked ? 'var(--orange-border)' : 'var(--border)'}`, cursor: 'default', transition: 'border-color .15s' }}>
                            <div style={{ width: 42, height: 42, borderRadius: '50%', background: unlocked ? 'rgba(255,107,43,.15)' : 'rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={unlocked ? 'var(--orange)' : '#C4B8AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {paths.map((d, i) => <path key={i} d={d} />)}
                              </svg>
                              {!unlocked && (
                                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#8A7E74" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </div>
                              )}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: unlocked ? 'var(--orange)' : 'var(--muted)', textAlign: 'center', lineHeight: 1.3, fontFamily: 'Fredoka, sans-serif' }}>{ach.name}</div>
                            {hoveredBadge === ach.id && (
                              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1A1A2E', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 11, whiteSpace: 'nowrap', maxWidth: 200, whiteSpace: 'normal', textAlign: 'center', zIndex: 50, lineHeight: 1.5, pointerEvents: 'none' }}>
                                {unlocked ? ach.desc : ach.condition}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}

          {/* Program Certificates */}
          {completedPrograms.length > 0 && (
            <div className="fadeUp d4" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 22, boxShadow: 'var(--shadow)', padding: '24px 28px', marginBottom: 20 }}>
              <div className="fredoka" style={{ fontSize: 20, color: 'var(--text)', marginBottom: 4 }}>Program Certificates</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{completedPrograms.length} program{completedPrograms.length !== 1 ? 's' : ''} completed</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {completedPrograms.map((cp, i) => {
                  const prog = getProgram(cp.programId)
                  if (!prog) return null
                  const dateStr = cp.completedDate ? new Date(cp.completedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
                  return (
                    <div key={i} style={{ background: 'var(--yellow-dim)', border: '2px solid var(--yellow)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--yellow)', border: '2px solid var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '2px 2px 0 var(--text)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
                      </div>
                      <div className="fredoka" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>{cp.certificate || prog.certificate}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{prog.name}</div>
                      {dateStr && <div style={{ fontSize: 11, color: '#7A5500', fontWeight: 700 }}>{dateStr}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="fadeUp d4" style={{
            background: 'var(--card)', border: '2.5px solid var(--border)',
            borderRadius: 22, boxShadow: 'var(--shadow)', padding: '28px 28px 20px',
            marginBottom: 20,
          }}>
            <div className="fredoka" style={{ fontSize: 20, marginBottom: 20, color: 'var(--text)' }}>Score Over Time</div>
            {sessions.length < 2 ? (
              <div style={{
                height: 180, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <p style={{ color: 'var(--muted)', fontSize: 15, textAlign: 'center' }}>
                  Complete {sessions.length === 0 ? '2' : '1 more'} session{sessions.length === 0 ? 's' : ''} to see your progress chart
                </p>
              </div>
            ) : (
              <div style={{ height: 260, position: 'relative' }}>
                <canvas ref={chartRef} />
              </div>
            )}
          </div>

          {/* Session history */}
          <div className="fadeUp d5" style={{
            background: 'var(--card)', border: '2.5px solid var(--border)',
            borderRadius: 22, boxShadow: 'var(--shadow)', overflow: 'hidden',
            marginBottom: 20,
          }}>
            <div style={{ padding: '24px 28px 0' }}>
              <div className="fredoka" style={{ fontSize: 20, marginBottom: 16, color: 'var(--text)' }}>Session History</div>
            </div>
            {sessions.length === 0 ? (
              <div style={{ padding: '0 28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 20 }}>
                <p style={{ color: 'var(--muted)', fontSize: 15 }}>No sessions yet — go practice!</p>
                <Link href="/" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 50, fontFamily: 'Fredoka, sans-serif',
                  fontSize: 16, fontWeight: 600, border: '2.5px solid var(--text)',
                  background: 'var(--orange)', color: '#fff', textDecoration: 'none',
                  boxShadow: '4px 4px 0 var(--text)', transition: 'all .15s',
                }}>
                  Start Practicing →
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th className="hide-mobile">Difficulty</th>
                      <th>Score</th>
                      <th>Filler Words</th>
                      <th style={{ width: 36 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(s => {
                      const badge = scoreBadge(s.score)
                      const isOpen = expandedId === s.id
                      const hasDetail = s.clarity != null
                      return (
                        <Fragment key={s.id}>
                          <tr
                            className={`data-row${isOpen ? ' expanded-row' : ''}`}
                            onClick={() => setExpandedId(isOpen ? null : s.id)}
                          >
                            <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{s.date && /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? fmt(s.date) : '—'}</td>
                            <td style={{ fontWeight: 600 }}>{s.category || 'Unknown'}</td>
                            <td className="hide-mobile">
                              {(() => {
                                const d = s.difficulty
                                const known = d === 'Easy' || d === 'Medium' || d === 'Hard'
                                return (
                                  <span style={{
                                    padding: '3px 12px', borderRadius: 50, fontSize: 12,
                                    fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
                                    background: d === 'Easy' ? '#E8F7EE' : d === 'Medium' ? '#FFF9E0' : d === 'Hard' ? '#FFECEC' : '#F0F0F0',
                                    color: d === 'Easy' ? 'var(--green)' : d === 'Medium' ? '#7A5500' : d === 'Hard' ? 'var(--red)' : 'var(--muted)',
                                    border: `1.5px solid ${d === 'Easy' ? 'var(--green)' : d === 'Medium' ? 'var(--yellow)' : d === 'Hard' ? 'var(--red)' : 'var(--border)'}`,
                                  }}>{known ? d : 'Unknown'}</span>
                                )
                              })()}
                            </td>
                            <td>
                              <span style={{
                                padding: '4px 14px', borderRadius: 50,
                                fontFamily: 'Fredoka, sans-serif', fontSize: 15, fontWeight: 700,
                                background: badge.bg, color: badge.color,
                                border: `2px solid ${badge.border}50`,
                              }}>{s.score}</span>
                            </td>
                            <td style={{ color: s.fillerWordCount > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
                              {s.fillerWordCount > 0
                                ? `${s.fillerWordCount} (${s.fillerWords.slice(0, 3).join(', ')}${s.fillerWords.length > 3 ? '…' : ''})`
                                : '✓ Clean'}
                            </td>
                            <td style={{ textAlign: 'center', paddingLeft: 4, paddingRight: 12 }}>
                              <svg className={`chevron${isOpen ? ' open' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round">
                                <path d="M4 6l4 4 4-4"/>
                              </svg>
                            </td>
                          </tr>

                          {isOpen && (
                            <tr className="detail-row">
                              <td colSpan={6} style={{ padding: 0 }}>
                                <div style={{ padding: '22px 24px 24px', background: 'var(--orange-dim)' }}>
                                  {!hasDetail ? (
                                    <p style={{ color: 'var(--muted)', fontSize: 14, fontStyle: 'italic' }}>
                                      Full details not available for this session
                                    </p>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                                      {/* Score breakdown */}
                                      <div>
                                        <p className="fredoka" style={{ fontSize: 16, marginBottom: 10 }}>Score Breakdown</p>
                                        <div className="breakdown-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                                          <MiniBar label="Clarity" val={s.clarity} max={25} color="#3B82F6" />
                                          <MiniBar label="Structure" val={s.structure} max={25} color="var(--orange)" />
                                          <MiniBar label="Delivery" val={s.deliveryScore} max={25} color="var(--green)" />
                                          <MiniBar label="Confidence" val={s.confidence} max={25} color="#8B5CF6" />
                                        </div>
                                      </div>

                                      {/* Filler words */}
                                      {Object.keys(s.fillerWordList || {}).length > 0 && (
                                        <div>
                                          <p className="fredoka" style={{ fontSize: 16, marginBottom: 10 }}>Filler Words Used</p>
                                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {Object.entries(s.fillerWordList).sort((a, b) => b[1] - a[1]).map(([word, count]) => (
                                              <div key={word} style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '7px 14px', borderRadius: 10, fontSize: 13,
                                                background: 'var(--card)', border: '1.5px solid rgba(232,64,64,.2)',
                                              }}>
                                                <span style={{ fontFamily: 'Fredoka, sans-serif', color: 'var(--red)' }}>"{word}"</span>
                                                <span style={{ color: 'var(--red)', fontWeight: 700 }}>— {count}×</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {Object.keys(s.fillerWordList || {}).length === 0 && (
                                        <p style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700 }}>✓ Clean delivery — no filler words</p>
                                      )}

                                      {/* Strength + Improvement */}
                                      <div className="feedback-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div style={{ background: 'var(--card)', borderRadius: 12, padding: '14px 16px', borderTop: '3px solid var(--green)' }}>
                                          <p className="fredoka" style={{ fontSize: 14, color: 'var(--green)', marginBottom: 6 }}>✓ What worked</p>
                                          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{s.strength}</p>
                                        </div>
                                        <div style={{ background: 'var(--card)', borderRadius: 12, padding: '14px 16px', borderTop: '3px solid var(--orange)' }}>
                                          <p className="fredoka" style={{ fontSize: 14, color: 'var(--orange)', marginBottom: 6 }}>↑ Focus on this</p>
                                          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{s.improvement}</p>
                                        </div>
                                      </div>

                                      {/* Transcript */}
                                      {s.transcript && (
                                        <details style={{ background: 'var(--card)', borderRadius: 12, padding: '12px 16px', border: '1.5px solid var(--border)', cursor: 'pointer' }}>
                                          <summary className="fredoka" style={{ fontSize: 14, color: 'var(--muted)', userSelect: 'none', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4h12M2 8h8M2 12h10"/></svg>
                                            View transcript
                                          </summary>
                                          <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, opacity: .85 }}>{s.transcript}</p>
                                        </details>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CTA */}
          {sessions.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 50, fontFamily: 'Fredoka, sans-serif',
                fontSize: 18, fontWeight: 600, border: '2.5px solid var(--text)',
                background: 'var(--orange)', color: '#fff', textDecoration: 'none',
                boxShadow: '4px 4px 0 var(--text)', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 var(--text)' }}>
                Practice Again →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Report Modal */}
      {showWeeklyReport && weeklyReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowWeeklyReport(false)}>
          <div style={{ background: 'var(--card)', borderRadius: 24, padding: '32px 28px', maxWidth: 480, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.35)', border: '2.5px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--orange)', marginBottom: 4, fontFamily: 'Fredoka, sans-serif' }}>Weekly Review</div>
                <h2 className="fredoka" style={{ fontSize: 26, color: 'var(--text)', marginBottom: 2 }}>Your week in review</h2>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{weeklyReport.dateRange}</div>
              </div>
              <button onClick={() => setShowWeeklyReport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: 'var(--orange-dim)', borderRadius: 14, padding: '16px 14px' }}>
                <div className="fredoka" style={{ fontSize: 32, color: 'var(--orange)', lineHeight: 1 }}>{weeklyReport.sessionCount}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Sessions last week</div>
              </div>
              <div style={{ background: weeklyReport.avgLastWeek !== null && weeklyReport.avgThisWeek >= weeklyReport.avgLastWeek ? '#E8F7EE' : 'var(--red-dim)', borderRadius: 14, padding: '16px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="fredoka" style={{ fontSize: 32, color: weeklyReport.avgLastWeek !== null && weeklyReport.avgThisWeek >= weeklyReport.avgLastWeek ? 'var(--green)' : 'var(--red)', lineHeight: 1 }}>{weeklyReport.avgThisWeek}</span>
                  {weeklyReport.hasCompare && weeklyReport.avgLastWeek !== null && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: weeklyReport.avgThisWeek >= weeklyReport.avgLastWeek ? 'var(--green)' : 'var(--red)' }}>
                      {weeklyReport.avgThisWeek >= weeklyReport.avgLastWeek ? '↑' : '↓'}{Math.abs(weeklyReport.avgThisWeek - weeklyReport.avgLastWeek)} vs last week
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>Average score</div>
              </div>
            </div>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {weeklyReport.best && (
                <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Best Session</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 2 }}>{weeklyReport.best.category} · {weeklyReport.best.difficulty}</div>
                  </div>
                  <div className="fredoka" style={{ fontSize: 24, color: 'var(--green)' }}>{weeklyReport.best.displayScore ?? weeklyReport.best.score}</div>
                </div>
              )}
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Most Practiced</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{weeklyReport.topCat}</div>
              </div>
              {weeklyReport.hasCompare && weeklyReport.mostImprovedLabel && weeklyReport.mostImprovedDelta && weeklyReport.mostImprovedDelta > 0 && (
                <div style={{ background: '#E8F7EE', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Most Improved</div>
                    <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 2 }}>{weeklyReport.mostImprovedLabel}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>+{weeklyReport.mostImprovedDelta}</div>
                </div>
              )}
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Filler Words</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 2 }}>
                    {weeklyReport.totalFillers} total
                    {weeklyReport.hasCompare && weeklyReport.prevFillers > weeklyReport.totalFillers && (
                      <span style={{ color: 'var(--green)', fontWeight: 700 }}> · Down {weeklyReport.prevFillers - weeklyReport.totalFillers} from last week</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!weeklyReport.hasCompare && (
              <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginBottom: 16, fontStyle: 'italic' }}>
                Keep practicing to unlock week-over-week comparisons
              </div>
            )}

            {/* Closing line */}
            <div style={{ background: 'var(--orange-dim)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, fontSize: 14, color: '#7A4500', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}>
              {weeklyReport.hasCompare && weeklyReport.avgThisWeek > (weeklyReport.avgLastWeek ?? 0)
                ? 'You are getting sharper — keep the momentum going'
                : weeklyReport.sessionCount > 0
                  ? 'More reps, more results — great week'
                  : 'You took a break — this week is a fresh start'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowWeeklyReport(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '2px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>Close</button>
              <Link href="/" onClick={() => setShowWeeklyReport(false)} style={{ flex: 2, padding: '12px', borderRadius: 12, background: 'var(--orange)', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: 14, fontFamily: 'Fredoka, sans-serif', fontWeight: 600 }}>Start practicing</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
