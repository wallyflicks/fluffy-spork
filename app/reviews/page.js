'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;--orange-border:#FFD4BC;--green:#2D7A4F;
      --yellow:#F5C842;--yellow-dim:#FFF9E0;--text:#1A1A2E;
      --muted:#8A7E74;--border:#E8DDD4;--shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}.d4{animation-delay:.38s}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .nav-link{
      display:inline-flex;align-items:center;gap:8px;padding:8px 18px;
      border-radius:50px;font-family:'Fredoka',sans-serif;font-size:14px;
      font-weight:600;cursor:pointer;border:2px solid var(--border);
      background:var(--card);color:var(--muted);text-decoration:none;
      transition:all .15s ease;box-shadow:2px 2px 0 var(--border);white-space:nowrap;
    }
    .nav-link:hover{border-color:var(--orange);color:var(--orange);box-shadow:2px 2px 0 var(--orange)}
    .review-card{
      background:var(--card);border:2.5px solid var(--border);border-radius:20px;
      box-shadow:var(--shadow);padding:24px;display:flex;flex-direction:column;gap:12px;
      transition:box-shadow .2s,transform .2s;
    }
    .review-card:hover{box-shadow:7px 7px 0 rgba(0,0,0,0.13);transform:translateY(-3px)}
    .dot-bg{
      position:fixed;inset:0;
      background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);
      background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;
    }
    @media(max-width:600px){
      .review-grid{grid-template-columns:1fr!important}
      .bar-label{font-size:12px!important}
    }
  `}</style>
)

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff/60)>1?'s':''} ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff/3600)>1?'s':''} ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff/86400)>1?'s':''} ago`
  if (diff < 2592000) return `${Math.floor(diff / 604800)} week${Math.floor(diff/604800)>1?'s':''} ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff/2592000)>1?'s':''} ago`
  return 'over a year ago'
}

function Stars({ rating, size = 18 }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= rating ? '#F5C842' : 'none'}
          stroke={i <= rating ? '#F5C842' : 'var(--border)'} strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    supabase
      .from('Reviews')
      .select('id,rating,comment,Name,created_at')
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data || []))
  }, [])

  if (reviews === null) {
    return (
      <>
        <G />
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fredoka" style={{ fontSize: 22, color: 'var(--muted)' }}>Loading…</div>
        </div>
      </>
    )
  }

  const total = reviews.length
  const avg = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : null
  const countByStars = [5, 4].map(s => ({ stars: s, count: reviews.filter(r => r.rating === s).length }))
  const maxCount = Math.max(...countByStars.map(x => x.count), 1)

  return (
    <>
      <G />
      <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
        <div className="dot-bg" />

        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(255,248,240,0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '2.5px solid var(--border)', padding: '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13, background: 'var(--orange)',
              border: '2.5px solid var(--text)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '3px 3px 0 var(--text)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
            <span className="fredoka" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>Orivox</span>
          </Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/reviews" className="nav-link" style={{ background: 'var(--orange)', color: '#fff', borderColor: 'var(--orange)', boxShadow: '2px 2px 0 var(--orange)' }}>Reviews</Link>
            <Link href="/progress" className="nav-link">Progress</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/" className="nav-link">← Back</Link>
          </div>
        </header>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px', position: 'relative', zIndex: 1 }}>

          {/* Page title */}
          <div className="fadeUp" style={{ marginBottom: 40, textAlign: 'center' }}>
            <h1 className="fredoka" style={{ fontSize: 'clamp(36px,6vw,52px)', color: 'var(--text)', marginBottom: 10 }}>
              Testimonials
            </h1>
            {total > 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 17 }}>
                ⭐ {avg} out of 5 — based on {total} review{total !== 1 ? 's' : ''}
              </p>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: 17 }}>Be the first to share your experience</p>
            )}
          </div>

          {total === 0 ? (
            /* Empty state */
            <div className="fadeUp d1" style={{
              background: 'var(--card)', border: '2.5px solid var(--border)',
              borderRadius: 22, boxShadow: 'var(--shadow)',
              padding: '60px 32px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>💬</div>
              <p className="fredoka" style={{ fontSize: 22, marginBottom: 8 }}>No reviews yet</p>
              <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28 }}>
                Be the first to share your experience after a session.
              </p>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 30px', borderRadius: 50, fontFamily: 'Fredoka, sans-serif',
                fontSize: 17, fontWeight: 600, border: '2.5px solid var(--text)',
                background: 'var(--orange)', color: '#fff', textDecoration: 'none',
                boxShadow: '4px 4px 0 var(--text)', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 var(--text)' }}>
                Start a session →
              </Link>
            </div>
          ) : (
            <>
              {/* Rating breakdown */}
              <div className="fadeUp d1" style={{
                background: 'var(--card)', border: '2.5px solid var(--border)',
                borderRadius: 22, boxShadow: 'var(--shadow)', padding: '28px 32px',
                marginBottom: 28,
              }}>
                <p className="fredoka" style={{ fontSize: 19, marginBottom: 20 }}>Rating breakdown</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {countByStars.map(({ stars, count }) => (
                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, width: 80, flexShrink: 0 }}>
                        <span className="fredoka bar-label" style={{ fontSize: 14, color: 'var(--text)', width: 10 }}>{stars}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5C842" stroke="#F5C842" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(count / maxCount) * 100}%`,
                          background: stars === 5 ? 'var(--orange)' : 'var(--yellow)',
                          borderRadius: 5,
                          transition: 'width .6s cubic-bezier(.22,.68,0,1.2)',
                        }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 700, width: 60, textAlign: 'right', flexShrink: 0 }}>
                        {count} review{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review grid */}
              <div className="fadeUp d2 review-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}>
                {reviews.map((r, i) => (
                  <div key={r.id} className="review-card fadeUp" style={{ animationDelay: `${0.28 + i * 0.05}s` }}>
                    <Stars rating={r.rating} size={18} />
                    <p className="fredoka" style={{ fontSize: 14, color: 'var(--orange)' }}>
                      {r.Name || 'Anonymous'}
                    </p>
                    {r.comment && (
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', opacity: 0.85, flex: 1 }}>
                        "{r.comment}"
                      </p>
                    )}
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 'auto' }}>
                      {timeAgo(r.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          {total > 0 && (
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
                Try Orivox →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
