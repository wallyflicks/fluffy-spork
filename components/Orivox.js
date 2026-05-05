"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { detectFillers } from "../lib/fillerDetection";
import { checkNewAchievements, ACHIEVEMENTS } from "../lib/achievements";
import { containsInappropriateContent } from "../lib/contentFilter";

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
    @keyframes fadeInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes bounceBtn{0%,100%{transform:translate(0,0);box-shadow:4px 4px 0 var(--text)}45%{transform:translate(-2px,-5px);box-shadow:6px 9px 0 var(--text)}}
    @keyframes chipPop{0%{transform:scale(1)}40%{transform:scale(1.18)}70%{transform:scale(.96)}100%{transform:scale(1)}}
    @keyframes ripple{0%{transform:scale(0);opacity:.5}100%{transform:scale(4);opacity:0}}
    @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(600px) rotate(720deg);opacity:0}}
    @keyframes celebBounce{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.3) rotate(10deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
    @keyframes typewriter{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
    @keyframes urgentPulse{from{opacity:.15}to{opacity:.4}}
    @keyframes letsGoGlow{0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 22px rgba(255,107,43,.55))}}
    @keyframes chipSpring{0%{transform:scale(1)}25%{transform:scale(.95)}65%{transform:scale(1.05)}100%{transform:scale(1)}}
    @keyframes countdownTick{from{transform:scale(1.1)}to{transform:scale(1)}}
    @keyframes toastSlideIn{from{opacity:0;transform:translateY(-38px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}

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
    .btn:active{transform:translate(1px,1px) scale(.97);box-shadow:1px 1px 0 var(--text);transition:transform .1s,box-shadow .1s}
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
    @media(prefers-reduced-motion:no-preference){
      .chip:active{animation:chipSpring .28s cubic-bezier(.22,.68,0,1.4) forwards!important;transform:none!important;transition:none!important}
      .letsgo-btn:hover{animation:letsGoGlow 1.6s ease-in-out infinite}
      .timer-tick{animation:countdownTick .18s ease-out}
    }

    @media(max-width:480px){
      .chip{font-size:13px;padding:7px 14px;}
      .card{border-radius:16px;}
    }
    @media(max-width:640px){
      .scores-grid{grid-template-columns:1fr 1fr!important;}
    }
    .nav-links{display:flex;gap:8px;align-items:center;}
    .hamburger-btn{display:none;width:40px;height:40px;border-radius:12px;background:var(--card);border:2px solid var(--border);cursor:pointer;align-items:center;justify-content:center;box-shadow:2px 2px 0 var(--border);transition:all .15s;flex-shrink:0;}
    .hamburger-btn:hover{border-color:var(--orange);box-shadow:2px 2px 0 var(--orange);}
    .mob-menu{position:absolute;top:100%;left:0;right:0;background:rgba(255,248,240,0.98);border-bottom:2.5px solid var(--border);padding:14px 20px;display:flex;flex-direction:column;gap:8px;z-index:200;}
    .mob-pill{display:flex;align-items:center;padding:13px 20px;border-radius:14px;font-family:'Fredoka',sans-serif;font-size:16px;font-weight:600;border:2px solid var(--border);color:var(--muted);background:var(--card);text-decoration:none;transition:all .15s;box-shadow:2px 2px 0 var(--border);}
    .mob-pill:hover{border-color:var(--orange);color:var(--orange);}
    @media(max-width:600px){
      .nav-links{display:none;}
      .hamburger-btn{display:flex;}
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
  General:{
    Easy:["What is your favorite hobby and why?","Describe your ideal weekend","What is something you are grateful for today?","What is your favorite season and why?","Describe your morning routine","What would you do with a free day?","What is your favorite food and why?","Describe your hometown","What is your favorite book, movie, or show and what made it memorable?","What is a skill you recently picked up or want to learn?","Describe a place that makes you feel calm and why","What is something small that consistently makes your day better?","What does your ideal Sunday look like from start to finish?","Describe a person in your life who has had a positive influence on you","What is a tradition or habit from your family that you appreciate?","What is one thing you wish more people knew about where you grew up?","Describe the best meal you have ever had and what made it special","What is something you do just for yourself with no other reason?","What is your favorite movie and why?","Describe your dream house","What would you do if you won the lottery?","What is your favorite sport or activity?","What is something you are looking forward to?","Who is someone you look up to and why?","What is your favorite subject in school and why?","Describe your favorite place to relax","What is one thing you would change about your daily routine?","What is the best gift you have ever received?","Describe your favorite type of weather","What is something new you recently learned?","What is your favorite way to spend time with friends?","What is a skill you wish you had?","Describe your favorite childhood game","What is something that always makes you smile?","What would your perfect day look like from morning to night?","Describe something beautiful you saw recently","What is your go-to comfort activity after a tough day?","Describe a moment recently when you felt genuinely happy","What is your favorite thing about where you live?","Describe a skill you learned on your own without being taught","What is something you would change about your school?","Describe your ideal vacation destination","What is a tradition in your family that you love?","What is something most people do not know about you?","Describe a moment when you felt truly proud","What is your favorite time of day and why?","What is something you do every day that makes you feel better?","Describe a person who has made your life better","What is a small thing that makes a big difference in your day?","Describe your favorite type of music and why it resonates with you","What is something you are better at than most people you know?","Describe a place that makes you feel calm","What is one thing you wish you could do every single day?","Describe something you collect or have collected","What is your earliest memory?","Describe a time you tried a new food and loved or hated it","What is something you do when you need to recharge?","Describe your favorite piece of clothing and why you love it","What is something you are curious about right now?","Describe a time you helped someone without being asked","What is your favorite thing to do on a rainy day?","Describe a goal you are working toward right now","What is something you appreciate more now than you did before?"],
    Medium:["What is the most important lesson you have learned so far in life?","How do you handle stress?","What does success mean to you?","How has technology changed your daily life?","What is something you wish you had learned earlier?","How do you make difficult decisions?","What motivates you to keep going when things get hard?","Describe a time you stepped outside your comfort zone","What is a belief you held strongly a few years ago that you have since changed?","How do you know when to keep pushing and when to walk away from something?","What does a meaningful friendship look like to you?","How has your relationship with failure changed as you have gotten older?","What is the most valuable piece of feedback you have ever received?","How do you stay grounded when life feels chaotic?","What is something most people assume about you that is wrong?","How do you make sure the people in your life know you care about them?","What do you think is the single biggest thing holding most people back?","Describe a moment when you had to make a choice that changed your path","How do you think social media affects mental health?","How do you define a good life?","What is something you believe that most people disagree with?","How has a failure taught you something valuable?","What is the most important quality in a leader?","How do you stay focused when you are distracted?","What is your approach to learning something new?","How do you think your environment shapes who you are?","How do you handle situations where you do not know the answer?","How do you think about risk and taking chances?","What is the hardest part about growing up?","How do you deal with people who are difficult to work with?","What is something you are still trying to figure out about yourself?","How do you decide what to spend your time on?","What is the difference between being busy and being productive?","How do you think about your future?","What is one thing you would tell someone who just moved to a new city?","What does it mean to truly listen to someone?","How do you repair a relationship after a disagreement?","What is the most underrated life skill?","How do you think about the balance between ambition and contentment?","What is something society gets completely wrong in your opinion?","How do you decide who to trust?","What does it mean to truly listen to someone?","How do you think about the role of luck versus effort in success?","What is the most important lesson you learned from a mistake?","How do you approach a situation where you have no control?","What does it mean to be a responsible person?","How do you think about the difference between intelligence and wisdom?","What is something you believe strongly that is hard to explain to others?","How do you handle situations where you feel overwhelmed?","What does it mean to have integrity?","How do you think about forgiveness — is it for the other person or for yourself?","What is something you have changed your mind about in the last year?","How do you stay curious about the world?","What does it mean to truly respect someone?","How do you approach building new habits?","What is the difference between confidence and arrogance?","How do you think about the relationship between money and happiness?","What does it mean to be a good citizen?","How do you handle situations where you have made a promise you cannot keep?","What is the most underrated quality in a person?","How do you think about your own biases?","What does it mean to have good judgment?","How do you approach a conversation with someone you strongly disagree with?"],
    Hard:["What is your philosophy on life and how did you develop it?","How do you think the next generation will be different from yours?","What does it mean to live a meaningful life?","If you could change one thing about society what would it be and why?","How do you balance short term desires with long term goals?","What is the relationship between happiness and success?","How do you define your own identity?","What legacy do you want to leave behind?","If you could redesign education from scratch what would it look like and why?","How do you think about the role of luck versus hard work in life outcomes?","What is the biggest tension between individual freedom and collective responsibility?","What does it mean to truly know yourself and how do you get there?","How should people think about their moral obligations to strangers?","What is the most important question your generation will have to answer in the next 20 years?","How do you reconcile wanting to make an impact with the reality that individual action feels small?","What does genuine self-improvement look like versus surface-level change?","How do you think people actually change their minds about deeply held beliefs?","What would you say to someone who believes their circumstances make success impossible for them?","How do you think artificial intelligence will change what it means to be human?","How do you think about mortality and what it means for how you live?","How do cultural expectations shape individual identity?","What is the difference between intelligence and wisdom?","How do you think about justice and fairness in an unequal world?","What is the role of suffering in a meaningful life?","How do you balance individual ambition with care for others?","What does it mean to live authentically?","How do you think about truth in a world full of conflicting information?","What is the relationship between power and corruption?","How should society balance progress with preservation of tradition?","What does it mean to be truly educated?","How do you think about free will — do people really choose their path?","How do you define morality without religion?","What is the relationship between art and truth?","How should we think about our obligations to future generations?","What does courage look like in everyday life?","What is the cost of conformity in a society that rewards it?","How do you reconcile personal values with systemic pressures to compromise them?","How should we think about our obligations to people who will live after us?","What is the relationship between creativity and constraint?","How do you think about the ethics of eating meat in a world with alternatives?","What does it mean to live a life of integrity when integrity is costly?","How should individuals balance personal happiness with collective responsibility?","What is the role of doubt in forming strong beliefs?","How do you think about the relationship between memory and identity?","What does it mean to be free in a world full of social and economic constraints?","How should we think about punishment for crimes committed by people who had terrible circumstances?","What is the difference between tolerance and acceptance and why does it matter?","How do you think about the ethics of extreme wealth in a world with extreme poverty?","What does it mean to be truly educated versus merely credentialed?","How should society handle the tension between individual rights and collective safety?","What is the role of beauty in a good life?","How do you think about the relationship between language and thought?","What does it mean to be authentic when we are shaped by forces outside our control?","How should we think about historical figures who did great things and terrible things?","What is the relationship between vulnerability and strength?","How do you think about the ethics of bringing a child into a deeply uncertain world?","What does courage look like when no one is watching?"],
  },
  Interview:{
    Easy:["Tell me about yourself","What are your strengths?","What are your weaknesses?","Why do you want this job?","Where do you see yourself in 5 years?","What is your greatest achievement?","Why should we hire you?","Describe your work style","How do you prefer to receive feedback?","What are you most proud of from your last year of school or work?","How would your friends or colleagues describe you?","What is something you are still learning and how are you improving?","What do you know about our company and why does it appeal to you?","What kind of environment do you do your best work in?","What is one goal you have set for yourself this year?","Describe a skill you have that would surprise people","What does a good day at work or school look like for you?","How do you like to collaborate with others?","How would you describe yourself in three words?","What do you like to do outside of work or school?","What is one thing you are proud of?","How do you prefer to communicate with a team?","What is a goal you are currently working toward?","How do you handle a busy or stressful day?","What does a productive day look like for you?","What is something you taught yourself?","How do you prepare for something important?","What is one thing you would improve about your last job or school experience?","How do you stay organized?","How do you define doing a good job?","What motivates you to do your best work?","How do you approach tasks you do not enjoy?","What is the most useful skill you have developed?","How do you handle making a mistake at work or school?","What is something you are actively trying to get better at?","What is one value you bring to every team you are part of?","How do you handle feedback you disagree with?","How do you handle feedback that you disagree with?","What is something you do to prepare for an important meeting or presentation?","How do you stay productive when you are working from home?","What is your approach to learning a new tool or skill quickly?","How do you handle a task that has unclear instructions?","What is something you do when you feel stuck on a problem?","How do you build rapport with people you just met?","What is your approach to managing your energy throughout the day?","How do you handle it when someone takes credit for your work?","What is something you do to stay calm under pressure?","How do you approach setting goals for yourself?","What is your strategy for staying motivated during repetitive work?","How do you handle situations where you have to say no to someone?","What is something you always do before starting a new project?","How do you approach asking for help when you need it?","What is your approach to giving constructive feedback to a peer?","How do you handle working with someone you find difficult?","What is something you do to improve your skills outside of work or school?","How do you approach a day when everything is going wrong?","What is your strategy for making a good first impression?"],
    Medium:["Tell me about a time you faced a conflict at work or school and how you resolved it","Describe a situation where you had to lead a team","How do you prioritize tasks when you have multiple deadlines?","Tell me about a time you failed and what you learned from it","How do you handle criticism?","Describe a time you went above and beyond","Tell me about a time you had to adapt quickly to change","How do you work under pressure?","Describe a time when you disagreed with a decision and how you handled it","Tell me about a project you are genuinely proud of and your specific role in it","How do you approach learning something you know nothing about?","Describe a time when you had to deliver work under a very tight deadline","Tell me about a situation where you had to work with someone who had a very different communication style","How do you handle situations where priorities shift unexpectedly?","Describe a time when you identified a problem before anyone else noticed it","Tell me about a time you had to earn someone's trust quickly","How have you responded to a situation where the goalposts changed mid-project?","Describe a moment when you received feedback that was hard to hear and what you did with it","Describe a time you had to learn something very quickly","Tell me about a time you disagreed with a team decision and what you did","How do you approach working with someone whose style is very different from yours?","How do you handle competing priorities when everything feels urgent?","Tell me about a time you had to give someone difficult feedback","How do you build trust with people you work with?","Describe a time when you had to be flexible and adapt your approach","How do you approach a problem you have never seen before?","Tell me about a time you had to work without much guidance","How do you make sure your work meets a high standard?","Describe a time when you changed someone's mind","How do you handle a situation where you made a commitment you could not keep?","Tell me about a time you worked on something that failed","How do you manage your energy throughout a long project?","Describe a time you took on more responsibility than was expected","How do you approach collaboration on a remote or hybrid team?","How do you stay motivated on long or repetitive tasks?","Describe a time you had to make a quick decision with incomplete information","How do you approach a situation where your instincts conflict with what data is telling you?","Tell me about a time you had to deliver more with fewer resources","Tell me about a time you had to deliver results with a team that was not performing well","How do you approach building credibility in a new role or environment?","Tell me about a time you had to learn from someone much younger or less experienced than you","How do you handle situations where your values conflict with what you are being asked to do?","Tell me about a time you had to manage a project that was already behind schedule","How do you approach situations where you have to make a decision that will upset someone?","Tell me about a time you had to collaborate with someone in a completely different field","How do you handle receiving praise — do you find it easy or difficult to accept?","Tell me about a time you spotted a problem before anyone else did","How do you approach building relationships with people who are very different from you?","Tell me about a time you had to be the voice of reason in a chaotic situation","How do you handle situations where the goal posts keep moving?","Tell me about a time you had to balance quality with speed","How do you approach mentoring or helping someone newer than you?","Tell me about a time you had to advocate for yourself or your team","How do you handle working on something you fundamentally disagree with?","Tell me about a time you turned a negative situation into an opportunity","How do you approach situations where you have more work than time?","Tell me about a time you had to earn the trust of a skeptical stakeholder","How do you handle situations where your instinct and the data point in different directions?"],
    Hard:["Tell me about a time you had to make a difficult decision with limited information","Describe a situation where you had to convince someone who strongly disagreed with you","Tell me about the most complex problem you have ever solved","How would you handle managing someone who was underperforming?","Describe a time you had to deliver bad news — how did you handle it?","Tell me about a time you took initiative without being asked","How do you approach situations where there is no clear right answer?","Describe your biggest professional failure and what you would do differently","Tell me about a time you had to make an unpopular decision and then defend it","Describe a situation where you had to balance competing demands from multiple stakeholders","How would you handle a situation where your manager gave you instructions you believed were wrong?","Tell me about a time when you had to rebuild trust after a mistake","Describe a situation where you had to lead through significant uncertainty","How do you approach ethical dilemmas where the right answer is not obvious?","Tell me about the most politically complex environment you have worked or studied in","Describe a time you drove meaningful change in an organization or team","How do you approach performance conversations that could be emotionally charged?","Tell me about a time when you had to sacrifice short-term results for long-term gain","How would you build trust with a team that has been burned by poor leadership before?","How do you approach a situation where the ethical choice and the profitable choice conflict?","Tell me about the most ambiguous project you have worked on and how you navigated it","How would you turn around a team with low morale and poor performance?","Describe a time you had to influence without authority","How do you think about your blind spots as a leader or collaborator?","Tell me about a time you had to rebuild a relationship that was damaged","How do you approach situations where you know more than the person managing you?","Describe how you would handle discovering that a colleague was acting unethically","How do you think about long-term career strategy?","How do you approach hiring or building a team?","Describe a time you had to deliver results under impossible constraints","How do you think about your personal brand and reputation professionally?","How do you balance being decisive with being collaborative?","Describe your philosophy on mentorship and developing others","How do you approach situations where you have to say no to someone important?","Tell me about the most complex stakeholder situation you have ever managed","How do you build alignment when people have fundamentally different goals?","Describe a time when you had to challenge a deeply held assumption in your organization","How would you handle discovering that a key metric your company relies on has been measured incorrectly for years?","Tell me about a time you had to make a call that you knew would damage an important relationship","How would you build alignment across a team with fundamentally different visions for the future?","Tell me about a time you had to operate without any of the resources you needed","How do you approach situations where being right and being effective are in conflict?","Tell me about the most politically complex situation you have ever navigated professionally","How would you handle a situation where your manager is clearly wrong but very confident?","Tell me about a time you had to completely change your approach midway through a project","How do you think about building a personal board of advisors throughout your career?","Tell me about a time you had to lead through a crisis you did not cause","How would you handle a situation where two of your most important stakeholders want completely opposite things?","Tell me about a time you had to make a decision that went against established precedent","How do you think about the difference between a career plateau and a comfortable equilibrium?","Tell me about a time you had to inspire commitment to a goal you yourself were uncertain about","How do you approach situations where you are clearly out of your depth?","Tell me about the most important professional relationship you have ever built and how you built it","How would you handle being passed over for a promotion you deserved?","Tell me about a time you had to hold a team together during a period of significant uncertainty","How do you think about the relationship between technical expertise and leadership?","Tell me about a time when slowing down was the right strategic move even when everyone wanted to speed up"],
  },
  Storytelling:{
    Easy:["Tell a story about a funny thing that happened to you","Describe your most memorable birthday","Tell a story about a time you got lost","Describe your first day at a new school or job","Tell a story about a pet or animal encounter","Describe your favorite childhood memory","Tell a story about a time you were surprised","Describe a trip or vacation that stood out","Tell the story of how you met your closest friend","Describe a time when something went completely wrong in a funny way","Tell a story about a lesson you learned the hard way when you were young","Describe a moment when a stranger did something kind for you","Tell a story about a time you tried something new and did not expect to enjoy it","Describe the most adventurous thing you have done with a group of people","Tell a story about a moment that made you laugh until you could not stop","Describe a time when a small decision turned into a big unexpected adventure","Tell a story about a tradition or event in your family that means something to you","Describe a moment when you realized someone was far more interesting than you had assumed","Tell a story about a time you tried something for the first time","Describe a moment that made you laugh until you cried","Tell a story about a time you made a new friend","Tell a story about a time you got something very wrong","Describe a time you did something kind for a stranger","Tell a story about your most memorable meal","Describe a time you were really nervous and what happened","Tell a story about a time something unexpectedly went right","Describe a moment you felt really proud of yourself","Tell a story about a time you had to apologize","Describe your first memory of being truly excited about something","Tell a story about a time you explored somewhere new","Describe a moment you felt completely at peace","Tell a story about a time someone surprised you with their kindness","Describe a time you had to be patient","Tell a story about something you built or created","Describe a moment that felt like it was from a movie","Tell a story about a time you changed your mind about someone","Describe your most memorable school day","Tell a story about a day that did not go as planned but ended well","Tell a story about a time you stayed up way too late doing something","Describe your most memorable Halloween or holiday experience","Tell a story about a time you got into trouble for something that was not your fault","Describe a time you discovered something hidden or unexpected","Tell a story about a time you had to keep a secret","Describe your most memorable experience in nature","Tell a story about a time you made someone else laugh really hard","Describe a time you witnessed something extraordinary","Tell a story about a time you had to improvise","Describe your most memorable experience at a sporting event or concert","Tell a story about a time you reconnected with someone from your past","Describe a time you achieved something you had been working toward for a long time","Tell a story about a time technology failed you at the worst possible moment","Describe your most memorable experience traveling or being in a new place","Tell a story about a time you had to ask for directions or help finding something","Describe a time you found something you had lost","Tell a story about a time you stayed somewhere overnight unexpectedly","Describe a time you saw something that completely changed your mood","Tell a story about a time you had to take care of something or someone","Describe your most memorable experience with a stranger"],
    Medium:["Tell a story about a time a friendship changed your life","Describe a moment that made you see the world differently","Tell a story about a time you had to be brave","Describe a moment you are proud of but rarely talk about","Tell a story about a time things did not go as planned but worked out","Describe a moment that taught you something unexpected","Tell a story about a time you helped someone","Describe a turning point in your life","Tell a story about a time you had to stand up for what you believed in even when it was uncomfortable","Describe a moment when you realized that a relationship had fundamentally changed","Tell a story about the most nervous you have ever been before doing something important","Describe a time when you had to make a sacrifice and whether you stand by it today","Tell a story about a moment when you felt genuinely lost and how you found your way","Describe a conversation that changed how you think about something important","Tell a story about a time you were underestimated and what you did with it","Describe a moment when you realized you had been wrong about something significant","Tell a story about a time when failure led you somewhere you never expected to go","Describe a relationship that shaped your values in a way you are still living out today","Tell a story about a time you had to choose between two things you both wanted","Describe a moment when you realized you had grown as a person","Tell a story about a relationship that changed who you are","Tell a story about a failure that became a turning point","Describe a moment when you felt truly understood by someone","Tell a story about a time you had to let something go","Tell a story about a time you helped someone through something hard","Describe a time you were challenged by someone you respected","Tell a story about a moment of unexpected beauty or wonder","Describe a time you made a decision that scared you","Tell a story about a time you had to trust someone completely","Describe a moment when you realized what you actually value","Tell a story about a time you were completely out of your depth","Describe a moment that felt like a before-and-after in your life","Tell a story about a time you had to start over","Describe a moment when everything felt uncertain but you kept going","Tell a story about a time community or belonging mattered to you","Describe a time when being honest cost you something","Tell a story about a time you surprised yourself with what you were capable of","Tell a story about a time you realized you were becoming someone different","Describe a moment when you chose the harder path and what happened","Tell a story about a time you had to fight for something you believed in","Describe a moment when you realized a relationship had fundamentally changed","Tell a story about a time silence was more powerful than words","Describe a moment when you had to choose between loyalty and honesty","Tell a story about a time you witnessed real kindness from an unexpected source","Describe a moment when failure taught you something success never could","Tell a story about a time you had to accept something you could not change","Describe a moment when you felt completely out of place and what you did","Tell a story about a time you surprised yourself with what you were capable of","Describe a moment when a small gesture had a huge impact","Tell a story about a time you had to apologize and really mean it","Describe a moment when you had to trust your gut despite what others said","Tell a story about a time you were the underdog and what happened","Describe a moment when something ended and something new began","Tell a story about a time you witnessed someone else's courage","Describe a moment when you realized that appearances were completely deceiving","Tell a story about a time you had to let someone go","Describe a moment when laughter got you through something difficult"],
    Hard:["Tell a story that captures who you are as a person in under 2 minutes","Describe a moment of failure that ultimately led to growth","Tell a story that changed how you think about human connection","Describe the most difficult thing you have ever had to communicate to someone","Tell a story where the stakes were high and walk us through your thought process","Describe a moment where your values were tested","Tell a story about a time you had to rebuild after something fell apart","Describe an experience that you think everyone should have at least once","Tell the story of a decision you knew would change everything and walk through exactly how it felt to make it","Describe an experience where you had to hold two completely opposing truths at the same time","Tell a story about a loss and how it reshaped what you value","Describe the most complex relationship you have ever navigated and what you learned","Tell a story about a time you chose integrity over convenience and what it cost you","Describe a moment when you realized the story you had been telling yourself was wrong","Tell a story about a time you had to forgive — either someone else or yourself","Describe an experience that made you confront your own blind spots or assumptions","Tell a story where you were the antagonist in someone else's narrative and how you came to see that","Describe the moment that best explains why you are the way you are today","Tell a story that explores the gap between who you are and who you want to be","Describe the moment you understood what your parents gave up for you","Describe a failure so significant it changed how you see yourself","Tell a story about a relationship where love was not enough","Describe a moment when you realized the world was more complicated than you thought","Describe the experience that most shaped your values","Describe a moment where you felt both lost and completely free","Tell a story about a time you witnessed something that stayed with you forever","Describe a choice you made that you still think about","Tell a story about a time you had to trust the process even when you could not see the outcome","Describe a moment when you understood something about humanity that words barely capture","Tell a story about a time you had to be someone's anchor","Describe the most honest conversation you have ever had","Tell a story about a time you realized you were wrong about something important","Describe a moment that tested everything you thought you knew about yourself","Tell a story about a time joy and grief existed at the same time","Tell a story about a time you had to carry something alone and what that taught you","Describe a moment when you chose to walk away and why that was the bravest thing to do","Tell a story that captures the moment you stopped being afraid of something","Describe the experience that most challenged your sense of who you are","Tell a story about a time you had to hold two people you love together when they were pulling apart","Describe a moment when you understood something about grief that words barely capture","Tell a story about a time you had to be strong for someone when you had nothing left","Describe the moment you realized you had been living for someone else's expectations","Tell a story about a time the truth was more complicated than anyone wanted to hear","Describe a moment when you had to choose between your head and your heart","Tell a story about a time you walked away from something that was hurting you","Describe the experience that made you realize how short life actually is","Tell a story about a time you had to rebuild trust after it was broken","Describe a moment when you realized that what you wanted and what you needed were completely different","Tell a story about a time you had to be honest with yourself about something uncomfortable","Describe the moment a relationship became something deeper than you expected","Tell a story about a time you stood up for someone who could not stand up for themselves","Describe a moment when you felt the weight of a decision you could not undo","Tell a story about a time everything changed in a single conversation","Describe a moment when you found beauty in something broken","Tell a story about a time you chose growth over comfort and what it actually cost you","Describe the experience that taught you the most about what it means to love someone"],
  },
  Debate:{
    Easy:["Should school uniforms be mandatory?","Is social media more harmful than helpful?","Should students have homework?","Is it better to be book smart or street smart?","Should phones be banned in classrooms?","Is it better to work in a team or alone?","Should junk food be banned in schools?","Is competition healthy?","Should PE be mandatory in schools?","Is it better to be early or exactly on time?","Should celebrities be allowed to keep their personal lives private?","Is it better to live in a big city or a small town?","Should video games be considered a sport?","Is it better to be honest or kind when the two conflict?","Should students be allowed to grade their teachers?","Is peer pressure always negative?","Should there be a universal dress code in public spaces?","Is it better to follow the rules or trust your instincts?","Should there be a limit on screen time for teenagers?","Is money the most important factor in choosing a career?","Should celebrities be role models?","Is it better to be feared or respected as a leader?","Should the school day start later for teenagers?","Is it better to ask for forgiveness or permission?","Should voting be mandatory?","Is fast fashion a problem worth caring about?","Should animals be kept in zoos?","Is travel necessary to broaden your perspective?","Should there be age limits on social media?","Is intelligence more important than emotional skills?","Should schools teach financial literacy?","Is it ever okay to break a promise?","Should college athletes be paid?","Is it better to have many acquaintances or a few close friends?","Should parents monitor their children's social media?","Is failure necessary for success?","Is it better to specialize in one skill or be good at many things?","Should students be allowed to use AI for homework?","Is it better to be a generalist or a specialist?","Should public transport be free?","Is it better to live in a city or in nature?","Should all drugs be legal for adults?","Is it better to have a fixed routine or to be spontaneous?","Should zoos be abolished?","Is online learning better than in-person learning?","Should there be a four-day school or work week?","Is it better to rent or own a home?","Should social media have age verification?","Is breakfast really the most important meal of the day?","Should extreme sports be regulated more strictly?","Is it better to be overdressed or underdressed?","Should museums be free to enter?","Is it better to forgive and forget or to forgive and remember?","Should grading in school be abolished?","Is remote work better or worse for productivity?","Should advertising to children be banned?","Is it better to have many hobbies or to master one?"],
    Medium:["Should the voting age be lowered to 16?","Is college worth the cost?","Should influencers be held to the same standards as journalists?","Is it ethical to eat meat?","Should AI be regulated by governments?","Is remote work better than working in an office?","Should standardized testing be abolished?","Is cancel culture harmful or necessary?","Should social media platforms be legally responsible for the content posted on them?","Is the concept of work-life balance realistic in today's economy?","Should wealthy nations have open borders?","Is it ethical to use animals in medical research?","Should mental health days be treated the same as sick days?","Is hustle culture doing more harm than good?","Should the legal drinking age be changed?","Is technology making us more or less connected as humans?","Should people be allowed to buy social media followers?","Is it possible to be a good person and still benefit from an unjust system?","Should basic income be guaranteed to every citizen?","Is social media doing more harm than good to democracy?","Should the wealthy pay significantly higher taxes?","Is privacy more important than security?","Should the minimum wage be raised significantly?","Is the gig economy good or bad for workers?","Should there be limits on how much money can be spent on political campaigns?","Is affirmative action fair?","Should the internet be regulated more heavily?","Should violent video games be restricted?","Is it possible to be patriotic and also critical of your country?","Should the death penalty be abolished?","Is it ethical for companies to collect and sell user data?","Should schools ban smartphones during the day?","Is it possible to be truly unbiased?","Should convicted criminals be allowed to vote?","Is the news media trustworthy?","Should the government control social media algorithms?","Is beauty culture harmful to young people?","Should universal healthcare be a right in every country?","Is it ethical to use animals to test cosmetics?","Should the police be defunded and resources redirected?","Is it ethical to have extremely lavish weddings when others are struggling?","Should there be a wealth cap — a maximum amount any individual can own?","Is it ethical to ghost someone in a romantic or professional context?","Should universities require community service for graduation?","Is it ethical to eat at fast food chains that have poor environmental records?","Should governments ban single-use plastics entirely?","Is it ethical to keep exotic animals as pets?","Should children be allowed to decide their own bedtimes?","Is it ethical to use social media to research someone before a date or interview?","Should the arts receive the same funding as sciences in schools?","Is it ethical to recline your seat on a short flight?","Should employers be able to see employees' social media profiles?","Is it ethical to negotiate salary aggressively?","Should cities ban cars from their centers?","Is it ethical to eat food that you know is bad for you?","Should universities accept students based on potential rather than grades?","Is it ethical to date a coworker?"],
    Hard:["Should billionaires exist?","Is democracy the best form of government?","Should gene editing in humans be allowed?","Is it ever ethical to lie?","Should the internet be considered a human right?","Is capitalism compatible with solving climate change?","Should prisons focus on punishment or rehabilitation?","Is it possible to be truly objective?","Should developed nations pay reparations for historical injustices?","Is universal basic income economically viable and morally justified?","Should there be limits on how much wealth any single person can accumulate?","Is it ethical to have children in the current state of the world?","Should free speech have any limits and if so who should decide?","Is national identity a force for good or for division?","Should artificial intelligence be granted any legal rights?","Is it ever morally acceptable to break the law?","Should governments be able to mandate vaccination for public health?","Is it possible to separate art from the personal ethics of the artist who created it?","Is it ever justified to break the law for a greater good?","Is it possible to have true equality in a capitalist system?","Is nationalism compatible with global human rights?","Should there be a maximum wage?","Should democratic governments be allowed to restrict misinformation?","Is economic growth compatible with environmental sustainability?","Is it ethical to extend human life indefinitely through technology?","Should corporations have the same legal rights as individuals?","Is it possible to have justice without forgiveness?","Should there be global governance over emerging technologies?","Is colonialism still shaping the world today?","Should education be completely free at all levels?","Is it ethical to optimize children's genetics before birth?","Should there be limits on what private companies can own?","Is meritocracy a myth?","Should governments prioritize national interest over global humanitarian concerns?","Is there such a thing as ethical consumption under capitalism?","Should advanced technology be equally accessible to all nations?","Is it ever ethical to sacrifice one person to save many?","Should there be limits on what parents can teach their children about religion?","Is it possible to be both patriotic and critical of your country at the same time?","Should the right to vote be contingent on passing a basic civics test?","Is it ethical to have biological children when adoption is an option?","Should the media be required to present both sides of every issue?","Is cultural appropriation always harmful or can it be a form of cultural appreciation?","Should governments be allowed to lie to citizens for national security reasons?","Is it ethical to prosecute someone for a crime that was legal when they committed it?","Should AI-generated art be eligible for copyright protection?","Is it ethical to exploit legal loopholes even if they violate the spirit of the law?","Should there be a global minimum wage?","Is it ethical to hire a less qualified candidate for diversity reasons?","Should people be held responsible for the environmental impact of their consumption choices?","Is it ethical to protest in ways that inconvenience ordinary people?","Should governments have the right to restrict internet access during civil unrest?","Is it ethical to keep a terminally ill person alive against their wishes?","Should the right to have children be regulated in any circumstances?","Is it ethical to use information obtained illegally if it serves the public interest?","Should historical statues of controversial figures be removed or contextualized?"],
  },
  Business:{
    Easy:["Pitch a simple app idea in 60 seconds","Describe a business you would start with $1000","What makes a good leader?","What is the most important quality in a team member?","How would you market a new product to young people?","What is customer service and why does it matter?","Describe a brand you admire and why","What is the difference between a manager and a leader?","What does good communication look like in a workplace?","Describe what makes a product truly stand out in a crowded market","What is one thing most businesses get wrong when they are just starting out?","If you were starting a small food business today where would you begin?","What does a great customer experience look like from start to finish?","What is the most important thing a new employee can do in their first 30 days?","Describe the qualities you would look for when hiring your first team member","What is one way a local business could grow without spending money on advertising?","What does good feedback look like in a professional setting?","What makes someone trustworthy in a business context?","What makes a product truly useful?","How would you get your first 10 customers?","What is the difference between price and value?","How would you describe your personal brand?","What makes a great company culture?","How would you handle a negative review of your business?","What is the most important thing to know before starting a business?","How do you build a loyal customer base?","What is the role of social media for a small business?","How would you market a product with no money?","What makes people trust a brand?","How would you name a new company?","How do you know when a business idea is worth pursuing?","What is the most underrated skill in business?","How would you handle a competitor copying your idea?","What does it mean to add value?","How would you structure your first week at a new job?","What makes a great pitch?","How do you know when to quit and when to persist?","What is the most important lesson a first job teaches you?","What is the difference between a startup and a small business?","What makes a good company name?","How would you describe entrepreneurship to someone who has never heard the word?","What is customer loyalty and why does it matter?","What is the difference between revenue and profit?","How would you handle a business partner you disagree with?","What makes a product go viral?","What is the difference between B2B and B2C?","How would you get feedback from your customers?","What is a unique selling proposition?","What is the difference between a vision and a mission?","How would you build a team with no budget?","What is word of mouth marketing and why is it powerful?","What is the difference between a want and a need in marketing?","How would you price something when you have no competitors to compare to?","What is a loss leader and when would you use one?","What is the difference between sales and marketing?","How would you handle a supplier who is not delivering on time?","What is a SWOT analysis and when would you use it?","What is the difference between a product and a service?"],
    Medium:["You are pitching your startup to investors — go","How would you turn around a struggling business?","Describe how you would build a team from scratch","How do you handle a customer complaint professionally?","What is your strategy for entering a competitive market?","How would you cut costs without hurting quality?","Describe how you would launch a product with no budget","How do you keep employees motivated?","How would you identify whether a new business idea has real market potential?","Describe how you would handle a conflict between two key team members","What is your approach to setting goals that are ambitious but achievable?","How would you rebuild customer trust after a public mistake or failure?","Describe how you would approach pricing a new product for the first time","What is your strategy for retaining top talent when you cannot compete on salary?","How would you approach delegating to a team you have just taken over?","Describe how you would structure the first 90 days in a new leadership role","What metrics would you track to know whether a product launch was successful?","How would you approach a partnership that could help your business grow but comes with risk?","How do you build a product people actually want versus what they say they want?","What is your framework for prioritizing when resources are limited?","How do you build a network authentically without it feeling transactional?","What is the most important metric for a startup in its first year?","How do you create urgency without being pushy in sales?","What is your approach to negotiating a deal?","How would you position a product in a crowded market?","What is the difference between a feature and a benefit?","How do you decide when to pivot and when to stay the course?","How do you build partnerships with other companies?","What is the most common reason startups fail?","How do you create a feedback loop with your customers?","What is the role of storytelling in business?","How do you handle a business that is growing faster than you can manage?","How do you build a brand that people feel emotionally connected to?","What is your approach to managing up?","How do you create a culture of accountability without micromanaging?","What is the most important thing investors look for beyond the numbers?","How do you approach building a product roadmap when everyone has an opinion?","What does it mean to truly understand your customer?","How do you build a brand in a market that does not trust you yet?","What is your framework for deciding when to say no to a customer?","How do you think about building systems that work without you?","What is the most important thing to get right in the first 90 days of a new venture?","How do you approach building a culture in a remote team?","What is your strategy for turning a one-time customer into a repeat customer?","How do you think about the right time to hire your first employee?","What is your approach to managing cash flow in an early stage business?","How do you build a sales process that scales?","What is the difference between a customer who is satisfied and one who is loyal?","How do you think about building for a niche versus building for a mass market?","What is your approach to handling a PR crisis on social media?","How do you think about the right balance between planning and executing?","What is the most common mistake founders make in their first year?","How do you approach pricing when your competitors are significantly cheaper?","What is your strategy for building authority in a new industry?","How do you think about when to automate versus when to keep things manual?","What is the difference between a good idea and a good business?","How do you approach building a product roadmap when everyone has a different opinion?","What is your framework for evaluating whether a new opportunity is worth pursuing?"],
    Hard:["You have 90 seconds to convince a board of directors to approve your proposal","How would you disrupt an industry that has not changed in 50 years?","Describe your framework for making high stakes business decisions","How do you build a company culture that survives rapid growth?","How would you handle a major PR crisis for your company?","What is your vision for where your industry will be in 10 years?","How do you balance ethics and profit in business?","Pitch yourself as the CEO of a company you would want to run","You just discovered a key vendor has been acting unethically — walk through exactly how you handle it","Describe how you would lead a company through a forced pivot when the original model stops working","How would you make the case for long-term investment when the board is focused on quarterly results?","Describe your approach to acquisitions — how do you evaluate, negotiate, and integrate?","How do you maintain clarity of vision while staying genuinely open to challenging feedback?","What is your philosophy on risk and how do you decide when a bet is worth taking?","Describe how you would restructure an organization that has grown chaotic and siloed","How would you approach entering an international market for the first time?","What does responsible innovation look like and where do companies typically get it wrong?","If a profitable line of business was causing real social harm, how would you decide what to do?","How do you build a company that outlasts its founders?","What is your framework for making ethical decisions under competitive pressure?","How do you think about building a moat in a world where everything can be copied?","What is the most underestimated risk in scaling a company?","How do you maintain innovation as a company grows and becomes risk-averse?","What is your philosophy on failure and how does it affect how you build?","How do you think about the responsibility of a business to society?","What is the relationship between company culture and long-term performance?","How do you build a global company while staying locally relevant?","What is your approach to making a major strategic bet with uncertain outcomes?","How do you think about building trust at scale?","What is the hardest thing about being a founder that no one tells you?","How do you balance vision with listening to what the market actually wants?","What is your philosophy on pricing?","How do you build a company in a declining industry?","What is the difference between a strategy and a plan?","How do you think about competition — should you ignore it or obsess over it?","What is the most important thing you would tell a first-time founder?","How do you create alignment in a large organization with competing interests?","What does it mean to build a company with integrity?","How do you build a company that can survive the loss of its founder?","What is your framework for deciding whether to vertically integrate or stay focused?","How do you think about managing the tension between short-term shareholder returns and long-term company health?","What is the most important thing a company can do to maintain its culture as it scales from 10 to 1000 people?","How do you approach making a major strategic bet in a market that does not yet exist?","What is your philosophy on when to follow data and when to override it with judgment?","How do you think about the right level of transparency with employees during a difficult period?","What is your framework for deciding which customers to fire?","How do you build a company that can compete against a much larger and better-resourced rival?","What is your approach to managing a board that has conflicting interests?","How do you think about the ethics of growth hacking and aggressive user acquisition?","What is the most underrated source of competitive advantage in business today?","How do you build a company that is resilient to economic downturns?","What is your framework for deciding when a business model is fundamentally broken versus temporarily struggling?","How do you think about the right relationship between a company and the community it operates in?","What is your approach to managing the transition from founder-led to professionally managed?","How do you think about building optionality into your strategy?","What is the most important thing investors consistently undervalue when evaluating early-stage companies?","How do you build a company culture where people are willing to flag bad news early?","What is your framework for deciding when to double down versus when to cut your losses?"],
  },
  Motivational:{
    Easy:["What is one small habit that has made a big difference in your life?","Share a quote that inspires you and explain why","What does confidence mean to you?","Describe a time someone believed in you","What is something you are working to improve about yourself?","What gets you out of bed in the morning?","Describe your definition of a good day","What is one piece of advice you would give your younger self?","What is a simple thing you do when you need to reset your mindset?","Describe someone whose work ethic you admire and what makes them stand out","What does it look like when you are performing at your best?","What is something you once thought was impossible that you now know you can do?","What does the word discipline mean to you in your own life?","Describe a moment when you genuinely surprised yourself","What is one area of your life where you have made real progress that you are proud of?","What do you do when your motivation runs out but you still have to show up?","Describe what it looks like when you are truly focused and how you get there","What is the best advice you have ever been given and did you actually take it?","What is one thing you did recently that you are proud of?","Describe a moment when you felt truly confident","What is something simple that brings you joy?","Who has had the biggest positive impact on your life and how?","What is one value you try to live by every day?","Describe a time when things were hard but you kept going","What is one thing you would encourage a friend to never give up on?","What does a good attitude look like in practice?","What is something you are better at now than you were a year ago?","Describe a time when kindness made a real difference","What does it mean to show up for someone?","What is something you are grateful for that you rarely think about?","Describe a moment when you felt truly alive","What is one thing you want to do before the end of this year?","Describe a time you did something that scared you and it paid off","What is one way you try to make the world slightly better?","What does it mean to be true to yourself?","Describe something you love about the person you are becoming","What is one small win you had this week that deserves recognition?","What does it mean to take care of yourself without apologizing for it?","What is one thing you are doing right now that your past self would be proud of?","Describe a time when you kept going even when you wanted to stop","What is one small win you had recently that made you smile?","Describe something you used to think you could not do that you can now","What is one thing you are looking forward to that keeps you going?","Describe a person whose persistence inspires you","What is one thing you tell yourself when things get hard?","Describe a moment when you realized how far you had come","What is something you are doing today that is building toward something bigger?","Describe a time when rest turned out to be the most productive thing you could do","What is one thing that never fails to remind you of your purpose?","Describe a time when believing in yourself made the difference","What is something you have accomplished that once seemed impossible?","Describe a habit that has made you a better version of yourself","What is one thing you know about yourself now that has taken years to understand?","Describe a moment when you chose yourself and what happened","What is something you are grateful for that you used to take for granted?","Describe a time when patience paid off in a way you did not expect","What is one thing you would tell someone who is exactly where you were a year ago?","Describe a moment when kindness changed the direction of your day"],
    Medium:["Talk about a time you overcame self doubt","What is the hardest thing you have ever pushed through and how?","How do you stay motivated when you do not see results?","Describe your personal definition of success","How do you deal with fear of failure?","What does resilience look like in your life?","How do you get back up after a setback?","What is the mindset shift that changed your life?","Describe a time when you had to commit to something before you felt ready","What do you do when comparison makes you feel like you are not enough?","How do you build momentum on a goal when you are starting from zero?","Describe a time when your circumstances made success harder but you found a way anyway","What separates people who talk about their goals from people who actually achieve them?","How do you define your own success in a way that does not depend on external validation?","Describe a moment when giving up felt like the rational choice but you chose to stay","What is the hardest mental habit you have had to build and how did you do it?","How do you stay consistent on the days when you simply do not feel like it?","Describe the moment you decided to take your own potential seriously","How do you rebuild your confidence after a major setback?","What does it mean to choose growth over comfort?","How do you stay true to your values when there is pressure to compromise?","What is the relationship between discipline and self-respect?","How do you define progress when results are not yet visible?","What does it look like to take radical ownership of your life?","How do you deal with the voice in your head that says you are not good enough?","What is the difference between motivation and commitment?","How do you find meaning in difficult or mundane work?","What does it mean to be brave in everyday life?","How do you build the kind of confidence that does not depend on external validation?","What is the most important mindset shift you have made?","How do you stay grounded when life is chaotic?","What does it mean to invest in yourself?","How do you handle the gap between where you are and where you want to be?","What does perseverance actually feel like from the inside?","How do you make peace with uncertainty?","What is the hardest part of becoming the person you want to be?","How do you keep going when no one is watching or cheering you on?","What does it mean to live with intention?","How do you find purpose in the work you do every day?","What does it mean to invest in yourself and how do you do it?","How do you think about the relationship between fear and growth?","What is the most important mindset shift that has changed how you approach challenges?","How do you define success for yourself separate from what society expects?","What does it mean to show up fully for the people in your life?","How do you think about the role of failure in building character?","What is the difference between being busy and making progress?","How do you maintain faith in yourself during a long stretch without visible results?","What does it mean to live with intentionality?","How do you think about the relationship between discipline and freedom?","What is the most important lesson you have learned about perseverance?","How do you approach rebuilding yourself after a major setback?","What does it mean to be truly present in your own life?","How do you think about the relationship between your environment and your mindset?","What is the most underrated aspect of building a good life?","How do you approach the gap between where you are and where you want to be without losing hope?","What does it mean to be committed to something rather than just interested in it?","How do you think about the relationship between self-discipline and self-compassion?","What is the most important thing you have learned about what you are capable of?"],
    Hard:["Give a 2 minute motivational speech to someone who has completely given up","What would you say to a room full of people who feel like they are not enough?","Describe the moment you decided to stop making excuses and what happened next","What is the most important thing you know about perseverance that most people do not?","If you had one chance to inspire someone to change their life what would you say?","Talk about the relationship between discipline and freedom","What does it mean to truly believe in yourself and how do you get there?","Give a speech about why failure is not the opposite of success","Address a group of young people told their dreams are unrealistic and give them something real to hold on to","What would you say to someone stuck between the person they are and the person they know they could be?","Talk about the cost of playing it safe and what people are really giving up when they choose comfort over growth","Give a speech about what it means to be consistent when no one is watching — why that is where character is actually built","What would you say to someone at the start of a hard journey who is wondering if it will be worth it?","Talk about the relationship between identity and behavior — why changing how you act without changing how you see yourself never works","Give a speech about why the people who make the biggest difference are rarely the most talented in the room","What does it mean to fully commit to something and why is half-commitment the most expensive kind?","Talk about the difference between being motivated and being driven and why only one actually gets you where you want to go","Give a closing speech for a group that has just completed something difficult — make them feel the weight and meaning of what they accomplished","Give a speech about why the most important battles are the ones you fight inside yourself","What would you say to someone who has lost faith in their own potential?","Speak about the relationship between suffering and purpose","What does it mean to live a life that matters and how do you know if you are?","Give a speech about why showing up imperfectly is better than not showing up at all","What would you say to a room full of people who are afraid to start?","Speak about the courage it takes to choose a life that is true to you","What is the hardest truth about becoming who you are meant to be?","Give a speech about why the world needs people who refuse to give up","What would you say to someone standing at the edge of giving everything up?","Speak about what it really means to believe in yourself when no one else does","Give a speech about the power of one decision to change the direction of your life","What would you say to your younger self about the struggles ahead?","What does it mean to find your voice and why does it matter?","Give a speech about the relationship between gratitude and strength","What would you say to someone who feels invisible and unimportant?","Speak about why the quiet consistent effort matters more than the dramatic breakthrough","What is your message to anyone who feels like they are running out of time?","Give a speech about why the world is changed not by those who are certain but by those who act despite uncertainty","Give a speech about what it means to keep going when you have run out of reasons to","What would you say to a room full of people who have been told their whole lives that they are not enough?","Speak about the relationship between identity and transformation — can you become someone new without losing who you were?","Give a speech about why the most important work is often the most invisible","What would you say to someone who has achieved everything they wanted and still feels empty?","Speak about the courage it takes to admit you were wrong and start over","Give a speech about what it means to find meaning in suffering","What would you say to someone who is afraid that it is too late for them?","Speak about the relationship between humility and greatness","Give a speech about why the world needs people who refuse to be cynical","What would you say to someone who has been waiting for permission to start?","Speak about what it means to choose a life of purpose over a life of comfort","Give a speech about why consistency is more powerful than intensity","What would you say to someone who has lost faith in people?","Speak about the relationship between solitude and self-knowledge","Give a speech about why your story — exactly as it is — matters","What would you say to someone who is terrified of being seen?","Speak about what it means to live with radical acceptance","Give a speech about the difference between surviving and truly living","What would you say to someone who has everything to give but is afraid to give it?"],
  },
  Law:{
    Easy:["What is the difference between civil law and criminal law?","What does it mean to have the right to remain silent?","What is a contract and what makes it valid?","What is the difference between a lawyer and a judge?","What does innocent until proven guilty mean?","What is a jury and what is its role?","What is the difference between a felony and a misdemeanor?","What does it mean to sue someone?","What is bail and how does it work?","What is the purpose of a court?","What is the difference between state law and federal law?","What does it mean to have freedom of speech?","What is a warrant and when do police need one?","What is the difference between a plaintiff and a defendant?","What does it mean to plead guilty?","What is the role of a defense attorney?","What is the difference between jail and prison?","What is a legal right?","What does it mean to appeal a court decision?","What is the purpose of laws in a society?","What is a subpoena?","What is the difference between a judge and a jury?","What is small claims court?","What does it mean to be on parole?","What is a legal settlement?","What is the presumption of innocence?","What is the difference between murder and manslaughter?","What does it mean to have due process?","What is a restraining order?","What is the role of a prosecutor?","What does habeas corpus mean?","What is the difference between a misdemeanor and an infraction?","What is the purpose of a grand jury?","What is the difference between a deposition and a trial?","What is probation and how does it work?","What is the difference between slander and libel?","What is a class action lawsuit?","What is the difference between a public defender and a private attorney?","What is the purpose of the Miranda warning?","What is a legal injunction?","What is the difference between negligence and recklessness?","What is a power of attorney?","What is the difference between a felony and a civil wrong?","What is a statute of limitations?","What is the difference between an arrest and a detention?","What is a legal precedent?","What is the difference between a verdict and a sentence?","What is contempt of court?"],
    Medium:["Should the death penalty be abolished and why?","How does the jury selection process work and is it fair?","What are the arguments for and against mandatory minimum sentences?","How does plea bargaining affect the justice system?","Should drugs be decriminalized and what would that mean legally?","How does the appeals process work in the court system?","What is the difference between the burden of proof in civil vs criminal cases?","How do laws protect privacy in the digital age?","Should corporations be held criminally liable for their actions?","What is the role of precedent in legal decisions?","How does self-defense law work and where should its limits be?","What is the difference between legal and ethical?","How does intellectual property law affect innovation?","Should there be stricter regulations on data collection by companies?","What is restorative justice and how does it differ from punitive justice?","How does the legal system handle mental illness in criminal cases?","What are the arguments for and against legalizing assisted dying?","How does international law work and who enforces it?","Should the legal age for various activities be the same across the board?","How does the statute of limitations affect justice?","What is the relationship between law and morality?","How should the law handle emerging technologies like AI?","What is qualified immunity and should it be reformed?","How does the bail system disadvantage low-income defendants?","What is the difference between justice and revenge?","Should whistleblowers be protected by law?","How do civil rights laws get enforced in practice?","What is the role of evidence in a criminal trial?","How does family law handle custody disputes?","What is the difference between negligence and intentional wrongdoing?","How does the concept of reasonable doubt protect defendants?","What are the arguments for and against legalizing all drugs?","How does international law handle crimes against humanity?","What is the tension between freedom of religion and anti-discrimination laws?","How should the law handle AI systems that make life-altering decisions about people?","What are the arguments for and against a universal basic income from a legal perspective?","How does the law balance press freedom with the right to a fair trial?","What is the difference between a legal right and a human right?","How should the law handle deepfakes and synthetic media?","What are the arguments for and against mandatory voting?","How does the law protect whistleblowers and should it do more?","What is the role of intent in criminal law?","How should the law handle inherited wealth from illegal activities?","How does the law handle situations where following orders leads to harm?","What is the difference between justice and the law?","How should the law handle climate change — who is liable?","What are the arguments for and against jury nullification?","How does the law handle stateless persons?","What is the difference between rehabilitation and punishment as goals of the justice system?"],
    Hard:["How should the law balance free speech with preventing harm?","Is the current criminal justice system fundamentally broken and if so how would you fix it?","How should courts handle cases where the law is clear but the outcome would be unjust?","What is the tension between national security and civil liberties and how should law resolve it?","Should judges be elected or appointed and what are the implications of each?","How should the legal system adapt to crimes that cross international borders?","Is civil disobedience ever legally or morally justified?","How should the law handle situations where following orders leads to atrocities?","What is the relationship between corporate power and the legal system?","Should there be universal human rights that override national laws?","How does systemic bias affect the application of law and what should be done about it?","Is it possible to have a truly impartial legal system?","How should the law handle rapidly evolving moral standards around consent?","What are the legal and ethical implications of predictive policing using AI?","How should intellectual property law evolve in a world where AI can create original works?","Should the legal system treat juvenile offenders the same as adults for serious crimes?","How does the law handle stateless persons and what obligations do states have?","What is the philosophical basis for punishment and which theory should guide sentencing?","How should international courts handle war crimes committed by leaders of powerful nations?","Should corporations have the same legal rights as individuals and what are the consequences?","How should the law regulate genetic engineering and designer babies?","What is the tension between majority rule and minority rights in a legal system?","How should the law handle historical injustices that are technically outside the statute of limitations?","Is mandatory jury service compatible with individual liberty?","How should the legal system handle AI systems that cause harm — who is liable?","What are the limits of attorney-client privilege and should there be exceptions?","How does the law define personhood and why does it matter?","Should prisons be privatized and what are the legal implications?","How should the law balance parental rights with children's rights?","What is the difference between the rule of law and the rule of lawyers?","How should the law handle situations where the majority democratically votes to oppress a minority?","Is there a moral obligation to follow unjust laws?","How should international law evolve to handle state-sponsored cyberattacks?","What are the philosophical foundations of the right to property and how should they inform law?","How should the law handle the personhood of future generations in environmental cases?","Is it possible to have a legal system that is both consistent and just in all cases?","How should the law handle corporate crimes where responsibility is diffused across thousands of employees?","What is the tension between the right to privacy and the need for government transparency?","How should the law handle the use of predictive algorithms in criminal sentencing?","What are the limits of free speech in a democracy and who should decide?","How should international law handle situations where domestic law permits human rights violations?","What is the legal and moral status of civil disobedience in a democracy?","How should the law handle situations where scientific evidence conflicts with legal standards of proof?","What is the relationship between law and morality and when should they diverge?","How should the law handle emerging technologies that fundamentally challenge existing legal categories?","What are the arguments for and against a world court with binding authority over all nations?","How should the law handle situations where corporations have more power than governments?","What is the tension between restorative justice and the need for deterrence?","How should the law handle the rights of animals as scientific understanding of their cognition grows?","What is the relationship between legal legitimacy and democratic consent?"],
  },
  Politics:{
    Easy:["What is the difference between a democracy and a dictatorship?","What does it mean to vote and why is it important?","What is the role of a president or prime minister?","What is the difference between left-wing and right-wing politics?","What is a political party and what is its purpose?","What does the government do with tax money?","What is freedom of the press and why does it matter?","What is the difference between local and national government?","What is a policy and how does it get made?","What does it mean for a country to have a constitution?","What is the United Nations and what does it do?","What is the difference between a republic and a democracy?","What is foreign policy?","What does it mean to have separation of powers?","What is a referendum and how does it work?","What is lobbying and how does it influence politics?","What is the difference between a senator and a representative?","What does it mean for a government to be transparent?","What is political ideology?","What is the difference between federal and local government?","What is geopolitics?","What does it mean to have checks and balances?","What is a political campaign?","What is the difference between a law and a policy?","What does it mean to have a coalition government?","What is a veto and when can a president use it?","What is the role of the opposition in a democracy?","What is a political debate and what is its purpose?","What does it mean to have term limits?","What is civic engagement?","What is the difference between a prime minister and a president?","What is gerrymandering and why does it matter?","What is the difference between a liberal and a conservative?","What is the role of the Supreme Court in a democracy?","What is the difference between a primary election and a general election?","What is political lobbying and is it good or bad?","What is the difference between a federal and a unitary state?","What is the role of a central bank in an economy?","What is the difference between a policy and a law?","What is the UN Security Council and what does it do?","What is the difference between left-wing and right-wing economic policy?","What is a political manifesto?","What is the difference between authoritarian and totalitarian government?","What is the role of a constitution in a democracy?","What is the difference between a refugee and an immigrant?","What is soft power in international relations?","What is the difference between a bicameral and unicameral legislature?","What is political neutrality and can it exist?","What is the difference between a tax and a fine?","What is the role of the opposition party in a parliament?"],
    Medium:["Should voting be mandatory for all citizens?","How does campaign finance affect the fairness of elections?","Should the electoral college be abolished in the United States?","How does gerrymandering undermine democratic representation?","Should there be term limits for all elected officials?","How does social media change the way politics works?","Should the voting age be lowered to 16?","How do you think about the relationship between the media and political power?","Should governments prioritize economic growth or equality?","How does nationalism affect international cooperation?","Should there be stricter regulations on political advertising?","How do you think immigration policy should be approached?","What is the role of civil society in a healthy democracy?","Should governments provide universal basic income?","How does political polarization happen and what can be done about it?","Should wealthy countries have greater obligations to poorer ones?","How should governments balance individual freedom with public safety?","What is the relationship between economic inequality and political instability?","Should there be publicly funded elections to remove private money from politics?","How does political corruption happen and how can it be prevented?","Should governments regulate social media platforms?","How do you think climate change should be handled at a political level?","What is the relationship between democracy and capitalism?","Should there be more women in political leadership and how do we get there?","How does foreign interference affect democratic elections?","Should government services be privatized or kept public?","How do you think about the relationship between religion and politics?","What is the role of protest in a democracy?","Should there be a global government to handle global problems?","How does political apathy affect a democracy?","How should democracies handle the spread of political misinformation?","What is the relationship between economic inequality and political instability?","Should there be term limits for Supreme Court justices?","How do you think about the balance between national sovereignty and global cooperation?","Should governments regulate the size and power of technology companies?","How does the revolving door between government and industry affect policy?","Should there be publicly financed elections to reduce the influence of money in politics?","How should democracies respond to the rise of authoritarian-leaning populist movements?","What is the relationship between free trade and domestic job losses?","Should governments have the right to break up monopolies?","How do you think about the tension between security and civil liberties?","Should there be stricter controls on the movement of capital across borders?","How does media ownership affect political discourse?","Should governments invest heavily in renewable energy even if it costs jobs in traditional industries?","How do you think about the relationship between democracy and technocracy?","Should there be mandatory voting with a none of the above option?","How should governments handle the political implications of demographic change?","What is the relationship between economic growth and political freedom?","Should governments be allowed to restrict foreign ownership of media?","How do you think about the role of compromise in a polarized political system?"],
    Hard:["Is liberal democracy the best possible system of government or just the least bad one?","How should democratic governments respond to majorities that vote for anti-democratic outcomes?","Is it possible to have genuine democracy in a world with extreme wealth inequality?","How should nations balance sovereignty with the need for international cooperation on global problems?","Is political violence ever justified and under what circumstances?","How do you think about the tension between security and civil liberties in the age of surveillance?","Should wealthy democracies have open borders and what would the consequences be?","How does empire shape the modern world and what obligations do former colonial powers have?","Is capitalism compatible with addressing climate change or does the system need to change?","How should democracies handle the rise of authoritarian-leaning populist movements within their own borders?","What is the relationship between truth and power in politics?","How should governments handle the political implications of artificial intelligence and automation?","Is it possible to separate politics from identity and should we try?","How do you think about the moral obligations of citizens in an unjust political system?","Should there be global democratic governance over multinational corporations?","How does the military-industrial complex shape foreign policy?","Is the nation-state still the right unit of political organization for the 21st century?","How should democracies respond to disinformation at scale?","What is the relationship between economic development and political freedom?","How do you think about the ethics of political compromise — when is it principled and when is it cowardly?","Should there be enforceable global human rights that override national sovereignty?","How does political tribalism prevent good governance and what can be done about it?","Is representative democracy still fit for purpose in a world of complex global challenges?","How should political systems handle existential risks like pandemics, climate change, and AI?","What is the relationship between political freedom and economic freedom?","How do you think about the obligations of politically powerful nations to the rest of the world?","Is neutrality in politics ever genuinely possible or is it always a political choice?","How should governments balance short-term political incentives with long-term policy needs?","What does it mean to have legitimate political authority and when does it break down?","How should democracies handle situations where the democratic process produces outcomes that violate fundamental rights?","Is liberal democracy in structural decline and if so what comes next?","How should democratic governments handle existential risks like AI and climate change when electoral cycles are too short?","Is the nation state still the right political unit for solving global problems?","How should we think about the democratic legitimacy of technocratic institutions like central banks?","Is it possible to have meaningful democracy without meaningful economic equality?","How should democracies handle the fact that future generations cannot vote on decisions that will affect them most?","What is the relationship between capitalism and democracy — are they compatible in the long run?","How should we think about the political obligations of citizens in a deeply unjust society?","Is political neutrality by institutions like universities or courts possible or desirable?","How should democracies handle the fact that the most important global decisions are made by unelected international bodies?","What is the relationship between national identity and the ability to build a functioning welfare state?","How should we think about the democratic legitimacy of international sanctions?","Is there a tension between cosmopolitan ethics and democratic self-determination?","How should democracies handle the rise of private military contractors and the privatization of state functions?","What is the most important political reform that no mainstream party is willing to advocate for?","How should we think about the obligations of powerful democracies to promote democracy elsewhere?","Is there a point at which economic inequality becomes incompatible with political equality?","How should democracies handle the fact that many voters are systematically misinformed?","What is the relationship between political freedom and technological development?","How should we think about the rights of political minorities in a majoritarian system?"],
  },
  "Case Competition":{
    Easy:["A local coffee chain with 12 locations wants to expand nationally but has limited capital. They asked your team to recommend the best growth strategy. Judge question: Walk me through your recommendation in one sentence.","A mid-sized clothing retailer is seeing online sales grow 40% while in-store sales decline 15% year over year. Your team was asked whether they should close stores and go digital-only. Judge question: What is the single biggest risk in your proposal?","A food delivery startup is burning through cash and needs to reach profitability within 12 months. Your team recommended cutting driver incentives to reduce costs. Judge question: Who does your recommendation hurt most and how do you address that?","A university wants to increase enrollment by 25% over five years in a declining demographic market. Your team proposed launching three new online programs. Judge question: What assumptions did you make in your analysis?","A gym chain lost 60% of its members during the pandemic and is now trying to win them back against stronger competitors. Your team recommended a premium rebrand. Judge question: Why did you choose this solution over the alternatives?","A regional bank wants to attract younger customers under 30 who prefer fintech apps. Your team recommended building a standalone digital banking app. Judge question: Who is your target customer and why?","A national newspaper has seen print advertising revenue drop 70% in five years. Your team was asked how to build a sustainable business model. Judge question: What does success look like in year one?","A fast food chain wants to enter the Indian market for the first time. Your team was asked to recommend an entry strategy. Judge question: What is your go-to-market strategy in simple terms?","A software company sells project management tools to enterprises but is losing deals to cheaper competitors. Your team recommended adding a free tier to compete. Judge question: What is your competitive advantage?","A hospital network wants to reduce patient readmission rates by 20% within two years to avoid government penalties. Your team proposed a remote patient monitoring program. Judge question: What metrics would you track to measure success?","A luxury hotel chain wants to appeal to younger millennial and Gen Z travelers without losing its core older clientele. Your team recommended a sub-brand strategy. Judge question: How does your solution create value for the customer?","A consumer electronics company is seeing its flagship product become commoditized with margins falling every year. Your team was asked how to protect profitability. Judge question: What is your pricing strategy and why?","A retail pharmacy chain is being disrupted by mail-order prescription services. Your team recommended pivoting to health and wellness services in-store. Judge question: How big is the market opportunity?","A streaming platform is losing subscribers to competitors and has a content budget that is one tenth the size of its rivals. Your team recommended a niche content strategy. Judge question: Why should this company trust your recommendation?","A logistics company wants to reduce its carbon footprint by 50% in ten years while staying cost competitive. Your team proposed a fleet electrification plan. Judge question: What would you do differently if you had more time?","A fashion brand known for fast fashion wants to respond to growing consumer pressure around sustainability without raising prices significantly. Your team recommended a take-back and resell program. Judge question: How does your recommendation align with the company's existing strengths?","A theme park is struggling with long wait times that are driving negative reviews and repeat visit rates down. Your team was asked to improve the guest experience without major capital investment. Judge question: Walk me through how you would execute in the first 90 days.","A telecommunications company is losing business customers to competitors offering better service packages. Your team recommended a loyalty program with dedicated account managers. Judge question: What is your cost structure?","A grocery chain wants to compete with Amazon Fresh and Instacart in same-day delivery without owning its own fleet. Your team proposed a third-party partnership model. Judge question: What are the main risks of your recommendation?","A children's toy company is seeing sales decline as kids spend more time on screens. Your team recommended launching an interactive digital-physical hybrid toy line. Judge question: How confident are you in your financial projections?"],
    Medium:["A private equity firm acquired a struggling airline and gave your team 6 months to develop a turnaround plan. The airline has high labor costs, an aging fleet, and operates in 40 unprofitable routes. Judge question: Your financials assume returning to profitability in year two — justify that number given the scale of problems you inherited.","A global fast food chain wants to enter the Chinese market where local competitors have deep brand loyalty and government relationships. Your team recommended a joint venture with a local partner. Judge question: Your partner has no incentive to help you succeed long-term — defend your joint venture strategy.","A pharmaceutical company has a blockbuster drug coming off patent in 18 months. Generic competitors will enter the market and drive the price down by 80%. Your team was asked how to protect revenue. Judge question: Walk me through the three biggest risks and how you would mitigate each one.","A ride-sharing company is facing pressure from regulators to classify drivers as employees rather than contractors. Your team recommended proactively reclassifying drivers before legislation forces them to. Judge question: What happens to your business model if your primary cost assumption turns out to be wrong?","A legacy auto manufacturer wants to transition entirely to electric vehicles by 2030 but its dealership network and manufacturing plants are built around combustion engines. Your team recommended a phased transition strategy. Judge question: How would you prioritize if you only had half the budget you assumed?","A major retailer discovered that its supply chain has serious human rights violations among third-tier suppliers. Your team was asked to develop a responsible sourcing strategy. Judge question: What ethical considerations did your team discuss and how did they affect your recommendation?","A social media company is facing advertiser boycotts over harmful content on its platform. Your team recommended an AI-powered content moderation system as the primary fix. Judge question: Your competitor just launched a similar system and it failed publicly — how does that change your recommendation?","A hospital network is considering acquiring three smaller regional clinics to expand its geographic reach. Your team was asked to evaluate the acquisition. Judge question: What is the single biggest flaw in your own analysis?","A consumer goods company wants to expand into direct-to-consumer sales without destroying its relationships with its existing retail partners. Your team proposed a product differentiation strategy where DTC gets exclusive products. Judge question: Why can't a larger competitor just copy your differentiation strategy in six months?","A city government hired your team to recommend how to reduce homelessness by 30% in five years with a fixed budget of 50 million dollars. Judge question: Your recommendation creates winners and losers — how do you manage that politically?","An edtech startup has grown rapidly during the pandemic but is now seeing users churn as schools return to in-person learning. Your team recommended pivoting from B2C to B2B selling to schools and districts. Judge question: How would you validate that school districts actually want to buy this before committing to the pivot?","A luxury fashion house wants to grow revenue by entering the accessible luxury segment with a lower-priced line without damaging its core brand. Judge question: A senior executive has been against this idea for two years — how do you get their buy-in?","A major bank wants to launch a cryptocurrency trading platform for retail customers but faces significant regulatory uncertainty. Your team recommended launching in three low-regulation markets first. Judge question: How does your recommendation account for regulatory risk spreading to your initial markets?","A newspaper company acquired a sports data analytics firm two years ago and the integration has failed. Your team was asked whether to continue investing or divest. Judge question: What would need to be true for the alternative recommendation you rejected to actually be the right answer?","A hotel chain wants to compete with Airbnb by offering more unique and local experiences. Your team recommended partnering with local experience providers in each city. Judge question: How does this strategy scale beyond the first ten cities?","A tech company with a dominant position in enterprise software is being investigated for anti-competitive behavior. Your team was asked to recommend a strategy that addresses the legal risk while protecting market position. Judge question: What is the single assumption that if wrong would completely invalidate your analysis?","A national grocery chain wants to reduce food waste by 40% in three years to meet sustainability commitments. Your team recommended a dynamic pricing system that discounts products near expiration. Judge question: How would you handle customer backlash if the system is perceived as unfair to lower-income shoppers?","An insurance company wants to use AI to improve claims processing speed but is worried about algorithmic bias disadvantaging certain customer groups. Judge question: How do you balance efficiency gains with the ethical risks of your recommendation?","A streaming music platform is losing artists to competitors offering better royalty rates. Your team recommended a tiered royalty system that pays more to top-performing artists. Judge question: How does your recommendation affect your relationship with emerging artists who are not yet top performers?","A global consulting firm wants to expand into Southeast Asia but faces intense competition from local firms with stronger government relationships. Judge question: Why is now the right time for this company to make this move rather than waiting two years?"],
    Hard:["A legacy department store chain has been losing money for four consecutive years. It has 200 stores, significant real estate holdings, a loyal but aging customer base, and a weak online presence. A private equity firm just acquired it and gave your team 90 days to recommend a path to profitability. Judge question: Your entire turnaround hinges on closing 120 stores — walk me through the second and third order consequences of that decision that you did not present.","A government health agency hired your team to design a strategy to reduce childhood obesity rates by 25% in ten years using a combination of policy, industry partnerships, and public education. Judge question: Two members of our panel have completely opposite views on whether government should regulate food companies — make the case to both of them simultaneously.","A global technology company has developed an AI system that can accurately predict employee attrition six months in advance. HR wants to use it to proactively manage talent. Legal and ethics teams have raised concerns. Your team was asked for a recommendation on how to proceed. Judge question: What are the second and third order consequences of deploying this system that your team did not fully account for?","A century-old manufacturing company faces a choice between investing 2 billion dollars to modernize its existing factories or pivoting entirely to a services and software model. The current workforce of 15000 people would be significantly affected either way. Judge question: You have three minutes with the CEO in an elevator after this presentation — what do you say?","A national airline is considering abandoning its hub-and-spoke model to shift to point-to-point routes to compete with low-cost carriers. This would require restructuring its entire fleet, workforce, and route network over five years. Judge question: What is the most important thing you learned from this case that applies beyond this specific situation?","A global food company gets 70% of its revenue from products that nutritionists classify as unhealthy. Changing consumer preferences and incoming regulation threaten that revenue base. Your team was asked to recommend a portfolio transformation strategy over ten years. Judge question: Your recommendation involves exiting categories that currently employ 30000 people — how do you address that?","A developing nation hired your team to recommend how to attract foreign direct investment in its technology sector while protecting its data sovereignty and national security interests. Judge question: How does your recommendation hold up when the interests of foreign investors and national sovereignty directly conflict?","A major university with a 10 billion dollar endowment is under pressure from students, faculty, and donors who disagree about whether to divest from fossil fuels. Your team was asked to recommend a position and a stakeholder management strategy. Judge question: How would you present this recommendation differently to the board of trustees versus the student body?","A global shipping company must choose between investing in hydrogen-powered vessels or ammonia-powered vessels as it transitions away from fossil fuels. Both technologies are unproven at scale and require different infrastructure investments. Judge question: The data you were given is incomplete and the technology is still maturing — how does that affect your confidence in a 5 billion dollar capital commitment?","A social media platform with 2 billion users is considering whether to implement a verified identity requirement to reduce misinformation — a move that would improve trust but reduce user growth and anger privacy advocates. Judge question: If this recommendation fails what does failure look like and what is the recovery plan?","A national government hired your team to recommend how to regulate artificial intelligence in a way that protects citizens without stifling innovation while keeping the country competitive globally. Judge question: How does your regulatory framework account for AI capabilities that do not yet exist but will emerge in the next five years?","A private equity firm is deciding whether to acquire a struggling newspaper group with strong brand recognition, declining revenue, and significant pension obligations. Your team was asked for an investment recommendation. Judge question: If you had to bet your own money on this investment succeeding would you and why?","A global pharmaceutical company discovered that one of its bestselling drugs has significant side effects that were not revealed in the original trials. Your team was asked to recommend how to handle the disclosure, the regulatory response, and the long-term business strategy. Judge question: Walk me through the ethical considerations that should override the business considerations in this case.","A city of 3 million people hired your team to recommend how to achieve carbon neutrality by 2040 while maintaining economic competitiveness and not placing a disproportionate burden on low-income residents. Judge question: How would you restructure your entire recommendation if the city's budget were cut by 50% due to an economic downturn?","A consumer bank wants to use behavioral data to offer personalized financial products — higher credit limits to reliable customers and intervention programs to customers showing signs of financial distress. Judge question: What are the unintended consequences of a system that algorithmically identifies customers in financial distress and what happens when it is wrong?","A global fashion brand is considering acquiring a sustainable materials startup for 800 million dollars. The startup has promising technology but has never operated at scale and has a founding team with no corporate experience. Judge question: What would need to be true about this acquisition for it to create long-term sustainable competitive advantage rather than just a short-term PR win?","A streaming platform operating in 50 countries needs to decide whether to pursue a single global content strategy or a fully localized one. The global strategy is cheaper but the localized one has shown better retention data in pilot markets. Judge question: A judge believes your team lacks the domain expertise to make a 500 million dollar content investment recommendation credibly — how do you respond?","A national sports league is considering expanding internationally for the first time, opening franchises in three new countries. The move would grow revenue but risks diluting the domestic fan base and overextending league operations. Judge question: You are six months into international expansion and early results are significantly below projections — what do you do and how do you present that to the board?","A large technology company is considering spinning off its cloud division into a separate publicly traded company. The cloud division is the fastest growing part of the business but cross-subsidizes the core business. Judge question: How would you handle the internal politics of recommending a spinoff to an executive team whose compensation is tied to the combined company's stock price?","A global non-profit fighting malaria has evidence that a controversial new approach — paying communities directly to eliminate mosquito breeding sites — works better than traditional methods but is opposed by established public health institutions. Your team was asked whether to scale the new approach. Judge question: How do you make the case for a recommendation that the established experts in the room disagree with?"],
  },
};
const ALL_PROMPTS = Object.values(TOPICS).flatMap(cat=>Object.values(cat).flat());
const CATS = Object.keys(TOPICS);
const DIFFS = ["Easy","Medium","Hard"];
const DIFF_COLOR = {Easy:"#2D7A4F",Medium:"#CC6600",Hard:"#E84040",Random:"#1A1A2E",Custom:"#6B7280"};
const DIFF_BG = {Easy:"#E8F7EE",Medium:"#FFF4E0",Hard:"#FFECEC",Random:"#F0F0F0",Custom:"#F0F0F0"};

const CASE_TYPE_PROMPTS = {
  "Recommendations":["A fast food chain is losing market share to healthier competitors but its core customers love its current menu. Judge question: What is your single strongest recommendation and why?","A retail bank is seeing branch foot traffic decline 40% over three years as customers move to digital banking. Judge question: Should they close branches or transform them and what would you do first?","A luxury car brand wants to launch an electric vehicle but fears it will cannibalize its most profitable combustion engine models. Judge question: Give me your recommendation in 30 seconds then defend it.","A theme park is considering adding a virtual reality experience zone to attract younger visitors. It has the space but limited capital. Judge question: Is this the right investment and what would you prioritize instead if not?","A newspaper with a strong brand has been losing print subscribers for a decade. Digital subscriptions are growing but not fast enough to replace lost revenue. Judge question: What is the one thing this company must do in the next 12 months?","A grocery chain is being squeezed between discount retailers on price and premium organic stores on quality. Judge question: Which direction should they go and how do you pick a lane?","A hospital network wants to reduce costs by 15% without cutting clinical staff. Judge question: Where do you find the savings and what is your top recommendation?","A fashion brand known for sustainability is being accused of greenwashing by a prominent journalist. Judge question: What is your immediate recommendation for the next 72 hours?","A tech startup has two potential acquirers offering very different deals — one offers more money, one offers better strategic fit. Judge question: Which do you recommend they take and why?","A sports league is considering expanding to three new international markets simultaneously. Judge question: Would you recommend doing all three at once or sequencing them and why?","A university is considering eliminating 12 underperforming academic departments to cut costs. Judge question: Is this the right move and what is your recommendation?","A pharmaceutical company can either acquire a biotech startup for 2 billion or build similar capabilities in-house over five years. Judge question: Build or buy and defend your answer.","A city government wants to reduce traffic congestion and has a budget for either expanding public transit or building new roads. Judge question: Which do you recommend and why?","A streaming platform has data showing that original content gets more engagement but licensed content is cheaper to acquire. Judge question: Where should they allocate next year's content budget?","A consumer goods company wants to expand into Asia but cannot decide between China and Southeast Asia as the entry market. Judge question: Which market do you recommend entering first and what is your rationale?","A hotel chain is deciding whether to franchise aggressively or maintain full ownership of all properties. Judge question: What is your recommendation on the ownership model and why?","A non-profit is choosing between expanding its flagship program that works well or launching a new initiative that could reach more people. Judge question: What do you recommend and how did you make that call?","A software company is debating whether to raise prices for existing customers or find new customer segments. Judge question: Which lever do you pull first?","A government agency wants to modernize its IT infrastructure and is choosing between a big-bang replacement and a phased migration. Judge question: Which approach do you recommend and what is the deciding factor?","A food and beverage company has three potential new products ready to launch but budget for only one. Judge question: Which do you launch and how do you decide?","A logistics company can either invest in drone delivery or autonomous ground vehicles as its next-generation delivery method. Judge question: Which technology do you recommend betting on and why?","A media company is considering launching a podcast network to diversify away from print and digital advertising. Judge question: Is this the right strategic move and what is your recommendation?","A retailer is deciding between opening 50 new small-format stores or 10 large flagship stores. Judge question: Which format do you recommend and what is your reasoning?","A bank is considering acquiring a fintech startup to accelerate its digital transformation. The startup has great technology but has never been profitable. Judge question: Do you recommend the acquisition and what is your single biggest concern?","A restaurant chain is deciding whether to launch a ghost kitchen delivery-only brand or invest in improving dine-in experience. Judge question: Which direction do you recommend and why?","A mid-sized retailer has excess inventory and is deciding whether to discount aggressively or hold price and take a write-off. Judge question: What do you recommend and what is your decision framework?","A professional services firm is deciding whether to expand to a new city by hiring locally or transferring senior staff from headquarters. Judge question: What is your recommendation and what is the biggest risk you are accepting?","A consumer tech company is deciding whether to launch its new product in the US first or go global simultaneously. Judge question: What is your go-to-market recommendation?","An e-commerce company is evaluating whether to build its own logistics network or continue relying on third-party carriers. Judge question: What is your recommendation and what would change your mind?","A startup is deciding between two very different pricing models — subscription versus one-time purchase. Judge question: Which model do you recommend and what evidence supports that?"],
  "Risks and Mitigations":["A tech company is launching a new AI-powered hiring tool that screens resumes automatically. Judge question: What is the single biggest risk in deploying this tool and how do you mitigate it?","A retail chain is opening 100 new stores in a single year to outpace a competitor. Judge question: Walk me through your top three execution risks in order of severity.","A pharmaceutical company is fast-tracking a drug through clinical trials to beat a competitor to market. Judge question: What happens if your safety assumption turns out to be wrong and what is your contingency plan?","A startup is betting its entire runway on a single enterprise client deal that has not closed yet. Judge question: What risk almost killed this company and how do you prevent it?","A government is rolling out a new digital identity system for all citizens. Judge question: What is the cybersecurity risk you are most worried about and how do you address it?","A food company is switching its entire supply chain to a single low-cost supplier in another country. Judge question: What is the concentration risk here and how do you mitigate it?","A bank is expanding into cryptocurrency services for retail customers. Judge question: What regulatory risk keeps you up at night and what is your plan?","A manufacturer is automating 40% of its production floor in 18 months. Judge question: What is the biggest risk to your timeline and how do you manage it?","An airline is launching a new budget sub-brand to compete with low-cost carriers while maintaining its premium main brand. Judge question: What is the brand risk and how do you prevent cannibalization?","A non-profit is expanding internationally for the first time into a country with political instability. Judge question: What is your political risk assessment and mitigation plan?","A retailer is implementing a new loyalty program that involves collecting significant customer data. Judge question: What is the privacy risk and how do you address it?","A hospital is implementing AI diagnostics to assist doctors in making treatment decisions. Judge question: What is the liability risk if the AI makes an incorrect recommendation?","A streaming service is launching in five new markets simultaneously. Judge question: What is the operational risk of moving so fast and what would make you slow down?","A city is building a new light rail system that requires closing major roads for two years. Judge question: What is the biggest risk to public support and how do you manage it?","A consumer brand is launching a major celebrity partnership campaign. Judge question: What is the reputational risk of this partnership and how do you protect yourself?","An insurance company is using AI to set premiums based on behavioral data. Judge question: What is the regulatory and ethical risk of this approach?","A startup is entering a market dominated by one player with deep pockets. Judge question: What is the competitive risk of your strategy and how do you survive if they respond aggressively?","A food delivery company is expanding to rural markets where order density is much lower. Judge question: What is the unit economics risk and at what point does this become unviable?","A software company is migrating all customers from its old platform to a new one in a single weekend cutover. Judge question: What is your biggest technical risk and what is your rollback plan?","A fashion brand is moving manufacturing back onshore to improve sustainability credentials. Judge question: What is the cost risk and how does it affect your competitive position?","A university is launching an online degree program to compete with established edtech players. Judge question: What is the biggest risk to student completion rates and how do you address it?","A private equity firm is acquiring a company in a heavily regulated industry it has no experience in. Judge question: What is your biggest risk and what expertise do you need to bring in?","A government is introducing a carbon tax that will significantly increase costs for heavy industry. Judge question: What is the economic risk of this policy and how do you mitigate the impact on jobs?","A tech company is building a platform that relies entirely on user-generated content. Judge question: What is your content moderation risk and how do you handle it at scale?","A healthcare company is partnering with a tech giant to share patient data for AI research. Judge question: What is the biggest trust and consent risk and how do you protect patients?","A consumer goods company is launching its product in five new countries at once. Judge question: What is the biggest operational risk and how do you prioritize your mitigation effort?","A financial services firm is allowing employees to work fully remotely permanently. Judge question: What is the biggest risk to your culture and client relationships and how do you manage it?","A major retailer is acquiring a direct competitor. Judge question: What is the integration risk and what are the first things you would do to manage it?","An energy company is investing heavily in renewable infrastructure in markets with uncertain regulatory environments. Judge question: What is your regulatory risk and what is your contingency if policy changes mid-investment?","A media company is cutting its editorial team by 40% and replacing with AI-generated content. Judge question: What is the reputational and quality risk of this decision and how do you address it?"],
  "Financials":["A subscription software company is pitching to investors. Judge question: Walk me through your revenue model and how you think about lifetime customer value.","A retail startup has been operating for two years and is not yet profitable. Judge question: How do you think about your path to profitability and what are the key milestones?","A manufacturing company wants to expand capacity by 50%. Judge question: Walk me through how you would build the business case for this capital investment.","A restaurant chain is evaluating whether to open a new location. Judge question: What are the unit economics you would look at to make this decision?","A tech startup is burning 500000 dollars per month and has 8 months of runway. Judge question: How do you think about your fundraising timeline and what levers do you pull to extend runway?","A consumer brand is deciding whether to discount heavily to drive volume or hold price to protect margin. Judge question: How do you think about the margin vs volume tradeoff?","A private equity firm is evaluating an acquisition. Judge question: What financial metrics would you look at first and why?","A company is choosing between two growth strategies — one requires heavy upfront investment, one is slower but cash-flow positive from day one. Judge question: How do you evaluate which strategy creates more value?","A startup is trying to price its product for the first time. Judge question: Walk me through how you would think about setting the right price.","A retailer wants to know if it should lease or buy its store locations. Judge question: How do you think about that make vs buy decision financially?","A non-profit is allocating its annual budget across three programs with different impact profiles. Judge question: How do you think about return on investment in a non-profit context?","A company has 10 million dollars to allocate across marketing, product development, and hiring. Judge question: How do you prioritize that spend and what framework do you use?","A business is evaluating whether to enter a new market that requires 3 years of losses before turning profitable. Judge question: How do you build the case for investing through losses?","A company is considering raising prices by 15%. Judge question: How do you model the impact on revenue if some customers churn as a result?","A startup is trying to decide between raising venture capital or growing through revenue. Judge question: How do you think about the financial tradeoffs of each path?","A company wants to reduce its cost base by 20%. Judge question: How do you approach a cost reduction exercise without damaging long-term growth?","A business has three product lines with very different margin profiles. Judge question: How do you think about portfolio mix and where do you focus resources?","A retailer is evaluating its inventory management and finds it is carrying too much working capital. Judge question: How do you think about optimizing working capital without hurting service levels?","A company is deciding whether to expand internationally or double down on its home market. Judge question: How do you build a financial framework to compare these two options?","A startup just landed its first enterprise customer worth 2 million dollars annually. Judge question: How does one customer of this size change your financial model and what risks does that concentration create?","A company is evaluating a major technology investment that will reduce labor costs but requires significant upfront capital. Judge question: Walk me through how you would calculate the payback period and whether this investment makes sense.","A consumer business is seeing customer acquisition costs rise while lifetime value stays flat. Judge question: How do you think about the sustainability of this model and what do you change?","A company is considering taking on debt to fund an acquisition. Judge question: How do you think about the right level of leverage and what are the risks?","A business is generating strong revenue but poor cash flow because of long payment terms with customers. Judge question: How do you address the working capital gap and what are your options?","A startup has been offered a term sheet with a valuation lower than expected. Judge question: How do you think about whether to accept it and what are the financial considerations?","A company is deciding whether to reinvest profits into growth or return cash to shareholders. Judge question: How do you think about this capital allocation decision?","A fast-growing startup has revenue doubling each year but its costs are growing even faster. Judge question: How do you diagnose where the problem is and what financial levers do you pull?","A retailer is evaluating whether to move to a direct-to-consumer model which has higher margins but lower volume. Judge question: How do you model the financial impact of this shift?","A company is being asked to provide financial projections for the next five years. Judge question: Walk me through your key assumptions and how sensitive the model is to changes in them.","A business wants to know if its pricing is leaving money on the table. Judge question: How would you approach a pricing analysis and what data would you need?"],
};

// Deterministically pick today's prompt — same date → same prompt for all users
const getDailyPrompt=()=>{
  const now=new Date();
  const ds=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  let h=0;for(let i=0;i<ds.length;i++)h=((h<<5)-h+ds.charCodeAt(i))|0;
  const pool=[];
  Object.entries(TOPICS).forEach(([cat,diffs])=>Object.entries(diffs).forEach(([diff,ps])=>ps.forEach(p=>pool.push({text:p,cat,diff}))));
  return pool[Math.abs(h)%pool.length];
};
const DAILY_PROMPT=getDailyPrompt();

const msTilMidnight=()=>{const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);return m-n;};
const PREP_TIMES = [0,30,60,120];
const SPEAK_TIMES = [30,60,120,180,300];
const fmt = s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const rand = arr=>arr[Math.floor(Math.random()*arr.length)];
const randNew=(pool,last)=>{if(!pool||pool.length===0)return"";if(pool.length===1)return pool[0];let c,t=0;do{c=pool[Math.floor(Math.random()*pool.length)];t++;}while(c===last&&t<20);return c;};

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
  const sentenceCount = sentences.length;
  // ── coherence check — catch gibberish before scoring ──────────────────────
  {
    const wArr=words.map(w=>w.toLowerCase().replace(/[^a-z]/g,''));
    const uniqueR=wordCount>0?new Set(wArr).size/wordCount:1;
    const NOISE=new Set(['yada','ya','yeah','yep','boo','hey','yo','hmm','hm','ha','haha','woah','wow','whoa','dunno','nah','nope','ugh','buddy','dude','whatever','lol','huh','nah']);
    const noiseR=wordCount>0?wArr.filter(w=>NOISE.has(w)).length/wordCount:0;
    const freqM={};wArr.forEach(w=>{freqM[w]=(freqM[w]||0)+1;});
    const maxF=Object.values(freqM).length?Math.max(...Object.values(freqM)):0;
    const flags=[uniqueR<0.4&&wordCount<60, noiseR>0.3, wordCount<50&&maxF>4].filter(Boolean).length;
    if(flags>=2)return{
      totalScore:16,clarity:3,structure:1,fillerWords:8,confidence:4,
      fillerWordList:{},
      feedback:"This response did not contain a meaningful answer to the prompt. Real feedback requires real sentences.",
      strength:"You attempted to speak — that is the first step.",
      improvement:"Give a real answer next time. Even 3-4 clear sentences directly addressing the prompt will score much higher.",
    };
  }
  // ── new-format local fallback ──────────────────────────────────────────────
  {
    const {fillerWordList,totalFillers}=detectFillers(text);
    const fillerRate=wordCount>0?totalFillers/wordCount:0;

    // Hedge detection
    const HEDGE_RES=[/\bi\s+think\b/gi,/\bmaybe\b/gi,/\bi\s+guess\b/gi,/\bprobably\b/gi,/\bi\s+feel\b/gi,/\bperhaps\b/gi,/\bi'?m\s+not\s+sure\b/gi];
    const totalHedges=HEDGE_RES.reduce((s,re)=>s+(text.match(re)||[]).length,0);

    // Word metrics
    const cleanWords=words.map(w=>w.toLowerCase().replace(/[^a-z]/g,''));
    const uniqueWordSet=new Set(cleanWords.filter(w=>w.length>3));
    const vocabRatio=wordCount>0?uniqueWordSet.size/wordCount:0;

    // ── Filler words score ────────────────────────────────────────────────────
    // 0 fillers + 150+ words = 25 (earned); 0 fillers alone = 23; fillers present = capped at 22
    let fillerWordsScore;
    if(totalFillers===0){
      fillerWordsScore=wordCount>=150?25:23;
    }else{
      fillerWordsScore=Math.max(0,Math.min(22,22-Math.round(fillerRate*160)));
    }

    // ── Clarity (base 18 for 80+ words; no sentence-length dependency) ────────
    let clarity=wordCount>=80?18:wordCount>=50?14:10;
    if(wordCount>=150) clarity+=2;                       // length bonus
    if(vocabRatio>0.7)      clarity+=4;                  // vocab bonus tiers
    else if(vocabRatio>0.6) clarity+=3;
    const properNounCount=(text.match(/\b[A-Z][a-zA-Z]{2,}\b/g)||[]).length;
    const numericCount=(text.match(/\b\d[\d,.%]*\b/g)||[]).length;
    clarity+=Math.min(3,properNounCount+numericCount);   // specific content +1 each, max +3
    const vagueCount=(text.match(/\b(yeah|whatever|stuff|things|something|anything|everything)\b/gi)||[]).length;
    if(vagueCount>wordCount*0.5) clarity-=5;             // heavy vague-vocab penalty
    clarity=Math.max(3,Math.min(25,clarity));

    // ── Structure (base 15, criteria-based) ───────────────────────────────────
    // Hard-evidence words: any one of these = "because"-level proof, disable evidence feedback
    const HARD_EVIDENCE=['because','therefore','since','which means','as a result'];
    const hasHardEvidence=HARD_EVIDENCE.some(w=>lower.includes(w));
    const EVIDENCE_GROUPS=[
      [/\bbecause\b/,/\bsince\b/,/\bgiven\s+that\b/],
      [/\bfor\s+example\b/,/\bfor\s+instance\b/,/\bsuch\s+as\b/,/\blike\s+when\b/,/\bconsider\b/,/\bimagine\b/,/\btake\b/],
      [/\bfirst\b/,/\bsecond\b/,/\bthird\b/,/\bfirstly\b/,/\bsecondly\b/],
      [/\btherefore\b/,/\bthus\b/,/\bwhich\s+means\b/,/\bthis\s+means\b/,/\bas\s+a\s+result\b/],
      [/\bmost\s+people\b/,/\ba\s+lot\s+of\b/,/\bmany\b/,/\bresearch\b/,/\bstudies\b/,/\bdata\b/,/\bstatistics\b/],
      [/\b\d+%?\b/],
    ];
    const evidenceTypesFound=EVIDENCE_GROUPS.filter(g=>g.some(re=>re.test(lower))).length;
    const hasEvidence=hasHardEvidence||evidenceTypesFound>=3;

    // Incoherence check (>60% noise → override to 3)
    const NOISE_WORDS=new Set(['yada','ya','yeah','yep','boo','hey','yo','hmm','hm','ha','haha','woah','wow','whoa','dunno','nah','nope','ugh','whatever','lol','huh']);
    const noiseRate=cleanWords.filter(w=>NOISE_WORDS.has(w)).length/(wordCount||1);
    const isIncoherent=noiseRate>0.6;

    let structure=isIncoherent?3:15;
    if(!isIncoherent){
      const CONTRAST=['on the other hand','however','but ','whereas','while ','unlike','in contrast','compared to'];
      if(CONTRAST.some(w=>lower.includes(w)))      structure+=4;
      const CAUSAL=['because','since','therefore','which means','as a result','thus'];
      if(CAUSAL.some(w=>lower.includes(w)))        structure+=3;
      if((lower.match(/\bbecause\b/g)||[]).length>=3) structure+=1;
      const EXAMPLE=['for example','for instance','such as','like when','imagine','take the'];
      if(EXAMPLE.some(w=>lower.includes(w)))       structure+=3;
      const last20=words.slice(-20).join(' ').toLowerCase();
      const CLOSING=['so ','therefore','ultimately','in the end','which is why','that is why','overall','this shows','this means','the point is'];
      if(CLOSING.some(w=>last20.includes(w)))      structure+=3;
      structure=Math.min(25,structure);
    }

    // ── Confidence (penalty from base, capped by assertive language) ──────────
    // Length alone can't push confidence above 20 — assertive phrases required
    const ASSERTIVE_RES=[/\bi\s+know\b/gi,/\bdefinitely\b/gi,/\bclearly\b/gi,/\bthe\s+fact\s+is\b/gi,/\babsolutely\b/gi,/\bwithout\s+a\s+doubt\b/gi,/\bthis\s+is\s+why\b/gi,/\bthe\s+answer\s+is\b/gi,/\bi\s+am\s+certain\b/gi,/\bmy\s+point\s+is\b/gi];
    const assertiveCount=ASSERTIVE_RES.reduce((s,re)=>s+(text.match(re)||[]).length,0);
    const assertiveCap=assertiveCount>=3&&wordCount>=200?25:assertiveCount>=2&&wordCount>=150?23:assertiveCount>=1?21:20;
    let confidence=25;
    if(totalHedges>=5)      confidence-=10;
    else if(totalHedges>=3) confidence-=6;
    else if(totalHedges>=1) confidence-=3;
    if(wordCount<60)        confidence-=8;
    else if(wordCount<100)  confidence-=4;
    else if(wordCount<150)  confidence-=1;
    confidence=Math.max(5,Math.min(assertiveCap,confidence));

    // ── Word count hard cap on total ─────────────────────────────────────────
    const wordCountCap=wordCount<30?25:wordCount<61?45:wordCount<101?68:wordCount<151?82:wordCount<201?91:100;
    // Single final score — used identically for display, localStorage, and Supabase
    const totalScore=Math.max(20,Math.min(wordCountCap,clarity+structure+fillerWordsScore+confidence));

    // ── Strength: find actual highest scoring category via reduce ─────────────
    const allScores=[['fillerWords',fillerWordsScore],['clarity',clarity],['structure',structure],['confidence',confidence]];
    const highestCat=allScores.reduce((a,b)=>b[1]>a[1]?b:a)[0];
    const lowestCat=allScores.reduce((a,b)=>b[1]<a[1]?b:a)[0];
    const strengthMsgs={
      fillerWords:'Clean delivery — you kept filler words to a minimum which makes your speech much easier to follow',
      clarity:'Your ideas came through clearly — strong vocabulary and specific content made your argument easy to follow',
      structure:'Good logical flow — your response moved from point to point with clear reasoning and support',
      confidence:'Strong commitment to your answer — you spoke with length and conviction',
    };
    const strength=strengthMsgs[highestCat];

    // ── Improvement (priority-based, specific) ────────────────────────────────
    const topFillers=Object.entries(fillerWordList).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([w])=>w);
    const STOP=new Set(['the','and','that','this','with','have','from','they','what','been','will','when','your','said','each','which','there','would','their','about','more','many','some','also','into','than','then','only','most','over','just','well','were','very','even','back','make','take','know','come','look','want','need','such','does','here','made','much','same','has','had','not','are','for','out','but','its','who','him','her','our','you','all','any','can','did','get','got','how','let','may','now','put','see','set','she','was','we']);
    const contentFreq={};
    cleanWords.forEach(w=>{if(w.length>3&&!STOP.has(w)&&!fillerWordList[w])contentFreq[w]=(contentFreq[w]||0)+1;});
    const topRepeated=Object.entries(contentFreq).sort((a,b)=>b[1]-a[1])[0];
    const hasRepetition=topRepeated&&topRepeated[1]>=4;

    let improvement;
    if(lowestCat==='fillerWords'&&totalFillers>=8){
      const twoFillers=topFillers.length>=2?`"${topFillers[0]}" and "${topFillers[1]}"`:`"${topFillers[0]||'um'}"`;
      improvement=`You used ${totalFillers} filler words in this response — ${twoFillers} were the most frequent. Practice pausing silently for half a second instead of reaching for a filler sound. Record yourself and count them — awareness is the first fix.`;
    }else if(wordCount<60){
      improvement=`Your response was only ${wordCount} words — that is not enough to fully make your point. Aim for at least 100 words. After your main statement, ask yourself why, then answer that too. That alone usually doubles your word count.`;
    }else if(totalHedges>=3){
      improvement=`You hedged ${totalHedges} times with phrases like 'I think' and 'maybe'. Pick a position and commit to it. Instead of 'I think this might be good' say 'This is good because...'. Confidence in delivery starts with confident language.`;
    }else if(!hasEvidence){
      improvement=`Your response made claims but did not explain the reasoning behind them. After every point you make, add 'because' and explain why. One well-supported point is stronger than three unsupported ones.`;
    }else if(hasRepetition){
      improvement=`You repeated the word '${topRepeated[0]}' ${topRepeated[1]} times. Varied vocabulary makes your speech more engaging — try finding two or three different ways to express the same idea.`;
    }else if(vocabRatio<0.45){
      improvement=`Your vocabulary was quite repetitive in this response. Challenge yourself to avoid repeating the same word more than twice — a richer vocabulary makes your argument more compelling.`;
    }else if(lowestCat==='confidence'){
      improvement=`Develop your ideas further — after making a point, add a concrete example or real-world scenario to make it stick. Abstract points are forgettable, specific ones are not.`;
    }else{
      improvement=`Push yourself to speak for longer next time — the more you develop your ideas the more natural and confident you will sound.`;
    }

    const tipMap={
      fillerWords:'Next time, replace that word with a deliberate pause — silence sounds more confident than a filler.',
      clarity:'Aim to keep each sentence to one clear idea — if you need a breath mid-sentence, split it in two.',
      structure:'After your next main point, add "because" and give a specific reason — that single word forces you to develop your ideas.',
      confidence:"Use 'for example' as a trigger — each time you make a point, follow it immediately with one specific real-world example.",
    };
    const feedback=`${strength}. ${improvement}. ${tipMap[lowestCat]}`;
    return{totalScore,clarity,structure,fillerWords:fillerWordsScore,confidence,fillerWordList,feedback,strength,improvement};
  }
  // (unreachable — kept for linter)
  const FILLER_DEFS = [
    {word:"um",re:/\bum\b/gi},{word:"uh",re:/\buh\b/gi},
    {word:"like",re:/\blike\b/gi},{word:"you know",re:/\byou\s+know\b/gi},
    {word:"basically",re:/\bbasically\b/gi},{word:"literally",re:/\bliterally\b/gi},
    {word:"actually",re:/\bactually\b/gi},{word:"right",re:/\bright\b/gi},
    {word:"so",re:/\bso\b/gi},{word:"I mean",re:/\bi\s+mean\b/gi},
    {word:"kind of",re:/\bkind\s+of\b/gi},{word:"sort of",re:/\bsort\s+of\b/gi},
    {word:"honestly",re:/\bhonestly\b/gi},{word:"well",re:/\bwell\b/gi},
    {word:"just",re:/\bjust\b/gi},
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

  const HEDGE_DEFS=[
    {word:"I think",re:/\bi\s+think\b/gi},{word:"maybe",re:/\bmaybe\b/gi},
    {word:"perhaps",re:/\bperhaps\b/gi},{word:"I guess",re:/\bi\s+guess\b/gi},
    {word:"probably",re:/\bprobably\b/gi},{word:"I feel like",re:/\bi\s+feel\s+like\b/gi},
    {word:"I'm not sure",re:/\bi'?m\s+not\s+sure\b/gi},{word:"kind of",re:/\bkind\s+of\b/gi},
  ];
  const hedgeBreakdown=[];
  let totalHedges=0;
  for(const {word,re} of HEDGE_DEFS){
    const n=(text.match(re)||[]).length;
    if(n>0){hedgeBreakdown.push({word,count:n});totalHedges+=n;}
  }

  const avgWPS=sentenceCount>0?wordCount/sentenceCount:0;
  const firstSentence=sentences[0]?.trim()||"";
  const lastSentence=sentences[sentenceCount-1]?.trim()||"";
  const longestSentence=sentences.reduce((a,b)=>b.split(/\s+/).length>a.split(/\s+/).length?b:a,'');
  const uniqueWords=new Set(words.map(w=>w.toLowerCase().replace(/[^a-z]/g,'')).filter(w=>w.length>3));
  const vocabDiversity=wordCount>0?uniqueWords.size/wordCount:0;
  const hasContrast=/\bbut\b|\bhowever\b|\balthough\b|\byet\b|\bon the other hand\b/i.test(text);
  const hasThreePartList=/\bfirst\b.*\bsecond\b.*\bthird\b/is.test(text)||/\bfirst\b.*\bsecond\b.*\bfinally\b/is.test(text);
  const hasPersonalExample=/\bi remember\b|\bfor example\b|\bfor instance\b|\bwhen i\b/i.test(text);
  const hasQuestion=text.includes('?');

  // Difficulty-calibrated scoring — Easy has lower bar, Hard has higher bar
  const fillerTolerance=difficulty==="Easy"?0.10:difficulty==="Medium"?0.06:0.03;
  const structureTarget=difficulty==="Easy"?1:difficulty==="Medium"?2:3;
  const wordTarget=difficulty==="Easy"?60:difficulty==="Medium"?100:150;

  const clarity=Math.min(98,Math.max(20,
    (difficulty==="Easy"?88:difficulty==="Medium"?90:85)
    -Math.round((fillerRate/fillerTolerance)*15)
    -(avgWPS>28?10:avgWPS>22?4:0)
    +(wordCount>wordTarget?5:0)
    +(vocabDiversity>0.7?4:0)
  ));
  const structure=Math.min(98,Math.max(20,
    (difficulty==="Easy"?48:difficulty==="Medium"?40:32)
    +Math.min(structureCount,5)*10
    +(sentenceCount>3?8:0)
    +(wordCount>wordTarget?6:0)
    +(hasThreePartList?10:0)
    +(hasContrast&&difficulty==="Hard"?6:0)
  ));
  const confidence=Math.min(98,Math.max(20,
    (difficulty==="Easy"?88:difficulty==="Medium"?90:86)
    -totalHedges*(difficulty==="Hard"?10:7)
    -Math.round(fillerRate*120)
    +(wordCount>wordTarget?4:0)
  ));
  const score=Math.max(20,Math.round((clarity+structure+confidence)/3));

  // 5-6 specific strengths
  const strengths=[];
  if(wordCount>150) strengths.push(`Strong depth — ${wordCount} words across ${sentenceCount} sentences. You fully developed the idea rather than giving a surface-level answer`);
  else if(wordCount>80) strengths.push(`Solid content length — ${wordCount} words in ${sentenceCount} sentences gives you enough substance to make a real argument`);
  if(fillerRate<0.04) strengths.push(`Exceptionally clean delivery — only ${totalFillers} filler word${totalFillers!==1?"s":""} in ${wordCount} words (${(fillerRate*100).toFixed(1)}% filler rate). Professional level`);
  else if(fillerRate<0.08) strengths.push(`Good filler control — ${totalFillers} fillers across ${wordCount} words (${(fillerRate*100).toFixed(1)}%) is better than most speakers at this stage`);
  if(firstSentence.split(/\s+/).length>8) strengths.push(`Strong opener — you launched straight into the topic: "${firstSentence.slice(0,75)}${firstSentence.length>75?"...":""}"`);
  if(structureCount>=3) strengths.push(`Excellent structure — used ${structureCount} signpost words (${usedStructure.slice(0,4).map(w=>`"${w}"`).join(', ')}) that make your argument easy to follow`);
  else if(structureCount>=1) strengths.push(`Used "${usedStructure[0]}" to signal organization — a strong structural instinct. Build on this by adding more signposts`);
  if(totalHedges===0) strengths.push(`Spoke with full conviction — zero hedging language detected. Every statement was direct and authoritative`);
  if(hasThreePartList) strengths.push(`Used a classic three-part structure (first/second/finally) — this framework makes speeches immediately more persuasive and memorable`);
  if(hasContrast) strengths.push(`Used contrast effectively (but/however/although) — acknowledging opposing views and pivoting strengthens rather than weakens your argument`);
  if(hasPersonalExample) strengths.push(`Grounded your argument in concrete examples — abstract points need real evidence and you provided it`);
  if(hasQuestion) strengths.push(`Used a question to engage the listener — rhetorical questions create mental participation and signal confident delivery`);
  if(vocabDiversity>0.72&&wordCount>60) strengths.push(`High vocabulary variety — ${Math.round(vocabDiversity*100)}% unique words shows strong command of language for this topic`);
  if(strengths.length<3) strengths.push(`Completed the full exercise without stopping — the discipline to speak to the end builds skill that practice drills cannot replace`);
  if(strengths.length<3) strengths.push(`Addressed the prompt directly — staying on-topic is harder than it sounds under pressure`);

  // 5-6 specific improvements
  const improvements=[];
  if(fillerBreakdown.length>0){
    const bd=fillerBreakdown.slice(0,5).map(f=>`"${f.word}" ×${f.count}`).join(', ');
    improvements.push(`Filler words: ${bd} — total ${totalFillers} in ${wordCount} words. That's one filler every ${Math.round(wordCount/totalFillers)} words. Target: under one every 30`);
  }
  if(structureCount<2) improvements.push(`No clear structure — the listener cannot tell how many points you are making. Fix: open with "I will cover three things — first... second... finally..." then stick to that framework`);
  if(totalHedges>0){
    const hd=hedgeBreakdown.slice(0,3).map(h=>`"${h.word}" ×${h.count}`).join(', ');
    improvements.push(`Hedging language undermines authority: ${hd}. Replace "I think X is true" with "X is true" — the listener does not need your permission to believe you`);
  }
  if(avgWPS>25){
    const ex=longestSentence.trim();
    improvements.push(`Sentences average ${Math.round(avgWPS)} words — too long for spoken delivery. Longest sentence: "${ex.slice(0,80)}${ex.length>80?'...':''}". Break this into two`);
  }
  if(wordCount<80) improvements.push(`Only ${wordCount} words — "${topic}" deserves more depth. Add one specific real-world example and explain why it matters. That alone adds 40-60 words`);
  if(lastSentence&&lastSentence.split(/\s+/).length<6&&sentenceCount>2) improvements.push(`Weak closing: "${lastSentence}" — this trails off rather than landing. End with a bold statement or circle back to your opening claim`);
  if(!hasContrast&&wordCount>80&&difficulty!=="Easy") improvements.push(`No counter-argument — for "${topic}", briefly acknowledging the opposing view before refuting it makes your position significantly stronger`);
  if(!hasPersonalExample&&wordCount>60) improvements.push(`No concrete examples — abstract claims without evidence are forgettable. One specific story, statistic, or scenario would double the impact of this response`);
  if(improvements.length<3) improvements.push(`Vocabulary is functional but generic — replace vague words like "good", "bad", "things" with precise alternatives specific to this topic`);

  const clarityReason=fillerRate>fillerTolerance?`filler words at ${(fillerRate*100).toFixed(1)}% (target: under ${(fillerTolerance*100).toFixed(0)}% for ${difficulty})`:`clean delivery at ${(fillerRate*100).toFixed(1)}% filler rate`;
  const structureReason=structureCount<structureTarget?`only ${structureCount} signpost word${structureCount!==1?'s':''} (${difficulty} expects at least ${structureTarget})`:`${structureCount} signpost words used`;
  const confidenceReason=totalHedges>0?`${totalHedges} hedge phrase${totalHedges!==1?'s':''} like "${hedgeBreakdown[0]?.word}" reduce authority`:`no hedging language — fully authoritative`;
  let overall=`Score of ${score} breaks down as: Clarity ${clarity} (${clarityReason}), Structure ${structure} (${structureReason}), Confidence ${confidence} (${confidenceReason}). `;
  overall+=score>=80?`Strong performance on a ${difficulty} prompt.`:score>=60?`Solid effort — the gaps above explain exactly where points were lost.`:`Keep working at it — the breakdown above shows precisely what to fix first.`;

  let tip="";
  if(fillerBreakdown.length>0&&fillerRate>0.06){
    const top=fillerBreakdown[0];
    tip=`Your #1 habit is "${top.word}" (×${top.count}). Drill: Record a 30-second response on "${topic}" with one rule — every time you say "${top.word}", immediately stop, back up one sentence, and restart it. Do 5 rounds. By round 5, your brain will have built a new pause reflex.`;
  } else if(structureCount<2){
    tip=`Structure drill: write "FIRST... SECOND... FINALLY..." on paper before every practice session this week. Start each attempt by saying those three words aloud, then fill them in. After 10 sessions this scaffold will be automatic and you will never sound disorganized on "${topic}" again.`;
  } else if(totalHedges>2){
    const top=hedgeBreakdown[0];
    tip=`Record 60 seconds on "${topic}" with a zero-tolerance rule for "${top.word}". Every time you catch yourself saying it, pause, then restate the sentence without it. Play back and count occurrences. Your target is zero in three consecutive takes.`;
  } else if(wordCount<80){
    tip=`You cut yourself short at ${wordCount} words. Drill: set a 90-second timer on "${topic}" and commit to filling ALL of it. When you run out of points, say "for example..." and give a specific scenario. Then say "this matters because..." and explain the impact. These two phrases add 50+ words and substance every time.`;
  } else if(avgWPS>28){
    tip=`The "full stop pause" drill: after every sentence in your next attempt, pause for a full second before continuing. Record it and play it back — the pauses that feel uncomfortably long to you will sound like confidence and authority to your listener. Do this 3 times on "${topic}".`;
  } else {
    tip=`Precision drill on "${topic}": record again but this time ban the words "this", "that", "it", "thing", and "stuff". Every time you want to use one, force yourself to say the exact noun you mean. This single constraint dramatically increases perceived intelligence and specificity.`;
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

function WaveViz({active,analyserNode}){
  const canvasRef=useRef(null);
  const rafRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext('2d');
    if(!active||!analyserNode){
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      return;
    }
    const bufLen=analyserNode.fftSize;
    const data=new Uint8Array(bufLen);
    const draw=()=>{
      rafRef.current=requestAnimationFrame(draw);
      analyserNode.getByteTimeDomainData(data);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.beginPath();
      ctx.strokeStyle='#FF6B2B';
      ctx.lineWidth=2.5;
      ctx.lineJoin='round';
      const sw=canvas.width/bufLen;
      let x=0;
      for(let i=0;i<bufLen;i++){
        const y=(data[i]/128)*canvas.height/2;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        x+=sw;
      }
      ctx.stroke();
    };
    draw();
    return()=>cancelAnimationFrame(rafRef.current);
  },[active,analyserNode]);
  if(!active)return null;
  return(
    <canvas ref={canvasRef} width={280} height={56}
      style={{display:'block',maxWidth:'100%',borderRadius:8,background:'rgba(255,107,43,0.07)',marginTop:8}}
    />
  );
}

function HighlightedTranscript({text,fillerWords}){
  const fillers=Object.keys(fillerWords||{});
  if(!fillers.length)return<span>{text}</span>;
  const pattern=fillers.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  const regex=new RegExp(`\\b(${pattern})\\b`,'gi');
  const parts=[];let last=0,m;
  while((m=regex.exec(text))!==null){
    if(m.index>last)parts.push({t:text.slice(last,m.index),h:false});
    parts.push({t:m[0],h:true});
    last=m.index+m[0].length;
  }
  if(last<text.length)parts.push({t:text.slice(last),h:false});
  return<>{parts.map((p,i)=>p.h
    ?<mark key={i} style={{background:'#FFF3CD',color:'#7A5500',fontWeight:700,borderRadius:3,padding:'0 2px'}}>{p.t}</mark>
    :<span key={i}>{p.t}</span>
  )}</>;
}

function VoiceTypeCard({data}){
  const [shareUrl,setShareUrl]=useState('');
  const generate=()=>{
    const W=1080,H=1080;
    const c=document.createElement('canvas');
    c.width=W;c.height=H;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#1A1A2E';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(255,255,255,0.055)';
    for(let x=27;x<W;x+=54)for(let y=27;y<H;y+=54){ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#FF6B2B';ctx.fillRect(0,0,W,10);
    ctx.font='bold 72px Fredoka,"Arial Rounded MT Bold",Arial';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#FF6B2B';
    ctx.fillText('Orivox',W/2,104);
    ctx.fillStyle='rgba(255,255,255,0.42)';ctx.font='30px Arial,sans-serif';
    ctx.fillText('My Speaking Type',W/2,158);
    ctx.strokeStyle='rgba(255,107,43,0.25)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(W*0.25,184);ctx.lineTo(W*0.75,184);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.38)';ctx.font='34px Arial,sans-serif';ctx.textAlign='center';
    ctx.fillText('I AM',W/2,370);
    ctx.fillStyle='#FF6B2B';ctx.font='bold 112px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.fillText(data.type,W/2,510);
    ctx.fillStyle='rgba(255,255,255,0.65)';ctx.font='italic 36px Arial,sans-serif';
    const tag=`"${data.tagline}"`;
    const maxW=860;
    if(ctx.measureText(tag).width<=maxW){ctx.fillText(tag,W/2,572);}
    else{const mid=Math.floor(tag.length/2);ctx.fillText(tag.slice(0,mid),W/2,560);ctx.fillText(tag.slice(mid),W/2,606);}
    ctx.strokeStyle='rgba(255,107,43,0.2)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(W*0.2,820);ctx.lineTo(W*0.8,820);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.38)';ctx.font='27px Arial,sans-serif';
    ctx.fillText('Try it at',W/2,874);
    ctx.fillStyle='#FF6B2B';ctx.font='bold 44px Arial,sans-serif';
    ctx.fillText('orivoxapp.vercel.app',W/2,944);
    ctx.fillStyle='#FF6B2B';ctx.fillRect(0,H-10,W,10);
    c.toBlob(b=>{if(shareUrl)URL.revokeObjectURL(shareUrl);setShareUrl(URL.createObjectURL(b));},'image/png');
  };
  const download=()=>{const a=document.createElement('a');a.href=shareUrl;a.download=`orivox-${data.type.toLowerCase().replace(/\s+/g,'-')}.png`;a.click();};
  if(!shareUrl)return<button className="btn btn-orange" style={{flex:1,justifyContent:"center"}} onClick={generate}>Share my type</button>;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <img src={shareUrl} alt="Type card" style={{width:"100%",borderRadius:12,border:"2px solid var(--border)"}}/>
      <button className="btn btn-orange" style={{width:"100%",justifyContent:"center"}} onClick={download}>Download Image</button>
    </div>
  );
}

// ── Review Prompt ────────────────────────────────────────────────────────────
function ReviewPrompt({onSubmit,initialName=""}){
  const [rating,setRating]=useState(0);
  const [hover,setHover]=useState(0);
  const [name,setName]=useState(initialName);
  const [comment,setComment]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const submit=async()=>{
    if(!rating)return;
    const trimName=name.trim()||"Anonymous";
    const trimComment=comment.trim();
    if(containsInappropriateContent(trimName)||containsInappropriateContent(trimComment)){
      setErr("Your review contains inappropriate content and could not be submitted. Please keep it respectful.");return;
    }
    setLoading(true);setErr("");
    const res=await fetch("/api/submit-review",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({rating,comment:trimComment||null,name:trimName})});
    const data=await res.json().catch(()=>({}));
    setLoading(false);
    if(!res.ok){setErr(data.error||"Couldn't submit — please try again.");return;}
    setSubmitted(true);
    onSubmit();
  };

  const inputStyle={
    width:"100%",padding:"11px 16px",borderRadius:12,fontSize:14,
    border:"2px solid var(--border)",background:"var(--bg)",color:"var(--text)",
    fontFamily:"Nunito,sans-serif",outline:"none",marginBottom:10,boxSizing:"border-box",
  };

  if(submitted)return(
    <div style={{textAlign:"center",padding:"28px 20px"}}>
      <div style={{width:52,height:52,borderRadius:"50%",background:"#E8F7EE",border:"3px solid var(--green)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <p className="fredoka" style={{fontSize:20,color:"var(--green)"}}>Thanks for your feedback!</p>
    </div>
  );

  return(
    <div style={{padding:"28px 0 8px"}}>
      <p className="fredoka" style={{fontSize:20,marginBottom:20,textAlign:"center"}}>How was your session?</p>
      {/* Stars */}
      <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:20}}>
        {[1,2,3,4,5].map(i=>(
          <button key={i} onClick={()=>setRating(i)}
            onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
            style={{background:"none",border:"none",cursor:"pointer",padding:4,transition:"transform .1s",transform:(hover||rating)>=i?"scale(1.15)":"scale(1)"}}>
            <svg width="36" height="36" viewBox="0 0 24 24"
              fill={(hover||rating)>=i?"#F5C842":"none"}
              stroke={(hover||rating)>=i?"#F5C842":"var(--border)"} strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        ))}
      </div>
      <input value={name} onChange={e=>setName(e.target.value)}
        placeholder="Your name (optional)" style={inputStyle}/>
      <textarea value={comment} onChange={e=>setComment(e.target.value)}
        placeholder="Anything to add? Optional" rows={3}
        style={{...inputStyle,resize:"vertical",marginBottom:14}}/>
      {err&&<p style={{color:"var(--red)",fontSize:13,marginBottom:10}}>{err}</p>}
      <button onClick={submit} disabled={!rating||loading}
        className="btn btn-orange" style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:17,opacity:!rating?.5:1}}>
        {loading?"Submitting…":"Leave a review"}
      </button>
    </div>
  );
}

// ── Share Card ───────────────────────────────────────────────────────────────
function ShareCard({score,category,difficulty,strength}){
  const [copied,setCopied]=useState(false);
  const [open,setOpen]=useState(false);

  const buildUrl=()=>{
    const p=new URLSearchParams({score:String(score),category,difficulty,strength});
    return `https://orivoxapp.vercel.app/result?${p.toString()}`;
  };

  const handleShare=async()=>{
    const url=buildUrl();
    const title=`I scored ${score}/100 on Orivox`;
    // Mobile: native share sheet
    if(typeof navigator!=='undefined'&&navigator.share){
      try{await navigator.share({title,url});return;}
      catch(e){if(e.name==='AbortError')return;}
    }
    // Desktop: copy link
    try{
      await navigator.clipboard.writeText(url);
      setCopied(true);setTimeout(()=>setCopied(false),2400);
    }catch{}
  };

  // Canvas-based PNG download (kept as secondary option)
  const handleDownload=()=>{
    const W=1080,H=1080;
    const c=document.createElement('canvas');
    c.width=W;c.height=H;
    const ctx=c.getContext('2d');
    const scoreColor=score>=80?'#2D7A4F':score>=60?'#F5C842':'#E84040';
    ctx.fillStyle='#1A1A2E';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(255,255,255,0.055)';
    for(let x=27;x<W;x+=54)for(let y=27;y<H;y+=54){ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#FF6B2B';ctx.fillRect(0,0,W,10);
    ctx.fillStyle='#FF6B2B';ctx.font='bold 84px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('Orivox',W/2,115);
    ctx.fillStyle='rgba(255,255,255,0.42)';ctx.font='30px Arial,sans-serif';ctx.fillText('AI Speaking Coach',W/2,162);
    ctx.strokeStyle='rgba(255,107,43,0.22)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(W*0.3,186);ctx.lineTo(W*0.7,186);ctx.stroke();
    const cx=W/2,cy=415,r=168;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,0.09)';ctx.lineWidth=22;ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(score/100)*Math.PI*2);
    ctx.strokeStyle=scoreColor;ctx.lineWidth=22;ctx.lineCap='round';ctx.stroke();
    ctx.fillStyle=scoreColor;ctx.font='bold 192px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.textBaseline='middle';ctx.fillText(score.toString(),cx,cy-16);
    ctx.fillStyle='rgba(255,255,255,0.33)';ctx.font='bold 54px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.fillText('/100',cx,cy+90);
    ctx.fillStyle='rgba(255,255,255,0.75)';ctx.font='38px Arial,sans-serif';ctx.textBaseline='alphabetic';
    ctx.fillText(`${category} · ${difficulty}`,cx,658);
    ctx.fillStyle='rgba(255,255,255,0.48)';ctx.font='italic 29px Arial,sans-serif';
    const maxW=820;const wds=(`"${strength}"`).split(' ');let line='';const lines=[];
    for(const w of wds){const test=line+(line?' ':'')+w;if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w;if(lines.length>=2)break;}else line=test;}
    if(lines.length<2&&line)lines.push(line);
    if(lines.length===2){while(ctx.measureText(lines[1]+'…').width>maxW&&lines[1].includes(' '))lines[1]=lines[1].split(' ').slice(0,-1).join(' ');if(!(`"${strength}"`).endsWith(lines[1]))lines[1]+='…';}
    lines.forEach((l,i)=>ctx.fillText(l,cx,714+i*42));
    ctx.strokeStyle='rgba(255,107,43,0.2)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(W*0.2,822);ctx.lineTo(W*0.8,822);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.38)';ctx.font='27px Arial,sans-serif';ctx.fillText('Try it at',cx,876);
    ctx.fillStyle='#FF6B2B';ctx.font='bold 44px Arial,sans-serif';ctx.fillText('orivoxapp.vercel.app',cx,946);
    ctx.fillStyle='#FF6B2B';ctx.fillRect(0,H-10,W,10);
    const a=document.createElement('a');a.href=c.toDataURL('image/png');
    a.download='orivox-score.png';document.body.appendChild(a);a.click();document.body.removeChild(a);
    setOpen(false);
  };

  const btnBase={display:'flex',alignItems:'center',justifyContent:'center',gap:8,
    padding:'13px',borderRadius:50,cursor:'pointer',
    fontFamily:'Fredoka,sans-serif',fontSize:16,fontWeight:600,
    transition:'all .15s',width:'100%',border:'2.5px solid var(--text)'};

  return(
    <>
      <button onClick={handleShare} style={{
        display:'inline-flex',alignItems:'center',gap:8,marginTop:22,
        padding:'10px 26px',borderRadius:50,cursor:'pointer',
        fontFamily:'Fredoka,sans-serif',fontSize:16,fontWeight:600,
        background:copied?'#E8F7EE':'transparent',
        color:copied?'var(--green)':'var(--text)',
        border:`2.5px solid ${copied?'var(--green)':'var(--border)'}`,
        boxShadow:`3px 3px 0 ${copied?'var(--green)':'var(--border)'}`,transition:'all .15s',
      }}>
        {copied?'✓ Link copied!':'Share Result'}
      </button>

      {/* Overflow menu for image download */}
      <button onClick={()=>setOpen(true)} style={{
        background:'none',border:'none',cursor:'pointer',
        fontSize:12,color:'var(--muted)',marginTop:8,display:'block',
        fontFamily:'Nunito,sans-serif',textDecoration:'underline',textDecorationColor:'transparent',
        transition:'all .15s',
      }}
      onMouseEnter={e=>e.currentTarget.style.color='var(--orange)'}
      onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}>
        Download image instead
      </button>

      {open&&(
        <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'var(--card)',borderRadius:24,border:'2.5px solid var(--border)',boxShadow:'8px 8px 0 rgba(0,0,0,0.22)',padding:28,maxWidth:380,width:'100%'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span className="fredoka" style={{fontSize:22}}>Download image</span>
              <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:24,color:'var(--muted)',padding:4,lineHeight:1}}>×</button>
            </div>
            <p style={{fontSize:14,color:'var(--muted)',marginBottom:18,lineHeight:1.6}}>Save the score card as a PNG — share it directly in stories, posts, or wherever images work best.</p>
            <button onClick={handleDownload} style={{...btnBase,background:'var(--orange)',color:'#fff',boxShadow:'4px 4px 0 var(--text)'}}>↓ Download PNG</button>
          </div>
        </div>
      )}
    </>
  );
}

function SubBar({label,val,max=100,color,bg}){
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
        <span style={{fontFamily:"Fredoka",fontSize:15,color:"var(--text)"}}>{label}</span>
        <span style={{fontFamily:"Fredoka",fontSize:20,fontWeight:700,color}}>{shown}<span style={{fontSize:12,opacity:.6,fontWeight:400}}>/{max}</span></span>
      </div>
      <div style={{height:8,borderRadius:4,background:"rgba(0,0,0,0.08)",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(shown/max)*100}%`,background:color,borderRadius:4,transition:"width .1s"}}/>
      </div>
    </div>
  );
}

// ── Border Timer ─────────────────────────────────────────────────────────────
function lerpColor(a, b, t){
  const h=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
  const [r1,g1,b1]=h(a), [r2,g2,b2]=h(b);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

function BorderTimer({containerRef, startTimeRef, durationSecs, active}){
  const [dims,setDims]=useState({w:0,h:0});
  const trackRef=useRef(null);
  const glowRef=useRef(null);
  const rafRef=useRef(null);

  // Measure card using offsetWidth/offsetHeight (includes border) on resize
  useEffect(()=>{
    const el=containerRef?.current;
    if(!el) return;
    const measure=()=>setDims({w:el.offsetWidth,h:el.offsetHeight});
    measure();
    const ro=new ResizeObserver(measure);
    ro.observe(el);
    return()=>ro.disconnect();
  },[containerRef]);

  // RAF loop — directly mutates SVG attrs, zero React re-renders per frame
  useEffect(()=>{
    cancelAnimationFrame(rafRef.current);
    if(!active||!dims.w) return;

    const rx=20, sw=5;
    const rw=dims.w-sw, rh=dims.h-sw;
    const perim=2*(rw+rh)-8*rx+2*Math.PI*rx;

    const tick=()=>{
      const start=startTimeRef?.current;
      if(!start){rafRef.current=requestAnimationFrame(tick);return;}
      const elapsed=(Date.now()-start)/1000;
      const rem=Math.max(0,durationSecs-elapsed);
      const frac=durationSecs>0?rem/durationSecs:0;
      const offset=perim*(1-frac);

      const color=rem>=30?'#FF6B2B'
        :rem>=10?lerpColor('#F5C842','#FF6B2B',(rem-10)/20)
        :lerpColor('#E84040','#F5C842',rem/10);

      if(trackRef.current){
        trackRef.current.setAttribute('stroke-dashoffset',offset.toFixed(2));
        trackRef.current.setAttribute('stroke',color);
        const urgent=rem<10&&rem>0;
        trackRef.current.style.filter=urgent?`drop-shadow(0 0 8px ${color}) drop-shadow(0 0 3px ${color})`:'none';
        if(glowRef.current) glowRef.current.style.opacity=urgent?(0.15+0.15*Math.sin(Date.now()/200)).toFixed(3):'0';
      }
      if(rem>0) rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[active,dims,durationSecs]);

  if(!dims.w||!dims.h||!active) return null;

  const rx=20, sw=5, half=sw/2;
  const rw=dims.w-sw, rh=dims.h-sw;
  const perim=2*(rw+rh)-8*rx+2*Math.PI*rx;

  return(
    // Positioned so stroke centre sits exactly on the card's outer border edge
    <svg style={{position:'absolute',top:`-${half}px`,left:`-${half}px`,
      width:`calc(100% + ${sw}px)`,height:`calc(100% + ${sw}px)`,
      pointerEvents:'none',zIndex:4,overflow:'visible'}}
      viewBox={`0 0 ${dims.w} ${dims.h}`}>
      {/* Glow halo for urgency — opacity driven by RAF */}
      <rect ref={glowRef} x={half} y={half} width={rw} height={rh} rx={rx}
        fill="none" stroke="#E84040" strokeWidth={sw+8} opacity={0}/>
      {/* Main countdown stroke */}
      <rect ref={trackRef} x={half} y={half} width={rw} height={rh} rx={rx}
        fill="none" stroke="#FF6B2B" strokeWidth={sw}
        strokeDasharray={`${perim.toFixed(2)} ${perim.toFixed(2)}`}
        strokeDashoffset={0}
        strokeLinecap="butt"/>
    </svg>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function Orivox(){
  const [screen,setScreen]=useState("home");
  const [menuOpen,setMenuOpen]=useState(false);
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
  const [username,setUsername]=useState("");
  const [showNameModal,setShowNameModal]=useState(false);
  const [nameError,setNameError]=useState("");
  const [toastQueue,setToastQueue]=useState([]);
  const [nameInput,setNameInput]=useState("");
  const [showReviewModal,setShowReviewModal]=useState(false);
  const typingRef=useRef(null);
  const timerCardRef=useRef(null);
  const mediaRef=useRef(null);
  const chunksRef=useRef([]);
  const ivRef=useRef(null);
  const startTimeRef=useRef(null);
  const initialTimeRef=useRef(0);
  const recognitionRef=useRef(null);
  const transcriptRef=useRef("");
  const stoppingRef=useRef(false);
  const earlyStopRef=useRef(false);
  const earlyStopElapsedRef=useRef(0);
  const lastTopicRef=useRef("");
  const audioCtxRef=useRef(null);
  const [analyserNode,setAnalyserNode]=useState(null);
  const [micStarting,setMicStarting]=useState(false);
  const [retrySource,setRetrySource]=useState(null);
  const [voiceTypeData,setVoiceTypeData]=useState(null);
  const [showVoiceTypeModal,setShowVoiceTypeModal]=useState(false);
  const [customText,setCustomText]=useState("");
  const [customErr,setCustomErr]=useState("");
  const [recentCustoms,setRecentCustoms]=useState([]);
  const [caseType,setCaseType]=useState("General Q&A");
  const [activeCaseType,setActiveCaseType]=useState("General Q&A");
  const [,tickMin]=useState(0);

  // On mount: load saved username; show name modal if first visit
  useEffect(()=>{
    const saved=localStorage.getItem("orivox_username");
    if(saved) setUsername(saved); else setShowNameModal(true);
    const rc=JSON.parse(localStorage.getItem("orivox_custom_prompts")||"[]");
    setRecentCustoms(rc);
  },[]);

  // Tick every minute so the "Next prompt in X" countdown stays current
  useEffect(()=>{
    const id=setInterval(()=>tickMin(n=>n+1),60000);
    return()=>clearInterval(id);
  },[]);

  // Achievement toast auto-advance
  useEffect(()=>{
    if(toastQueue.length===0)return;
    const t=setTimeout(()=>setToastQueue(prev=>prev.slice(1)),3200);
    return()=>clearTimeout(t);
  },[toastQueue]);

  // Auto-post to leaderboard only when it's a new personal best
  useEffect(()=>{
    if(!feedback||feedback.error) return;
    const pname=localStorage.getItem("orivox_username")||"Anonymous";
    const now=new Date();
    const d=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    // Fetch existing best before inserting — only post if it's a new personal best
    supabase.from("scores")
      .select("score")
      .eq("player_name",pname)
      .order("score",{ascending:false})
      .limit(1)
      .then(({data})=>{
        const existingBest=(data&&data[0])?data[0].score:0;
        if(feedback.totalScore>existingBest){
          supabase.from("scores")
            .insert({player_name:pname,score:feedback.totalScore,category:activeCat,difficulty:activeDiff,date:d})
            .then(({error})=>{
              if(error){
                console.error("LB insert failed:",error.message);
                supabase.from("scores").insert({player_name:pname,score:feedback.totalScore})
                  .then(({error:e2})=>{if(e2)console.error("LB minimal insert failed:",e2.message);});
              }
            }).catch(e=>console.error("LB error:",e));
        }
      }).catch(e=>console.error("LB best-score check error:",e));
    if(!localStorage.getItem("orivox_review_prompted")) setShowReviewModal(true);
  },[feedback,activeCat,activeDiff]);

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

  const pickTopic=useCallback(()=>{
    if(activeCat==="Custom")return;
    let pool;
    if(activeCat==="Case Competition"&&activeCaseType!=="General Q&A"){
      pool=CASE_TYPE_PROMPTS[activeCaseType]||ALL_PROMPTS;
    }else{
      pool=activeCat==="Random"?ALL_PROMPTS:(TOPICS[activeCat]?.[activeDiff]||ALL_PROMPTS);
    }
    const t=randNew(pool,lastTopicRef.current);
    lastTopicRef.current=t;
    setTopic(t);
  },[activeCat,activeDiff,activeCaseType]);

  const startSession=(overrideData=null)=>{
    // Custom prompt flow
    if(!overrideData&&cat==="Custom"){
      if(!customText.trim()){setCustomErr("Please describe your scenario before starting");return;}
      setCustomErr("");
      const text=customText.trim();
      const rc=JSON.parse(localStorage.getItem("orivox_custom_prompts")||"[]");
      const updated=[text,...rc.filter(r=>r!==text)].slice(0,3);
      localStorage.setItem("orivox_custom_prompts",JSON.stringify(updated));
      setRecentCustoms(updated);
      setActiveCat("Custom");setActiveDiff("Medium");
      lastTopicRef.current=text;setTopic(text);
      setFeedback(null);setAudioBlob(null);setTranscript("");setAudioUrl(null);transcriptRef.current="";
      setPhase("prep");setTimer(prepTime);initialTimeRef.current=prepTime;
      if(prepTime===0){setScreen("speak");setPhase("speak");setTimer(speakTime);initialTimeRef.current=speakTime;}
      else setScreen("prep");
      return;
    }
    // Daily prompt override or normal flow
    const resolvedCat=overrideData?overrideData.cat:(cat==="Random"?rand(CATS):cat);
    const resolvedDiff=overrideData?overrideData.diff:(diff==="Random"?rand(DIFFS):diff);
    const resolvedCaseType=overrideData?("General Q&A"):caseType;
    setActiveCat(resolvedCat);setActiveDiff(resolvedDiff);setActiveCaseType(resolvedCaseType);
    let picked;
    if(overrideData){
      picked=overrideData.text;
    }else if(resolvedCat==="Case Competition"&&resolvedCaseType!=="General Q&A"){
      picked=randNew(CASE_TYPE_PROMPTS[resolvedCaseType]||ALL_PROMPTS,lastTopicRef.current);
    }else{
      picked=randNew(TOPICS[resolvedCat]?.[resolvedDiff]||ALL_PROMPTS,lastTopicRef.current);
    }
    lastTopicRef.current=picked;setTopic(picked);
    setFeedback(null);setAudioBlob(null);setTranscript("");setAudioUrl(null);transcriptRef.current="";
    setPhase("prep");setTimer(prepTime);initialTimeRef.current=prepTime;
    if(prepTime===0){setScreen("speak");setPhase("speak");setTimer(speakTime);initialTimeRef.current=speakTime;}
    else setScreen("prep");
  };

  const goSpeak=()=>{setPhase("speak");setTimer(speakTime);initialTimeRef.current = speakTime;setScreen("speak");};

  const startMic=async()=>{
    if(micStarting||recording) return;
    setMicStarting(true);
    setMicErr("");setTranscript("");transcriptRef.current="";
    stoppingRef.current=false;
    try{
      // Check permission state before attempting getUserMedia
      if(navigator.permissions){
        try{
          const perm=await navigator.permissions.query({name:"microphone"});
          if(perm.state==="denied"){
            setMicErr("Microphone access is blocked. Go to your browser settings and allow microphone access for this site, then refresh and try again.");
            setMicStarting(false);return;
          }
        }catch{}
      }

      const stream=await navigator.mediaDevices.getUserMedia({audio:true});

      // Set up Web Audio API analyser for the waveform visualizer
      try{
        const audioCtx=new(window.AudioContext||window.webkitAudioContext)();
        const analyser=audioCtx.createAnalyser();
        analyser.fftSize=512;
        audioCtx.createMediaStreamSource(stream).connect(analyser);
        audioCtxRef.current=audioCtx;
        setAnalyserNode(analyser);
      }catch{}

      // audio/mp4 first — required for iOS Safari; webm for Chrome/Firefox
      const mimeType=
        MediaRecorder.isTypeSupported('audio/mp4')?'audio/mp4':
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':
        MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':
        MediaRecorder.isTypeSupported('audio/ogg')?'audio/ogg':
        'audio/mp4';
      console.log('[Orivox] Recording MIME type selected:',mimeType);

      const mr=new MediaRecorder(stream,{mimeType});
      mediaRef.current=mr;chunksRef.current=[];
      mr.ondataavailable=e=>{if(e.data&&e.data.size>0)chunksRef.current.push(e.data);};
      mr.onstop=()=>{
        const finalMime=mr.mimeType||mimeType||"audio/webm";
        const blob=new Blob(chunksRef.current,{type:finalMime});
        console.log(`[Orivox] Recording stopped. MIME: ${finalMime}, size: ${blob.size} bytes, chunks: ${chunksRef.current.length}`);
        if(blob.size<1000){
          setMicErr("We could not detect your audio. Please check your microphone permissions and try again.");
          stream.getTracks().forEach(t=>t.stop());
          return;
        }
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t=>t.stop());
      };
      mr.start(1000);startTimeRef.current=Date.now();setRecording(true);setRunning(true);
      setMicStarting(false);

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
            if(!stoppingRef.current&&mediaRef.current?.state==="recording") startRec();
          };
          rec.onerror=()=>{
            if(!stoppingRef.current&&mediaRef.current?.state==="recording") startRec();
          };
          rec.start();
          recognitionRef.current=rec;
        };
        startRec();
      }
    }catch(err){
      const msg=err?.name==="NotAllowedError"||err?.name==="PermissionDeniedError"
        ?"Microphone access was denied. Please allow microphone access in your browser settings and try again."
        :err?.name==="NotFoundError"||err?.name==="DevicesNotFoundError"
        ?"No microphone found. Please connect a microphone and try again."
        :"Could not start recording — please check your microphone and try again.";
      setMicErr(msg);
      setMicStarting(false);
    }
  };

  const doStop=(early=false)=>{
    if(stoppingRef.current)return;
    earlyStopRef.current=early;
    if(early&&startTimeRef.current) earlyStopElapsedRef.current=Math.floor((Date.now()-startTimeRef.current)/1000);
    stoppingRef.current=true;
    setAnalyserNode(null);
    audioCtxRef.current?.close().catch(()=>{});
    audioCtxRef.current=null;
    recognitionRef.current?.stop();recognitionRef.current=null;
    if(mediaRef.current?.state!=="inactive")mediaRef.current?.stop();
    setRecording(false);setRunning(false);setScreen("feedback");analyze();
  };

  const saveSession=(feedbackData)=>{
    try{
      const words=transcriptRef.current.trim().split(/\s+/).filter(Boolean).length;
      const actualDur=earlyStopRef.current&&earlyStopElapsedRef.current>0?earlyStopElapsedRef.current:speakTime;
      const wpm=actualDur>0?Math.round((words/actualDur)*60):0;
      const pacingRating=wpm<110?"too slow":wpm<130?"slightly slow":wpm<=160?"ideal":wpm<=180?"slightly fast":"too fast";
      const fillerWordList=feedbackData.fillerWordList||{};
      const localDate=new Date().toLocaleDateString("en-CA");
      const displayScore=feedbackData.totalScore||0;
      const session={
        id:Date.now().toString(),
        date:localDate,
        category:activeCat||"Unknown",
        difficulty:activeDiff||"Unknown",
        score:feedbackData.totalScore||0,
        displayScore,
        wpm,
        fillerWordCount:Object.values(fillerWordList).reduce((a,b)=>a+b,0),
        fillerWords:Object.keys(fillerWordList),
        pacingRating,
        speakDuration:actualDur,
        clarity:feedbackData.clarity||0,
        structure:feedbackData.structure||0,
        deliveryScore:feedbackData.fillerWords||0,
        confidence:feedbackData.confidence||0,
        fillerWordList,
        transcript:transcriptRef.current,
        strength:feedbackData.strength||"",
        improvement:feedbackData.improvement||"",
        feedback:feedbackData.feedback||"",
      };
      const existing=JSON.parse(localStorage.getItem("orivox_sessions")||"[]");
      existing.push(session);
      localStorage.setItem("orivox_sessions",JSON.stringify(existing));
      return session;
      // Update streak using dedicated keys
      const lastDate=localStorage.getItem("orivox_last_session_date")||"";
      const prevStreak=parseInt(localStorage.getItem("orivox_streak_count")||"0",10);
      let newStreak=1;
      if(lastDate===localDate){
        newStreak=prevStreak||1;
      }else if(lastDate){
        const diff=Math.round((new Date(localDate+"T12:00:00")-new Date(lastDate+"T12:00:00"))/86400000);
        newStreak=diff===1?prevStreak+1:1;
      }
      localStorage.setItem("orivox_streak_count",String(newStreak));
      localStorage.setItem("orivox_last_session_date",localDate);
      localStorage.removeItem("orivox_streak_lost_shown");
      const rs=localStorage.getItem("orivox_retry_source");
      if(rs)try{setRetrySource(JSON.parse(rs));localStorage.removeItem("orivox_retry_source");}catch{}
    }catch{}
  };

  const handleSaveName=(forced)=>{
    const name=(forced!==undefined?forced:(nameInput||"").trim())||"Anonymous";
    if(forced===undefined&&name!=="Anonymous"&&containsInappropriateContent(name)){
      setNameError("Please choose an appropriate display name.");return;
    }
    setNameError("");
    localStorage.setItem("orivox_username",name);
    setUsername(name);setShowNameModal(false);
  };

  const closeReviewModal=()=>{
    localStorage.setItem("orivox_review_prompted","1");
    setShowReviewModal(false);
  };

  const analyze=async()=>{
    setLoading(true);
    const text=transcriptRef.current;
    if(!text.trim()){
      const hadAudio=chunksRef.current.length>0&&chunksRef.current.some(c=>c.size>0);
      setFeedback({error:hadAudio
        ?"Audio could not be processed on your device. Try using Chrome on desktop for the best experience."
        :"No speech detected. Make sure your microphone is working and try again."
      });
      setLoading(false);return;
    }
    let result=null;
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({transcript:text,topic,category:activeCat,difficulty:activeDiff})});
      if(res.ok){const d=await res.json();if(!d.error)result=d;}
    }catch{}
    if(!result){
      await new Promise(r=>setTimeout(r,800));
      result=analyzeTranscript(text,topic,activeDiff);
    }
    const savedSession=saveSession(result);setFeedback(result);setLoading(false);
    // Achievement checking
    try{
      const allSessions=JSON.parse(localStorage.getItem("orivox_sessions")||"[]");
      const unlocked=checkNewAchievements(allSessions,savedSession||{});
      if(unlocked.length>0)setToastQueue(prev=>[...prev,...unlocked]);
    }catch{}
    checkVoiceType().catch(()=>{});
  };

  const checkVoiceType=async()=>{
    if(localStorage.getItem("orivox_voice_type"))return;
    const sessions=JSON.parse(localStorage.getItem("orivox_sessions")||"[]");
    if(sessions.length<5)return;
    const last5=sessions.slice(-5);
    const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({classifyVoiceType:true,sessions:last5})});
    if(res.ok){
      const data=await res.json();
      if(data.type){
        localStorage.setItem("orivox_voice_type",JSON.stringify(data));
        setVoiceTypeData(data);setShowVoiceTypeModal(true);
      }
    }
  };

  const tryAgain=()=>{
    const words=(feedback?.cleanedTranscript||transcript).trim().split(/\s+/).filter(Boolean).length;
    const dur=earlyStopRef.current&&earlyStopElapsedRef.current>0?earlyStopElapsedRef.current:speakTime;
    const wpm=dur>0?Math.round((words/dur)*60):0;
    localStorage.setItem("orivox_retry_source",JSON.stringify({
      score:feedback?.totalScore||0,
      fillerCount:Object.values(feedback?.fillerWordList||{}).reduce((a,b)=>a+b,0),
      wpm,
      improvement:feedback?.improvement||""
    }));
    setRetrySource(null);
    setFeedback(null);setAudioBlob(null);setTranscript("");setAudioUrl(null);transcriptRef.current="";
    earlyStopRef.current=false;earlyStopElapsedRef.current=0;
    setPhase("prep");setTimer(prepTime);initialTimeRef.current=prepTime;
    if(prepTime===0){setScreen("speak");setPhase("speak");setTimer(speakTime);initialTimeRef.current=speakTime;}
    else setScreen("prep");
  };

  const newPrompt=()=>{
    localStorage.removeItem("orivox_retry_source");setRetrySource(null);
    setFeedback(null);setAudioBlob(null);setTranscript("");setAudioUrl(null);transcriptRef.current="";
    earlyStopRef.current=false;earlyStopElapsedRef.current=0;
    if(activeCat!=="Custom"){
      const pool=activeCat==="Random"?ALL_PROMPTS:(TOPICS[activeCat]?.[activeDiff]||ALL_PROMPTS);
      const picked=randNew(pool,lastTopicRef.current);
      lastTopicRef.current=picked;setTopic(picked);
    }
    setPhase("prep");setTimer(prepTime);initialTimeRef.current=prepTime;
    if(prepTime===0){setScreen("speak");setPhase("speak");setTimer(speakTime);initialTimeRef.current=speakTime;}
    else setScreen("prep");
  };

  const reset=()=>{
    recognitionRef.current?.stop();recognitionRef.current=null;
    setScreen("home");setFeedback(null);setAudioBlob(null);setTranscript("");setRecording(false);setRunning(false);
    clearInterval(ivRef.current);
    if(audioUrl){URL.revokeObjectURL(audioUrl);setAudioUrl(null);}
  };

  const FloatDeco=()=>(
    <>
      <Star size={48} color="#F5C842" style={{position:"absolute",top:60,left:"4%",animation:"float 4s ease-in-out infinite",opacity:.95,willChange:"transform"}}/>
      <Star size={28} color="#FF6B2B" style={{position:"absolute",top:170,right:"4%",animation:"float 3.5s ease-in-out infinite",animationDelay:"1s",willChange:"transform"}}/>
      <Sparkle size={36} color="#2D7A4F" style={{position:"absolute",top:110,right:"16%",animation:"float 5.2s ease-in-out infinite",animationDelay:"0.5s",willChange:"transform"}}/>
      <Star size={20} color="#F5C842" style={{position:"absolute",top:300,left:"10%",animation:"float 4.5s ease-in-out infinite",animationDelay:"2s",willChange:"transform"}}/>
      <Sparkle size={30} color="#FF6B2B" style={{position:"absolute",bottom:210,left:"6%",animation:"float 3.8s ease-in-out infinite",animationDelay:"1.5s",willChange:"transform"}}/>
      <Star size={38} color="#2D7A4F" style={{position:"absolute",bottom:250,right:"5%",animation:"float 4.2s ease-in-out infinite",animationDelay:"0.8s",willChange:"transform"}}/>
      <Sparkle size={22} color="#F5C842" style={{position:"absolute",top:380,right:"19%",animation:"float 5.5s ease-in-out infinite",animationDelay:"3s",willChange:"transform"}}/>
      <Star size={16} color="#FF6B2B" style={{position:"absolute",top:450,left:"18%",animation:"float 6.8s ease-in-out infinite",animationDelay:"1.2s",willChange:"transform"}}/>
      <Sparkle size={26} color="#3B82F6" style={{position:"absolute",bottom:360,right:"11%",animation:"float 6s ease-in-out infinite",animationDelay:"2.5s",willChange:"transform"}}/>
      <Star size={42} color="#F5C842" style={{position:"absolute",bottom:130,left:"2%",animation:"float 3.5s ease-in-out infinite",animationDelay:"0.3s",opacity:.7,willChange:"transform"}}/>
      <Sparkle size={18} color="#2D7A4F" style={{position:"absolute",top:230,left:"24%",animation:"float 7s ease-in-out infinite",animationDelay:"1.8s",willChange:"transform"}}/>
    </>
  );

  return(
    <>
      <G/>
      <div style={{minHeight:"100vh",background:"var(--bg)",position:"relative",overflow:"hidden",paddingBottom:80}}>
        {/* dot grid BG */}
        <div style={{position:"fixed",inset:0,backgroundImage:"radial-gradient(circle,#E0CEBC 1px,transparent 1px)",backgroundSize:"30px 30px",opacity:.55,pointerEvents:"none",zIndex:0}}/>

        {/* Header */}
        <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,248,240,0.9)",backdropFilter:"blur(12px)",borderBottom:"2.5px solid var(--border)"}}>
          <div style={{padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>{reset();setMenuOpen(false)}}>
              <div style={{width:42,height:42,borderRadius:13,background:"var(--orange)",border:"2.5px solid var(--text)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"3px 3px 0 var(--text)"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              </div>
              <span className="fredoka" style={{fontSize:26,fontWeight:700,color:"var(--text)"}}>Orivox</span>
            </div>
            <div className="nav-links">
              {screen!=="home"&&<button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={reset}>← Home</button>}
              {["Progress","/progress","Leaderboard","/leaderboard","Reviews","/reviews","About","/about"].reduce((acc,v,i,a)=>i%2===0?[...acc,[a[i],a[i+1]]]:acc,[]).map(([label,href])=>(
                <Link key={href} href={href} style={{display:"inline-flex",alignItems:"center",padding:"8px 18px",borderRadius:50,fontFamily:"Fredoka, sans-serif",fontSize:14,fontWeight:600,border:"2px solid var(--border)",color:"var(--muted)",background:"var(--card)",textDecoration:"none",boxShadow:"2px 2px 0 var(--border)",transition:"all .18s",whiteSpace:"nowrap"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.color="var(--orange)";e.currentTarget.style.boxShadow="2px 2px 0 var(--orange)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";e.currentTarget.style.boxShadow="2px 2px 0 var(--border)"}}>
                  {label}
                </Link>
              ))}
            </div>
            <button className="hamburger-btn" onClick={e=>{e.stopPropagation();setMenuOpen(o=>!o)}} aria-label="Menu">
              {menuOpen
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><path d="M3 3l12 12M15 3L3 15"/></svg>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round"><path d="M2 4h14M2 9h14M2 14h14"/></svg>
              }
            </button>
          </div>
          {menuOpen&&(
            <div className="mob-menu" onClick={e=>e.stopPropagation()}>
              {screen!=="home"&&(
                <button className="mob-pill" style={{border:"2px solid var(--border)",cursor:"pointer"}} onClick={()=>{reset();setMenuOpen(false)}}>← Home</button>
              )}
              {["Progress","/progress","Leaderboard","/leaderboard","Reviews","/reviews","About","/about"].reduce((acc,v,i,a)=>i%2===0?[...acc,[a[i],a[i+1]]]:acc,[]).map(([label,href])=>(
                <Link key={href} href={href} className="mob-pill" onClick={()=>setMenuOpen(false)}>{label}</Link>
              ))}
            </div>
          )}
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
                  <h1 className="fredoka fadeUp" style={{fontSize:"clamp(62px,10vw,100px)",lineHeight:1,color:"var(--text)",letterSpacing:"-0.02em",animationDelay:".05s"}}>Speak up.</h1>
                  <div style={{display:"flex",justifyContent:"center",marginTop:-4,marginBottom:4}}><Squiggle width={340} color="var(--orange)"/></div>
                </div>
                <h1 className="fredoka fadeUp" style={{fontSize:"clamp(62px,10vw,100px)",lineHeight:1.1,color:"var(--orange)",letterSpacing:"-0.02em",display:"block",marginBottom:36,animationDelay:".28s"}}>Level up.</h1>
                <p className="fadeUp" style={{color:"var(--muted)",fontSize:19,maxWidth:480,margin:"0 auto",lineHeight:1.8,animationDelay:".35s"}}>Practice any speaking scenario and get instant AI feedback on clarity, structure, and filler words.</p>
              </div>

              {/* Prompt of the Day */}
              {(()=>{
                const ms=msTilMidnight();
                const h=Math.floor(ms/3600000);const m=Math.floor((ms%3600000)/60000);
                const countdown=h>0?`${h}h ${m}m`:`${m}m`;
                return(
                  <div className="card fadeUp d2" style={{padding:"clamp(16px,4vw,24px)",marginBottom:20,background:"var(--yellow-dim)",border:"2.5px solid var(--yellow)",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,right:0,width:72,height:72,background:"rgba(245,200,66,0.18)",borderRadius:"0 0 0 72px",pointerEvents:"none"}}/>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"#7A5500",background:"var(--yellow)",padding:"4px 12px",borderRadius:50,fontFamily:"Fredoka",whiteSpace:"nowrap"}}>Today's challenge</span>
                      <span style={{fontSize:12,color:"var(--muted)",marginLeft:"auto",whiteSpace:"nowrap"}}>Next in {countdown}</span>
                    </div>
                    <p className="fredoka" style={{fontSize:18,lineHeight:1.5,marginBottom:14,color:"var(--text)"}}>"{DAILY_PROMPT.text}"</p>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{background:DIFF_BG[DAILY_PROMPT.diff],color:DIFF_COLOR[DAILY_PROMPT.diff],border:`1.5px solid ${DIFF_COLOR[DAILY_PROMPT.diff]}60`,borderRadius:50,padding:"3px 12px",fontSize:12,fontFamily:"Fredoka",fontWeight:600}}>{DAILY_PROMPT.diff}</span>
                      <span style={{background:"var(--orange-dim)",color:"var(--orange)",border:"1.5px solid var(--orange-border)",borderRadius:50,padding:"3px 12px",fontSize:12,fontFamily:"Fredoka",fontWeight:600}}>{DAILY_PROMPT.cat}</span>
                      <button className="btn btn-orange" style={{marginLeft:"auto",padding:"8px 18px",fontSize:14}} onClick={()=>startSession(DAILY_PROMPT)}>Try this prompt</button>
                    </div>
                  </div>
                );
              })()}

              {/* Setup card */}
              <div className="card fadeUp d3" style={{padding:"clamp(20px,5vw,40px)",marginBottom:20}}>
                {/* Category */}
                <div style={{marginBottom:36}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <span className="fredoka" style={{fontSize:20}}>Pick a category</span>
                    <Star size={20} color="#F5C842"/>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                    {CATS.map(c=><button key={c} className={`chip ${cat===c?"active":""}`} onClick={()=>{setCat(c);setCustomErr("");}}>{c}</button>)}
                    <button className={`chip ${cat==="Random"?"active":""}`} onClick={()=>{setCat("Random");setCustomErr("");}}>Random</button>
                    <button className={`chip ${cat==="Custom"?"active":""}`} onClick={()=>{setCat("Custom");setCustomErr("");}}>Custom</button>
                  </div>
                </div>
                {/* Custom prompt textarea */}
                {cat==="Custom"&&(
                  <div style={{marginBottom:36}}>
                    <div style={{position:"relative"}}>
                      <textarea
                        value={customText}
                        onChange={e=>{if(e.target.value.length<=300){setCustomText(e.target.value);setCustomErr("");}}}
                        placeholder="Describe your scenario, e.g. Explain my startup idea to a skeptical investor, or Practice asking my boss for a raise"
                        rows={3}
                        style={{width:"100%",padding:"12px 16px 28px",borderRadius:14,border:`2px solid ${customErr?"var(--red)":"var(--border)"}`,fontSize:15,fontFamily:"Nunito,sans-serif",outline:"none",background:"var(--bg)",color:"var(--text)",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,transition:"border-color .2s"}}
                      />
                      <span style={{position:"absolute",bottom:10,right:14,fontSize:12,color:customText.length>270?"var(--red)":"var(--muted)",pointerEvents:"none"}}>{300-customText.length}</span>
                    </div>
                    {customErr&&<p style={{color:"var(--red)",fontSize:13,marginTop:6,fontWeight:600}}>{customErr}</p>}
                    {recentCustoms.length>0&&(
                      <div style={{marginTop:14}}>
                        <p style={{fontSize:12,color:"var(--muted)",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>Recent custom prompts</p>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {recentCustoms.map((r,i)=>(
                            <button key={i} onClick={()=>{setCustomText(r);setCustomErr("");}}
                              style={{textAlign:"left",padding:"9px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--cream)",fontSize:13,color:"var(--text)",cursor:"pointer",fontFamily:"Nunito,sans-serif",lineHeight:1.5,transition:"border-color .15s"}}
                              onMouseOver={e=>e.currentTarget.style.borderColor="var(--orange)"}
                              onMouseOut={e=>e.currentTarget.style.borderColor="var(--border)"}>
                              {r.length>90?r.slice(0,90)+"…":r}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Difficulty — hidden for Custom */}
                {cat!=="Custom"&&(
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
                )}
                {/* Question Type — Case Competition only */}
                {cat==="Case Competition"&&(
                  <div style={{marginBottom:36}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                      <span className="fredoka" style={{fontSize:20}}>Question Type</span>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                      {["General Q&A","Recommendations","Risks and Mitigations","Financials"].map(t=>(
                        <button key={t} className={`chip ${caseType===t?"active":""}`} onClick={()=>setCaseType(t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                )}
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
                <button className="btn btn-orange btn-bounce letsgo-btn" style={{width:"100%",justifyContent:"center",padding:"18px",fontSize:22}} onClick={()=>startSession()}>Let's Go!</button>
              </div>

              {/* Feature strip */}
              <div className="fadeUp d4" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
                {[["Record","Mic-based practice"],["AI Feedback","Real-time analysis"],["Score","Detailed breakdown"]].map(([t,s])=>(
                  <div key={t} className="card" style={{padding:"24px 16px",textAlign:"center"}}>
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
                    {activeCat!=="Custom"&&<span style={{background:DIFF_BG[activeDiff],color:DIFF_COLOR[activeDiff],border:`2px solid ${DIFF_COLOR[activeDiff]}50`,borderRadius:50,padding:"4px 14px",fontSize:13,fontFamily:"Fredoka",fontWeight:600}}>{activeDiff}</span>}
                    <span style={{background:"var(--orange-dim)",color:"var(--orange)",border:"2px solid var(--orange-border)",borderRadius:50,padding:"4px 14px",fontSize:13,fontFamily:"Fredoka",fontWeight:600}}>{activeCat}</span>
                  </div>
                  <h2 className="fredoka" style={{fontSize:30}}>Prep Time!</h2>
                </div>
              </div>

              <div className="card fadeUp d1" style={{padding:28,marginBottom:20,borderLeft:"6px solid var(--orange)",position:"relative"}}>
                <p style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Your prompt</p>
                <p className="fredoka" style={{fontSize:24,lineHeight:1.4,marginBottom:16}}>"{activeCat==="Custom"?topic:displayedTopic}"</p>
                {activeCat!=="Custom"&&<button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={pickTopic}>↻ New topic</button>}
              </div>

              <div className="card fadeUp d2" style={{textAlign:"center",padding:"44px 32px",marginBottom:20}}>
                <div style={{fontSize:90,fontWeight:700,fontFamily:"Fredoka",lineHeight:1,letterSpacing:"-0.03em",color:timer<10?"var(--red)":"var(--text)"}}>{fmt(timer)}</div>
                <div style={{color:"var(--muted)",fontSize:16,marginTop:8,fontFamily:"Fredoka"}}>prep time remaining</div>
              </div>

              <div className="fadeUp d3" style={{display:"flex",gap:12}}>
                {!running
                  ?<button className="btn btn-orange" style={{flex:1,justifyContent:"center",padding:"15px",fontSize:18}} onClick={()=>{startTimeRef.current=Date.now()-((initialTimeRef.current-timer)*1000);setRunning(true);}}>Start Timer</button>
                  :<button className="btn btn-cream" style={{flex:1,justifyContent:"center"}} onClick={()=>setRunning(false)}>Pause</button>
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
                <p className="fredoka" style={{fontSize:20,lineHeight:1.5,marginBottom:recording?0:14}}>"{activeCat==="Custom"?topic:displayedTopic}"</p>
                {!recording&&activeCat!=="Custom"&&<button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={pickTopic}>↻ New topic</button>}
              </div>

              <div ref={timerCardRef} className="card fadeUp d2" style={{padding:"48px 32px",marginBottom:20,border:recording?"2.5px solid transparent":"2.5px solid var(--border)",transition:"border-color .3s",position:"relative",overflow:"visible"}}>
                <BorderTimer containerRef={timerCardRef} startTimeRef={startTimeRef} durationSecs={speakTime} active={recording}/>
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
                <div key={timer} className="timer-tick" style={{fontSize:96,fontWeight:700,fontFamily:"Fredoka",lineHeight:1,letterSpacing:"-0.03em",color:timer<10?"var(--red)":timer<30?"#CC6600":"var(--text)"}}>{fmt(timer)}</div>
                <div style={{color:"var(--muted)",fontFamily:"Fredoka",fontSize:17,margin:"10px 0 22px"}}>speaking time remaining</div>
                <div style={{display:"flex",justifyContent:"center"}}><WaveViz active={recording} analyserNode={analyserNode}/></div>
              </div>

              <div className="fadeUp d3">
                {!recording
                  ?<button className="btn btn-orange" style={{width:"100%",justifyContent:"center",padding:"17px",fontSize:20}} onClick={startMic} disabled={micStarting}>{micStarting?"Starting...":"Start Recording"}</button>
                  :<div style={{textAlign:"center"}}>
                    <div style={{padding:"14px 20px",borderRadius:50,background:"var(--red-dim)",border:"2px solid var(--red)",fontFamily:"Fredoka",fontSize:16,color:"var(--red)",fontWeight:600,marginBottom:10}}>Timer ends automatically</div>
                    <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"var(--muted)",fontFamily:"Nunito,sans-serif",textDecoration:"underline",padding:0}} onClick={()=>doStop(true)}>Stop early (not recommended)</button>
                  </div>
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

              {!loading&&feedback&&!feedback.error&&(()=>{
                const displayScore=feedback.totalScore||0;
                return(
                <div>
                  {/* Before & After comparison */}
                  {retrySource&&(()=>{
                    const curWords=(feedback.cleanedTranscript||transcript).trim().split(/\s+/).filter(Boolean).length;
                    const curDur=earlyStopRef.current&&earlyStopElapsedRef.current>0?earlyStopElapsedRef.current:speakTime;
                    const curWpm=curDur>0?Math.round((curWords/curDur)*60):0;
                    const curFill=Object.values(feedback.fillerWordList||{}).reduce((a,b)=>a+b,0);
                    const scoreDiff=displayScore-retrySource.score;
                    const fillDiff=curFill-retrySource.fillerCount;
                    const wpmDiff=curWpm-retrySource.wpm;
                    const improved=scoreDiff>=0;
                    return(
                      <div className="card fadeUp" style={{marginBottom:20,padding:28,border:`2.5px solid ${improved?"var(--green)":"var(--orange)"}`,borderTop:`5px solid ${improved?"var(--green)":"var(--orange)"}`}}>
                        <p className="fredoka" style={{fontSize:18,marginBottom:16,color:improved?"var(--green)":"var(--orange)"}}>Before vs After</p>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                          {[["Previous",retrySource.score,retrySource.fillerCount,retrySource.wpm],["This attempt",displayScore,curFill,curWpm]].map(([label,score,fill,wpm],i)=>(
                            <div key={i} style={{background:"var(--cream)",borderRadius:12,padding:"14px 16px",border:"1.5px solid var(--border)"}}>
                              <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"var(--muted)",marginBottom:10}}>{label}</p>
                              <p className="fredoka" style={{fontSize:28,color:i===1?(score>retrySource.score?"var(--green)":score<retrySource.score?"var(--red)":"var(--text)"):"var(--muted)",marginBottom:4}}>{score}</p>
                              <p style={{fontSize:13,color:"var(--muted)"}}>{fill} filler{fill!==1?"s":""} · {wpm} WPM</p>
                            </div>
                          ))}
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                          {[
                            [scoreDiff,`Score ${scoreDiff>=0?"+":""}${scoreDiff} points`],
                            [-fillDiff,`Filler words ${fillDiff<=0?"cut by "+Math.abs(fillDiff):"+"+fillDiff}`],
                            [wpmDiff,`Pace ${wpmDiff>=0?"+":""}${wpmDiff} WPM`],
                          ].map(([val,label],i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:val>0?"var(--green)":val<0?"var(--red)":"var(--muted)"}}>
                              <span style={{fontWeight:700}}>{val>0?"↑":val<0?"↓":"→"}</span>{label}
                            </div>
                          ))}
                        </div>
                        <p style={{fontSize:14,fontWeight:700,color:improved?"var(--green)":"var(--orange)"}}>
                          {improved?"Real improvement in one attempt":"Scores fluctuate — the practice still counts"}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Score hero */}
                  <div className="card fb1" style={{textAlign:"center",padding:"48px 32px",marginBottom:20,position:"relative",overflow:"visible",borderTop:`6px solid ${displayScore>=80?"var(--green)":displayScore>=60?"var(--yellow)":"var(--red)"}`}}>
                    <Confetti active={true}/>
                    <CelebStars show={displayScore>=80}/>
                    <div style={{position:"absolute",top:16,right:16}}><Star size={32} color="#F5C842"/></div>
                    <div style={{position:"absolute",top:20,left:20}}><Sparkle size={26} color="var(--orange)"/></div>
                    <h2 className="fredoka" style={{fontSize:28,color:"var(--text)",marginBottom:16}}>
                      {displayScore>=80?"Crushed it":displayScore>=60?"Nice work":"Keep going — it gets easier"}
                    </h2>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:28}}><ScoreRing score={displayScore} size={160}/></div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
                      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 28px",borderRadius:50,
                        background:displayScore>=80?"var(--green)":displayScore>=60?"var(--yellow-dim)":"var(--red-dim)",
                        border:`2px solid ${displayScore>=80?"var(--green)":displayScore>=60?"var(--yellow)":"var(--red)"}`,
                        color:displayScore>=80?"white":displayScore>=60?"#7A5500":"var(--red)",
                        fontFamily:"Fredoka",fontSize:18,fontWeight:600}}>
                        {displayScore>=80?"Excellent":displayScore>=60?"Good Job":"Keep Practicing"}
                      </div>
                      <ShareCard score={displayScore} category={activeCat} difficulty={activeDiff} strength={feedback.strength||""}/>
                    </div>
                  </div>

                  {/* Sub scores — 4 categories out of 25 */}
                  <div className="fb2 scores-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                    <SubBar label="Clarity" val={feedback.clarity} max={25} color="#3B82F6" bg="#EFF6FF"/>
                    <SubBar label="Structure" val={feedback.structure} max={25} color="var(--orange)" bg="var(--orange-dim)"/>
                    <SubBar label="Delivery" val={feedback.fillerWords} max={25} color="var(--green)" bg="#E8F7EE"/>
                    <SubBar label="Confidence" val={feedback.confidence} max={25} color="#8B5CF6" bg="#F5F3FF"/>
                  </div>

                  {/* WPM metric */}
                  {(()=>{
                    const words=(feedback.cleanedTranscript||transcript).trim().split(/\s+/).filter(Boolean).length;
                    const dur=earlyStopRef.current&&earlyStopElapsedRef.current>0?earlyStopElapsedRef.current:speakTime;
                    const wpm=dur>0?Math.round((words/dur)*60):0;
                    if(!wpm)return null;
                    const pace=wpm<110?{label:"Too slow — try to speak more naturally",color:"var(--red)"}
                      :wpm<130?{label:"Slightly slow — good for clarity",color:"#CC6600"}
                      :wpm<=160?{label:"Ideal pace — clear and engaging",color:"var(--green)"}
                      :wpm<=180?{label:"Slightly fast — slow down a little",color:"#CC6600"}
                      :{label:"Too fast — your audience will struggle to follow",color:"var(--red)"};
                    return(
                      <div className="card fb3" style={{padding:28,marginBottom:20,borderLeft:`5px solid ${pace.color}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                          <div>
                            <p className="fredoka" style={{fontSize:19,marginBottom:4}}>Speaking Pace</p>
                            <p style={{fontSize:13,color:"var(--muted)"}}>Ideal: 130–160 WPM</p>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <span className="fredoka" style={{fontSize:38,color:pace.color,lineHeight:1}}>{wpm}</span>
                            <span style={{fontSize:14,color:"var(--muted)",marginLeft:4}}>WPM</span>
                          </div>
                        </div>
                        <p style={{marginTop:10,fontSize:14,color:pace.color,fontWeight:600}}>{pace.label}</p>
                      </div>
                    );
                  })()}

                  {/* Filler word callouts */}
                  <div className="card fb3" style={{padding:28,marginBottom:20,borderLeft:`5px solid ${Object.keys(feedback.fillerWordList||{}).length===0?"var(--green)":"var(--red)"}`}}>
                    <p className="fredoka" style={{fontSize:19,marginBottom:16}}>Filler Words</p>
                    {Object.keys(feedback.fillerWordList||{}).length===0?(
                      <p style={{color:"var(--green)",fontSize:15,fontWeight:600}}>Clean delivery — no filler words detected</p>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {Object.entries(feedback.fillerWordList).sort((a,b)=>b[1]-a[1]).map(([word,count])=>(
                          <div key={word} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderRadius:12,background:"var(--red-dim)",border:"1.5px solid rgba(232,64,64,.18)"}}>
                            <span style={{fontFamily:"Fredoka",fontSize:16,color:"var(--red)"}}>"{word}"</span>
                            <span style={{fontSize:14,color:"var(--red)",fontWeight:700}}>— {count} {count===1?"time":"times"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* What's working + Focus on this */}
                  <div className="fb4" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
                    <div className="card" style={{padding:28,borderTop:"5px solid var(--green)"}}>
                      <p className="fredoka" style={{fontSize:18,color:"var(--green)",marginBottom:14}}>✓ What's working</p>
                      <p style={{fontSize:15,lineHeight:1.7,color:"var(--text)"}}>{feedback.strength}</p>
                    </div>
                    <div className="card" style={{padding:28,borderTop:"5px solid var(--orange)"}}>
                      <p className="fredoka" style={{fontSize:18,color:"var(--orange)",marginBottom:14}}>↑ Focus on this</p>
                      <p style={{fontSize:15,lineHeight:1.7,color:"var(--text)"}}>{feedback.improvement}</p>
                    </div>
                  </div>

                  {/* Coach's Note — AI-generated specific feedback */}
                  {feedback.feedback&&(
                    <div className="card fb5" style={{padding:28,marginBottom:20,background:"var(--yellow-dim)",border:"2.5px solid var(--yellow)",borderRadius:22}}>
                      <p className="fredoka" style={{fontSize:18,color:"#7A5500",marginBottom:8}}>Coach's Note</p>
                      <p style={{fontSize:15,lineHeight:1.8}}>{feedback.feedback}</p>
                    </div>
                  )}

                  {/* Transcript */}
                  {transcript&&(
                    <details className="card fb6" style={{marginBottom:20,padding:28,cursor:"pointer"}}>
                      <summary className="fredoka" style={{fontSize:16,color:"var(--muted)",userSelect:"none"}}>View transcript ▾</summary>
                      <div style={{marginTop:16}}>
                        {Object.keys(feedback.fillerWordList||{}).length>0&&(
                          <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,fontStyle:"italic"}}>Highlighted words are filler words detected in your speech</p>
                        )}
                        {(feedback.cleanedTranscript||transcript).split(/\n+/).map((para,i)=>(
                          <p key={i} style={{fontSize:14,lineHeight:1.9,opacity:.85,marginBottom:12}}>
                            <HighlightedTranscript text={para} fillerWords={feedback.fillerWordList}/>
                          </p>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* Audio */}
                  {audioUrl&&(
                    <div className="card fb7" style={{padding:28,marginBottom:20}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                        <span className="fredoka" style={{fontSize:17,color:"var(--muted)"}}>Your Recording</span>
                      </div>
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
                  <div className="fb7" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                    <button className="btn btn-orange" style={{justifyContent:"center",padding:"15px",fontSize:17}} onClick={tryAgain}>Try Again</button>
                    <button className="btn btn-cream" style={{justifyContent:"center",padding:"15px"}} onClick={newPrompt}>New Prompt</button>
                    <button className="btn btn-cream" style={{justifyContent:"center",gridColumn:"1/-1"}} onClick={()=>{localStorage.removeItem("orivox_retry_source");setRetrySource(null);reset();}}>Change Category</button>
                  </div>

                </div>
                );
              })()}

              {!loading&&feedback?.error&&(
                <div className="card fadeUp" style={{textAlign:"center",padding:48}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <p style={{color:"var(--red)",marginBottom:20,fontFamily:"Fredoka",fontSize:18}}>{feedback.error}</p>
                  <button className="btn btn-cream" onClick={reset}>Go back</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Achievement toast */}
      {toastQueue.length>0&&(()=>{
        const ach=toastQueue[0];
        const paths=Array.isArray(ach.path)?ach.path:[ach.path];
        return(
          <div style={{position:"fixed",top:20,right:20,zIndex:4000,display:"flex",flexDirection:"column",gap:10,pointerEvents:"none"}}>
            <div style={{
              background:"#1A1A2E",color:"#fff",borderRadius:16,padding:"14px 18px",
              boxShadow:"0 8px 32px rgba(0,0,0,0.35)",display:"flex",alignItems:"center",gap:14,
              border:"2px solid var(--orange)",minWidth:260,maxWidth:320,
              animation:"toastSlideIn .38s cubic-bezier(.22,.68,0,1.3)",
            }}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,107,43,.15)",border:"2px solid var(--orange)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {paths.map((d,i)=><path key={i} d={d}/>)}
                </svg>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"var(--orange)",marginBottom:2}}>Achievement Unlocked</div>
                <div style={{fontFamily:"Fredoka, sans-serif",fontSize:17,fontWeight:600,color:"#fff"}}>{ach.name}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:1}}>{ach.desc}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* First-visit name modal */}
      {showNameModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"var(--card)",borderRadius:24,border:"2.5px solid var(--border)",boxShadow:"8px 8px 0 rgba(0,0,0,0.18)",padding:36,maxWidth:420,width:"100%",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"var(--orange-dim)",border:"2.5px solid var(--orange-border)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </div>
            <h2 className="fredoka" style={{fontSize:24,marginBottom:8}}>What should we call you?</h2>
            <p style={{color:"var(--muted)",fontSize:14,marginBottom:24,lineHeight:1.6}}>Your name appears next to your scores. You can change it any time on the leaderboard page.</p>
            <input value={nameInput} onChange={e=>{setNameInput(e.target.value);setNameError("");}}
              onKeyDown={e=>e.key==="Enter"&&handleSaveName()}
              placeholder="Your name" maxLength={30} autoFocus
              style={{width:"100%",padding:"12px 16px",borderRadius:12,border:`2px solid ${nameError?"var(--red)":"var(--border)"}`,fontSize:16,fontFamily:"Nunito,sans-serif",outline:"none",background:"var(--bg)",color:"var(--text)",marginBottom:nameError?6:12,boxSizing:"border-box"}}/>
            {nameError&&<p style={{color:"var(--red)",fontSize:13,marginBottom:10,textAlign:"left"}}>{nameError}</p>}
            <button className="btn btn-orange" style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:17,marginBottom:10}} onClick={()=>handleSaveName()}>
              Let's go
            </button>
            <button style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--muted)",fontFamily:"Nunito,sans-serif",textDecoration:"underline",padding:"4px"}} onClick={()=>handleSaveName("Anonymous")}>
              Stay anonymous
            </button>
          </div>
        </div>
      )}

      {/* Voice Type reveal modal */}
      {showVoiceTypeModal&&voiceTypeData&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
          <div style={{background:"var(--card)",borderRadius:28,border:"3px solid var(--orange)",boxShadow:"12px 12px 0 rgba(0,0,0,0.28)",padding:"36px 28px",maxWidth:460,width:"100%",textAlign:"center",position:"relative",margin:"auto"}}>
            <p style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--orange)",marginBottom:10,fontFamily:"Fredoka"}}>Unlocked after 5 sessions</p>
            <p style={{fontSize:14,color:"var(--muted)",marginBottom:6}}>Your Speaking Type</p>
            <h2 className="fredoka" style={{fontSize:38,marginBottom:8,color:"var(--text)"}}>{voiceTypeData.type}</h2>
            <p style={{fontSize:16,color:"var(--muted)",marginBottom:24,fontStyle:"italic",lineHeight:1.5}}>"{voiceTypeData.tagline}"</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14,textAlign:"left"}}>
              <div style={{background:"#E8F7EE",borderRadius:14,padding:"14px 15px"}}>
                <p style={{fontSize:11,fontWeight:700,color:"var(--green)",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Strength</p>
                <p style={{fontSize:13,color:"var(--text)",lineHeight:1.5}}>{voiceTypeData.strengths}</p>
              </div>
              <div style={{background:"var(--orange-dim)",borderRadius:14,padding:"14px 15px"}}>
                <p style={{fontSize:11,fontWeight:700,color:"var(--orange)",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Work On</p>
                <p style={{fontSize:13,color:"var(--text)",lineHeight:1.5}}>{voiceTypeData.weakness}</p>
              </div>
            </div>
            <div style={{background:"var(--yellow-dim)",border:"2px solid var(--yellow)",borderRadius:14,padding:"14px 15px",marginBottom:24,textAlign:"left"}}>
              <p style={{fontSize:11,fontWeight:700,color:"#7A5500",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Your Tip</p>
              <p style={{fontSize:14,color:"var(--text)",lineHeight:1.6}}>{voiceTypeData.tip}</p>
            </div>
            <div style={{display:"flex",gap:10}}>
              <VoiceTypeCard data={voiceTypeData}/>
              <button className="btn btn-cream" style={{flex:1,justifyContent:"center"}} onClick={()=>setShowVoiceTypeModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* One-time review modal */}
      {showReviewModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={closeReviewModal}>
          <div style={{background:"var(--card)",borderRadius:24,border:"2.5px solid var(--border)",boxShadow:"8px 8px 0 rgba(0,0,0,0.18)",padding:32,maxWidth:440,width:"100%",position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",padding:6,lineHeight:0}} onClick={closeReviewModal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <ReviewPrompt onSubmit={closeReviewModal} initialName={username}/>
          </div>
        </div>
      )}
    </>
  );
}
