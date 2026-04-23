'use client'
import Link from 'next/link'

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#FFF8F0;--card:#FFFFFF;--orange:#FF6B2B;--orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;--orange-border:#FFD4BC;--text:#1A1A2E;
      --muted:#8A7E74;--border:#E8DDD4;--shadow:4px 4px 0px rgba(0,0,0,0.12);
    }
    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}
    .stat-card{
      background:var(--card);border:2.5px solid var(--border);border-radius:20px;
      box-shadow:var(--shadow);padding:24px 20px;text-align:center;
      transition:box-shadow .2s,transform .2s;
    }
    .stat-card:hover{box-shadow:7px 7px 0 rgba(0,0,0,0.13);transform:translateY(-3px)}
    .nav-link{
      display:inline-flex;align-items:center;gap:8px;
      padding:9px 20px;border-radius:50px;font-family:'Fredoka',sans-serif;
      font-size:16px;font-weight:600;cursor:pointer;border:2.5px solid var(--text);
      background:var(--card);color:var(--text);text-decoration:none;
      transition:all .15s ease;box-shadow:3px 3px 0 var(--text);
    }
    .nav-link:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--text)}
    .dot-bg{
      position:fixed;inset:0;
      background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);
      background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;
    }
  `}</style>
)

export default function About() {
  return (
    <>
      <G />
      <div style={{minHeight:'100vh',background:'var(--bg)',position:'relative'}}>
        <div className="dot-bg"/>

        {/* Header */}
        <header style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,248,240,0.9)',
          backdropFilter:'blur(12px)',borderBottom:'2.5px solid var(--border)',
          padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none',cursor:'pointer'}}>
            <div style={{width:42,height:42,borderRadius:13,background:'var(--orange)',
              border:'2.5px solid var(--text)',display:'flex',alignItems:'center',
              justifyContent:'center',boxShadow:'3px 3px 0 var(--text)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
            <span className="fredoka" style={{fontSize:26,fontWeight:700,color:'var(--text)'}}>Orivox</span>
          </Link>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <Link href="/about" className="nav-link" style={{background:'var(--orange)',color:'#fff',borderColor:'var(--orange)',boxShadow:'3px 3px 0 var(--orange)'}}>About</Link>
            <Link href="/" className="nav-link">← Back</Link>
          </div>
        </header>

        {/* Content */}
        <div style={{maxWidth:680,margin:'0 auto',padding:'64px 24px 80px',position:'relative',zIndex:1}}>

          {/* Photo */}
          <div className="fadeUp" style={{display:'flex',justifyContent:'center',marginBottom:40}}>
            <div style={{
              width:160,height:160,borderRadius:'50%',overflow:'hidden',
              border:'3px solid var(--border)',boxShadow:'5px 5px 0 rgba(0,0,0,0.12)',
              flexShrink:0,
            }}>
              <img
                src="/wallace.jpg"
                alt="Wallace Cheng"
                style={{
                  width:'100%',
                  height:'200%',
                  objectFit:'cover',
                  objectPosition:'center 18%',
                  display:'block',
                }}
              />
            </div>
          </div>

          {/* Headline */}
          <div className="fadeUp d1" style={{textAlign:'center',marginBottom:48}}>
            <h1 className="fredoka" style={{fontSize:'clamp(28px,5vw,42px)',lineHeight:1.2,color:'var(--text)',marginBottom:12}}>
              Built by a student who couldn't find a way to practice thinking on his feet.
            </h1>
            <p className="fredoka" style={{fontSize:'clamp(20px,3vw,28px)',color:'var(--orange)'}}>
              So he built one.
            </p>
          </div>

          {/* Story */}
          <div className="fadeUp d2" style={{
            background:'var(--card)',border:'2.5px solid var(--border)',
            borderRadius:22,boxShadow:'var(--shadow)',padding:'36px 40px',
            marginBottom:32,
          }}>
            <div style={{borderLeft:'4px solid var(--orange)',paddingLeft:24}}>
              <p style={{fontSize:16,lineHeight:1.9,color:'var(--text)',marginBottom:20}}>
                Hi, I'm a 16-year-old high school student from Vancouver, BC — and I built Orivox because I had the same problem most people have but rarely talk about: I could think of the perfect thing to say about ten seconds too late.
              </p>
              <p style={{fontSize:16,lineHeight:1.9,color:'var(--text)',marginBottom:20}}>
                I wanted to get better at quick thinking, at articulating my thoughts clearly under pressure, at sounding confident when it mattered. But I couldn't find a good way to actually practice that. Reading books about public speaking didn't help. Watching YouTube videos didn't help. What I needed was a way to just <em>do it</em> — over and over — and get real feedback.
              </p>
              <p style={{fontSize:16,lineHeight:1.9,color:'var(--text)',marginBottom:20}}>
                So I built Orivox for myself. A place where I could pick a scenario, hit record, and get honest AI feedback on whether I was actually making sense or just filling the air with words.
              </p>
              <p style={{fontSize:16,lineHeight:1.9,color:'var(--text)',marginBottom:20}}>
                I shared it with some friends. They liked it. So I decided to launch it, because if I had this problem, I figured some people probably do too.
              </p>
              <p style={{fontSize:16,lineHeight:1.9,color:'var(--text)',marginBottom:24}}>
                Orivox isn't backed by a company or a team of designers. It's just something I made because I needed it. I hope it helps you the way it's helped me.
              </p>
              <p style={{fontFamily:'Fredoka, sans-serif',fontSize:17,color:'var(--orange)',fontWeight:600}}>
                — Wallace Cheng, Founder of Orivox
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="fadeUp d3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:40}}>
            {[
              {label:'Grade 11', sub:'Vancouver, BC'},
              {label:'Built solo', sub:'Design, code, and launch'},
              {label:'Shared with friends', sub:'They liked it — so I shipped it'},
            ].map(({label,sub})=>(
              <div key={label} className="stat-card">
                <div className="fredoka" style={{fontSize:16,color:'var(--text)',marginBottom:4}}>{label}</div>
                <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.4}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="fadeUp d4" style={{textAlign:'center'}}>
            <Link href="/" style={{
              display:'inline-flex',alignItems:'center',gap:8,
              padding:'14px 32px',borderRadius:50,fontFamily:'Fredoka, sans-serif',
              fontSize:18,fontWeight:600,cursor:'pointer',border:'2.5px solid var(--text)',
              background:'var(--orange)',color:'#fff',textDecoration:'none',
              boxShadow:'4px 4px 0 var(--text)',transition:'all .15s ease',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translate(-2px,-2px)';e.currentTarget.style.boxShadow='6px 6px 0 var(--text)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='4px 4px 0 var(--text)'}}>
              Try Orivox →
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
