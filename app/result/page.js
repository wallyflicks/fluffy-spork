import Link from 'next/link'

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  const score    = params.score    || '?'
  const category = params.category || 'Speaking'
  const difficulty = params.difficulty || ''
  const label = difficulty ? `${category} · ${difficulty}` : category
  const url = `https://orivoxapp.vercel.app/result?score=${score}&category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}`
  return {
    title: `I scored ${score}/100 on Orivox`,
    description: `${label} — Try it yourself at orivoxapp.vercel.app`,
    openGraph: {
      title: `I scored ${score}/100 on Orivox`,
      description: `${label} — Try it yourself at orivoxapp.vercel.app`,
      url,
      images: [{ url: 'https://orivoxapp.vercel.app/og-image.png', width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `I scored ${score}/100 on Orivox`,
      description: `${label} — Try it yourself at orivoxapp.vercel.app`,
      images: ['https://orivoxapp.vercel.app/og-image.png'],
    },
  }
}

export default async function ResultPage({ searchParams }) {
  const params = await searchParams
  const score      = parseInt(params.score || '0', 10)
  const category   = params.category   || 'General'
  const difficulty = params.difficulty || 'Medium'
  const strength   = params.strength   || 'You spoke with clarity and conviction'

  const scoreColor = score >= 80 ? '#2D7A4F' : score >= 60 ? '#F5C842' : '#E84040'
  const scoreBg    = score >= 80 ? 'rgba(45,122,79,.15)' : score >= 60 ? 'rgba(245,200,66,.12)' : 'rgba(232,64,64,.15)'
  const label      = score >= 80 ? 'Strong performance' : score >= 60 ? 'Good effort' : 'Keep going'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0F0F1E;color:#fff;font-family:'Nunito',sans-serif;min-height:100vh}
        .fredoka{font-family:'Fredoka',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fade1{animation:fadeUp .5s .05s both}
        .fade2{animation:fadeUp .5s .15s both}
        .fade3{animation:fadeUp .5s .25s both}
        .fade4{animation:fadeUp .5s .35s both}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,107,43,.5)!important}
      `}</style>

      {/* Top accent bar */}
      <div style={{height:6,background:'#FF6B2B',width:'100%'}}/>

      {/* Dot-grid background */}
      <div style={{
        position:'fixed',inset:0,zIndex:0,
        backgroundImage:'radial-gradient(circle,rgba(255,255,255,.055) 1px,transparent 1px)',
        backgroundSize:'40px 40px',pointerEvents:'none',
      }}/>

      <div style={{position:'relative',zIndex:1,maxWidth:480,margin:'0 auto',padding:'40px 24px 60px'}}>

        {/* Logo */}
        <div className="fade1" style={{textAlign:'center',marginBottom:32}}>
          <div className="fredoka" style={{fontSize:38,fontWeight:700,color:'#FF6B2B',letterSpacing:'-.5px'}}>Orivox</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginTop:2,letterSpacing:'.04em'}}>AI SPEAKING COACH</div>
        </div>

        {/* Score card */}
        <div className="fade2" style={{
          background:'rgba(255,255,255,.04)',
          border:'1.5px solid rgba(255,255,255,.1)',
          borderRadius:28,padding:'36px 28px 32px',
          textAlign:'center',marginBottom:28,
          boxShadow:'0 24px 64px rgba(0,0,0,.45)',
        }}>
          {/* Score ring */}
          <div style={{position:'relative',display:'inline-block',marginBottom:20}}>
            <svg width={160} height={160} style={{transform:'rotate(-90deg)'}}>
              <circle cx={80} cy={80} r={66} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={14}/>
              <circle cx={80} cy={80} r={66} fill="none" stroke={scoreColor} strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={2*Math.PI*66}
                strokeDashoffset={2*Math.PI*66*(1-Math.min(score,100)/100)}/>
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span className="fredoka" style={{fontSize:52,fontWeight:700,color:scoreColor,lineHeight:1}}>{score}</span>
              <span style={{fontSize:14,color:'rgba(255,255,255,.35)',fontWeight:600}}>/100</span>
            </div>
          </div>

          {/* Badge */}
          <div style={{display:'inline-block',background:scoreBg,border:`1.5px solid ${scoreColor}`,color:scoreColor,borderRadius:50,padding:'5px 16px',fontSize:13,fontWeight:700,marginBottom:14}}>
            {label}
          </div>

          {/* Category · Difficulty */}
          <div style={{fontSize:17,color:'rgba(255,255,255,.7)',marginBottom:16,fontWeight:600}}>
            {category} · {difficulty}
          </div>

          {/* Divider */}
          <div style={{height:1,background:'rgba(255,107,43,.18)',margin:'0 auto 18px',width:'60%'}}/>

          {/* Strength quote */}
          <p style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.65,fontStyle:'italic',maxWidth:340,margin:'0 auto'}}>
            &ldquo;{strength}&rdquo;
          </p>
        </div>

        {/* CTA section */}
        <div className="fade3" style={{textAlign:'center',marginBottom:32}}>
          <h2 className="fredoka" style={{fontSize:28,color:'#fff',marginBottom:8}}>Think you can beat this?</h2>
          <p style={{fontSize:14,color:'rgba(255,255,255,.45)',marginBottom:22}}>Practice any speaking scenario and get instant AI feedback.</p>
          <Link href="/" className="cta-btn" style={{
            display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
            background:'#FF6B2B',color:'#fff',textDecoration:'none',
            padding:'16px 40px',borderRadius:50,
            fontFamily:'Fredoka,sans-serif',fontSize:20,fontWeight:700,
            boxShadow:'0 6px 24px rgba(255,107,43,.4)',transition:'all .2s',
          }}>
            Try Orivox free →
          </Link>
          <p style={{fontSize:12,color:'rgba(255,255,255,.3)',marginTop:12}}>No sign up needed — just speak</p>
        </div>

        {/* Footer */}
        <div className="fade4" style={{textAlign:'center',fontSize:12,color:'rgba(255,255,255,.2)'}}>
          orivoxapp.vercel.app
        </div>

      </div>

      {/* Bottom accent bar */}
      <div style={{height:6,background:'#FF6B2B',width:'100%',position:'fixed',bottom:0,left:0}}/>
    </>
  )
}
