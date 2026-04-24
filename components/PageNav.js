'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const NAV = [
  { label: 'Progress', href: '/progress' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: '← Home', href: '/' },
]

export default function PageNav({ active }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <>
      <style>{`
        .ph{position:sticky;top:0;z-index:100;background:rgba(255,248,240,0.95);backdrop-filter:blur(12px);border-bottom:2.5px solid var(--border);}
        .phi{padding:14px 32px;display:flex;align-items:center;justify-content:space-between;}
        .plogo{display:flex;align-items:center;gap:12px;text-decoration:none;flex-shrink:0;}
        .plogo-i{width:42px;height:42px;border-radius:13px;background:var(--orange);border:2.5px solid var(--text);display:flex;align-items:center;justify-content:center;box-shadow:3px 3px 0 var(--text);}
        .plogo-t{font-family:'Fredoka',sans-serif;font-size:26px;font-weight:700;color:var(--text);}
        .pnav-d{display:flex;gap:8px;align-items:center;}
        .pnav-pill{display:inline-flex;align-items:center;padding:8px 16px;border-radius:50px;font-family:'Fredoka',sans-serif;font-size:14px;font-weight:600;border:2px solid var(--border);color:var(--muted);background:var(--card);text-decoration:none;transition:all .15s;box-shadow:2px 2px 0 var(--border);white-space:nowrap;}
        .pnav-pill:hover{border-color:var(--orange);color:var(--orange);box-shadow:2px 2px 0 var(--orange);}
        .pnav-pill.on{background:var(--orange);color:#fff;border-color:var(--orange);box-shadow:2px 2px 0 rgba(255,107,43,.35);}
        .pnav-pill.on:hover{color:#fff;}
        .phbg{display:none;width:40px;height:40px;border-radius:12px;background:var(--card);border:2px solid var(--border);cursor:pointer;align-items:center;justify-content:center;box-shadow:2px 2px 0 var(--border);transition:all .15s;flex-shrink:0;}
        .phbg:hover{border-color:var(--orange);box-shadow:2px 2px 0 var(--orange);}
        .pmob{position:absolute;top:100%;left:0;right:0;background:rgba(255,248,240,0.98);border-bottom:2.5px solid var(--border);padding:14px 20px;display:flex;flex-direction:column;gap:8px;z-index:200;}
        .pmob-pill{display:flex;align-items:center;padding:13px 20px;border-radius:14px;font-family:'Fredoka',sans-serif;font-size:16px;font-weight:600;border:2px solid var(--border);color:var(--muted);background:var(--card);text-decoration:none;transition:all .15s;box-shadow:2px 2px 0 var(--border);}
        .pmob-pill:hover{border-color:var(--orange);color:var(--orange);}
        .pmob-pill.on{background:var(--orange);color:#fff;border-color:var(--orange);box-shadow:2px 2px 0 rgba(255,107,43,.35);}
        @media(max-width:600px){
          .phi{padding:12px 16px;}
          .pnav-d{display:none;}
          .phbg{display:flex;}
        }
      `}</style>
      <header className="ph">
        <div className="phi">
          <Link href="/" className="plogo">
            <div className="plogo-i">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
            <span className="plogo-t">Orivox</span>
          </Link>

          <div className="pnav-d">
            {NAV.map(l => (
              <Link key={l.href} href={l.href} className={`pnav-pill${active === l.href ? ' on' : ''}`}>{l.label}</Link>
            ))}
          </div>

          <button className="phbg" onClick={e => { e.stopPropagation(); setOpen(o => !o) }} aria-label="Menu">
            {open
              ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><path d="M3 3l12 12M15 3L3 15"/></svg>
              : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><path d="M2 4h14M2 9h14M2 14h14"/></svg>
            }
          </button>
        </div>

        {open && (
          <div className="pmob" onClick={e => e.stopPropagation()}>
            {NAV.map(l => (
              <Link key={l.href} href={l.href} className={`pmob-pill${active === l.href ? ' on' : ''}`} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
