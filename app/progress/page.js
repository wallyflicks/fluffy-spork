'use client'
import { useState, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import PageNav from '../../components/PageNav'

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
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
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

function fmt(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}`
}

function calcStreak(sessions) {
  if (!sessions.length) return 0
  const days = [...new Set(sessions.map(s => s.date))].sort().reverse()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (days[0] !== today && days[0] !== yesterday) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    const diff = (prev - curr) / 86400000
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

export default function Progress() {
  const [sessions, setSessions] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('orivox_sessions')
      setSessions(raw ? JSON.parse(raw) : [])
    } catch {
      setSessions([])
    }
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

  const streak = calcStreak(sessions)
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
          <div className="fadeUp d1" style={{
            background: streak > 0 ? 'var(--yellow-dim)' : 'var(--card)',
            border: `2.5px solid ${streak > 0 ? 'var(--yellow)' : 'var(--border)'}`,
            borderRadius: 20, padding: '20px 28px', marginBottom: 20,
            boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span style={{ fontSize: 40, lineHeight: 1 }}>{streak > 0 ? '🔥' : '💤'}</span>
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

          {/* Stats row */}
          <div className="fadeUp d2 stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
            <div className="stat-card">
              <div className="fredoka" style={{ fontSize: 36, color: 'var(--orange)', lineHeight: 1, marginBottom: 4 }}>{sessions.length}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="fredoka" style={{ fontSize: 36, color: sessions.length ? (avgScore >= 80 ? 'var(--green)' : avgScore >= 60 ? '#CC6600' : 'var(--red)') : 'var(--muted)', lineHeight: 1, marginBottom: 4 }}>
                {sessions.length ? avgScore : '—'}
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
              <span style={{ fontSize: 36, lineHeight: 1 }}>🏆</span>
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
                            <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{fmt(s.date)}</td>
                            <td style={{ fontWeight: 600 }}>{s.category}</td>
                            <td className="hide-mobile">
                              <span style={{
                                padding: '3px 12px', borderRadius: 50, fontSize: 12,
                                fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
                                background: s.difficulty === 'Easy' ? '#E8F7EE' : s.difficulty === 'Medium' ? '#FFF9E0' : '#FFECEC',
                                color: s.difficulty === 'Easy' ? 'var(--green)' : s.difficulty === 'Medium' ? '#7A5500' : 'var(--red)',
                                border: `1.5px solid ${s.difficulty === 'Easy' ? 'var(--green)' : s.difficulty === 'Medium' ? 'var(--yellow)' : 'var(--red)'}`,
                              }}>{s.difficulty}</span>
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
    </>
  )
}
