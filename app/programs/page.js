'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PageNav from '../../components/PageNav'
import { PROGRAMS, DIFFICULTY_ORDER, getProgram } from '../../lib/programs'

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
    @keyframes slideIn{from{opacity:0;transform:translateX(44px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-44px)}to{opacity:1;transform:translateX(0)}}
    @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(500px) rotate(720deg);opacity:0}}
    @keyframes celebBounce{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.3) rotate(10deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes popIn{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes barGrow{from{width:0}to{width:var(--bar-w)}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .slideIn{animation:slideIn .38s cubic-bezier(.22,.68,0,1.2) both}
    .slideInLeft{animation:slideInLeft .38s cubic-bezier(.22,.68,0,1.2) both}
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
      font-size:15px;font-weight:600;color:var(--text);}
    .quiz-opt:hover{border-color:var(--orange);background:var(--orange-dim);}
    .quiz-opt.sel{border-color:var(--orange);background:var(--orange-dim);color:var(--orange);}
    .prog-bar{height:8px;border-radius:4px;background:var(--border);overflow:hidden;}
    .prog-bar-fill{height:100%;border-radius:4px;background:var(--orange);transition:width .6s cubic-bezier(.22,.68,0,1.2);}
    @media(max-width:640px){
      .two-col{grid-template-columns:1fr!important;}
      .prog-grid{grid-template-columns:1fr!important;}
    }
  `}</style>
)

// ── Constants ─────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: 'What do you want to improve most?',
    field: 'goal',
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
    field: 'level',
    opts: [
      { key:'beginner', label:'Complete beginner', sub:'I get very nervous and avoid speaking' },
      { key:'getting-started', label:'Getting started', sub:'I can speak but I have obvious weaknesses' },
      { key:'intermediate', label:'Intermediate', sub:'I am decent but want to be noticeably better' },
      { key:'advanced', label:'Advanced', sub:'I am already good and want to reach the next level' },
    ],
  },
  {
    q: 'How much time can you commit daily?',
    field: 'time',
    opts: [
      { key:'2-3min', label:'2–3 minutes', sub:'Just a quick session' },
      { key:'5-7min', label:'5–7 minutes', sub:'A solid daily practice' },
      { key:'10-15min', label:'10–15 minutes', sub:'I am serious about improving' },
      { key:'30min', label:'30+ minutes', sub:'I want intensive training' },
    ],
  },
  {
    q: 'What is your main goal?',
    field: 'mainGoal',
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

const DIFF_CFG = {
  Beginner:     { badge:'badge-green',  color:'var(--green)',  label:'Beginner' },
  Intermediate: { badge:'badge-orange', color:'var(--orange)', label:'Intermediate' },
  Advanced:     { badge:'badge-red',    color:'var(--red)',    label:'Advanced' },
}

function fmtTime(secs) {
  if (!secs) return '1 min'
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60), s = secs % 60
  return s ? `${m}:${s.toString().padStart(2,'0')}` : `${m} min`
}

// ── Recommendation logic (uses quiz answers + test scores) ────────────────────
function getSmartRecommendations(answers, testResult) {
  const { goal, level, time, mainGoal } = answers || {}
  const delivery   = testResult?.delivery   ?? 0
  const clarity    = testResult?.clarity    ?? 0
  const structure  = testResult?.structure  ?? 0
  const confidence = testResult?.confidence ?? 0

  const allHigh = [delivery, clarity, structure, confidence].every(s => s >= 18)
  const allLow  = [delivery, clarity, structure, confidence].every(s => s <= 10)
  const isBeg   = level === 'beginner'
  const isGS    = level === 'getting-started'
  const isAdv   = level === 'advanced'
  const shortTime = time === '2-3min'
  const longTime  = time === '30min'

  let primary, secondaries

  if (goal === 'case-competition' || mainGoal === 'comp') {
    primary = 'case-competition-mastery'
    secondaries = ['pressure-training', 'debate-foundations']
  } else if (goal === 'interview' || mainGoal === 'job') {
    primary = 'interview-ready'
    secondaries = ['structure-master', 'confidence-starter']
  } else if (goal === 'filler') {
    if (delivery >= 15) {
      primary = 'filler-word-advanced'; secondaries = ['pressure-training', 'vocabulary-builder']
    } else {
      primary = 'filler-word-eliminator'; secondaries = ['confidence-starter', 'structure-master']
    }
  } else if (goal === 'confidence') {
    if (isBeg || isGS) {
      primary = 'confidence-starter'; secondaries = ['first-words', 'filler-word-eliminator']
    } else {
      primary = 'leadership-voice'; secondaries = ['interview-ready', 'pressure-training']
    }
  } else if (goal === 'structure') {
    primary = 'structure-master'; secondaries = ['interview-ready', 'debate-foundations']
  } else if (goal === 'quick-thinking') {
    primary = 'quick-thinker'; secondaries = ['confidence-starter', 'filler-word-eliminator']
  } else if (goal === 'business') {
    primary = 'business-communication'; secondaries = ['interview-ready', 'leadership-voice']
  } else if (goal === 'debate') {
    if (isAdv) {
      primary = 'political-speaker'; secondaries = ['debate-foundations', 'pressure-training']
    } else {
      primary = 'debate-foundations'; secondaries = ['structure-master', 'political-speaker']
    }
  } else {
    primary = 'structure-master'; secondaries = ['confidence-starter', 'interview-ready']
  }

  // Override edges
  if (allHigh && !['case-competition-mastery','pressure-training','filler-word-advanced','political-speaker','leadership-voice'].includes(primary)) {
    secondaries = [primary, ...secondaries.slice(0,1)]
    primary = isAdv ? 'pressure-training' : 'filler-word-advanced'
  }
  if (allLow && !['first-words','confidence-starter','quick-thinker','filler-word-eliminator'].includes(primary)) {
    secondaries = [primary, ...secondaries.slice(0,1)]
    primary = isBeg ? 'first-words' : 'confidence-starter'
  }
  if (isBeg && shortTime && !['first-words','quick-thinker'].includes(primary)) {
    secondaries = [primary, ...secondaries.slice(0,1)]
    primary = 'first-words'
  }
  if (isAdv && longTime && !['case-competition-mastery','pressure-training','leadership-voice'].includes(primary)) {
    secondaries = [primary, ...secondaries.slice(0,1)]
    primary = 'case-competition-mastery'
  }

  return [primary, ...secondaries.slice(0,2)].map(id => getProgram(id)).filter(Boolean)
}

function getPersonalizedReason(programId, answers, testResult) {
  const goalLabels = {
    filler:'reducing filler words', confidence:'speaking with more confidence',
    structure:'structuring your thoughts', 'quick-thinking':'thinking faster on your feet',
    interview:'interview skills', debate:'public speaking and debate',
    business:'business communication', 'case-competition':'case competition prep',
  }
  const goalLabel = goalLabels[answers?.goal] || 'improving your speaking'
  const d = testResult?.delivery ?? 0
  const conf = testResult?.confidence ?? 0
  const s = testResult?.structure ?? 0
  const c = testResult?.clarity ?? 0

  const low = { delivery:d, confidence:conf, structure:s, clarity:c }
  const weakest = Object.entries(low).sort((a,b) => a[1]-b[1])[0]
  const weakLabels = { delivery:'delivery', confidence:'confidence', structure:'structure', clarity:'clarity' }
  const wLabel = weakLabels[weakest?.[0]] || 'delivery'
  const wScore = weakest?.[1] ?? 0

  const reasons = {
    'filler-word-eliminator': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — this program uses 7 focused sessions to rewire your filler word habits from the ground up.`,
    'filler-word-advanced': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — this advanced program puts you in high-pressure scenarios where filler words are hardest to control.`,
    'first-words': `Your speaking profile shows this is the right place to start — short daily sessions that build real confidence before anything else.`,
    'quick-thinker': `You told us your goal is ${goalLabel} — training instant response is the fastest way to sound more confident, and your ${wLabel} score of ${wScore} confirms this is the right focus.`,
    'confidence-starter': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — 10 days of deliberate directness training will change how you come across in any room.`,
    'structure-master': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — organized thinking is the single biggest upgrade most speakers can make.`,
    'interview-ready': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — three weeks of progressive interview practice across every question type you will face.`,
    'debate-foundations': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — learning to argue any side of any issue is the fastest path to becoming genuinely persuasive.`,
    'storytelling-basics': `Your ${wLabel} score was ${wScore} — this program teaches the narrative structure that makes people actually want to listen.`,
    'business-communication': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — speaking like you belong in the room is a learnable skill and this program builds it systematically.`,
    'case-competition-mastery': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — 30 days of intensive case prep across every format judges use.`,
    'vocabulary-builder': `Your ${wLabel} score was ${wScore} — your ideas deserve better words, and this program sharpens your language to match the quality of your thinking.`,
    'pressure-training': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — progressive overload for your speaking muscles, each week harder and you get stronger.`,
    'leadership-voice': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — executive presence is developed not born, and this program builds it over 21 deliberate days.`,
    'political-speaker': `You told us your goal is ${goalLabel} and your ${wLabel} score was ${wScore} — political argumentation is the highest difficulty setting for public speaking.`,
  }
  return reasons[programId] || `Based on your goal of ${goalLabel} and a ${wLabel} score of ${wScore}, this is the strongest match for where you are right now.`
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({length:36},(_,i)=>({
    id:i, left:5+(i*2.5)%90,
    color:['#FF6B2B','#F5C842','#2D7A4F','#3B82F6','#E84040','#FF8F5E'][i%6],
    delay:(i*0.04)%1.3, size:6+(i%5)*3,
    rot:(i*53)%360, dur:1.2+(i%4)*0.28, shape:i%3===0?'50%':'3px',
  }))
  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:999}}>
      {pieces.map(p=>(
        <div key={p.id} style={{position:'absolute',top:'-5%',left:`${p.left}%`,
          width:p.size,height:p.size,borderRadius:p.shape,background:p.color,
          transform:`rotate(${p.rot}deg)`,
          animation:`confettiFall ${p.dur}s ease-in ${p.delay}s both`}}/>
      ))}
    </div>
  )
}

// ── Score ring for results ─────────────────────────────────────────────────────
function ScoreRing({score, size=110}) {
  const r=(size-10)/2, circ=2*Math.PI*r
  const color=score>=80?'#2D7A4F':score>=60?'#CC6600':'#E84040'
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0E8E0" strokeWidth={9}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9}
        strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"/>
      <text x={size/2} y={size/2} fill={color} fontSize={size/3.2} fontWeight="700"
        fontFamily="Fredoka, sans-serif" textAnchor="middle" dominantBaseline="middle"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}>
        {score}
      </text>
    </svg>
  )
}

// ── Horizontal score bar ──────────────────────────────────────────────────────
function ScoreBar({label, value, max=25, color='var(--orange)', showValue=true, animate=true}) {
  const pct = Math.round((value/max)*100)
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:13,fontWeight:600}}>
        <span style={{color:'var(--text)'}}>{label}</span>
        {showValue && <span style={{color,fontFamily:'Fredoka, sans-serif'}}>{value}<span style={{color:'var(--muted)',fontWeight:400,fontSize:11}}>/{max}</span></span>}
      </div>
      <div style={{height:10,borderRadius:5,background:'var(--border)',overflow:'hidden'}}>
        <div style={{
          height:'100%',borderRadius:5,background:color,
          width:`${pct}%`,
          transition: animate ? 'width .8s cubic-bezier(.22,.68,0,1.2)' : 'none',
        }}/>
      </div>
    </div>
  )
}

// ── Program card ─────────────────────────────────────────────────────────────
function ProgramCard({program, progress, completedIds, onEnroll, recommended, activeId}) {
  const cfg = DIFF_CFG[program.difficulty] || DIFF_CFG.Beginner
  const isActive = activeId === program.id
  const isDone = completedIds.includes(program.id)
  const prog = progress?.programId === program.id ? progress : null
  const currentDay = prog?.currentDay ?? 1
  const pct = Math.round(((currentDay-1)/program.duration)*100)

  return (
    <div className="prog-card" style={{border:recommended?'2.5px solid var(--orange)':undefined,position:'relative'}}>
      {recommended && (
        <div style={{position:'absolute',top:-10,left:16,background:'var(--orange)',color:'#fff',fontSize:10,fontWeight:700,fontFamily:'Fredoka, sans-serif',padding:'2px 10px',borderRadius:50,letterSpacing:'.06em'}}>RECOMMENDED</div>
      )}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
        {isDone && <span style={{fontSize:11,fontWeight:700,color:'var(--green)',fontFamily:'Fredoka',background:'var(--green-dim)',padding:'2px 10px',borderRadius:50,border:'1.5px solid #b8dfc8'}}>✓ Completed</span>}
      </div>
      <div className="fredoka" style={{fontSize:18,fontWeight:700,color:'var(--text)',marginBottom:4,lineHeight:1.2}}>{program.name}</div>
      <div style={{fontSize:13,color:'var(--muted)',marginBottom:12,lineHeight:1.5}}>{program.tagline}</div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
        <span style={{fontSize:12,color:'var(--muted)',background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:50,padding:'2px 10px'}}>{program.duration} days</span>
        <span style={{fontSize:12,color:'var(--muted)',background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:50,padding:'2px 10px'}}>{fmtTime(program.speakTime)}/session</span>
      </div>
      {isActive && prog && (
        <div style={{marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--muted)',marginBottom:4}}>
            <span>Day {currentDay} of {program.duration}</span><span>{pct}%</span>
          </div>
          <div className="prog-bar"><div className="prog-bar-fill" style={{width:`${pct}%`}}/></div>
        </div>
      )}
      {isActive ? (
        <button className="btn btn-green btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={()=>onEnroll(program,'continue')}>
          Continue — Day {currentDay} of {program.duration}
        </button>
      ) : isDone ? (
        <button className="btn btn-cream btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={()=>onEnroll(program,'redo')}>
          Redo Program
        </button>
      ) : (
        <button className="btn btn-orange btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={()=>onEnroll(program,'start')}>
          Start Program
        </button>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ProgramsPage() {
  const router = useRouter()

  const [view, setView] = useState('loading')
  const [quizScreen, setQuizScreen] = useState(0)
  const [slideDir, setSlideDir] = useState('forward')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [testResult, setTestResult] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [progress, setProgress] = useState(null)
  const [completedPrograms, setCompletedPrograms] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [missedDays, setMissedDays] = useState(0)
  const [todayDone, setTodayDone] = useState(false)
  const [enrollConfirm, setEnrollConfirm] = useState(null)

  const today = new Date().toLocaleDateString('en-CA')

  useEffect(() => {
    const diagDone    = localStorage.getItem('orivox_diagnostic_complete') === 'true'
    const answers     = JSON.parse(localStorage.getItem('orivox_diagnostic_answers') || 'null')
    const testRes     = JSON.parse(localStorage.getItem('orivox_diagnostic_test_result') || 'null')
    const prog        = JSON.parse(localStorage.getItem('orivox_program_progress') || 'null')
    const completed   = JSON.parse(localStorage.getItem('orivox_completed_programs') || '[]')
    const activeProgId= localStorage.getItem('orivox_active_program') || null

    setProgress(prog)
    setCompletedPrograms(completed)
    setActiveId(activeProgId)

    // Returning from the speaking test — show results
    if (!diagDone && answers && testRes) {
      setQuizAnswers(answers)
      setTestResult(testRes)
      const recs = getSmartRecommendations(answers, testRes)
      setRecommendations(recs)
      setView('results')
      return
    }

    // Fully done with onboarding
    if (diagDone) {
      if (activeProgId && prog) {
        const program = getProgram(activeProgId)
        if (program) {
          const lastDate = prog.lastCompletedDate
          if (lastDate && lastDate !== today) {
            const diff = Math.round((new Date(today+'T12:00:00')-new Date(lastDate+'T12:00:00'))/86400000)
            if (diff > 1) setMissedDays(diff - 1)
          }
          if (prog.lastCompletedDate === today) setTodayDone(true)
          if (prog.currentDay > program.duration) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3500)
            setView('complete')
            return
          }
        }
        setView('active')
      } else {
        if (answers) {
          setQuizAnswers(answers)
          if (testRes) {
            setTestResult(testRes)
            setRecommendations(getSmartRecommendations(answers, testRes))
          }
        }
        setView('browse')
      }
      return
    }

    // Quiz done but test not yet taken — go straight to speaking transition
    if (answers && !testRes) {
      setQuizAnswers(answers)
      setView('speaking-transition')
      return
    }

    setView('welcome')
  }, [])

  // ── Enrollment helpers ────────────────────────────────────────────────────
  const handleEnroll = (program, mode) => {
    if (mode === 'continue') { setView('active'); return }
    if (mode === 'redo') {
      const fresh = {programId:program.id, currentDay:1, enrolledDate:today, lastCompletedDate:null, dayScores:{}}
      localStorage.setItem('orivox_program_progress', JSON.stringify(fresh))
      localStorage.setItem('orivox_active_program', program.id)
      setProgress(fresh); setActiveId(program.id); setView('active'); return
    }
    if (activeId && activeId !== program.id) { setEnrollConfirm(program); return }
    startProgram(program)
  }

  const startProgram = (program) => {
    localStorage.setItem('orivox_diagnostic_complete', 'true')
    const fresh = {programId:program.id, currentDay:1, enrolledDate:today, lastCompletedDate:null, dayScores:{}}
    localStorage.setItem('orivox_program_progress', JSON.stringify(fresh))
    localStorage.setItem('orivox_active_program', program.id)
    setProgress(fresh); setActiveId(program.id); setEnrollConfirm(null); setView('active')
  }

  const launchSession = () => {
    if (!activeId || !progress) return
    const program = getProgram(activeId)
    if (!program) return
    const dayData = program.days[progress.currentDay - 1]
    if (!dayData) return
    const sessionCtx = {
      programId:program.id, programName:program.name,
      day:progress.currentDay, totalDays:program.duration,
      prompt:dayData.prompt || null, category:dayData.category, difficulty:dayData.difficulty,
      caseType:dayData.caseType||'General Q&A',
      speakTime:dayData.speakTime||program.speakTime,
      forcePrepTime:program.forcePrepTime??null,
      focus:dayData.focus, certificate:program.certificate,
    }
    localStorage.setItem('orivox_current_program_session', JSON.stringify(sessionCtx))
    router.push('/')
  }

  // ── Quiz handlers ─────────────────────────────────────────────────────────
  const handleAnswer = (key, field) => {
    const newAnswers = {...quizAnswers, [field]: key}
    setQuizAnswers(newAnswers)
    setSlideDir('forward')
    if (quizScreen < QUIZ.length - 1) {
      setTimeout(() => setQuizScreen(s => s + 1), 180)
    } else {
      localStorage.setItem('orivox_diagnostic_answers', JSON.stringify(newAnswers))
      setTimeout(() => setView('speaking-transition'), 180)
    }
  }

  const handleBack = () => {
    if (quizScreen === 0) { setSlideDir('backward'); setView('welcome'); return }
    setSlideDir('backward')
    setQuizScreen(s => s - 1)
  }

  const startSpeakingTest = () => {
    localStorage.setItem('orivox_diagnostic_session', JSON.stringify({mode:'diagnostic',category:'General',difficulty:'Medium',speakTime:30,prepTime:0}))
    router.push('/')
  }

  if (view === 'loading') return null

  // ── Projected scores for results screen ───────────────────────────────────
  const projections = testResult ? {
    delivery:   Math.min(25, testResult.delivery   + Math.round(8  + Math.random()*4)),
    clarity:    Math.min(25, testResult.clarity    + Math.round(4  + Math.random()*2)),
    structure:  Math.min(25, testResult.structure  + Math.round(5  + Math.random()*3)),
    confidence: Math.min(25, testResult.confidence + Math.round(6  + Math.random()*4)),
  } : null
  const projTotal  = projections ? projections.delivery + projections.clarity + projections.structure + projections.confidence : 0
  const improvement = testResult && projections ? projTotal - (testResult.totalScore || 0) : 0
  const recProgram = recommendations[0]

  // Weakest area callouts
  const callouts = (() => {
    if (!testResult) return []
    const scores = {delivery:testResult.delivery, clarity:testResult.clarity, structure:testResult.structure, confidence:testResult.confidence}
    const sorted = Object.entries(scores).sort((a,b)=>a[1]-b[1])
    const msgs = {
      delivery: `You averaged ${Object.values(testResult.fillerWordList||{}).reduce((a,b)=>a+b,0)} filler words — most people cut this in half within a week`,
      confidence: `Your confidence score suggests you are holding back — the right program unlocks this fast`,
      structure: `Your ideas are there — you just need a framework to organize them`,
      clarity: `Small vocabulary and pacing adjustments make a massive difference here`,
    }
    return sorted.slice(0, 3).map(([key]) => msgs[key]).filter(Boolean)
  })()

  return (
    <>
      <G/>
      <PageNav active="/programs"/>
      {showConfetti && <Confetti/>}

      <div style={{maxWidth:720, margin:'0 auto', padding:'32px 20px 80px'}}>

        {/* ── WELCOME CARD ─────────────────────────────────────────────── */}
        {view === 'welcome' && (
          <div className="fadeUp" style={{textAlign:'center', paddingTop:40}}>
            <div style={{fontSize:64, marginBottom:16}}>🎤</div>
            <h1 className="fredoka" style={{fontSize:36, color:'var(--text)', marginBottom:12}}>
              Let us find your perfect program
            </h1>
            <p style={{color:'var(--muted)', fontSize:17, marginBottom:32, lineHeight:1.7, maxWidth:460, margin:'0 auto 32px'}}>
              Four quick questions then a speaking test — takes about 2 minutes
            </p>
            <button className="btn btn-orange" style={{fontSize:20, padding:'16px 40px'}}
              onClick={() => setView('quiz')}>
              Get started
            </button>
            <div style={{marginTop:20}}>
              <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14,fontFamily:'Nunito'}}
                onClick={() => {
                  localStorage.setItem('orivox_diagnostic_complete','true')
                  setView('browse')
                }}>
                Skip — just browse programs
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ ─────────────────────────────────────────────────────── */}
        {view === 'quiz' && (
          <div>
            {/* Progress */}
            <div style={{marginBottom:28}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13,color:'var(--muted)'}}>
                <span style={{fontFamily:'Fredoka',fontWeight:600}}>Question {quizScreen+1} of {QUIZ.length}</span>
                <span>{Math.round(((quizScreen)/QUIZ.length)*100)}%</span>
              </div>
              <div style={{height:5,borderRadius:3,background:'var(--border)',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:3,background:'var(--orange)',width:`${(quizScreen/QUIZ.length)*100}%`,transition:'width .3s ease'}}/>
              </div>
            </div>

            {/* Animated question card */}
            <div key={`q-${quizScreen}`} className={slideDir==='forward'?'slideIn':'slideInLeft'}>
              <div className="card" style={{padding:'32px 28px'}}>
                <h2 className="fredoka" style={{fontSize:26,marginBottom:6,color:'var(--text)'}}>
                  {QUIZ[quizScreen].q}
                </h2>
                <p style={{fontSize:14,color:'var(--muted)',marginBottom:22}}>Pick one option</p>

                <div className="two-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {QUIZ[quizScreen].opts.map(opt => {
                    const isSelected = quizAnswers[QUIZ[quizScreen].field] === opt.key
                    return (
                      <div key={opt.key} className={`quiz-opt${isSelected?' sel':''}`}
                        onClick={() => handleAnswer(opt.key, QUIZ[quizScreen].field)}>
                        <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${isSelected?'var(--orange)':'var(--border)'}`,background:isSelected?'var(--orange)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          {isSelected && <div style={{width:7,height:7,borderRadius:'50%',background:'#fff'}}/>}
                        </div>
                        <div>
                          <div style={{fontWeight:700,fontSize:14}}>{opt.label}</div>
                          {opt.sub && <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{opt.sub}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button className="btn btn-cream btn-sm" style={{marginTop:20}} onClick={handleBack}>
                  ← Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SPEAKING TRANSITION ──────────────────────────────────────── */}
        {view === 'speaking-transition' && (
          <div className="fadeUp" style={{textAlign:'center', paddingTop:32}}>
            <div style={{width:80,height:80,borderRadius:24,background:'var(--orange)',border:'3px solid var(--text)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'4px 4px 0 var(--text)'}}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </div>
            <h1 className="fredoka" style={{fontSize:32,color:'var(--text)',marginBottom:12}}>
              One last thing — let us hear you speak
            </h1>
            <p style={{color:'var(--muted)',fontSize:17,lineHeight:1.7,maxWidth:460,margin:'0 auto 12px'}}>
              30 seconds on a random topic. This gives us your baseline so we can show you exactly how much you can improve.
            </p>
            <p style={{color:'var(--muted)',fontSize:14,marginBottom:32}}>
              No prep time needed — just hit the button and start talking
            </p>

            {/* What to expect */}
            <div className="card" style={{padding:'20px 24px',marginBottom:32,textAlign:'left',maxWidth:420,margin:'0 auto 32px'}}>
              {[
                ['🎯', 'Random General topic — Medium difficulty'],
                ['⏱', '30 seconds speak time, no prep'],
                ['🤖', 'AI scores your clarity, structure, and delivery'],
                ['📊', 'Results show your starting point and projected growth'],
              ].map(([icon, text]) => (
                <div key={text} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                  <span style={{fontSize:14,color:'var(--muted)'}}>{text}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-orange" style={{fontSize:20,padding:'16px 40px'}} onClick={startSpeakingTest}>
              Start speaking test
            </button>
            <div style={{marginTop:16}}>
              <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14,fontFamily:'Nunito'}}
                onClick={() => {
                  localStorage.setItem('orivox_diagnostic_complete','true')
                  const recs = getSmartRecommendations(quizAnswers, null)
                  setRecommendations(recs)
                  setView('browse')
                }}>
                Skip speaking test — go to programs
              </button>
            </div>
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────────── */}
        {view === 'results' && testResult && (
          <div className="fadeUp">
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 20px',borderRadius:50,background:'var(--orange-dim)',border:'2px solid var(--orange-border)',marginBottom:16}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'var(--orange)',display:'inline-block'}}/>
                <span style={{fontSize:13,fontWeight:700,color:'var(--orange)',fontFamily:'Fredoka',letterSpacing:'.05em'}}>Your speaking profile</span>
              </div>
            </div>

            {/* Section 1: Here is where you are today */}
            <div className="card fadeUp d1" style={{padding:'28px',marginBottom:20}}>
              <div className="fredoka" style={{fontSize:20,color:'var(--text)',marginBottom:4}}>
                Here is where you are today
              </div>
              <p style={{fontSize:14,color:'var(--muted)',marginBottom:24}}>
                This is your starting point — everyone starts somewhere. Here is what your 30-second session revealed.
              </p>
              <div style={{display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
                <div style={{flexShrink:0,textAlign:'center'}}>
                  <ScoreRing score={testResult.totalScore||0} size={110}/>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:6,fontFamily:'Fredoka'}}>Total score</div>
                </div>
                <div style={{flex:1,minWidth:200}}>
                  <ScoreBar label="Clarity" value={testResult.clarity||0} color="#3B82F6"/>
                  <ScoreBar label="Structure" value={testResult.structure||0} color="#2D7A4F"/>
                  <ScoreBar label="Filler words / Delivery" value={testResult.delivery||0} color="var(--orange)"/>
                  <ScoreBar label="Confidence" value={testResult.confidence||0} color="#8B5CF6"/>
                </div>
              </div>
            </div>

            {/* Section 2: Here is where you could be */}
            {projections && recProgram && (
              <div className="card fadeUp d2" style={{padding:'28px',marginBottom:20,border:'2.5px solid var(--green)',borderTop:'4px solid var(--green)'}}>
                <div className="fredoka" style={{fontSize:20,color:'var(--text)',marginBottom:4}}>
                  Here is where you could be
                </div>
                <p style={{fontSize:14,color:'var(--muted)',marginBottom:20}}>
                  Projected scores after completing {recProgram.name} ({recProgram.duration} days)
                </p>

                {/* Before / After comparison */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}} className="two-col">
                  <div style={{background:'var(--bg)',borderRadius:14,padding:'16px',border:'1.5px solid var(--border)'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12,fontFamily:'Fredoka'}}>Your scores today</div>
                    {[['Clarity',testResult.clarity||0,'#3B82F6'],['Structure',testResult.structure||0,'#2D7A4F'],['Delivery',testResult.delivery||0,'var(--orange)'],['Confidence',testResult.confidence||0,'#8B5CF6']].map(([label,val,color])=>(
                      <ScoreBar key={label} label={label} value={val} color={color} animate={false}/>
                    ))}
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:12,paddingTop:10,borderTop:'1.5px solid var(--border)',fontSize:14,fontWeight:700}}>
                      <span>Total</span><span style={{fontFamily:'Fredoka, sans-serif',color:'var(--text)'}}>{testResult.totalScore||0}</span>
                    </div>
                  </div>
                  <div style={{background:'var(--green-dim)',borderRadius:14,padding:'16px',border:'1.5px solid #b8dfc8'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--green)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12,fontFamily:'Fredoka'}}>After {recProgram.name}</div>
                    {[['Clarity',projections.clarity,'#3B82F6'],['Structure',projections.structure,'#2D7A4F'],['Delivery',projections.delivery,'var(--orange)'],['Confidence',projections.confidence,'#8B5CF6']].map(([label,val,color])=>(
                      <ScoreBar key={label} label={label} value={val} color={color}/>
                    ))}
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:12,paddingTop:10,borderTop:'1.5px solid #b8dfc8',fontSize:14,fontWeight:700}}>
                      <span>Total</span><span style={{fontFamily:'Fredoka, sans-serif',color:'var(--green)'}}>{projTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Bold improvement headline */}
                <div style={{background:'var(--green)',color:'#fff',borderRadius:12,padding:'14px 18px',marginBottom:16,textAlign:'center'}}>
                  <div className="fredoka" style={{fontSize:18,lineHeight:1.4}}>
                    Stick with us and you could improve your total score by up to <strong>{improvement} points</strong> in just {recProgram.duration} days
                  </div>
                </div>

                {/* Callouts */}
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {callouts.map((msg,i) => (
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,background:'var(--bg)',borderRadius:10,padding:'12px 14px',border:'1.5px solid var(--border)'}}>
                      <span style={{fontSize:16,flexShrink:0}}>💡</span>
                      <span style={{fontSize:14,color:'var(--text)',lineHeight:1.5}}>{msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Recommended program */}
            {recProgram && (
              <div className="card fadeUp d3" style={{padding:'28px',marginBottom:20,border:'2.5px solid var(--orange)',borderTop:'5px solid var(--orange)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                  <div style={{width:36,height:36,borderRadius:10,background:'var(--orange)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2l9.09 9.09L12 22 2.91 11.09z"/></svg>
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--orange)',textTransform:'uppercase',letterSpacing:'.07em',fontFamily:'Fredoka'}}>Your recommended program</div>
                    <div className="fredoka" style={{fontSize:22,color:'var(--text)'}}>{recProgram.name}</div>
                  </div>
                </div>

                <p style={{fontSize:15,color:'var(--muted)',marginBottom:16,lineHeight:1.6}}>
                  {getPersonalizedReason(recProgram.id, quizAnswers, testResult)}
                </p>

                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
                  <span className={`badge ${DIFF_CFG[recProgram.difficulty]?.badge}`}>{recProgram.difficulty}</span>
                  <span style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:50,padding:'3px 12px',fontSize:12,color:'var(--muted)'}}>{recProgram.duration} days</span>
                  <span style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:50,padding:'3px 12px',fontSize:12,color:'var(--muted)'}}>{fmtTime(recProgram.speakTime)}/session</span>
                </div>

                {/* Secondary picks */}
                {recommendations.slice(1).length > 0 && (
                  <div style={{marginBottom:24}}>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10,fontFamily:'Fredoka'}}>Also a good fit</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}} className="two-col">
                      {recommendations.slice(1).map(p => (
                        <div key={p.id} style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:12,padding:'14px'}}>
                          <span className={`badge ${DIFF_CFG[p.difficulty]?.badge}`} style={{marginBottom:8,display:'block',width:'fit-content'}}>{p.difficulty}</span>
                          <div className="fredoka" style={{fontSize:15,fontWeight:700,marginBottom:4}}>{p.name}</div>
                          <div style={{fontSize:12,color:'var(--muted)',marginBottom:10,lineHeight:1.4}}>{p.tagline}</div>
                          <button className="btn btn-cream btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={()=>startProgram(p)}>
                            Start this
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                  <button className="btn btn-orange" style={{flex:1,justifyContent:'center',fontSize:18,padding:'15px'}}
                    onClick={() => startProgram(recProgram)}>
                    Start my program
                  </button>
                  <button className="btn btn-cream" style={{justifyContent:'center'}}
                    onClick={() => {
                      localStorage.setItem('orivox_diagnostic_complete','true')
                      setView('browse')
                    }}>
                    Browse all programs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVE PROGRAM DAY ───────────────────────────────────────── */}
        {view === 'active' && activeId && (() => {
          const program = getProgram(activeId)
          if (!program || !progress) return null
          const currentDay = progress.currentDay
          const dayData = program.days[currentDay - 1]
          if (!dayData) return null
          const pct = Math.round(((currentDay-1)/program.duration)*100)
          const cfg = DIFF_CFG[program.difficulty]
          return (
            <div>
              {missedDays > 0 && !todayDone && (
                <div className="fadeUp" style={{background:'var(--yellow-dim)',border:'2px solid var(--yellow)',borderRadius:14,padding:'14px 20px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:22}}>☀️</span>
                  <div>
                    <div style={{fontWeight:700,fontFamily:'Fredoka',fontSize:16}}>Welcome back — you missed {missedDays} day{missedDays>1?'s':''}</div>
                    <div style={{fontSize:14,color:'var(--muted)'}}>No worries, your progress is saved. Ready to pick up on Day {currentDay}?</div>
                  </div>
                </div>
              )}

              <div className="fadeUp" style={{marginBottom:24}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14,fontFamily:'Nunito',fontWeight:600,padding:0}} onClick={()=>setView('browse')}>← All programs</button>
                  <span className={`badge ${cfg.badge}`}>{program.difficulty}</span>
                </div>
                <h1 className="fredoka" style={{fontSize:30,color:'var(--text)',marginBottom:4}}>{program.name}</h1>
                <p style={{color:'var(--muted)',fontSize:15}}>{program.tagline}</p>
              </div>

              <div className="card fadeUp d1" style={{padding:'20px 24px',marginBottom:20}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{fontFamily:'Fredoka',fontSize:16,fontWeight:700}}>Day {currentDay} of {program.duration}</span>
                  <span style={{fontSize:14,color:'var(--muted)'}}>{pct}% complete</span>
                </div>
                <div className="prog-bar" style={{height:10,marginBottom:8}}>
                  <div className="prog-bar-fill" style={{width:`${pct}%`}}/>
                </div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:8}}>
                  {Array.from({length:program.duration},(_,i)=>{
                    const d=i+1; const isDone=d<currentDay; const isCurr=d===currentDay
                    return (
                      <div key={d} style={{width:20,height:20,borderRadius:4,background:isDone?'var(--orange)':isCurr?'var(--orange-dim)':'var(--border)',border:isCurr?'2px solid var(--orange)':'2px solid transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:isDone?'#fff':isCurr?'var(--orange)':'var(--muted)'}}>
                        {isDone?'✓':d}
                      </div>
                    )
                  })}
                </div>
              </div>

              {todayDone ? (
                <div className="card fadeUp d2" style={{padding:'32px',textAlign:'center'}}>
                  <div style={{fontSize:48,marginBottom:12}}>✅</div>
                  <h2 className="fredoka" style={{fontSize:26,marginBottom:8}}>Day {currentDay-1} complete!</h2>
                  <p style={{color:'var(--muted)',fontSize:15,marginBottom:20}}>Great work. Come back tomorrow for Day {currentDay}.</p>
                  {program.days[currentDay-1] && (
                    <div style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:12,padding:'14px 18px',textAlign:'left',marginBottom:20}}>
                      <div style={{fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6,fontFamily:'Fredoka'}}>Tomorrow — Day {currentDay}</div>
                      <div style={{fontWeight:700,marginBottom:4}}>{program.days[currentDay-1].prompt || `${program.days[currentDay-1].category} ${program.days[currentDay-1].difficulty} prompt`}</div>
                      <div style={{fontSize:13,color:'var(--muted)'}}>Focus: {program.days[currentDay-1].focus}</div>
                    </div>
                  )}
                  <button className="btn btn-cream" onClick={()=>setView('browse')}>Browse programs</button>
                </div>
              ) : (
                <div className="card fadeUp d2" style={{padding:'28px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                    <div style={{width:40,height:40,borderRadius:11,background:'var(--orange-dim)',border:'2px solid var(--orange-border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                    </div>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:'var(--orange)',textTransform:'uppercase',letterSpacing:'.07em',fontFamily:'Fredoka'}}>Today's Session</div>
                      <div className="fredoka" style={{fontSize:20,color:'var(--text)'}}>Day {currentDay}</div>
                    </div>
                  </div>
                  <div style={{background:'var(--bg)',border:'2px solid var(--border)',borderRadius:14,padding:'18px 20px',marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8,fontFamily:'Fredoka'}}>{dayData.category} · {dayData.difficulty}</div>
                    <p style={{fontSize:17,fontWeight:700,color:'var(--text)',lineHeight:1.5}}>"{dayData.prompt||`A ${dayData.category} ${dayData.difficulty} prompt (selected for you)`}"</p>
                  </div>
                  <div style={{background:'var(--orange-dim)',border:'2px solid var(--orange-border)',borderRadius:14,padding:'16px 18px',marginBottom:20}}>
                    <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                      <span style={{fontSize:18,flexShrink:0}}>🎯</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:'var(--orange)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4,fontFamily:'Fredoka'}}>Today's coaching focus</div>
                        <p style={{fontSize:15,color:'var(--text)',lineHeight:1.6}}>{dayData.focus}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:10,marginBottom:24}}>
                    <div style={{flex:1,background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:12,padding:'12px 16px',textAlign:'center'}}>
                      <div style={{fontSize:11,color:'var(--muted)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Speak Time</div>
                      <div className="fredoka" style={{fontSize:22,color:'var(--text)'}}>{fmtTime(dayData.speakTime||program.speakTime)}</div>
                    </div>
                    {program.forcePrepTime===0 && (
                      <div style={{flex:1,background:'var(--red-dim)',border:'1.5px solid #f5c0c0',borderRadius:12,padding:'12px 16px',textAlign:'center'}}>
                        <div style={{fontSize:11,color:'var(--red)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Prep Time</div>
                        <div className="fredoka" style={{fontSize:22,color:'var(--red)'}}>None</div>
                      </div>
                    )}
                  </div>
                  <button className="btn btn-orange" style={{width:'100%',justifyContent:'center',fontSize:18,padding:'16px'}} onClick={launchSession}>
                    Start Day {currentDay} Session
                  </button>
                  <p style={{textAlign:'center',fontSize:12,color:'var(--muted)',marginTop:12}}>You'll be taken to the speaking coach, then returned here</p>
                </div>
              )}

              <div className="fadeUp d4" style={{textAlign:'center',marginTop:20}}>
                <button style={{background:'none',border:'none',cursor:'pointer',fontSize:13,color:'var(--muted)',fontFamily:'Nunito'}}
                  onClick={()=>{
                    if(confirm('Leave this program? Your progress will be saved but you will be un-enrolled.')){
                      localStorage.removeItem('orivox_active_program')
                      localStorage.removeItem('orivox_current_program_session')
                      setActiveId(null); setView('browse')
                    }
                  }}>
                  Leave program
                </button>
              </div>
            </div>
          )
        })()}

        {/* ── PROGRAM COMPLETE ─────────────────────────────────────────── */}
        {view === 'complete' && activeId && (() => {
          const program = getProgram(activeId)
          if (!program) return null
          return (
            <div className="fadeUp" style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:72,marginBottom:16,animation:'celebBounce .7s cubic-bezier(.22,.68,0,1.4) both'}}>🏆</div>
              <h1 className="fredoka" style={{fontSize:38,color:'var(--orange)',marginBottom:8}}>You did it!</h1>
              <h2 className="fredoka" style={{fontSize:24,color:'var(--text)',marginBottom:12}}>{program.name}</h2>
              <p style={{color:'var(--muted)',fontSize:16,marginBottom:8}}>Completed {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
              <div style={{background:'var(--yellow-dim)',border:'2.5px solid var(--yellow)',borderRadius:20,padding:'24px',maxWidth:400,margin:'24px auto',boxShadow:'4px 4px 0 rgba(245,200,66,.3)'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#7A5500',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:'Fredoka',marginBottom:8}}>Certificate Earned</div>
                <div className="fredoka" style={{fontSize:26,color:'var(--text)',marginBottom:4}}>{program.certificate}</div>
                <div style={{fontSize:13,color:'var(--muted)'}}>Added to your Achievements</div>
              </div>
              <p style={{color:'var(--muted)',fontSize:15,marginBottom:28,maxWidth:420,margin:'0 auto 28px'}}>Your certificate has been added to the Achievements section on your Progress page.</p>
              <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
                <Link href="/progress" className="btn btn-green" style={{textDecoration:'none'}}>View Achievements</Link>
                <button className="btn btn-orange" onClick={()=>{localStorage.removeItem('orivox_active_program');setActiveId(null);setView('browse')}}>Browse more programs</button>
              </div>
            </div>
          )
        })()}

        {/* ── BROWSE ───────────────────────────────────────────────────── */}
        {view === 'browse' && (
          <div>
            <div className="fadeUp" style={{marginBottom:32}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
                <div>
                  <h1 className="fredoka" style={{fontSize:32,color:'var(--text)',marginBottom:4}}>Programs</h1>
                  <p style={{color:'var(--muted)',fontSize:15}}>Structured practice paths with daily coaching</p>
                </div>
                {activeId && (
                  <button className="btn btn-green btn-sm" onClick={()=>setView('active')}>▶ Continue my program</button>
                )}
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="fadeUp d1" style={{marginBottom:32}}>
                <div style={{fontSize:13,fontWeight:700,color:'var(--orange)',textTransform:'uppercase',letterSpacing:'.07em',fontFamily:'Fredoka',marginBottom:12}}>★ Recommended for you</div>
                <div className="prog-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
                  {recommendations.map((p,i)=>(
                    <ProgramCard key={p.id} program={p} progress={progress}
                      completedIds={completedPrograms.map(c=>c.programId)}
                      activeId={activeId} recommended={i===0} onEnroll={handleEnroll}/>
                  ))}
                </div>
              </div>
            )}

            {DIFFICULTY_ORDER.map((diff,di)=>{
              const shown = PROGRAMS.filter(p=>p.difficulty===diff && !recommendations.find(r=>r.id===p.id))
              if (!shown.length) return null
              return (
                <div key={diff} className="fadeUp" style={{marginBottom:32,animationDelay:`${di*0.08}s`}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                    <span className={`badge ${DIFF_CFG[diff].badge}`} style={{fontSize:12}}>{diff}</span>
                    <div style={{flex:1,height:1,background:'var(--border)'}}/>
                  </div>
                  <div className="prog-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
                    {shown.map(p=>(
                      <ProgramCard key={p.id} program={p} progress={progress}
                        completedIds={completedPrograms.map(c=>c.programId)}
                        activeId={activeId} onEnroll={handleEnroll}/>
                    ))}
                  </div>
                </div>
              )
            })}

            <div className="fadeUp" style={{textAlign:'center',paddingTop:20}}>
              <button className="btn btn-cream btn-sm" onClick={()=>{
                localStorage.removeItem('orivox_diagnostic_complete')
                localStorage.removeItem('orivox_diagnostic_answers')
                localStorage.removeItem('orivox_diagnostic_test_result')
                setQuizAnswers({}); setQuizScreen(0); setSlideDir('forward')
                setRecommendations([]); setTestResult(null); setView('welcome')
              }}>
                Retake diagnostic
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enroll confirmation modal */}
      {enrollConfirm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:500,padding:20}}>
          <div className="card popIn" style={{maxWidth:420,width:'100%',padding:'32px 28px',textAlign:'center'}}>
            <h2 className="fredoka" style={{fontSize:24,marginBottom:12}}>Switch programs?</h2>
            <p style={{color:'var(--muted)',fontSize:15,marginBottom:24}}>You are currently enrolled in another program. Switching will un-enroll you from it.</p>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <button className="btn btn-orange" onClick={()=>startProgram(enrollConfirm)}>Yes, switch</button>
              <button className="btn btn-cream" onClick={()=>setEnrollConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
