'use client'
import Link from 'next/link'
import PageNav from '../../components/PageNav'

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
    .dot-bg{
      position:fixed;inset:0;
      background-image:radial-gradient(circle,#E0CEBC 1px,transparent 1px);
      background-size:30px 30px;opacity:.55;pointer-events:none;z-index:0;
    }
    @media(max-width:600px){
      .about-stat-grid{grid-template-columns:1fr 1fr!important}
      .about-story{padding:24px 20px!important}
    }
  `}</style>
)

export default function About() {
  return (
    <>
      <G />
      <div style={{minHeight:'100vh',background:'var(--bg)',position:'relative'}}>
        <div className="dot-bg"/>

        <PageNav active="/about" />

        {/* Content */}
        <div style={{maxWidth:680,margin:'0 auto',padding:'64px 24px 80px',position:'relative',zIndex:1}}>

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
          <div className="fadeUp d2 about-story" style={{
            background:'var(--card)',border:'2.5px solid var(--border)',
            borderRadius:22,boxShadow:'var(--shadow)',padding:'36px 40px',
            marginBottom:32,
          }}>
            <div style={{borderLeft:'4px solid var(--orange)',paddingLeft:24}}>
              <p style={{fontSize:16,lineHeight:1.9,color:'var(--text)',marginBottom:20}}>
                Hi, my name is Wallace and I am a 16 year old high school student from Vancouver, BC. I built Orivox because I had the same problem most people have but rarely talk about: I could think of the perfect thing to say about ten seconds too late.
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
          <div className="fadeUp d3 about-stat-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:40}}>
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

          {/* Terms & Privacy */}
          <div id="terms" style={{marginTop:64}}>
            <div style={{height:2,background:'var(--border)',marginBottom:40,borderRadius:2}}/>
            <h2 className="fredoka" style={{fontSize:28,color:'var(--text)',marginBottom:6}}>Terms &amp; Privacy</h2>

            {[
              {
                heading:'What we collect',
                body:'Your session history (category, difficulty, score, transcript, and feedback) is stored locally in your browser. It never leaves your device unless you choose to post your score to the leaderboard. If you post a score, we store your display name and score in our database. If you leave a review, we store your display name, rating, and comment. We do not collect your email address. We do not require an account.',
              },
              {
                heading:'How we use your data',
                body:'Your local session data is used only to show you your own progress. We do not access it, sell it, or share it. Your leaderboard score and display name are shown publicly on the Leaderboard page. Your review is shown publicly on the Reviews page.',
              },
              {
                heading:'Analytics',
                body:'Orivox uses Vercel Analytics to count page views and understand how people use the app. This does not use cookies and does not collect personally identifiable information.',
              },
              {
                heading:'Third party services',
                body:'Supabase stores leaderboard scores and reviews. Vercel hosts the app and provides analytics.',
              },
              {
                heading:'Your data',
                body:'If you want your leaderboard score or review removed contact us at wallyflickss@gmail.com and we will delete it promptly. You can clear your local session history at any time from the Progress page.',
              },
              {
                heading:'Disclaimer',
                body:"Orivox is a solo student project provided free of charge and as-is. Scores are not a formal assessment — use it as a practice tool.",
              },
              {
                heading:'Contact',
                body:'wallyflickss@gmail.com — this goes directly to the founder.',
              },
            ].map(({heading,body})=>(
              <div key={heading} style={{marginBottom:28}}>
                <h3 style={{fontSize:15,fontWeight:700,color:'var(--text)',marginBottom:6,fontFamily:'Nunito, sans-serif'}}>{heading}</h3>
                <p style={{fontSize:14,lineHeight:1.85,color:'var(--muted)'}}>{body}</p>
              </div>
            ))}

            <p style={{fontSize:13,color:'var(--border)',marginTop:40,fontStyle:'italic'}}>Last updated: May 2026</p>
          </div>

        </div>
      </div>
    </>
  )
}
