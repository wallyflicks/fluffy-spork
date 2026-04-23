"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

    :root{
      --bg:#FFF8F0;
      --cream:#FFF3E6;
      --card:#FFFFFF;
      --orange:#FF6B2B;
      --orange-light:#FF8F5E;
      --orange-dim:#FFF0E8;
      --orange-border:#FFD4BC;
      --green:#2D7A4F;
      --green-light:#3A9962;
      --yellow:#F5C842;
      --yellow-dim:#FFF9E0;
      --red:#E84040;
      --red-dim:#FFECEC;
      --blue:#3B82F6;
      --blue-dim:#EFF6FF;
      --text:#1A1A2E;
      --muted:#8A7E74;
      --border:#E8DDD4;
      --shadow: 4px 4px 0px rgba(0,0,0,0.12);
      --shadow-hover: 6px 6px 0px rgba(0,0,0,0.16);
    }

    body{background:var(--bg);color:var(--text);font-family:'Nunito',sans-serif;}
    .fredoka{font-family:'Fredoka',sans-serif;}

    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-thumb{background:var(--orange-border);border-radius:3px}

    @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(-52px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(52px)}to{opacity:1;transform:translateX(0)}}
    @keyframes screenEnter{from{opacity:0;transform:translateY(32px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes wobble{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
    @keyframes pulseRing{0%{transform:scale(1);opacity:.7}100%{transform:scale(1.8);opacity:0}}
    @keyframes waveBar{0%,100%{transform:scaleY(.15)}50%{transform:scaleY(1)}}
    @keyframes float{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-22px) rotate(5deg)}}
    @keyframes bounceBtn{0%,100%{transform:translate(0,0);box-shadow:4px 4px 0 var(--text)}45%{transform:translate(-2px,-5px);box-shadow:6px 9px 0 var(--text)}}
    @keyframes chipPop{0%{transform:scale(1)}40%{transform:scale(1.18)}70%{transform:scale(.96)}100%{transform:scale(1)}}
    @keyframes ripple{0%{transform:scale(0);opacity:.5}100%{transform:scale(4);opacity:0}}
    @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(600px) rotate(720deg);opacity:0}}
    @keyframes celebBounce{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.3) rotate(10deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
    @keyframes typewriter{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}

    .fadeUp{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
    .slideLeft{animation:slideLeft .6s cubic-bezier(.22,.68,0,1.2) both}
    .slideRight{animation:slideRight .6s cubic-bezier(.22,.68,0,1.2) both}
    .screenEnter{animation:screenEnter .5s cubic-bezier(.22,.68,0,1.2) both}
    .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}
    .d4{animation-delay:.38s}.d5{animation-delay:.48s}.d6{animation-delay:.58s}
    .fb1{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.05s}
    .fb2{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.2s}
    .fb3{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.35s}
    .fb4{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.5s}
    .fb5{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.65s}
    .fb6{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.8s}
    .fb7{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) both;animation-delay:.95s}

    .card{
      background:var(--card);border:2.5px solid var(--border);
      border-radius:22px;box-shadow:var(--shadow);
      transition:box-shadow .22s,transform .22s;
    }
    .card:hover{box-shadow:8px 8px 0 rgba(0,0,0,0.14);transform:translateY(-3px)}

    .btn{
      display:inline-flex;align-items:center;gap:8px;
      padding:12px 24px;border-radius:50px;overflow:hidden;position:relative;
      font-family:'Fredoka',sans-serif;font-size:18px;font-weight:600;
      cursor:pointer;border:2.5px solid var(--text);
      transition:all .15s ease;white-space:nowrap;
      box-shadow:4px 4px 0 var(--text);
    }
    .btn::after{content:'';position:absolute;width:60px;height:60px;border-radius:50%;
      background:rgba(255,255,255,0.3);transform:scale(0);pointer-events:none;
      top:50%;left:50%;margin:-30px 0 0 -30px;}
    .btn:active::after{animation:ripple .4s ease-out}
    .btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--text)}
    .btn:active{transform:translate(1px,1px);box-shadow:1px 1px 0 var(--text)}
    .btn-orange{background:var(--orange);color:#fff}
    .btn-orange:hover{background:var(--orange-light)}
    .btn-cream{background:var(--cream);color:var(--text)}
    .btn-green{background:var(--green);color:#fff;border-color:var(--green);box-shadow:4px 4px 0 var(--green)}
    .btn-green:hover{box-shadow:6px 6px 0 var(--green)}
    .btn-red{background:var(--red-dim);color:var(--red);border-color:var(--red);box-shadow:4px 4px 0 var(--red)}
    .btn-red:hover{background:var(--red);color:#fff;box-shadow:6px 6px 0 var(--red)}
    .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
    .btn-bounce{animation:bounceBtn 2.4s ease-in-out infinite}

    .chip{
      display:inline-flex;align-items:center;gap:6px;
      padding:9px 20px;border-radius:50px;font-size:15px;font-weight:600;
      font-family:'Fredoka',sans-serif;
      border:2px solid var(--border);color:var(--muted);background:var(--card);
      cursor:pointer;transition:all .2s;box-shadow:2px 2px 0 var(--border);
      white-space:nowrap;
    }
    .chip:hover{border-color:var(--orange);color:var(--orange);box-shadow:3px 3px 0 var(--orange);transform:translateY(-2px)}
    .chip:active{transform:scale(.93)!important;transition:transform .08s}
    .chip.active{background:var(--orange);border-color:var(--orange);color:#fff;
      box-shadow:3px 3px 0 rgba(255,107,43,.5);animation:chipPop .3s cubic-bezier(.22,.68,0,1.4)}

    @media(max-width:480px){
      .chip{font-size:13px;padding:7px 14px;}
      .card{border-radius:16px;}
    }
  `}</style>
);

// ── SVG Doodles ──────────────────────────────────────────────────────────────
const Star = ({ size=24, color="#F5C842", style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill={color} stroke={color} strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

const Sparkle = ({ size=20, color="#FF6B2B", style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" fill={color}/>
  </svg>
);

const Squiggle = ({ width=120, color="#FF6B2B" }) => {
  const segs = Math.floor(width/20);
  let d = `M0 7`;
  for(let i=0;i<segs;i++) d += ` Q${i*20+10} ${i%2===0?1:13} ${(i+1)*20} 7`;
  return (
    <svg width={width} height={14} viewBox={`0 0 ${width} 14`} style={{display:"block"}}>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
};

const MicDoodle = ({ size=80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="28" y="8" width="24" height="36" rx="12" fill="#FF6B2B" stroke="#1A1A2E" strokeWidth="3"/>
    <path d="M16 38c0 13.3 10.7 24 24 24s24-10.7 24-24" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="62" x2="40" y2="72" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round"/>
    <line x1="30" y1="72" x2="50" y2="72" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="40" cy="26" r="5" fill="white" opacity=".4"/>
  </svg>
);

const TimerDoodle = ({ size=60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="34" r="22" fill="#FFF3E6" stroke="#1A1A2E" strokeWidth="3"/>
    <circle cx="30" cy="34" r="16" fill="white" stroke="#1A1A2E" strokeWidth="2"/>
    <line x1="30" y1="34" x2="30" y2="22" stroke="#FF6B2B" strokeWidth="3" strokeLinecap="round"/>
    <line x1="30" y1="34" x2="40" y2="38" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="23" y="8" width="14" height="6" rx="3" fill="#1A1A2E"/>
    <line x1="44" y1="14" x2="48" y2="10" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="30" cy="34" r="2" fill="#1A1A2E"/>
  </svg>
);

const TrophyDoodle = ({ size=64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M20 8h24v20c0 8.8-7.2 16-16 16s-16-7.2-16-16V8z" fill="#F5C842" stroke="#1A1A2E" strokeWidth="2.5"/>
    <path d="M8 12h12v10c0 3.3-2.7 6-6 6s-6-2.7-6-6V12z" fill="#FFD966" stroke="#1A1A2E" strokeWidth="2"/>
    <path d="M44 12h12v10c0 3.3-2.7 6-6 6s-6-2.7-6-6V12z" fill="#FFD966" stroke="#1A1A2E" strokeWidth="2"/>
    <rect x="26" y="44" width="12" height="8" fill="#F5C842" stroke="#1A1A2E" strokeWidth="2"/>
    <rect x="18" y="52" width="28" height="6" rx="3" fill="#1A1A2E"/>
    <path d="M28 24l4-8 4 8" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const TOPICS = {
  General:["What is the most important skill a person can develop?","How do you define success?","What would you change about your hometown?","Should people follow their passion or follow the money?","What does it mean to live a good life?","How has the internet changed the way we think?","What is the biggest challenge facing your generation?","Should people share their opinions online?","What makes someone trustworthy?","How important is it to keep up with the news?","What is something most people get wrong about you?","How do you handle situations where you disagree with the majority?","What habit has had the biggest positive impact on your life?","What does a perfect day look like to you?","Should people be more or less open about their personal struggles?","What is something you wish schools taught?","How do you stay motivated when things get hard?","What role does luck play in success?","What is something you changed your mind about recently?","How do you think about balancing work and personal life?","What is one thing you would tell your younger self?","Should people always tell the truth?","How important is it to have a five year plan?","What makes a city a great place to live?","How do you define intelligence?","What is the most underrated quality in a person?","Should everyone travel before settling down?","How has a failure shaped who you are?","What do you think the world will look like in 20 years?","What is something people take for granted every day?","How do you make a difficult decision?","What is your relationship with social media?","What does community mean to you?","How do you think about personal growth?","What is the most important thing you have learned from someone older than you?","Should people be defined by their past?","How do you deal with uncertainty?","What is the difference between being busy and being productive?","What is something you are genuinely curious about right now?","How do you think about money?","What makes a conversation memorable?","Should people always follow the rules?","What is something you do differently than most people?","How do you think about risk?","What is the best advice you have ever received?","What does courage look like in everyday life?","How do you stay grounded when life gets overwhelming?","What is one thing you want to get better at?","How do you think about time?","What is something the world needs more of?"],
  Social:["How do you make a great first impression?","Describe your approach to meeting new people at a party where you know nobody","How do you handle an awkward silence in a conversation?","What is your strategy for networking events?","How do you keep a conversation going with someone you just met?","Describe a time you had to apologize to someone and how you handled it","How do you set boundaries with people in a kind way?","What do you do when someone is venting to you and you do not know what to say?","How do you handle conflict with a close friend?","What is your approach to giving someone difficult feedback?","How do you reconnect with someone you have lost touch with?","Describe how you would introduce two friends who do not know each other","How do you handle being excluded from a group?","What do you do when someone says something that offends you?","How do you support a friend going through a tough time?","Describe your approach to asking someone for a favor","How do you handle a conversation that turns political at a family dinner?","What do you do when you realize you have made someone feel bad unintentionally?","How do you make someone who is shy feel comfortable around you?","What is your approach to small talk and why?","How do you handle being the new person in a group?","Describe how you would handle a friend who constantly cancels plans","How do you say no to someone without damaging the relationship?","What do you do when you are in a conversation and completely disagree with the other person?","How do you show someone you genuinely care about them?","Describe a time you had to navigate a misunderstanding with someone","How do you handle receiving criticism in front of others?","What is your approach to keeping long distance friendships alive?","How do you handle someone who always one-ups your stories?","What do you do when a conversation becomes one-sided?","How do you approach talking to someone who is visibly upset?","Describe how you would comfort someone who just experienced a loss","How do you handle a friend who gives unsolicited advice?","What do you do when you feel left out of a conversation?","How do you approach building trust with someone new?","Describe your strategy for remembering peoples names and details","How do you handle social situations where you feel out of place?","What do you do when someone shares news you are supposed to act surprised about but already knew?","How do you navigate a friendship where your lives have gone in very different directions?","What is your approach to giving a toast at a celebration?","How do you handle it when someone takes credit for your idea in a group setting?","Describe how you would handle meeting your partners family for the first time","What do you do when a conversation gets too intense and you need to lighten the mood?","How do you handle someone who interrupts you constantly?","What is your approach to ending a conversation politely?","How do you handle disagreements without making the other person feel attacked?","Describe how you would handle a situation where two of your friends are fighting","What do you do when you do not understand something someone said but feel embarrassed to ask?","How do you make people feel heard in a conversation?","What makes someone a truly great friend?"],
  Storytelling:["Tell a story about a moment that changed your life forever","Describe a time you were completely lost and how you found your way","Tell a story about the most memorable meal you have ever had","Describe a person who shaped who you are today","Tell a story about a time you took a risk that paid off","Describe a moment when you felt truly proud of yourself","Tell a story about a time everything went wrong but turned out okay","Describe your earliest memory and what it means to you","Tell a story about a friendship that taught you something important","Describe a moment when a stranger made a big impact on your life","Tell a story about a time you had to start over from scratch","Describe the best trip you have ever taken","Tell a story about a moment of unexpected kindness you witnessed","Describe a time when you had to be brave","Tell a story about something you lost that you wish you still had","Describe a time you laughed so hard you cried","Tell a story about a goal you chased for a long time","Describe a moment that made you realize you had grown up","Tell a story about a time you misjudged someone completely","Describe a moment when you felt like you truly belonged somewhere","Tell a story about a mistake that became a blessing in disguise","Describe a time when you had to choose between two things you loved","Tell a story about someone you looked up to and what you learned from them","Describe a moment that made you question everything you believed","Tell a story about a time when you felt completely out of your comfort zone","Describe a place that holds a special meaning to you","Tell a story about a time you helped someone in a meaningful way","Describe a moment from your childhood that still makes you smile","Tell a story about something you tried and failed at but kept going anyway","Describe a time you had to say goodbye to something important","Tell a story that starts with the words I never thought I would","Describe a time when silence was more powerful than words","Tell a story about an ordinary day that turned extraordinary","Describe a moment when you realized your parents were just human","Tell a story about a competition or challenge you will never forget","Describe a time when music or art moved you deeply","Tell a story about a conversation that changed your perspective","Describe a moment when you felt completely free","Tell a story about a tradition or ritual that matters to you","Describe a time you saw someone do something incredibly generous","Tell a story about a summer that defined who you are","Describe a moment when you realized you were more capable than you thought","Tell a story about a time the plan fell apart and you had to improvise","Describe a moment when you felt a deep connection with nature","Tell a story about a dream you had that felt real","Describe a time when a book, film or song changed how you saw the world","Tell a story about a reunion that meant a lot to you","Describe a moment when you had to forgive someone","Tell a story about a night you will never forget","Describe a moment when you realized what truly matters to you"],
  Debate:["Social media does more harm than good","Artificial intelligence will destroy more jobs than it creates","Money can buy happiness","Celebrity culture is toxic for society","The voting age should be lowered to 16","Zoos should be abolished","Homework does more harm than good","Violent video games make people more violent","Space exploration is a waste of money","Athletes are paid too much","Privacy is more important than national security","Cancel culture has gone too far","Climate change is the most urgent issue facing humanity","Capitalism is the best economic system we have","The death penalty should be abolished worldwide","Standardized testing does not measure intelligence","Everyone should be required to do one year of community service","Technology is making us less human","Fast fashion should be banned","Governments should regulate what people eat","Working from home is better than working in an office","College education is no longer worth the cost","Parents should be held legally responsible for their children behavior","Genetically modifying humans is ethical","The news media cannot be trusted","Beauty standards are more harmful than helpful","Animals should have the same rights as humans","Democracy is the best form of government","Social media influencers have too much power over young people","Everyone should be vegetarian","Art and music programs in schools are just as important as math and science","The rich should pay significantly higher taxes","Addiction should be treated as a health issue not a criminal one","Doomscrolling is ruining mental health","Books are better than movies","Street art is art not vandalism","Online relationships can be just as meaningful as in person ones","Extreme sports should not be allowed","School uniforms are a good idea","The four day work week should be the global standard","Cultural appropriation is a serious issue","Tourism does more harm than good","People are too sensitive today","Nuclear energy is the solution to the climate crisis","Children should not have smartphones before age 16","The healthcare system should be completely free for everyone","Reality TV is destroying our culture","Giving to charity is a moral obligation","Lying is sometimes the right thing to do","The world would be better off without religion"],
  Business:["Pitch a startup idea that solves a problem you personally experience","How would you turn around a company that is losing customers fast?","Describe your vision for a business you would love to build one day","How would you pitch your personal brand to a potential employer?","What is the most important quality a CEO needs to have?","How would you motivate a team that has lost confidence after a big failure?","Describe how you would handle a major PR crisis for a company you run","How would you grow a small local business into a national brand?","What is your approach to hiring the right people?","How would you pitch a new product idea to a room of skeptical investors?","Describe how you would handle a difficult client who is never satisfied","What is the biggest mistake entrepreneurs make and how do you avoid it?","How would you disrupt an industry that has not changed in decades?","Describe your strategy for entering a new market","How do you build a company culture that people love?","What is your approach to pricing a product or service?","How would you handle a co-founder dispute that is threatening the business?","Describe how you would respond if a competitor copied your product","What is the most important lesson you have learned from a professional failure?","How would you convince a big company to partner with your small startup?","Describe your approach to building a personal network from scratch","How would you handle a situation where your top employee wants to leave?","What makes a brand truly unforgettable?","How would you allocate a $1 million marketing budget?","Describe how you would lead your team through a major organizational change","What is your strategy for getting your first 100 customers?","How would you negotiate a deal with someone who has more power than you?","Describe the key elements of a great pitch deck","How would you build trust with a new team you are leading for the first time?","What is your approach to giving performance reviews?","How would you handle discovering that an employee is stealing from the company?","Describe your strategy for scaling a product internationally","What is the difference between a manager and a true leader?","How would you pitch a socially responsible business to traditional investors?","Describe how you would handle a product launch that completely flopped","What is your approach to managing remote teams across different time zones?","How would you identify and fix a broken sales process?","Describe a time you had to make a tough business decision with incomplete information","How would you build a personal brand on social media from zero?","What is your strategy for retaining customers long term?","How would you handle a situation where your company values conflict with a profitable opportunity?","Describe how you would mentor a junior employee who has potential but lacks confidence","What is the most important financial metric for a startup to track?","How would you decide whether to build a feature or cut it?","Describe your approach to giving a high stakes presentation to the board","What is the role of creativity in business?","How would you handle a toxic high performer on your team?","Describe how you would rebuild a brand that has lost public trust","What does it take to build something that lasts?","How would you approach building a product for a market you know nothing about?"],
  Motivational:["What drives you to get out of bed every morning?","Describe a moment when you refused to give up","What does resilience mean to you?","Talk about a time you overcame your biggest fear","What is the one belief that keeps you going when things get hard?","Describe what your best self looks like","What would you do if you knew you could not fail?","Talk about a person who inspires you and why","What is something hard you did that you are proud of?","Describe a turning point that made you stronger","What does success look like to you in 10 years?","Talk about a time you proved someone wrong","What is the one thing you would tell someone who has lost all hope?","Describe how you handle your darkest days","What is the most important lesson failure has taught you?","Talk about a goal you are chasing right now and why it matters","What does it mean to live with purpose?","Describe a moment when everything clicked and you found your direction","What is something you sacrificed to become who you are?","Talk about a time you chose the hard right over the easy wrong","What motivates you more — fear of failure or desire for success?","Describe what courage looks like in your everyday life","What is one habit that changed your life?","Talk about a time you had to start over and what you learned","What is your personal definition of greatness?","Describe a mentor who changed your path","What does it feel like to be completely in your element?","Talk about a time you stepped up when nobody else would","What is something you want to achieve before you die?","Describe a moment when you surprised yourself","What is the best piece of advice you have ever received about perseverance?","Talk about a time you had to be patient when everything in you wanted to rush","What does discipline mean to you and how do you practice it?","Describe a time you had to fight for something you believed in","What is the story behind your biggest motivation?","Talk about a time you felt completely unstoppable","What is something you do every day to keep yourself mentally strong?","Describe a moment when you chose growth over comfort","What would you say to a younger version of yourself who was about to quit?","Talk about a time a setback led to something better","What is your relationship with fear and how has it shaped you?","Describe the moment you decided to take your life seriously","What is something you believe that most people would disagree with but keeps you going?","Talk about a time you had to rebuild your confidence from scratch","What does it mean to you to leave a legacy?","Describe how you keep going when nobody is cheering for you","What is the hardest thing you have ever done and what did it teach you?","Talk about a time you had to trust the process even when you could not see the results","What is your why — the deep reason behind everything you do?","Describe what an unstoppable mindset looks like to you"],
};
const CATS = Object.keys(TOPICS);
const CAT_EMOJI = {General:"🌍",Social:"👥",Storytelling:"📖",Debate:"⚡",Business:"📊",Motivational:"🔥"};
const DIFFS = ["Easy","Medium","Hard"];
const DIFF_COLOR = {Easy:"#2D7A4F",Medium:"#CC6600",Hard:"#E84040",Random:"#1A1A2E"};
const DIFF_BG = {Easy:"#E8F7EE",Medium:"#FFF4E0",Hard:"#FFECEC",Random:"#F0F0F0"};
const PREP_TIMES = [0,30,60,120];
const SPEAK_TIMES = [30,60,120,180,300];
const fmt = s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const rand = arr=>arr[Math.floor(Math.random()*arr.length)];

const playChime = () => {
  try {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    [[0, 880, 0.3], [0.25, 660, 0.25], [0.5, 880, 0.35]].forEach(([t, freq, vol]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.4);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.4);
    });
  } catch(e) {}
};

// ── Speech Analysis ──────────────────────────────────────────────────────────
function analyzeTranscript(text, topic, difficulty) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);

  // Exact per-word filler counts
  const FILLER_DEFS = [
    {word:"um",     re:/\bum\b/gi},
    {word:"uh",     re:/\buh\b/gi},
    {word:"like",   re:/\blike\b/gi},
    {word:"you know",re:/\byou\s+know\b/gi},
    {word:"basically",re:/\bbasically\b/gi},
    {word:"literally",re:/\bliterally\b/gi},
    {word:"actually", re:/\bactually\b/gi},
    {word:"right",  re:/\bright\b/gi},
    {word:"so",     re:/\bso\b/gi},
    {word:"I mean", re:/\bi\s+mean\b/gi},
    {word:"kind of",re:/\bkind\s+of\b/gi},
    {word:"sort of",re:/\bsort\s+of\b/gi},
    {word:"honestly",re:/\bhonestly\b/gi},
    {word:"well",   re:/\bwell\b/gi},
  ];
  const fillerBreakdown=[];
  let totalFillers=0;
  for(const {word,re} of FILLER_DEFS){
    const n=(text.match(re)||[]).length;
    if(n>0){fillerBreakdown.push({word,count:n});totalFillers+=n;}
  }
  fillerBreakdown.sort((a,b)=>b.count-a.count);
  const foundFillers=fillerBreakdown.map(f=>f.word);
  const fillerRate=wordCount>0?totalFillers/wordCount:0;

  const STRUCTURE_WORDS=["first","second","third","finally","in conclusion","to summarize",
    "furthermore","however","therefore","additionally","for example","for instance",
    "in contrast","on the other hand","to begin","lastly","next","importantly"];
  const usedStructure=STRUCTURE_WORDS.filter(w=>lower.includes(w));
  const structureCount=usedStructure.length;

  const HEDGES=["maybe","perhaps","i'm not sure","i think","i guess","might be",
    "could be","possibly","probably","i feel like","kinda","not sure"];
  const usedHedges=HEDGES.filter(w=>lower.includes(w));
  const hedgeCount=usedHedges.length;

  const avgWPS=sentences.length>0?wordCount/sentences.length:0;
  const firstSentence=sentences[0]?.trim()||"";
  const lastSentence=sentences[sentences.length-1]?.trim()||"";

  // Scores
  const clarity=Math.min(98,Math.max(25,
    90-Math.round(fillerRate*170)-(avgWPS>28?10:0)+(wordCount>100?4:0)
  ));
  const structure=Math.min(98,Math.max(25,
    40+structureCount*10+(sentences.length>3?10:0)+(wordCount>80?8:0)
  ));
  const confidence=Math.min(98,Math.max(25,
    90-hedgeCount*9-Math.round(fillerRate*120)+(wordCount>60?4:0)
  ));
  const diffPenalty=difficulty==="Hard"?3:difficulty==="Medium"?1:0;
  const score=Math.max(20,Math.round((clarity+structure+confidence)/3)-diffPenalty);

  // Strengths — always reference actual transcript data
  const strengths=[];
  if(fillerRate<0.04)
    strengths.push(`Exceptionally clean delivery — only ${totalFillers} filler word${totalFillers!==1?"s":""} across ${wordCount} words`);
  else if(fillerRate<0.09)
    strengths.push(`Decent filler control — ${totalFillers} filler${totalFillers!==1?"s":""} in ${wordCount} words is manageable`);

  if(structureCount>=2)
    strengths.push(`Good use of structure markers (${usedStructure.slice(0,3).map(w=>`"${w}"`).join(", ")}) that help the listener follow along`);
  else if(structureCount===1)
    strengths.push(`Used "${usedStructure[0]}" to organize — good instinct, now build on it`);

  if(firstSentence.split(/\s+/).length>8)
    strengths.push(`Strong opener: "${firstSentence.slice(0,70)}${firstSentence.length>70?"...":""}"`);

  if(wordCount>150)
    strengths.push(`Great depth — ${wordCount} words shows you developed the idea fully`);
  else if(wordCount>100)
    strengths.push(`Solid length at ${wordCount} words — enough to make a real argument`);

  if(hedgeCount===0)
    strengths.push("Spoke with conviction — no hedging language found in the transcript");

  if(strengths.length<2) strengths.push("Completed the full exercise without stopping — consistency is the skill");

  // Improvements — always specific to what was actually said
  const improvements=[];
  if(fillerBreakdown.length>0){
    const top=fillerBreakdown[0];
    const breakdown=fillerBreakdown.slice(0,3).map(f=>`"${f.word}" ×${f.count}`).join(", ");
    improvements.push(`Top fillers: ${breakdown} — "${top.word}" is your biggest habit to break`);
  }
  if(structureCount<2)
    improvements.push(`No clear structure detected — try: "I'll cover three things: first... second... finally..." before diving in`);
  if(wordCount<60)
    improvements.push(`Only ${wordCount} words spoken — aim for 100+ to fully develop your point on this topic`);
  if(hedgeCount>1)
    improvements.push(`Hedges like "${usedHedges.slice(0,2).map(w=>`"${w}"`).join(" and ")}" undermine your authority — replace with direct statements`);
  if(lastSentence&&lastSentence.split(/\s+/).length<5&&sentences.length>1)
    improvements.push(`Weak closing: "${lastSentence}" — end with a clear takeaway or bold final statement`);
  if(avgWPS>28)
    improvements.push(`Long sentences (avg ${Math.round(avgWPS)} words) — break them up for more punch and easier listening`);
  if(improvements.length<2)
    improvements.push("Try recording the same prompt again right now — compare the two and spot what changed");

  // Overall feedback referencing real transcript details
  let overall="";
  if(score>=80) overall=`Strong response on "${topic}". `;
  else if(score>=60) overall=`Solid attempt on "${topic}". `;
  else overall=`"${topic}" is a tough prompt — keep at it. `;
  if(fillerBreakdown.length>0)
    overall+=`Your most frequent filler was "${fillerBreakdown[0].word}" (×${fillerBreakdown[0].count}). `;
  if(structureCount>=2)
    overall+=`The signpost words you used ("${usedStructure[0]}", "${usedStructure[1]}") made the response easier to follow.`;
  else
    overall+=`Adding signpost words would make this response much easier to follow.`;

  // Tip specific to dominant issue
  let tip="";
  if(fillerBreakdown.length>0&&fillerRate>0.08){
    const top=fillerBreakdown[0];
    tip=`"${top.word}" appeared ${top.count} times. Before your next attempt, say it out loud deliberately — making it conscious is the first step to cutting it.`;
  } else if(structureCount<1){
    tip=`Take 3 seconds before speaking to think: opening claim → one example → closing takeaway. Even a rough mental skeleton transforms how organized you sound on "${topic}".`;
  } else if(hedgeCount>2){
    tip=`Replace "${usedHedges[0]}" with a direct statement. Instead of "${usedHedges[0]} X is true", just say "X is true." — the listener doesn't need your permission to believe you.`;
  } else if(wordCount<60){
    tip=`You stopped at ${wordCount} words. Next time, when you run out of points, give a specific real-world example — that alone adds 30-50 words and makes the argument stick.`;
  } else {
    tip=`Record this same prompt again right now and try to beat your score of ${score}. Immediate repetition is the fastest way to improve.`;
  }

  return {score,clarity,structure,confidence,
    filler_count:totalFillers, filler_words:foundFillers,
    strengths:strengths.slice(0,3), improvements:improvements.slice(0,3),
    overall_feedback:overall.trim(), one_tip:tip};
}

// ── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({score,size=160}){
  const [shown,setShown]=useState(0);
  useEffect(()=>{
    let raf;
    const dur=1600,start=Date.now();
    const tick=()=>{
      const p=Math.min((Date.now()-start)/dur,1);
      const e=1-Math.pow(1-p,3);
      setShown(Math.round(score*e));
      if(p<1) raf=requestAnimationFrame(tick);
    };
    const t=setTimeout(()=>{raf=requestAnimationFrame(tick);},150);
    return()=>{clearTimeout(t);cancelAnimationFrame(raf);};
  },[score]);
  const r=(size-16)/2, circ=2*Math.PI*r;
  const color=score>=80?"#2D7A4F":score>=60?"#CC6600":"#E84040";
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0E8E0" strokeWidth={13}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={13}
        strokeDasharray={circ} strokeDashoffset={circ*(1-shown/100)}
        strokeLinecap="round"/>
      <text x={size/2} y={size/2} fill={color} fontSize={36} fontWeight="700"
        fontFamily="Fredoka, sans-serif" textAnchor="middle" dominantBaseline="middle"
        style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`}}>
        {shown}
      </text>
    </svg>
  );
}

function Confetti({active}){
  const pieces=useMemo(()=>Array.from({length:32},(_,i)=>({
    id:i, left:5+(i*2.9)%90,
    color:['#FF6B2B','#F5C842','#2D7A4F','#3B82F6','#E84040','#FF8F5E'][i%6],
    delay:(i*0.04)%1.1, size:6+(i%5)*3,
    rot:(i*53)%360, dur:1.1+(i%4)*0.25,
    shape:i%3===0?'50%':'3px',
  })),[]);
  if(!active) return null;
  return(
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:6}}>
      {pieces.map(p=>(
        <div key={p.id} style={{position:'absolute',top:'-5%',left:`${p.left}%`,
          width:p.size,height:p.size,borderRadius:p.shape,background:p.color,
          transform:`rotate(${p.rot}deg)`,
          animation:`confettiFall ${p.dur}s ease-in ${p.delay}s both`}}/>
      ))}
    </div>
  );
}

function CelebStars({show}){
  if(!show) return null;
  const items=[
    {size:36,color:'#F5C842',top:'10%',left:'8%',delay:'0s'},
    {size:24,color:'#FF6B2B',top:'5%',left:'82%',delay:'.1s'},
    {size:40,color:'#2D7A4F',top:'18%',right:'6%',delay:'.05s'},
    {size:20,color:'#F5C842',top:'25%',left:'3%',delay:'.15s'},
    {size:28,color:'#3B82F6',top:'8%',left:'50%',delay:'.08s'},
    {size:22,color:'#FF6B2B',top:'30%',right:'10%',delay:'.12s'},
  ];
  return(
    <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible',zIndex:4}}>
      {items.map((s,i)=>(
        <div key={i} style={{position:'absolute',...s,animation:`celebBounce .6s cubic-bezier(.22,.68,0,1.4) ${s.delay} both`}}>
          <Star size={s.size} color={s.color}/>
        </div>
      ))}
    </div>
  );
}

const WAVE_HEIGHTS=[55,80,40,95,60,100,45,85,55,75,35,90,65,50];
function WaveViz({active}){
  return(
    <div style={{display:"flex",gap:4,alignItems:"center",height:48}}>
      {WAVE_HEIGHTS.map((h,i)=>(
        <div key={i} style={{
          width:5,height:`${h}%`,borderRadius:3,
          background:active?"var(--orange)":"var(--orange-border)",
          transformOrigin:"center",
          animationName:active?"waveBar":"none",
          animationDuration:`${0.4+(i%5)*0.11}s`,
          animationTimingFunction:"ease-in-out",
          animationIterationCount:"infinite",
          animationDelay:`${(i*0.06).toFixed(2)}s`,
          opacity:active?1:0.4,transition:"background .3s,opacity .3s",
        }}/>
      ))}
    </div>
  );
}

function SubBar({label,val,color,bg}){
  const [shown,setShown]=useState(0);
  useEffect(()=>{
    let raf;
    const dur=1300,start=Date.now();
    const tick=()=>{
      const p=Math.min((Date.now()-start)/dur,1);
      const e=1-Math.pow(1-p,3);
      setShown(Math.round(val*e));
      if(p<1) raf=requestAnimationFrame(tick);
    };
    const t=setTimeout(()=>{raf=requestAnimationFrame(tick);},200);
    return()=>{clearTimeout(t);cancelAnimationFrame(raf);};
  },[val]);
  return(
    <div style={{background:bg||"var(--orange-dim)",borderRadius:16,padding:"16px 18px",border:`2px solid ${color}30`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontFamily:"Fredoka",fontSize:16,color:"var(--text)"}}>{label}</span>
        <span style={{fontFamily:"Fredoka",fontSize:22,fontWeight:700,color}}>{shown}</span>
      </div>
      <div style={{height:8,borderRadius:4,background:"rgba(0,0,0,0.08)",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${shown}%`,background:color,borderRadius:4}}/>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function Articulate(){
  const [screen,setScreen]=useState("home");
  const [cat,setCat]=useState("General");
  const [diff,setDiff]=useState("Medium");
  const [activeCat,setActiveCat]=useState("General");
  const [activeDiff,setActiveDiff]=useState("Medium");
  const [prepTime,setPrepTime]=useState(60);
  const [speakTime,setSpeakTime]=useState(120);
  const [topic,setTopic]=useState("");
  const [displayedTopic,setDisplayedTopic]=useState("");
  const [timer,setTimer]=useState(0);
  const [running,setRunning]=useState(false);
  const [phase,setPhase]=useState("prep");
  const [recording,setRecording]=useState(false);
  const [audioBlob,setAudioBlob]=useState(null);
  const [transcript,setTranscript]=useState("");
  const [feedback,setFeedback]=useState(null);
  const [loading,setLoading]=useState(false);
  const [micErr,setMicErr]=useState("");
  const [audioUrl,setAudioUrl]=useState(null);
  const typingRef=useRef(null);
  const mediaRef=useRef(null);
  const chunksRef=useRef([]);
  const ivRef=useRef(null);
  const startTimeRef=useRef(null);
  const initialTimeRef=useRef(0);
  const recognitionRef=useRef(null);
  const transcriptRef=useRef("");

  useEffect(()=>{
    if(!topic){setDisplayedTopic("");return;}
    clearTimeout(typingRef.current);
    setDisplayedTopic("");
    let i=0;
    const type=()=>{i++;setDisplayedTopic(topic.slice(0,i));if(i<topic.length)typingRef.current=setTimeout(type,18);};
    typingRef.current=setTimeout(type,60);
    return()=>clearTimeout(typingRef.current);
  },[topic]);

  useEffect(()=>{
    if(running){
      ivRef.current=setInterval(()=>{
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, initialTimeRef.current - elapsed);
        setTimer(remaining);
        if(remaining === 0){
          clearInterval(ivRef.current);
          setRunning(false);
          if(phase==="prep") goSpeak(); else { playChime(); doStop(); }
        }
      },100);
    }
    return()=>clearInterval(ivRef.current);
  },[running,phase]);

  const pickTopic=useCallback(()=>setTopic(rand(TOPICS[activeCat])),[activeCat]);

  const startSession=()=>{
    const resolvedCat=cat==="Random"?rand(CATS):cat;
    const resolvedDiff=diff==="Random"?rand(DIFFS):diff;
    setActiveCat(resolvedCat);setActiveDiff(resolvedDiff);
    setTopic(rand(TOPICS[resolvedCat]));
    setFeedback(null);setAudioBlob(null);setTranscript("");setAudioUrl(null);transcriptRef.current="";
    setPhase("prep");setTimer(prepTime);
    initialTimeRef.current = prepTime;
    if(prepTime===0){setScreen("speak");setPhase("speak");setTimer(speakTime);initialTimeRef.current=speakTime;}
    else setScreen("prep");
  };

  const goSpeak=()=>{setPhase("speak");setTimer(speakTime);initialTimeRef.current = speakTime;setScreen("speak");};

  const startMic=async()=>{
    setMicErr("");setTranscript("");transcriptRef.current="";
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(stream);
      mediaRef.current=mr;chunksRef.current=[];
      mr.ondataavailable=e=>chunksRef.current.push(e.data);
      mr.onstop=()=>{
        const blob=new Blob(chunksRef.current,{type:mr.mimeType||"audio/webm"});
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t=>t.stop());
      };
      mr.start(1000);startTimeRef.current=Date.now();setRecording(true);setRunning(true);

      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(SR){
        let final="";
        const startRec=()=>{
          const rec=new SR();
          rec.continuous=true;rec.interimResults=true;rec.lang="en-US";
          rec.onresult=e=>{
            let interim="";
            for(let i=e.resultIndex;i<e.results.length;i++){
              if(e.results[i].isFinal) final+=e.results[i][0].transcript+" ";
              else interim+=e.results[i][0].transcript;
            }
            const val=(final+interim).trim();
            transcriptRef.current=val;
            setTranscript(val);
          };
          rec.onend=()=>{
            if(mediaRef.current?.state==="recording") startRec();
          };
          rec.onerror=()=>{
            if(mediaRef.current?.state==="recording") startRec();
          };
          rec.start();
          recognitionRef.current=rec;
        };
        startRec();
      }
    }catch{setMicErr("Mic access denied — please allow microphone permissions.");}
  };

  const doStop=()=>{
    recognitionRef.current?.stop();recognitionRef.current=null;
    if(mediaRef.current?.state!=="inactive")mediaRef.current?.stop();
    setRecording(false);setRunning(false);setScreen("feedback");analyze();
  };

  const analyze=()=>{
    setLoading(true);
    setTimeout(()=>{
      const text=transcriptRef.current;
      if(!text.trim()){
        setFeedback({error:"No speech detected. Make sure your microphone is working and try again."});
        setLoading(false);return;
      }
      setFeedback(analyzeTranscript(text,topic,activeDiff));
      setLoading(false);
    },1200);
  };

  const reset=()=>{
    recognitionRef.current?.stop();recognitionRef.current=null;
    setScreen("home");setFeedback(null);setAudioBlob(null);setTranscript("");setRecording(false);setRunning(false);
    clearInterval(ivRef.current);
    if(audioUrl){URL.revokeObjectURL(audioUrl);setAudioUrl(null);}
  };

  const FloatDeco=()=>(
    <>
      <Star size={48} color="#F5C842" style={{position:"absolute",top:60,left:"4%",animation:"float 4s ease-in-out infinite",opacity:.95}}/>
      <Star size={28} color="#FF6B2B" style={{position:"absolute",top:170,right:"4%",animation:"float 3.5s ease-in-out infinite",animationDelay:"1s"}}/>
      <Sparkle size={36} color="#2D7A4F" style={{position:"absolute",top:110,right:"16%",animation:"float 5s ease-in-out infinite",animationDelay:"0.5s"}}/>
      <Star size={20} color="#F5C842" style={{position:"absolute",top:300,left:"10%",animation:"float 4.5s ease-in-out infinite",animationDelay:"2s"}}/>
      <Sparkle size={30} color="#FF6B2B" style={{position:"absolute",bottom:210,left:"6%",animation:"float 3.8s ease-in-out infinite",animationDelay:"1.5s"}}/>
      <Star size={38} color="#2D7A4F" style={{position:"absolute",bottom:250,right:"5%",animation:"float 4.2s ease-in-out infinite",animationDelay:"0.8s"}}/>
      <Sparkle size={22} color="#F5C842" style={{position:"absolute",top:380,right:"19%",animation:"float 5.5s ease-in-out infinite",animationDelay:"3s"}}/>
      <Star size={16} color="#FF6B2B" style={{position:"absolute",top:450,left:"18%",animation:"float 4s ease-in-out infinite",animationDelay:"1.2s"}}/>
      <Sparkle size={26} color="#3B82F6" style={{position:"absolute",bottom:360,right:"11%",animation:"float 6s ease-in-out infinite",animationDelay:"2.5s"}}/>
      <Star size={42} color="#F5C842" style={{position:"absolute",bottom:130,left:"2%",animation:"float 3.5s ease-in-out infinite",animationDelay:"0.3s",opacity:.7}}/>
      <Sparkle size={18} color="#2D7A4F" style={{position:"absolute",top:230,left:"24%",animation:"float 4.8s ease-in-out infinite",animationDelay:"1.8s"}}/>
    </>
  );

  return(
    <>
      <G/>
      <div style={{minHeight:"100vh",background:"var(--bg)",position:"relative",overflow:"hidden",paddingBottom:80}}>
        {/* dot grid BG */}
        <div style={{position:"fixed",inset:0,backgroundImage:"radial-gradient(circle,#E0CEBC 1px,transparent 1px)",backgroundSize:"30px 30px",opacity:.55,pointerEvents:"none",zIndex:0}}/>

        {/* Header */}
        <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,248,240,0.9)",backdropFilter:"blur(12px)",borderBottom:"2.5px solid var(--border)",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={reset}>
            <div style={{width:42,height:42,borderRadius:13,background:"var(--orange)",border:"2.5px solid var(--text)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"3px 3px 0 var(--text)"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </div>
            <span className="fredoka" style={{fontSize:26,fontWeight:700,color:"var(--text)"}}>Articulate</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {screen!=="home"&&<button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={reset}>← Home</button>}
          </div>
        </header>

        {/* Key Modal */}

        <div style={{maxWidth:760,margin:"0 auto",padding:"0 24px",position:"relative",zIndex:1}}>

          {/* ── HOME ── */}
          {screen==="home"&&(
            <div>
              <FloatDeco/>
              <div style={{textAlign:"center",padding:"80px 0 60px"}}>
                <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:32,padding:"10px 26px",borderRadius:50,background:"var(--orange-dim)",border:"2px solid var(--orange-border)"}}>
                  <span style={{width:9,height:9,borderRadius:"50%",background:"var(--orange)",animation:"blink 2s infinite"}}/>
                  <span style={{fontSize:14,fontWeight:700,color:"var(--orange)",fontFamily:"Fredoka",letterSpacing:"0.06em",textTransform:"uppercase"}}>AI Speaking Coach</span>
                </div>
                <div style={{position:"relative",display:"block",marginBottom:12}}>
                  <h1 className="fredoka slideLeft" style={{fontSize:"clamp(62px,10vw,100px)",lineHeight:1,color:"var(--text)",letterSpacing:"-0.02em",animationDelay:".1s"}}>Speak up.</h1>
                  <div style={{display:"flex",justifyContent:"center",marginTop:-4,marginBottom:4}}><Squiggle width={340} color="var(--orange)"/></div>
                </div>
                <h1 className="fredoka slideRight" style={{fontSize:"clamp(62px,10vw,100px)",lineHeight:1.1,color:"var(--orange)",letterSpacing:"-0.02em",display:"block",marginBottom:36,animationDelay:".2s"}}>Level up.</h1>
                <p className="fadeUp" style={{color:"var(--muted)",fontSize:19,maxWidth:480,margin:"0 auto",lineHeight:1.8,animationDelay:".35s"}}>Practice any speaking scenario and get instant AI feedback on clarity, structure, and filler words.</p>
              </div>

              {/* Setup card */}
              <div className="card fadeUp d3" style={{padding:"clamp(20px,5vw,40px)",marginBottom:20}}>
                {/* Category */}
                <div style={{marginBottom:36}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <span className="fredoka" style={{fontSize:20}}>Pick a category</span>
                    <Star size={20} color="#F5C842"/>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                    {CATS.map(c=><button key={c} className={`chip ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>)}
                    <button className={`chip ${cat==="Random"?"active":""}`} onClick={()=>setCat("Random")}>Random</button>
                  </div>
                </div>
                {/* Difficulty */}
                <div style={{marginBottom:36}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <span className="fredoka" style={{fontSize:20}}>Difficulty</span>
                    <Sparkle size={20} color="var(--orange)"/>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                    {DIFFS.map(d=><button key={d} className={`chip ${diff===d?"active":""}`} onClick={()=>setDiff(d)}>{d}</button>)}
                    <button className={`chip ${diff==="Random"?"active":""}`} onClick={()=>setDiff("Random")}>Random</button>
                  </div>
                </div>
                {/* Timers */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,marginBottom:40}}>
                  <div>
                    <span className="fredoka" style={{fontSize:17,display:"block",marginBottom:14}}>Prep Time</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {PREP_TIMES.map(t=><button key={t} className={`chip ${prepTime===t?"active":""}`} style={{fontSize:14,padding:"6px 14px"}} onClick={()=>setPrepTime(t)}>{t===0?"None":fmt(t)}</button>)}
                    </div>
                  </div>
                  <div>
                    <span className="fredoka" style={{fontSize:17,display:"block",marginBottom:14}}>Speak Time</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {SPEAK_TIMES.map(t=><button key={t} className={`chip ${speakTime===t?"active":""}`} style={{fontSize:14,padding:"6px 14px"}} onClick={()=>setSpeakTime(t)}>{fmt(t)}</button>)}
                    </div>
                  </div>
                </div>
                <button className="btn btn-orange btn-bounce" style={{width:"100%",justifyContent:"center",padding:"18px",fontSize:22}} onClick={startSession}>Let's Go!</button>
              </div>

              {/* Feature strip */}
              <div className="fadeUp d4" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
                {[["🎙️","Record","Mic-based practice"],["🤖","AI Feedback","Real-time analysis"],["⭐","Score","Detailed breakdown"]].map(([e,t,s])=>(
                  <div key={t} className="card" style={{padding:"24px 16px",textAlign:"center"}}>
                    <div style={{fontSize:28,marginBottom:8}}>{e}</div>
                    <div className="fredoka" style={{fontSize:17,marginBottom:4}}>{t}</div>
                    <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.4}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PREP ── */}
          {screen==="prep"&&(
            <div className="screenEnter" style={{paddingTop:56}}>
              <div className="fadeUp" style={{display:"flex",alignItems:"center",gap:16,marginBottom:32}}>
                <TimerDoodle size={68}/>
                <div>
                  <div style={{display:"flex",gap:8,marginBottom:8}}>
                    <span style={{background:DIFF_BG[activeDiff],color:DIFF_COLOR[activeDiff],border:`2px solid ${DIFF_COLOR[activeDiff]}50`,borderRadius:50,padding:"4px 14px",fontSize:13,fontFamily:"Fredoka",fontWeight:600}}>{activeDiff}</span>
                    <span style={{background:"var(--orange-dim)",color:"var(--orange)",border:"2px solid var(--orange-border)",borderRadius:50,padding:"4px 14px",fontSize:13,fontFamily:"Fredoka",fontWeight:600}}>{cat}</span>
                  </div>
                  <h2 className="fredoka" style={{fontSize:30}}>Prep Time!</h2>
                </div>
              </div>

              <div className="card fadeUp d1" style={{padding:28,marginBottom:20,borderLeft:"6px solid var(--orange)",position:"relative"}}>
                <Star size={20} color="#F5C842" style={{position:"absolute",top:16,right:16}}/>
                <p style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Your prompt</p>
                <p className="fredoka" style={{fontSize:24,lineHeight:1.4,marginBottom:16}}>"{displayedTopic}"</p>
                <button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={pickTopic}>↻ New topic</button>
              </div>

              <div className="card fadeUp d2" style={{textAlign:"center",padding:"44px 32px",marginBottom:20}}>
                <div style={{fontSize:90,fontWeight:700,fontFamily:"Fredoka",lineHeight:1,letterSpacing:"-0.03em",color:timer<10?"var(--red)":"var(--text)"}}>{fmt(timer)}</div>
                <div style={{color:"var(--muted)",fontSize:16,marginTop:8,fontFamily:"Fredoka"}}>prep time remaining</div>
              </div>

              <div className="fadeUp d3" style={{display:"flex",gap:12}}>
                {!running
                  ?<button className="btn btn-orange" style={{flex:1,justifyContent:"center",padding:"15px",fontSize:18}} onClick={()=>{startTimeRef.current=Date.now()-((initialTimeRef.current-timer)*1000);setRunning(true);}}>▶ Start Timer</button>
                  :<button className="btn btn-cream" style={{flex:1,justifyContent:"center"}} onClick={()=>setRunning(false)}>⏸ Pause</button>
                }
                <button className="btn btn-green" style={{flex:1,justifyContent:"center",padding:"15px",fontSize:18}} onClick={goSpeak} disabled={running}>Start Speaking →</button>
              </div>
              {micErr&&<p style={{color:"var(--red)",fontSize:14,marginTop:12,textAlign:"center"}}>{micErr}</p>}
            </div>
          )}

          {/* ── SPEAK ── */}
          {screen==="speak"&&(
            <div className="screenEnter" style={{paddingTop:56,textAlign:"center"}}>
              <div className="fadeUp" style={{marginBottom:24,display:"flex",justifyContent:"center"}}>
                {recording
                  ?<div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",borderRadius:50,background:"var(--red-dim)",border:"2px solid var(--red)",fontFamily:"Fredoka",fontSize:17,color:"var(--red)",fontWeight:600}}>
                    <span style={{width:9,height:9,borderRadius:"50%",background:"var(--red)",animation:"blink 1s infinite"}}/>Recording
                  </div>
                  :<div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 22px",borderRadius:50,background:"var(--orange-dim)",border:"2px solid var(--orange-border)",fontFamily:"Fredoka",fontSize:17,color:"var(--orange)"}}>Ready to record</div>
                }
              </div>

              <div className="card fadeUp d1" style={{textAlign:"left",padding:24,marginBottom:20}}>
                <p style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Your prompt</p>
                <p className="fredoka" style={{fontSize:20,lineHeight:1.5,marginBottom:recording?0:14}}>"{displayedTopic}"</p>
                {!recording&&<button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={pickTopic}>↻ New topic</button>}
              </div>

              <div className="card fadeUp d2" style={{padding:"48px 32px",marginBottom:20,border:recording?"2.5px solid var(--red)":"2.5px solid var(--border)",transition:"border-color .3s",position:"relative",overflow:"hidden"}}>
                {recording&&<div style={{position:"absolute",top:0,left:0,right:0,height:5,background:"var(--red)"}}/>}
                {recording&&(
                  <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
                    <div style={{position:"relative",width:64,height:64}}>
                      <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2.5px solid var(--red)",animation:"pulseRing 1.5s ease-out infinite"}}/>
                      <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2.5px solid var(--red)",animation:"pulseRing 1.5s ease-out infinite",animationDelay:"0.5s"}}/>
                      <div style={{position:"absolute",inset:8,borderRadius:"50%",background:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{fontSize:96,fontWeight:700,fontFamily:"Fredoka",lineHeight:1,letterSpacing:"-0.03em",color:timer<10?"var(--red)":timer<30?"#CC6600":"var(--text)"}}>{fmt(timer)}</div>
                <div style={{color:"var(--muted)",fontFamily:"Fredoka",fontSize:17,margin:"10px 0 22px"}}>speaking time remaining</div>
                <div style={{display:"flex",justifyContent:"center"}}><WaveViz active={recording}/></div>
              </div>

              <div className="fadeUp d3">
                {!recording
                  ?<button className="btn btn-orange" style={{width:"100%",justifyContent:"center",padding:"17px",fontSize:20}} onClick={startMic}>Start Recording</button>
                  :<button className="btn btn-red" style={{width:"100%",justifyContent:"center",padding:"17px",fontSize:20}} onClick={doStop}>■ Stop & Get Feedback</button>
                }
              </div>
              {micErr&&<p style={{color:"var(--red)",fontSize:14,marginTop:12}}>{micErr}</p>}
            </div>
          )}

          {/* ── FEEDBACK ── */}
          {screen==="feedback"&&(
            <div className="screenEnter" style={{paddingTop:56}}>
              {loading&&(
                <div className="fadeUp" style={{textAlign:"center",padding:"80px 24px"}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
                    <div style={{animation:"wobble 1s ease-in-out infinite"}}><TrophyDoodle size={76}/></div>
                  </div>
                  <h3 className="fredoka" style={{fontSize:28,marginBottom:8}}>Analyzing your speech...</h3>
                  <p style={{color:"var(--muted)",fontSize:15}}>Analyzing with Claude AI...</p>
                </div>
              )}

              {!loading&&feedback&&!feedback.error&&(
                <div>
                  {/* Score hero */}
                  <div className="card fb1" style={{textAlign:"center",padding:"52px 32px",marginBottom:20,position:"relative",overflow:"visible",borderTop:`6px solid ${feedback.score>=80?"var(--green)":feedback.score>=60?"var(--yellow)":"var(--red)"}`}}>
                    <Confetti active={true}/>
                    <CelebStars show={feedback.score>=80}/>
                    <div style={{position:"absolute",top:16,right:16}}><Star size={32} color="#F5C842"/></div>
                    <div style={{position:"absolute",top:20,left:20}}><Sparkle size={26} color="var(--orange)"/></div>
                    <h3 className="fredoka" style={{fontSize:19,color:"var(--muted)",marginBottom:20}}>Overall Score</h3>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><ScoreRing score={feedback.score} size={160}/></div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 24px",borderRadius:50,
                      background:feedback.score>=80?"var(--green)":feedback.score>=60?"var(--yellow-dim)":"var(--red-dim)",
                      border:`2px solid ${feedback.score>=80?"var(--green)":feedback.score>=60?"var(--yellow)":"var(--red)"}`,
                      color:feedback.score>=80?"white":feedback.score>=60?"#7A5500":"var(--red)",
                      fontFamily:"Fredoka",fontSize:18,fontWeight:600,marginBottom:20}}>
                      {feedback.score>=80?"🏆 Excellent!":feedback.score>=60?"👍 Good Job!":"💪 Keep Practicing!"}
                    </div>
                    <p style={{color:"var(--muted)",fontSize:16,maxWidth:460,margin:"0 auto",lineHeight:1.8}}>{feedback.overall_feedback}</p>
                  </div>

                  {/* Sub scores */}
                  <div className="fb2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
                    <SubBar label="Clarity" val={feedback.clarity} color="#3B82F6" bg="#EFF6FF"/>
                    <SubBar label="Structure" val={feedback.structure} color="var(--orange)" bg="var(--orange-dim)"/>
                    <SubBar label="Confidence" val={feedback.confidence} color="var(--green)" bg="#E8F7EE"/>
                  </div>

                  {/* Fillers */}
                  {feedback.filler_count>0&&(
                    <div className="card fb3" style={{padding:28,marginBottom:20,borderLeft:"5px solid var(--red)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                        <span className="fredoka" style={{fontSize:19}}>😬 Filler Words</span>
                        <span style={{background:"var(--red-dim)",color:"var(--red)",border:"2px solid rgba(232,64,64,.2)",borderRadius:50,padding:"3px 14px",fontFamily:"Fredoka",fontSize:14}}>{feedback.filler_count} detected</span>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {feedback.filler_words.map(w=><span key={w} style={{padding:"6px 18px",borderRadius:50,background:"var(--red-dim)",color:"var(--red)",border:"2px solid rgba(232,64,64,.2)",fontFamily:"Fredoka",fontSize:15}}>{w}</span>)}
                      </div>
                    </div>
                  )}

                  {/* Strengths + Improvements */}
                  <div className="fb4" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
                    <div className="card" style={{padding:28,borderTop:"5px solid var(--green)"}}>
                      <p className="fredoka" style={{fontSize:18,color:"var(--green)",marginBottom:16}}>✓ What's working</p>
                      {feedback.strengths.map((s,i)=>(
                        <div key={i} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:"#E8F7EE",border:"2px solid var(--green)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                            <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                          </div>
                          <span style={{fontSize:15,lineHeight:1.6}}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="card" style={{padding:28,borderTop:"5px solid var(--orange)"}}>
                      <p className="fredoka" style={{fontSize:18,color:"var(--orange)",marginBottom:16}}>↑ To improve</p>
                      {feedback.improvements.map((s,i)=>(
                        <div key={i} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:"var(--orange-dim)",border:"2px solid var(--orange-border)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                            <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 9V3M3 6l3-3 3 3" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                          </div>
                          <span style={{fontSize:15,lineHeight:1.6}}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coach tip */}
                  <div className="card fb5" style={{padding:28,marginBottom:20,background:"var(--yellow-dim)",border:"2.5px solid var(--yellow)",borderRadius:22}}>
                    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                      <div style={{fontSize:36,flexShrink:0}}>💡</div>
                      <div>
                        <p className="fredoka" style={{fontSize:18,color:"#7A5500",marginBottom:8}}>Coach's Tip</p>
                        <p style={{fontSize:15,lineHeight:1.8}}>{feedback.one_tip}</p>
                      </div>
                    </div>
                  </div>

                  {/* Transcript */}
                  {transcript&&(
                    <details className="card fb6" style={{marginBottom:20,padding:28,cursor:"pointer"}}>
                      <summary className="fredoka" style={{fontSize:16,color:"var(--muted)",userSelect:"none"}}>📝 View transcript ▾</summary>
                      <p style={{marginTop:16,fontSize:14,lineHeight:1.9,opacity:.85}}>{transcript}</p>
                    </details>
                  )}

                  {/* Audio */}
                  {audioUrl&&(
                    <div className="card fb7" style={{padding:28,marginBottom:20}}>
                      <p className="fredoka" style={{fontSize:17,marginBottom:14,color:"var(--muted)"}}>🎧 Your Recording</p>
                      <audio controls src={audioUrl} style={{width:"100%",borderRadius:12}}
                        onLoadedMetadata={e=>{
                          const el=e.target;
                          if(el.duration===Infinity||isNaN(el.duration)){
                            el.currentTime=1e101;
                            el.ontimeupdate=()=>{el.ontimeupdate=null;el.currentTime=0;};
                          }
                        }}/>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="fb7" style={{display:"flex",gap:14,marginBottom:48}}>
                    <button className="btn btn-orange" style={{flex:1,justifyContent:"center",padding:"16px",fontSize:18}} onClick={()=>{setFeedback(null);setAudioBlob(null);setTranscript("");startSession();}}>Try Again 🔄</button>
                    <button className="btn btn-cream" style={{flex:1,justifyContent:"center"}} onClick={reset}>Change Topic</button>
                  </div>
                </div>
              )}

              {!loading&&feedback?.error&&(
                <div className="card fadeUp" style={{textAlign:"center",padding:48}}>
                  <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
                  <p style={{color:"var(--red)",marginBottom:20,fontFamily:"Fredoka",fontSize:18}}>{feedback.error}</p>
                  <button className="btn btn-cream" onClick={reset}>Go back</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
