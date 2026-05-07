'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PageNav from '../../components/PageNav'
import { PROGRAMS, DIFFICULTY_ORDER, getRecommendations, getRecommendationReason, getProgram } from '../../lib/programs'

// ── Styles ────────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;--orange-border:#FFD4BC;--green:#2D7A4F;
      --green-light:#3A9962;--green-dim:#E8F5EE;--yellow:#F5C842;--yellow-dim:#FFF9E0;
      --red:#E84040;--red-dim:#FFECEC;--blue:#3B82F6;--blue-dim:#EFF6FF;
      --text:#1A1A2E;--muted:#8A7E74;--border:#E8DDD4;
      --shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(500px) rotate(720deg);opacity:0}}
    @keyframes celebBounce{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.3) rotate(10deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes popIn{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .slideIn{animation:slideIn .4s cubic-bezier(.22,.68,0,1.2) both}
    .slideInLeft{animation:slideInLeft .4s cubic-bezier(.22,.68,0,1.2) both}
    .popIn{animation:popIn .35s cubic-bezier(.22,.68,0,1.4) both}
    .d1{animation-delay:.06s}.d2{animation-delay:.14s}.d3{animation-delay:.22s}
    .d4{animation-delay:.30s}.d5{animation-delay:.38s}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:50px;
      font-family:'Fredoka',sans-serif;font-size:17px;font-weight:600;cursor:pointer;
      border:2.5px solid var(--text);transition:all .15s;box-shadow:3px 3px 0 var(--text);white-space:nowrap;}
    .btn:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--text);}
    .btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0 var(--text);}
    .btn-orange{background:var(--orange);color:#fff;border-color:var(--orange);box-shadow:3px 3px 0 rgba(255,107,43,.4);}
    .btn-orange:hover{background:var(--orange-light);box-shadow:5px 5px 0 rgba(255,107,43,.4);}
    .btn-green{background:var(--green);color:#fff;border-color:var(--green);box-shadow:3px 3px 0 rgba(45,122,79,.4);}
    .btn-green:hover{background:var(--green-light);box-shadow:5px 5px 0 rgba(45,122,79,.4);}
    .btn-cream{background:#FFF3E6;color:var(--text);border-color:var(--border);}
    .btn-sm{font-size:14px;padding:8px 16px;}
    .card{background:var(--card);border:2.5px solid var(--border);border-radius:20px;box-shadow:var(--shadow);}
    .prog-card{background:var(--card);border:2.5px solid var(--border);border-radius:18px;
      box-shadow:3px 3px 0 rgba(0,0,0,0.08);padding:20px;transition:all .2s;cursor:default;}
    .prog-card:hover{box-shadow:6px 6px 0 rgba(0,0,0,0.12);transform:translateY(-2px);}
    .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:50px;
      font-size:11px;font-weight:700;font-family:'Fredoka',sans-serif;letter-spacing:.04em;}
    .badge-green{background:var(--green-dim);color:var(--green);border:1.5px solid #b8dfc8;}
    .badge-orange{background:var(--orange-dim);color:var(--orange);border:1.5px solid var(--orange-border);}
    .badge-red{background:var(--red-dim);color:var(--red);border:1.5px solid #f5c0c0;}
    .quiz-opt{display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:14px;
      border:2px solid var(--border);background:var(--card);cursor:pointer;transition:all .18s;
      font-family:'Nunito',sans-serif;font-size:15px;font-weight:600;color:var(--text);}
    .quiz-opt:hover{border-color:var(--orange);background:var(--orange-dim);}
    .quiz-opt.selected{border-color:var(--orange);background:var(--orange-dim);color:var(--orange);}
    .prog-bar{height:8px;border-radius:4px;background:var(--border);overflow:hidden;}
    .prog-bar-fill{height:100%;border-radius:4px;background:var(--orange);transition:width .6s cubic-bezier(.22,.68,0,1.2);}
    @media(max-width:640px){
      .prog-grid{grid-template-columns:1fr!important;}
      .quiz-cols{grid-template-columns:1fr!important;}
    }
  `}</style>
)

// ── Quiz data ─────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: 'What do you want to improve most?',
    opts: [
      { key:'filler', label:'Reducing filler words', sub:'I say um, like, and uh too much' },
      { key:'confidence', label:'Speaking with more confidence', sub:'I sound hesitant and unsure' },
      { key:'structure', label:'Structuring my thoughts', sub:'I ramble and lose my point' },
      { key:'quick-thinking', label:'Thinking faster on my feet', sub:'I freeze when put on the spot' },
      { key:'interview', label:'Interview and career skills', sub:'I want to nail job interviews' },
      { key:'debate', label:'Public speaking and debate', sub:'I want to argue and persuade better' },
      { key:'business', label:'Business communication', sub:'I want to sound professional and executive' },
      { key:'case-competition', label:'Case competition prep', sub:'I compete or want to compete in case comps' },
    ],
  },
  {
    q: 'How would you describe your speaking right now?',
    opts: [
      { key:'beginner', label:'Complete beginner', sub:'I get very nervous and avoid speaking' },
      { key:'getting-started', label:'Getting started', sub:'I can speak but I have obvious weaknesses' },
      { key:'intermediate', label:'Intermediate', sub:'I am decent but want to be noticeably better' },
      { key:'advanced', label:'Advanced', sub:'I am already good and want to reach the next level' },
    ],
  },
  {
    q: 'How much time can you commit daily?',
    opts: [
      { key:'2-3min', label:'2–3 minutes', sub:'Just a quick session' },
      { key:'5-7min', label:'5–7 minutes', sub:'A solid daily practice' },
      { key:'10-15min', label:'10–15 minutes', sub:'I am serious about improving' },
      { key:'30min', label:'30+ minutes', sub:'I want intensive training' },
    ],
  },
  {
    q: 'What is your main goal?',
    opts: [
      { key:'job', label:'Job interviews coming up', sub:'' },
      { key:'school', label:'School presentations and debates', sub:'' },
      { key:'comp', label:'Case competitions', sub:'' },
      { key:'conversations', label:'General confidence in conversations', sub:'' },
      { key:'public', label:'Public speaking events', sub:'' },
      { key:'better', label:'Just becoming a better communicator overall', sub:'' },
    ],
  },
]

// ── Difficulty config ─────────────────────────────────────────────────────────
const DIFF_CFG = {
  Beginner:     { badge:'badge-green', color:'var(--green)', label:'Beginner' },
  Intermediate: { badge:'badge-orange', color:'var(--orange)', label:'Intermediate' },
  Advanced:     { badge:'badge-red', color:'var(--red)', label:'Advanced' },
}

function fmtTime(secs) {
  if (!secs) return '1 min'
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60), s = secs % 60
  return s ? `${m}:${s.toString().padStart(2,'0')}` : `${m} min`
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i, left: 5 + (i * 2.4) % 90,
    color: ['#FF6B2B','#F5C842','#2D7A4F','#3B82F6','#E84040','#FF8F5E'][i % 6],
    delay: (i * 0.04) % 1.4, size: 6 + (i % 5) * 3,
    rot: (i * 53) % 360, dur: 1.2 + (i % 4) * 0.3,
    shape: i % 3 === 0 ? '50%' : '3px',
  }))
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:999 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', top:'-5%', left:`${p.left}%`,
          width:p.size, height:p.size, borderRadius:p.shape, background:p.color,
          transform:`rotate(${p.rot}deg)`,
          animation:`confettiFall ${p.dur}s ease-in ${p.delay}s both`,
        }}/>
      ))}
    </div>
  )
}

// ── Level chart (quiz results) ────────────────────────────────────────────────
function LevelChart({ level, programId }) {
  const levelMap = { beginner:30, 'getting-started':48, intermediate:62, advanced:75 }
  const boost = { 'filler-word-eliminator':22, 'filler-word-advanced':18, 'first-words':28,
    'quick-thinker':25, 'confidence-starter':24, 'structure-master':20, 'interview-ready':21,
    'debate-foundations':19, 'storytelling-basics':18, 'business-communication':20,
    'case-competition-mastery':22, 'vocabulary-builder':17, 'pressure-training':23,
    'leadership-voice':21, 'political-speaker':19 }
  const current = levelMap[level] || 50
  const potential = Math.min(96, current + (boost[programId] || 20))
  const dims = [
    { label:'Clarity', curr: current + (Math.random() > .5 ? 4 : -4) | 0 },
    { label:'Structure', curr: current + (Math.random() > .5 ? 3 : -6) | 0 },
    { label:'Confidence', curr: current + (Math.random() > .5 ? 2 : -5) | 0 },
    { label:'Delivery', curr: current + (Math.random() > .5 ? 5 : -3) | 0 },
    { label:'Vocab', curr: current + (Math.random() > .5 ? 1 : -7) | 0 },
  ].map(d => ({ ...d, curr: Math.max(20, Math.min(85, d.curr)), pot: Math.min(97, d.curr + (boost[programId] || 20)) }))

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>Your progress potential</span>
        <div style={{ display:'flex', gap:14, fontSize:12 }}>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:'#E8DDD4', display:'inline-block' }}/>Now</span>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:'var(--orange)', display:'inline-block' }}/>After program</span>
        </div>
      </div>
      {dims.map((d, i) => (
        <div key={d.label} style={{ marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13, fontWeight:600 }}>
            <span>{d.label}</span>
            <span style={{ color:'var(--orange)', fontFamily:'Fredoka, sans-serif' }}>{d.curr} → {d.pot}</span>
          </div>
          <div className="prog-bar">
            <div style={{ position:'relative', height:'100%', display:'flex' }}>
              <div style={{ width:`${d.pot}%`, background:'rgba(255,107,43,.18)', borderRadius:4, transition:'width .8s cubic-bezier(.22,.68,0,1.2)', transitionDelay:`${i*0.08}s` }}/>
              <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${d.curr}%`, background:'#C4B8AF', borderRadius:4 }}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Program Card ──────────────────────────────────────────────────────────────
function ProgramCard({ program, progress, completedIds, onEnroll, recommended, activeId }) {
  const cfg = DIFF_CFG[program.difficulty] || DIFF_CFG.Beginner
  const isActive = activeId === program.id
  const isDone = completedIds.includes(program.id)
  const prog = progress && progress.programId === program.id ? progress : null
  const currentDay = prog ? prog.currentDay : 1
  const pct = Math.round(((currentDay - 1) / program.duration) * 100)

  return (
    <div className="prog-card" style={{ border: recommended ? '2.5px solid var(--orange)' : undefined, position:'relative' }}>
      {recommended && (
        <div style={{ position:'absolute', top:-10, left:16, background:'var(--orange)', color:'#fff', fontSize:10, fontWeight:700, fontFamily:'Fredoka, sans-serif', padding:'2px 10px', borderRadius:50, letterSpacing:'.06em' }}>RECOMMENDED</div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
        {isDone && <span style={{ fontSize:11, fontWeight:700, color:'var(--green)', fontFamily:'Fredoka', background:'var(--green-dim)', padding:'2px 10px', borderRadius:50, border:'1.5px solid #b8dfc8' }}>✓ Completed</span>}
      </div>
      <div className="fredoka" style={{ fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:4, lineHeight:1.2 }}>{program.name}</div>
      <div style={{ fontSize:13, color:'var(--muted)', marginBottom:12, lineHeight:1.5 }}>{program.tagline}</div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:14 }}>
        <span style={{ fontSize:12, color:'var(--muted)', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:50, padding:'2px 10px' }}>{program.duration} days</span>
        <span style={{ fontSize:12, color:'var(--muted)', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:50, padding:'2px 10px' }}>{fmtTime(program.speakTime)}/session</span>
        <span style={{ fontSize:12, color:'var(--muted)', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:50, padding:'2px 10px' }}>{program.focus}</span>
      </div>
      {isActive && prog && (
        <div style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--muted)', marginBottom:4 }}>
            <span>Day {currentDay} of {program.duration}</span>
            <span>{pct}%</span>
          </div>
          <div className="prog-bar"><div className="prog-bar-fill" style={{ width:`${pct}%` }}/></div>
        </div>
      )}
      {isActive ? (
        <button className="btn btn-green btn-sm" style={{ width:'100%', justifyContent:'center' }} onClick={() => onEnroll(program, 'continue')}>
          Continue — Day {currentDay} of {program.duration}
        </button>
      ) : isDone ? (
        <button className="btn btn-cream btn-sm" style={{ width:'100%', justifyContent:'center' }} onClick={() => onEnroll(program, 'redo')}>
          Redo Program
        </button>
      ) : (
        <button className="btn btn-orange btn-sm" style={{ width:'100%', justifyContent:'center' }} onClick={() => onEnroll(program, 'start')}>
          Start Program
        </button>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProgramsPage() {
  const router = useRouter()

  // State
  const [view, setView] = useState('loading')
  const [quizScreen, setQuizScreen] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [progress, setProgress] = useState(null)
  const [completedPrograms, setCompletedPrograms] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [missedDays, setMissedDays] = useState(0)
  const [todayDone, setTodayDone] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [enrollConfirm, setEnrollConfirm] = useState(null) // program to confirm switch

  const today = new Date().toLocaleDateString('en-CA')

  // Load localStorage on mount
  useEffect(() => {
    const diagDone = localStorage.getItem('orivox_diagnostic_complete') === 'true'
    const answers = JSON.parse(localStorage.getItem('orivox_diagnostic_answers') || 'null')
    const prog = JSON.parse(localStorage.getItem('orivox_program_progress') || 'null')
    const completed = JSON.parse(localStorage.getItem('orivox_completed_programs') || '[]')
    const activeProgId = localStorage.getItem('orivox_active_program') || null

    setProgress(prog)
    setCompletedPrograms(completed)
    setActiveId(activeProgId)

    // Check if just returned from completing a program day
    if (prog && activeProgId) {
      const program = getProgram(activeProgId)
      if (program) {
        // Check missed days
        const lastDate = prog.lastCompletedDate
        if (lastDate && lastDate !== today) {
          const diff = Math.round(
            (new Date(today + 'T12:00:00') - new Date(lastDate + 'T12:00:00')) / 86400000
          )
          if (diff > 1) setMissedDays(diff - 1)
        }
        // Check today already done
        if (prog.lastCompletedDate === today) setTodayDone(true)
        // Check just completed
        if (prog.currentDay > program.duration) {
          setJustCompleted(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3500)
          setView('complete')
          return
        }
      }
    }

    if (!diagDone) {
      setView('quiz')
    } else if (activeProgId) {
      if (answers) setQuizAnswers(answers)
      setView('active')
    } else {
      if (answers) {
        setQuizAnswers(answers)
        const recs = getRecommendations(answers)
        setRecommendations(recs)
      }
      setView('browse')
    }
  }, [])

  // Enroll in a program (or continue / redo)
  const handleEnroll = (program, mode) => {
    if (mode === 'continue') {
      setView('active')
      return
    }
    if (mode === 'redo') {
      const fresh = { programId: program.id, currentDay: 1, enrolledDate: today, lastCompletedDate: null, dayScores: {} }
      localStorage.setItem('orivox_program_progress', JSON.stringify(fresh))
      localStorage.setItem('orivox_active_program', program.id)
      setProgress(fresh)
      setActiveId(program.id)
      setView('active')
      return
    }
    // 'start' — if already in another program, confirm switch
    if (activeId && activeId !== program.id) {
      setEnrollConfirm(program)
      return
    }
    startProgram(program)
  }

  const startProgram = (program) => {
    const fresh = { programId: program.id, currentDay: 1, enrolledDate: today, lastCompletedDate: null, dayScores: {} }
    localStorage.setItem('orivox_program_progress', JSON.stringify(fresh))
    localStorage.setItem('orivox_active_program', program.id)
    setProgress(fresh)
    setActiveId(program.id)
    setEnrollConfirm(null)
    setView('active')
  }

  // Launch session for the current program day
  const launchSession = () => {
    if (!activeId || !progress) return
    const program = getProgram(activeId)
    if (!program) return
    const dayData = program.days[progress.currentDay - 1]
    if (!dayData) return

    const sessionCtx = {
      programId: program.id,
      programName: program.name,
      day: progress.currentDay,
      totalDays: program.duration,
      prompt: dayData.prompt || null,
      category: dayData.category,
      difficulty: dayData.difficulty,
      caseType: dayData.caseType || 'General Q&A',
      speakTime: dayData.speakTime || program.speakTime,
      forcePrepTime: program.forcePrepTime ?? null,
      focus: dayData.focus,
      certificate: program.certificate,
    }
    localStorage.setItem('orivox_current_program_session', JSON.stringify(sessionCtx))
    router.push('/')
  }

  if (view === 'loading') return null

  return (
    <>
      <G/>
      <PageNav active="/programs"/>
      {showConfetti && <Confetti/>}

      <div style={{ maxWidth:760, margin:'0 auto', padding:'32px 20px 80px' }}>

        {/* ── DIAGNOSTIC QUIZ ── */}
        {view === 'quiz' && (
          <div className="fadeUp">
            {/* Progress bar */}
            <div style={{ marginBottom:32 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13, color:'var(--muted)' }}>
                <span style={{ fontFamily:'Fredoka', fontWeight:600 }}>Question {quizScreen + 1} of {QUIZ.length}</span>
                <span>{Math.round((quizScreen / QUIZ.length) * 100)}%</span>
              </div>
              <div className="prog-bar" style={{ height:6 }}>
                <div className="prog-bar-fill" style={{ width:`${(quizScreen / QUIZ.length) * 100}%` }}/>
              </div>
            </div>

            <div className="card" style={{ padding:'32px 28px' }}>
              <h2 className="fredoka" style={{ fontSize:26, marginBottom:8, color:'var(--text)' }}>
                {QUIZ[quizScreen].q}
              </h2>
              <p style={{ fontSize:14, color:'var(--muted)', marginBottom:24 }}>Pick one option</p>

              <div className="quiz-cols" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {QUIZ[quizScreen].opts.map(opt => {
                  const fieldKey = ['goal','level','time','mainGoal'][quizScreen]
                  const isSelected = quizAnswers[fieldKey] === opt.key
                  return (
                    <div key={opt.key} className={`quiz-opt${isSelected ? ' selected' : ''}`}
                      onClick={() => {
                        const fieldKeys = ['goal','level','time','mainGoal']
                        const newAnswers = { ...quizAnswers, [fieldKeys[quizScreen]]: opt.key }
                        setQuizAnswers(newAnswers)
                        setTimeout(() => {
                          if (quizScreen < QUIZ.length - 1) {
                            setQuizScreen(s => s + 1)
                          } else {
                            // Done — compute recommendations and show results
                            localStorage.setItem('orivox_diagnostic_complete', 'true')
                            localStorage.setItem('orivox_diagnostic_answers', JSON.stringify(newAnswers))
                            const recs = getRecommendations(newAnswers)
                            setRecommendations(recs)
                            setView('results')
                          }
                        }, 200)
                      }}>
                      <div style={{ width:22, height:22, borderRadius:'50%', border:`2px solid ${isSelected ? 'var(--orange)' : 'var(--border)'}`, background: isSelected ? 'var(--orange)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {isSelected && <div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }}/>}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>{opt.label}</div>
                        {opt.sub && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{opt.sub}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {quizScreen > 0 && (
                <button className="btn btn-cream btn-sm" style={{ marginTop:20 }} onClick={() => setQuizScreen(s => s - 1)}>
                  ← Back
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── QUIZ RESULTS ── */}
        {view === 'results' && recommendations.length > 0 && (
          <div className="fadeUp">
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:50, background:'var(--orange-dim)', border:'2px solid var(--orange-border)', marginBottom:16 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--orange)', fontFamily:'Fredoka' }}>Your speaking profile</span>
              </div>
              <h1 className="fredoka" style={{ fontSize:36, color:'var(--text)', marginBottom:8 }}>
                Here is your speaking profile
              </h1>
              <p style={{ color:'var(--muted)', fontSize:16 }}>
                Based on your answers — {QUIZ[1].opts.find(o => o.key === quizAnswers.level)?.label || 'Speaker'}
              </p>
            </div>

            {/* Chart */}
            <div className="card" style={{ padding:'24px 28px', marginBottom:20 }}>
              <LevelChart level={quizAnswers.level} programId={recommendations[0]?.id}/>
            </div>

            {/* Primary recommendation */}
            <div className="card" style={{ padding:'28px', marginBottom:16, border:'2.5px solid var(--orange)', borderTop:'5px solid var(--orange)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2l9.09 9.09L12 22 2.91 11.09z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'.07em', fontFamily:'Fredoka' }}>Top Recommendation</div>
                  <h2 className="fredoka" style={{ fontSize:22, color:'var(--text)' }}>{recommendations[0].name}</h2>
                </div>
              </div>
              <p style={{ color:'var(--muted)', fontSize:15, marginBottom:20, lineHeight:1.6 }}>
                {getRecommendationReason(recommendations[0].id, quizAnswers)}
              </p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
                <span style={{ background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:50, padding:'4px 12px', fontSize:12, color:'var(--muted)' }}>{recommendations[0].duration} days</span>
                <span style={{ background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:50, padding:'4px 12px', fontSize:12, color:'var(--muted)' }}>{fmtTime(recommendations[0].speakTime)}/session</span>
                <span className={`badge ${DIFF_CFG[recommendations[0].difficulty]?.badge}`}>{recommendations[0].difficulty}</span>
              </div>
              <button className="btn btn-orange" style={{ width:'100%', justifyContent:'center', fontSize:18 }}
                onClick={() => startProgram(recommendations[0])}>
                Start {recommendations[0].name}
              </button>
            </div>

            {/* Secondary recommendations */}
            {recommendations.slice(1).length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:12, fontFamily:'Fredoka' }}>Also a good fit</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="prog-grid">
                  {recommendations.slice(1).map(p => (
                    <div key={p.id} className="card" style={{ padding:18 }}>
                      <span className={`badge ${DIFF_CFG[p.difficulty]?.badge}`} style={{ marginBottom:8, display:'block', width:'fit-content' }}>{p.difficulty}</span>
                      <div className="fredoka" style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{p.name}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12, lineHeight:1.5 }}>{p.tagline}</div>
                      <button className="btn btn-cream btn-sm" style={{ width:'100%', justifyContent:'center' }}
                        onClick={() => startProgram(p)}>
                        Start this
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ textAlign:'center' }}>
              <button className="btn btn-cream" style={{ fontSize:15 }} onClick={() => setView('browse')}>
                Browse all programs
              </button>
            </div>
          </div>
        )}

        {/* ── ACTIVE PROGRAM DAY ── */}
        {view === 'active' && activeId && (() => {
          const program = getProgram(activeId)
          if (!program || !progress) return null
          const currentDay = progress.currentDay
          const dayData = program.days[currentDay - 1]
          if (!dayData) return null
          const pct = Math.round(((currentDay - 1) / program.duration) * 100)
          const cfg = DIFF_CFG[program.difficulty]

          return (
            <div>
              {/* Missed days banner */}
              {missedDays > 0 && !todayDone && (
                <div className="fadeUp" style={{ background:'var(--yellow-dim)', border:'2px solid var(--yellow)', borderRadius:14, padding:'14px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:22 }}>☀️</span>
                  <div>
                    <div style={{ fontWeight:700, fontFamily:'Fredoka', fontSize:16 }}>Welcome back — you missed {missedDays} day{missedDays > 1 ? 's' : ''}</div>
                    <div style={{ fontSize:14, color:'var(--muted)' }}>No worries, your progress is saved. Ready to pick up on Day {currentDay}?</div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="fadeUp" style={{ marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:14, fontFamily:'Nunito', fontWeight:600, padding:0 }}
                    onClick={() => setView('browse')}>
                    ← All programs
                  </button>
                  <span className={`badge ${cfg.badge}`}>{program.difficulty}</span>
                </div>
                <h1 className="fredoka" style={{ fontSize:30, color:'var(--text)', marginBottom:4 }}>{program.name}</h1>
                <p style={{ color:'var(--muted)', fontSize:15 }}>{program.tagline}</p>
              </div>

              {/* Progress bar */}
              <div className="card fadeUp d1" style={{ padding:'20px 24px', marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontFamily:'Fredoka', fontSize:16, fontWeight:700 }}>Day {currentDay} of {program.duration}</span>
                  <span style={{ fontSize:14, color:'var(--muted)' }}>{pct}% complete</span>
                </div>
                <div className="prog-bar" style={{ height:10, marginBottom:8 }}>
                  <div className="prog-bar-fill" style={{ width:`${pct}%` }}/>
                </div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:8 }}>
                  {Array.from({ length: program.duration }, (_, i) => {
                    const d = i + 1
                    const isDone = d < currentDay
                    const isCurr = d === currentDay
                    return (
                      <div key={d} style={{
                        width: 20, height: 20, borderRadius: 4,
                        background: isDone ? 'var(--orange)' : isCurr ? 'var(--orange-dim)' : 'var(--border)',
                        border: isCurr ? '2px solid var(--orange)' : '2px solid transparent',
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700,
                        color: isDone ? '#fff' : isCurr ? 'var(--orange)' : 'var(--muted)',
                      }}>
                        {isDone ? '✓' : d}
                      </div>
                    )
                  })}
                </div>
              </div>

              {todayDone ? (
                /* Already completed today */
                <div className="card fadeUp d2" style={{ padding:'32px', textAlign:'center' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <h2 className="fredoka" style={{ fontSize:26, marginBottom:8 }}>Day {currentDay - 1} complete!</h2>
                  <p style={{ color:'var(--muted)', fontSize:15, marginBottom:20 }}>
                    Great work. Come back tomorrow for Day {currentDay}.
                  </p>
                  <div style={{ background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:12, padding:'14px 18px', textAlign:'left', marginBottom:20 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:6, fontFamily:'Fredoka' }}>Tomorrow — Day {currentDay}</div>
                    {program.days[currentDay - 1] && (
                      <>
                        <div style={{ fontWeight:700, marginBottom:4 }}>{program.days[currentDay - 1].prompt || `${program.days[currentDay - 1].category} ${program.days[currentDay - 1].difficulty} prompt`}</div>
                        <div style={{ fontSize:13, color:'var(--muted)' }}>Focus: {program.days[currentDay - 1].focus}</div>
                      </>
                    )}
                  </div>
                  <button className="btn btn-cream" onClick={() => setView('browse')}>Browse programs</button>
                </div>
              ) : (
                /* Today's session */
                <div className="card fadeUp d2" style={{ padding:'28px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                    <div style={{ width:40, height:40, borderRadius:11, background:'var(--orange-dim)', border:'2px solid var(--orange-border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'.07em', fontFamily:'Fredoka' }}>Today's Session</div>
                      <div className="fredoka" style={{ fontSize:20, color:'var(--text)' }}>Day {currentDay}</div>
                    </div>
                  </div>

                  {/* Prompt */}
                  <div style={{ background:'var(--bg)', border:'2px solid var(--border)', borderRadius:14, padding:'18px 20px', marginBottom:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:8, fontFamily:'Fredoka' }}>
                      {dayData.category} · {dayData.difficulty}
                    </div>
                    <p style={{ fontSize:17, fontWeight:700, color:'var(--text)', lineHeight:1.5 }}>
                      "{dayData.prompt || `A ${dayData.category} ${dayData.difficulty} prompt (selected for you)`}"
                    </p>
                  </div>

                  {/* Coaching focus */}
                  <div style={{ background:'var(--orange-dim)', border:'2px solid var(--orange-border)', borderRadius:14, padding:'16px 18px', marginBottom:20 }}>
                    <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>🎯</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4, fontFamily:'Fredoka' }}>Today's coaching focus</div>
                        <p style={{ fontSize:15, color:'var(--text)', lineHeight:1.6 }}>{dayData.focus}</p>
                      </div>
                    </div>
                  </div>

                  {/* Speak time */}
                  <div style={{ display:'flex', gap:10, marginBottom:24 }}>
                    <div style={{ flex:1, background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:12, padding:'12px 16px', textAlign:'center' }}>
                      <div style={{ fontSize:11, color:'var(--muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>Speak Time</div>
                      <div className="fredoka" style={{ fontSize:22, color:'var(--text)' }}>{fmtTime(dayData.speakTime || program.speakTime)}</div>
                    </div>
                    {program.forcePrepTime === 0 && (
                      <div style={{ flex:1, background:'var(--red-dim)', border:'1.5px solid #f5c0c0', borderRadius:12, padding:'12px 16px', textAlign:'center' }}>
                        <div style={{ fontSize:11, color:'var(--red)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>Prep Time</div>
                        <div className="fredoka" style={{ fontSize:22, color:'var(--red)' }}>None</div>
                      </div>
                    )}
                  </div>

                  <button className="btn btn-orange" style={{ width:'100%', justifyContent:'center', fontSize:18, padding:'16px' }}
                    onClick={launchSession}>
                    Start Day {currentDay} Session
                  </button>
                  <p style={{ textAlign:'center', fontSize:12, color:'var(--muted)', marginTop:12 }}>
                    You'll be taken to the speaking coach, then returned here
                  </p>
                </div>
              )}

              {/* Leave program option */}
              <div className="fadeUp d4" style={{ textAlign:'center', marginTop:20 }}>
                <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:'var(--muted)', fontFamily:'Nunito' }}
                  onClick={() => {
                    if (confirm('Leave this program? Your progress will be saved but you will be un-enrolled.')) {
                      localStorage.removeItem('orivox_active_program')
                      localStorage.removeItem('orivox_current_program_session')
                      setActiveId(null)
                      setView('browse')
                    }
                  }}>
                  Leave program
                </button>
              </div>
            </div>
          )
        })()}

        {/* ── PROGRAM COMPLETE ── */}
        {view === 'complete' && activeId && (() => {
          const program = getProgram(activeId)
          if (!program) return null
          return (
            <div className="fadeUp" style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:72, marginBottom:16, animation:'celebBounce .7s cubic-bezier(.22,.68,0,1.4) both' }}>🏆</div>
              <h1 className="fredoka" style={{ fontSize:38, color:'var(--orange)', marginBottom:8 }}>You did it!</h1>
              <h2 className="fredoka" style={{ fontSize:24, color:'var(--text)', marginBottom:12 }}>{program.name}</h2>
              <p style={{ color:'var(--muted)', fontSize:16, marginBottom:8 }}>
                Completed {new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
              </p>
              <div style={{ background:'var(--yellow-dim)', border:'2.5px solid var(--yellow)', borderRadius:20, padding:'24px', maxWidth:400, margin:'24px auto', boxShadow:'4px 4px 0 rgba(245,200,66,.3)' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#7A5500', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'Fredoka', marginBottom:8 }}>Certificate Earned</div>
                <div className="fredoka" style={{ fontSize:26, color:'var(--text)', marginBottom:4 }}>{program.certificate}</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>Added to your Achievements</div>
              </div>
              <p style={{ color:'var(--muted)', fontSize:15, marginBottom:28, maxWidth:420, margin:'0 auto 28px' }}>
                Your certificate has been added to the Achievements section on your Progress page.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <Link href="/progress" className="btn btn-green" style={{ textDecoration:'none' }}>
                  View Achievements
                </Link>
                <button className="btn btn-orange" onClick={() => {
                  localStorage.removeItem('orivox_active_program')
                  setActiveId(null)
                  setView('browse')
                }}>
                  Browse more programs
                </button>
              </div>
            </div>
          )
        })()}

        {/* ── BROWSE ALL PROGRAMS ── */}
        {view === 'browse' && (
          <div>
            <div className="fadeUp" style={{ marginBottom:32 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                <div>
                  <h1 className="fredoka" style={{ fontSize:32, color:'var(--text)', marginBottom:4 }}>Programs</h1>
                  <p style={{ color:'var(--muted)', fontSize:15 }}>Structured practice paths with daily coaching</p>
                </div>
                {activeId && (
                  <button className="btn btn-green btn-sm" onClick={() => setView('active')}>
                    ▶ Continue my program
                  </button>
                )}
              </div>
            </div>

            {/* Recommendations highlight */}
            {recommendations.length > 0 && (
              <div className="fadeUp d1" style={{ marginBottom:32 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'.07em', fontFamily:'Fredoka', marginBottom:12 }}>
                  ★ Recommended for you
                </div>
                <div className="prog-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                  {recommendations.map((p, i) => (
                    <ProgramCard key={p.id} program={p} progress={progress}
                      completedIds={completedPrograms.map(c => c.programId)}
                      activeId={activeId} recommended={i === 0}
                      onEnroll={handleEnroll}/>
                  ))}
                </div>
              </div>
            )}

            {/* All programs by difficulty */}
            {DIFFICULTY_ORDER.map((diff, di) => {
              const progs = PROGRAMS.filter(p => p.difficulty === diff)
              // Filter out already-shown recommended ones
              const shown = recommendations.length > 0 ? progs.filter(p => !recommendations.find(r => r.id === p.id)) : progs
              if (shown.length === 0) return null
              return (
                <div key={diff} className="fadeUp" style={{ marginBottom:32, animationDelay:`${di * 0.1}s` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                    <span className={`badge ${DIFF_CFG[diff].badge}`} style={{ fontSize:12 }}>{diff}</span>
                    <div style={{ flex:1, height:1, background:'var(--border)' }}/>
                  </div>
                  <div className="prog-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                    {shown.map(p => (
                      <ProgramCard key={p.id} program={p} progress={progress}
                        completedIds={completedPrograms.map(c => c.programId)}
                        activeId={activeId}
                        onEnroll={handleEnroll}/>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Retake quiz */}
            <div className="fadeUp" style={{ textAlign:'center', paddingTop:20 }}>
              <button className="btn btn-cream btn-sm" onClick={() => {
                localStorage.removeItem('orivox_diagnostic_complete')
                localStorage.removeItem('orivox_diagnostic_answers')
                setQuizAnswers({})
                setQuizScreen(0)
                setRecommendations([])
                setView('quiz')
              }}>
                Retake diagnostic quiz
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Enroll confirmation modal */}
      {enrollConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:500, padding:20 }}>
          <div className="card popIn" style={{ maxWidth:420, width:'100%', padding:'32px 28px', textAlign:'center' }}>
            <h2 className="fredoka" style={{ fontSize:24, marginBottom:12 }}>Switch programs?</h2>
            <p style={{ color:'var(--muted)', fontSize:15, marginBottom:24 }}>
              You are currently enrolled in another program. Switching will un-enroll you from it (your progress will be lost).
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <button className="btn btn-orange" onClick={() => startProgram(enrollConfirm)}>Yes, switch</button>
              <button className="btn btn-cream" onClick={() => setEnrollConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
