'use client'
import { useState, useEffect } from 'react'
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
      --yellow:#F5C842;--yellow-dim:#FFF9E0;--red:#E84040;
      --text:#1A1A2E;--muted:#8A7E74;--border:#E8DDD4;
      --shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.06s}.d2{animation-delay:.14s}.d3{animation-delay:.22s}.d4{animation-delay:.30s}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .dot-bg{position:fixed;inset:0;background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;}
  `}</style>
)

export default function AchievementsPage() {
  const [unlockedIds, setUnlockedIds] = useState(new Set())
  const [hoveredBadge, setHoveredBadge] = useState(null)
  const [completedPrograms, setCompletedPrograms] = useState([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('orivox_achievements') || '[]')
      setUnlockedIds(new Set(stored.map(a => a.id)))
    } catch {}
    try {
      const cp = JSON.parse(localStorage.getItem('orivox_completed_programs') || '[]')
      setCompletedPrograms(cp)
    } catch {}
  }, [])

  const groups = [...new Set(ACHIEVEMENTS.map(a => a.group))]

  return (
    <>
      <G />
      <PageNav active="/achievements" />
      <div className="dot-bg" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fadeUp" style={{ marginBottom: 28 }}>
          <h1 className="fredoka" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 4 }}>Achievements</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>
            {unlockedIds.size} of {ACHIEVEMENTS.length} unlocked
          </p>
        </div>

        {/* Badge grid */}
        <div className="fadeUp d1" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 22, boxShadow: 'var(--shadow)', padding: '24px 28px', marginBottom: 20 }}>
          {groups.map(group => (
            <div key={group} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--orange)', marginBottom: 12, fontFamily: 'Fredoka, sans-serif' }}>{group}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 10 }}>
                {ACHIEVEMENTS.filter(a => a.group === group).map(ach => {
                  const unlocked = unlockedIds.has(ach.id)
                  const paths = Array.isArray(ach.path) ? ach.path : [ach.path]
                  return (
                    <div key={ach.id}
                      onMouseEnter={() => setHoveredBadge(ach.id)}
                      onMouseLeave={() => setHoveredBadge(null)}
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
                        <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1A1A2E', color: '#fff', borderRadius: 10, padding: '8px 12px', fontSize: 11, whiteSpace: 'normal', maxWidth: 200, textAlign: 'center', zIndex: 50, lineHeight: 1.5, pointerEvents: 'none' }}>
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

        {/* Program Certificates */}
        {completedPrograms.length > 0 && (
          <div className="fadeUp d2" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 22, boxShadow: 'var(--shadow)', padding: '24px 28px', marginBottom: 20 }}>
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

        {/* Empty state */}
        {unlockedIds.size === 0 && completedPrograms.length === 0 && (
          <div className="fadeUp d2" style={{ background: 'var(--card)', border: '2.5px solid var(--border)', borderRadius: 22, boxShadow: 'var(--shadow)', padding: '48px 32px', textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--orange-dim)', border: '2px solid var(--orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
            </div>
            <h2 className="fredoka" style={{ fontSize: 22, marginBottom: 8 }}>No achievements yet</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>Complete your first session to start unlocking badges.</p>
          </div>
        )}

      </div>
    </>
  )
}
