'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageNav from '../../components/PageNav'
import { supabase } from '../../lib/supabase'

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;--orange-border:#FFD4BC;--green:#2D7A4F;
      --yellow:#F5C842;--yellow-dim:#FFF9E0;--red:#E84040;--red-dim:#FFECEC;
      --text:#1A1A2E;--muted:#8A7E74;--border:#E8DDD4;--shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shine{from{background-position:200% center}to{background-position:-200% center}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}.d4{animation-delay:.38s}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .dot-bg{position:fixed;inset:0;background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;}
    .lb-card{background:var(--card);border:2.5px solid var(--border);border-radius:20px;box-shadow:var(--shadow);overflow:hidden;}
    .lb-row{display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1.5px solid var(--border);}
    .lb-row:last-child{border-bottom:none}
    .lb-row:hover{background:var(--orange-dim)}
    .rank-badge{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fredoka',sans-serif;font-size:15px;font-weight:700;flex-shrink:0;}
    .gold{background:linear-gradient(135deg,#FFD700,#FFC000,#FFD700);background-size:200%;animation:shine 2.5s linear infinite;color:#7A5500;}
    .silver{background:#E8E8E8;color:#666;}
    .bronze{background:#E8C4A0;color:#7A4400;}
    .rank-num{background:var(--orange-dim);color:var(--muted);}
    @media(max-width:600px){.lb-row{padding:12px 14px;gap:10px}}
  `}</style>
)

function fmtDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = (dateStr.includes('T') ? dateStr.split('T')[0] : dateStr).split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`
}

function scoreBadge(score) {
  if (score >= 80) return { bg: '#E8F7EE', color: '#2D7A4F', border: '#2D7A4F' }
  if (score >= 60) return { bg: '#FFF9E0', color: '#7A5500', border: '#F5C842' }
  return { bg: '#FFECEC', color: '#E84040', border: '#E84040' }
}

function ScorePill({ score }) {
  const b = scoreBadge(score)
  return (
    <span style={{ padding:'5px 16px', borderRadius:50, fontFamily:'Fredoka,sans-serif', fontSize:17, fontWeight:700, background:b.bg, color:b.color, border:`2px solid ${b.border}50`, flexShrink:0 }}>
      {score}
    </span>
  )
}

function RankBadge({ rank }) {
  if (rank === 1) return <div className="rank-badge gold">1</div>
  if (rank === 2) return <div className="rank-badge silver">2</div>
  if (rank === 3) return <div className="rank-badge bronze">3</div>
  return <div className="rank-badge rank-num">{rank}</div>
}

function TrophyIcon({ size = 28, stroke = '#7A5500' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4H4v5c0 2.2 1.8 4 4 4M17 4h3v5c0 2.2-1.8 4-4 4"/>
      <path d="M7 13c0 2.8 2.2 5 5 5s5-2.2 5-5V4H7v9z"/>
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function ScoreRow({ rank, entry, nameKey = 'player_name' }) {
  return (
    <div className="lb-row">
      <RankBadge rank={rank} />
      <div style={{ flex:1, minWidth:0 }}>
        <div className="fredoka" style={{ fontSize:15, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {entry[nameKey] || 'Anonymous'}
        </div>
        {(entry.category || entry.difficulty || entry.date) && (
          <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
            {[entry.category, entry.difficulty, entry.date ? fmtDate(entry.date) : (entry.created_at ? fmtDate(entry.created_at) : null)].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>
      <ScorePill score={entry.score} />
    </div>
  )
}

export default function Leaderboard() {
  const [global, setGlobal] = useState(null)   // from Supabase
  const [local, setLocal] = useState([])        // from localStorage
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load localStorage immediately
    try {
      const raw = localStorage.getItem('orivox_sessions')
      const sessions = raw ? JSON.parse(raw) : []
      setLocal([...sessions].sort((a, b) => b.score - a.score).slice(0, 20))
    } catch { setLocal([]) }

    // Query Supabase directly from browser (same as Reviews — works with anon key)
    supabase
      .from('scores')
      .select('id, player_name, score, category, difficulty, date, created_at')
      .order('score', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error && data) {
          setGlobal(data)
        } else {
          // Try minimal columns if full select fails
          supabase
            .from('scores')
            .select('id, player_name, score, created_at')
            .order('score', { ascending: false })
            .limit(20)
            .then(({ data: d2 }) => setGlobal(d2 || []))
            .catch(() => setGlobal(null))
        }
        setLoading(false)
      })
      .catch(() => { setGlobal(null); setLoading(false) })
  }, [])

  // Use global if available and has entries; otherwise fall back to local
  const useGlobal = global && global.length > 0
  const entries = useGlobal ? global : local

  // All-time high
  const allTimeHigh = entries[0] || null

  // Best per day (for local fallback, compute from full localStorage)
  const [byDay, setByDay] = useState([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem('orivox_sessions')
      const sessions = raw ? JSON.parse(raw) : []
      const map = {}
      sessions.forEach(s => { if (!map[s.date] || s.score > map[s.date].score) map[s.date] = s })
      setByDay(Object.values(map).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30))
    } catch { setByDay([]) }
  }, [])

  if (loading) {
    return (
      <>
        <G />
        <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="fredoka" style={{ fontSize:22, color:'var(--muted)' }}>Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <G />
      <div style={{ minHeight:'100vh', background:'var(--bg)', position:'relative' }}>
        <div className="dot-bg" />
        <PageNav active="/leaderboard" />

        <div style={{ maxWidth:700, margin:'0 auto', padding:'56px 24px 80px', position:'relative', zIndex:1 }}>

          {/* Title */}
          <div className="fadeUp" style={{ marginBottom:40, textAlign:'center' }}>
            <h1 className="fredoka" style={{ fontSize:'clamp(36px,6vw,52px)', color:'var(--text)', marginBottom:10 }}>
              Leaderboard
            </h1>
            <p style={{ color:'var(--muted)', fontSize:16 }}>
              {useGlobal ? 'Global rankings — visible to everyone.' : 'Your personal best sessions.'}
            </p>
          </div>

          {/* All-time high */}
          <div className="fadeUp d1" style={{
            background:'var(--yellow-dim)', border:'2.5px solid var(--yellow)',
            borderRadius:20, padding:'24px 28px', marginBottom:24,
            boxShadow:'var(--shadow)', display:'flex', alignItems:'center', gap:20,
          }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#FFF3C0', border:'2.5px solid var(--yellow)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <TrophyIcon size={28} stroke="#7A5500" />
            </div>
            <div style={{ flex:1 }}>
              <p className="fredoka" style={{ fontSize:13, color:'#7A5500', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>All-Time High Score</p>
              {allTimeHigh ? (
                <>
                  <div className="fredoka" style={{ fontSize:32, color:'#7A5500', lineHeight:1, marginBottom:4 }}>
                    {allTimeHigh.score} <span style={{ fontSize:16, opacity:.6 }}>/ 100</span>
                  </div>
                  <div style={{ fontSize:14, color:'#A07820' }}>
                    {[allTimeHigh.player_name || allTimeHigh.category, allTimeHigh.difficulty, allTimeHigh.date ? fmtDate(allTimeHigh.date) : null].filter(Boolean).join(' · ')}
                  </div>
                </>
              ) : (
                <div className="fredoka" style={{ fontSize:18, color:'#A07820' }}>No sessions yet — complete one to appear here!</div>
              )}
            </div>
          </div>

          {/* Global leaderboard */}
          <div className="fadeUp d2 lb-card" style={{ marginBottom:24 }}>
            <div style={{ padding:'20px 20px 16px', borderBottom:'2.5px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
              {useGlobal ? <GlobeIcon /> : <PersonIcon />}
              <h2 className="fredoka" style={{ fontSize:22, color:'var(--text)' }}>
                {useGlobal ? 'Global Top Scores' : 'Your Top Sessions'}
              </h2>
              {!useGlobal && (
                <span style={{ marginLeft:'auto', fontSize:12, color:'var(--muted)', fontWeight:600, background:'var(--orange-dim)', padding:'3px 10px', borderRadius:50, border:'1.5px solid var(--orange-border)' }}>
                  Local only
                </span>
              )}
            </div>

            {entries.length === 0 ? (
              <div style={{ padding:'40px 24px', textAlign:'center' }}>
                <p style={{ color:'var(--muted)', fontSize:15, marginBottom:20 }}>
                  No sessions yet — complete your first practice to appear here!
                </p>
                <Link href="/" style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'12px 28px', borderRadius:50, fontFamily:'Fredoka,sans-serif',
                  fontSize:16, fontWeight:600, border:'2.5px solid var(--text)',
                  background:'var(--orange)', color:'#fff', textDecoration:'none',
                  boxShadow:'4px 4px 0 var(--text)',
                }}>
                  Start a session
                </Link>
              </div>
            ) : (
              entries.map((entry, i) => (
                <ScoreRow key={entry.id || entry.date + i} rank={i + 1} entry={entry} />
              ))
            )}
          </div>

          {/* Best per day (always from local, since it's personal history) */}
          {byDay.length > 0 && (
            <div className="fadeUp d3 lb-card">
              <div style={{ padding:'20px 20px 16px', borderBottom:'2.5px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
                <PersonIcon />
                <h2 className="fredoka" style={{ fontSize:22, color:'var(--text)' }}>Your Best Per Day</h2>
                <span style={{ marginLeft:'auto', fontSize:13, color:'var(--muted)', fontWeight:600 }}>Personal history</span>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ borderCollapse:'collapse', width:'100%' }}>
                  <thead>
                    <tr>
                      <th style={{ background:'var(--orange-dim)', color:'var(--text)', fontFamily:'Fredoka,sans-serif', fontSize:14, fontWeight:600, padding:'12px 20px', textAlign:'left', borderBottom:'2.5px solid var(--border)' }}>Date</th>
                      <th style={{ background:'var(--orange-dim)', color:'var(--text)', fontFamily:'Fredoka,sans-serif', fontSize:14, fontWeight:600, padding:'12px 20px', textAlign:'left', borderBottom:'2.5px solid var(--border)' }}>Category</th>
                      <th style={{ background:'var(--orange-dim)', color:'var(--text)', fontFamily:'Fredoka,sans-serif', fontSize:14, fontWeight:600, padding:'12px 20px', textAlign:'right', borderBottom:'2.5px solid var(--border)' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byDay.map(s => {
                      const b = scoreBadge(s.score)
                      return (
                        <tr key={s.date} style={{ borderBottom:'1.5px solid var(--border)' }}>
                          <td style={{ padding:'12px 20px', fontSize:14, color:'var(--muted)', whiteSpace:'nowrap' }}>{fmtDate(s.date)}</td>
                          <td style={{ padding:'12px 20px', fontSize:14 }}>
                            <span className="fredoka">{s.category || '—'}</span>
                            {s.difficulty && <span style={{ fontSize:12, color:'var(--muted)', marginLeft:6 }}>{s.difficulty}</span>}
                          </td>
                          <td style={{ padding:'12px 20px', textAlign:'right' }}>
                            <span style={{ padding:'4px 14px', borderRadius:50, fontFamily:'Fredoka,sans-serif', fontSize:15, fontWeight:700, background:b.bg, color:b.color, border:`2px solid ${b.border}50` }}>
                              {s.score}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="fadeUp d4" style={{ textAlign:'center', marginTop:48 }}>
            <Link href="/" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'14px 32px', borderRadius:50, fontFamily:'Fredoka,sans-serif',
              fontSize:18, fontWeight:600, border:'2.5px solid var(--text)',
              background:'var(--orange)', color:'#fff', textDecoration:'none',
              boxShadow:'4px 4px 0 var(--text)', transition:'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 var(--text)' }}>
              Keep Practicing
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
