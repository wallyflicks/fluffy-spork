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
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-dim:#FFF0E8;
      --orange-border:#FFD4BC;--green:#2D7A4F;--yellow:#F5C842;--yellow-dim:#FFF9E0;
      --text:#1A1A2E;--muted:#8A7E74;--border:#E8DDD4;--shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shine{from{background-position:200% center}to{background-position:-200% center}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}
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

function fmtDate(s) {
  if (!s) return ''
  const d = (s.includes('T') ? s.split('T')[0] : s).split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+d[1]-1]} ${+d[2]}, ${d[0]}`
}

function scoreBadge(score) {
  if (score >= 80) return { bg:'#E8F7EE', color:'#2D7A4F', border:'#2D7A4F' }
  if (score >= 60) return { bg:'#FFF9E0', color:'#7A5500', border:'#F5C842' }
  return { bg:'#FFECEC', color:'#E84040', border:'#E84040' }
}

function RankBadge({ rank }) {
  if (rank === 1) return <div className="rank-badge gold">1</div>
  if (rank === 2) return <div className="rank-badge silver">2</div>
  if (rank === 3) return <div className="rank-badge bronze">3</div>
  return <div className="rank-badge rank-num">{rank}</div>
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7A5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4H4v5c0 2.2 1.8 4 4 4M17 4h3v5c0 2.2-1.8 4-4 4"/>
      <path d="M7 13c0 2.8 2.2 5 5 5s5-2.2 5-5V4H7v9z"/>
    </svg>
  )
}

export default function Leaderboard() {
  const [scores, setScores] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('scores')
      .select('id, player_name, score, category, difficulty, date, created_at')
      .order('score', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) { setScores(data); setLoading(false); return }
        // Fallback: minimal columns
        supabase
          .from('scores')
          .select('id, player_name, score, created_at')
          .order('score', { ascending: false })
          .limit(50)
          .then(({ data: d2, error: e2 }) => { setScores(e2 ? null : (d2 || [])); setLoading(false) })
          .catch(() => { setScores(null); setLoading(false) })
      })
      .catch(() => { setScores(null); setLoading(false) })
  }, [])

  const allTimeHigh = scores && scores.length > 0 ? scores[0] : null

  return (
    <>
      <G />
      <div style={{ minHeight:'100vh', background:'var(--bg)', position:'relative' }}>
        <div className="dot-bg" />
        <PageNav active="/leaderboard" />

        <div style={{ maxWidth:680, margin:'0 auto', padding:'56px 24px 80px', position:'relative', zIndex:1 }}>

          {/* Title */}
          <div className="fadeUp" style={{ marginBottom:32, textAlign:'center' }}>
            <h1 className="fredoka" style={{ fontSize:'clamp(36px,6vw,52px)', color:'var(--text)', marginBottom:10 }}>
              Leaderboard
            </h1>
            <p style={{ color:'var(--muted)', fontSize:16 }}>
              Top scores from speakers worldwide. Post yours after a session to compete.
            </p>
          </div>

          {/* All-time high */}
          {allTimeHigh && (
            <div className="fadeUp d1" style={{
              background:'var(--yellow-dim)', border:'2.5px solid var(--yellow)',
              borderRadius:20, padding:'22px 28px', marginBottom:24,
              boxShadow:'var(--shadow)', display:'flex', alignItems:'center', gap:18,
            }}>
              <div style={{ width:50, height:50, borderRadius:'50%', background:'#FFF3C0', border:'2.5px solid var(--yellow)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <TrophyIcon />
              </div>
              <div>
                <p className="fredoka" style={{ fontSize:12, color:'#7A5500', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:3 }}>
                  All-Time World Record
                </p>
                <div className="fredoka" style={{ fontSize:30, color:'#7A5500', lineHeight:1, marginBottom:3 }}>
                  {allTimeHigh.score}<span style={{ fontSize:14, opacity:.5 }}> / 100</span>
                </div>
                <div style={{ fontSize:13, color:'#A07820' }}>
                  {[allTimeHigh.player_name, allTimeHigh.category, allTimeHigh.difficulty, allTimeHigh.date ? fmtDate(allTimeHigh.date) : null].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
          )}

          {/* Global scores */}
          <div className="fadeUp d2 lb-card">
            <div style={{ padding:'18px 20px', borderBottom:'2.5px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <h2 className="fredoka" style={{ fontSize:20, color:'var(--text)' }}>Global Rankings</h2>
              <span style={{ marginLeft:'auto', fontSize:13, color:'var(--muted)' }}>All-time · All devices</span>
            </div>

            {loading ? (
              <div style={{ padding:'40px 24px', textAlign:'center' }}>
                <div className="fredoka" style={{ fontSize:18, color:'var(--muted)' }}>Loading...</div>
              </div>
            ) : scores === null ? (
              <div style={{ padding:'32px 24px', textAlign:'center' }}>
                <p style={{ color:'var(--muted)', fontSize:14 }}>Could not load scores. Make sure the Supabase <code>scores</code> table exists with RLS disabled.</p>
              </div>
            ) : scores.length === 0 ? (
              <div style={{ padding:'40px 24px', textAlign:'center' }}>
                <p style={{ color:'var(--muted)', fontSize:15 }}>No scores yet — be the first to post.</p>
              </div>
            ) : (
              scores.map((entry, i) => {
                const b = scoreBadge(entry.score)
                return (
                  <div key={entry.id} className="lb-row">
                    <RankBadge rank={i + 1} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="fredoka" style={{ fontSize:15, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {entry.player_name || 'Anonymous'}
                      </div>
                      {(entry.category || entry.difficulty || entry.date || entry.created_at) && (
                        <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
                          {[entry.category, entry.difficulty, entry.date ? fmtDate(entry.date) : (entry.created_at ? fmtDate(entry.created_at) : null)].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    <span style={{ padding:'5px 16px', borderRadius:50, fontFamily:'Fredoka,sans-serif', fontSize:17, fontWeight:700, background:b.bg, color:b.color, border:`2px solid ${b.border}50`, flexShrink:0 }}>
                      {entry.score}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* CTA */}
          <div className="fadeUp d3" style={{ textAlign:'center', marginTop:40 }}>
            <Link href="/" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'14px 32px', borderRadius:50, fontFamily:'Fredoka,sans-serif',
              fontSize:18, fontWeight:600, border:'2.5px solid var(--text)',
              background:'var(--orange)', color:'#fff', textDecoration:'none',
              boxShadow:'4px 4px 0 var(--text)', transition:'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0 var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 var(--text)' }}>
              Practice and Compete
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
