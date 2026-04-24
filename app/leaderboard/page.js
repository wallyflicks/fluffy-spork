'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageNav from '../../components/PageNav'

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
    .dot-bg{
      position:fixed;inset:0;
      background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);
      background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;
    }
    .lb-card{background:var(--card);border:2.5px solid var(--border);border-radius:20px;box-shadow:var(--shadow);overflow:hidden;}
    .lb-row{display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1.5px solid var(--border);}
    .lb-row:last-child{border-bottom:none}
    .lb-row:hover{background:var(--orange-dim)}
    .rank-badge{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fredoka',sans-serif;font-size:15px;font-weight:700;flex-shrink:0;}
    .gold{background:linear-gradient(135deg,#FFD700,#FFC000,#FFD700);background-size:200%;animation:shine 2.5s linear infinite;color:#7A5500;}
    .silver{background:#E8E8E8;color:#666;}
    .bronze{background:#E8C4A0;color:#7A4400;}
    .rank-num{background:var(--orange-dim);color:var(--muted);}
    table{border-collapse:collapse;width:100%}
    th{background:var(--orange-dim);color:var(--text);font-family:'Fredoka',sans-serif;font-size:14px;font-weight:600;padding:12px 20px;text-align:left;border-bottom:2.5px solid var(--border);}
    td{padding:12px 20px;font-size:14px;border-bottom:1.5px solid var(--border);vertical-align:middle;}
    tr:last-child td{border-bottom:none}
    @media(max-width:600px){
      .lb-row{padding:12px 14px;gap:10px}
      td,th{padding:10px 12px;font-size:13px}
      .hide-mob{display:none!important}
    }
  `}</style>
)

function fmtDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`
}

function scoreBadge(score) {
  if (score >= 80) return { bg: '#E8F7EE', color: '#2D7A4F', border: '#2D7A4F' }
  if (score >= 60) return { bg: '#FFF9E0', color: '#7A5500', border: '#F5C842' }
  return { bg: '#FFECEC', color: '#E84040', border: '#E84040' }
}

function RankBadge({ rank }) {
  if (rank === 1) return <div className="rank-badge gold">1</div>
  if (rank === 2) return <div className="rank-badge silver">2</div>
  if (rank === 3) return <div className="rank-badge bronze">3</div>
  return <div className="rank-badge rank-num">{rank}</div>
}

function TrophyIcon({ size = 44, stroke = '#7A5500' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M8 21h8M12 17v4M7 4H4v5c0 2.2 1.8 4 4 4M17 4h3v5c0 2.2-1.8 4-4 4"/>
      <path d="M7 13c0 2.8 2.2 5 5 5s5-2.2 5-5V4H7v9z"/>
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  )
}

function StarIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5C842" stroke="#F5C842" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5C842" stroke="#CC8800" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M2 20h20M5 20L3 8l5 4 4-8 4 8 5-4-2 12"/>
    </svg>
  )
}

export default function Leaderboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setData(d)
      })
      .catch(() => setError('Failed to load leaderboard'))
  }, [])

  if (!data && !error) {
    return (
      <>
        <G />
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fredoka" style={{ fontSize: 22, color: 'var(--muted)' }}>Loading...</div>
        </div>
      </>
    )
  }

  const { top20 = [], hallOfFame = [], allTimeHigh = null } = data || {}

  return (
    <>
      <G />
      <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
        <div className="dot-bg" />

        <PageNav active="/leaderboard" />

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '56px 24px 80px', position: 'relative', zIndex: 1 }}>

          {/* Title */}
          <div className="fadeUp" style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 className="fredoka" style={{ fontSize: 'clamp(36px,6vw,52px)', color: 'var(--text)', marginBottom: 10 }}>
              Leaderboard
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              Daily rankings reset at midnight — post your best score to claim a spot.
            </p>
          </div>

          {error && (
            <div className="fadeUp" style={{ background: 'var(--red-dim)', border: '2px solid var(--red)', borderRadius: 16, padding: '18px 24px', marginBottom: 24, color: 'var(--red)', fontFamily: 'Fredoka, sans-serif', fontSize: 16 }}>
              Could not load leaderboard data. Try refreshing.
            </div>
          )}

          {/* All-time high */}
          <div className="fadeUp d1" style={{
            background: 'var(--yellow-dim)', border: '2.5px solid var(--yellow)',
            borderRadius: 20, padding: '24px 28px', marginBottom: 24,
            boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF3C0', border: '2.5px solid var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrophyIcon size={28} stroke="#7A5500" />
            </div>
            <div style={{ flex: 1 }}>
              <p className="fredoka" style={{ fontSize: 13, color: '#7A5500', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>All-Time High Score</p>
              {allTimeHigh ? (
                <>
                  <div className="fredoka" style={{ fontSize: 32, color: '#7A5500', lineHeight: 1, marginBottom: 4 }}>
                    {allTimeHigh.score} <span style={{ fontSize: 16, opacity: .6 }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#A07820' }}>
                    {allTimeHigh.player_name} &middot; {fmtDate(allTimeHigh.won_on)}
                  </div>
                </>
              ) : (
                <div className="fredoka" style={{ fontSize: 20, color: '#A07820' }}>No scores yet — be the first!</div>
              )}
            </div>
          </div>

          {/* Top scores */}
          <div className="fadeUp d2 lb-card" style={{ marginBottom: 24 }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '2.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <MicIcon />
              <h2 className="fredoka" style={{ fontSize: 22, color: 'var(--text)' }}>Top Scores</h2>
            </div>

            {top20.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 20 }}>
                  No scores yet — be the first on the board!
                </p>
                <Link href="/" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 50, fontFamily: 'Fredoka, sans-serif',
                  fontSize: 16, fontWeight: 600, border: '2.5px solid var(--text)',
                  background: 'var(--orange)', color: '#fff', textDecoration: 'none',
                  boxShadow: '4px 4px 0 var(--text)',
                }}>
                  Start a session
                </Link>
              </div>
            ) : (
              top20.map((entry, i) => {
                const badge = scoreBadge(entry.score)
                return (
                  <div key={entry.id} className="lb-row">
                    <RankBadge rank={i + 1} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fredoka" style={{ fontSize: 15, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.player_name}
                      </div>
                      {(entry.category || entry.difficulty) && (
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          {[entry.category, entry.difficulty, entry.date ? fmtDate(entry.date) : null].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    <div style={{
                      padding: '5px 16px', borderRadius: 50,
                      fontFamily: 'Fredoka, sans-serif', fontSize: 17, fontWeight: 700,
                      background: badge.bg, color: badge.color,
                      border: `2px solid ${badge.border}50`, flexShrink: 0,
                    }}>
                      {entry.score}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Hall of Fame */}
          <div className="fadeUp d3 lb-card">
            <div style={{ padding: '20px 20px 16px', borderBottom: '2.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <StarIcon size={22} />
              <h2 className="fredoka" style={{ fontSize: 22, color: 'var(--text)' }}>Hall of Fame</h2>
              <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Past daily winners</span>
            </div>

            {hallOfFame.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', fontSize: 15 }}>
                  No past winners yet. The first daily champion will appear here.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Player</th>
                      <th style={{ textAlign: 'right' }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hallOfFame.map((entry, i) => {
                      const badge = scoreBadge(entry.score)
                      return (
                        <tr key={entry.id}>
                          <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{fmtDate(entry.won_on)}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {i === 0 && <CrownIcon />}
                              <span className="fredoka" style={{ fontSize: 15 }}>{entry.player_name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{
                              padding: '4px 14px', borderRadius: 50,
                              fontFamily: 'Fredoka, sans-serif', fontSize: 15, fontWeight: 700,
                              background: badge.bg, color: badge.color,
                              border: `2px solid ${badge.border}50`,
                            }}>
                              {entry.score}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="fadeUp d4" style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 50, fontFamily: 'Fredoka, sans-serif',
              fontSize: 18, fontWeight: 600, border: '2.5px solid var(--text)',
              background: 'var(--orange)', color: '#fff', textDecoration: 'none',
              boxShadow: '4px 4px 0 var(--text)', transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 var(--text)' }}>
              Practice and Post Your Score
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
