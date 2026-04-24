"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

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
    @keyframes urgentPulse{from{opacity:.15}to{opacity:.4}}

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
  General:{
    Easy:["What is your favorite season and why?","Describe your morning routine","What is a hobby you enjoy and how did you get into it?","What is your favorite meal and what makes it special?","Describe your ideal weekend","What is something you are genuinely good at?","What do you do to relax after a long day?","Describe the best gift you have ever received","What is something people would be surprised to learn about you?","What is your go-to comfort food and why?","Describe a typical evening at home","What is your favorite way to spend a Sunday?","Talk about a skill you want to learn","What small thing makes you happy every day?","Describe your favorite place to hang out","What is one thing you would change about your daily routine?","Talk about a book, show, or movie you enjoyed recently","Describe something you have been doing since you were a kid","What is something you always look forward to each week?","Describe a recent moment that made you smile","What do you like most about where you live?","Talk about a time you tried a new food and loved it","What is your favorite way to celebrate something good?","Describe what a perfect morning looks like for you","Talk about someone in your life who always makes you laugh"],
    Medium:["What is the most important skill a person can develop?","How do you define success?","Should people follow their passion or follow the money?","What habit has had the biggest positive impact on your life?","What makes someone trustworthy?","How do you stay motivated when things get hard?","What role does luck play in success?","What is something you changed your mind about recently?","What is the difference between being busy and being productive?","Should people be more open about their personal struggles?","What makes a city a great place to live?","What is the most underrated quality in a person?","Should people always tell the truth?","How has a failure shaped who you are?","What does community mean to you?","How do you deal with uncertainty?","What makes a conversation truly memorable?","What does courage look like in everyday life?","How important is it to have a long-term plan?","Should people always follow the rules?","What is something you do differently than most people?","What is the best advice you have ever received?","How do you think about risk?","What does it mean to live a good life?","What is something the world needs more of?"],
    Hard:["How has technology fundamentally altered human attention and the way we form beliefs?","Is it possible for any society to achieve true equality of opportunity?","How should individuals balance personal freedom against collective responsibility?","What is the relationship between comfort and genuine personal growth?","What does it mean to live authentically in a world that rewards conformity?","How will artificial intelligence reshape what it means to be human?","Is the pursuit of happiness a worthy life goal or a distraction from meaning?","What is the relationship between language and the limits of what we can think?","Should people be judged by their past choices or only their present ones?","How do you weigh individual rights against the common good?","Is moral progress real or simply a shift in social consensus?","What does it mean to think for yourself in an age of algorithmic influence?","How do you define the line between perseverance and self-destructive stubbornness?","Can a society be both truly meritocratic and genuinely compassionate?","How do you reconcile the desire for security with the need for growth?","What does it mean to leave the world better than you found it?","How do you think about your responsibility to people you will never meet?","Is human nature fundamentally selfish or cooperative and why does it matter?","How do you think about the relationship between individual choices and systemic outcomes?","What would a genuinely just society look like and how far are we from it?","How does where you grow up shape the limits of what you believe is possible?","What is the relationship between suffering and the development of character?","How do you think about truth in a world where everyone has access to contradictory information?","What is the cost of never being bored in an age of infinite entertainment?","How should we think about our obligations to future generations?"],
  },
  Social:{
    Easy:["How do you introduce yourself to someone new?","What do you say when you do not know what to say in a conversation?","How do you start a conversation with a stranger at an event?","What do you do when there is an awkward silence?","How do you respond to a compliment you were not expecting?","Describe how you would greet someone you admire for the first time","How do you keep a conversation going with someone you just met?","What do you say when someone asks what you do for a living?","How do you politely end a conversation that has run its course?","Describe your approach to making a good first impression at work","How do you remember someone's name after meeting them?","What do you do when you accidentally say something that lands awkwardly?","How do you politely ask someone to repeat themselves?","What is your approach to small talk and why?","How do you respond when someone shares exciting news with you?","Describe how you would introduce two friends to each other","How do you ask for help when you need it?","What do you say when you are running late?","How do you respond when someone gives you feedback you did not ask for?","Describe how you would handle being approached by someone very talkative when you are busy","How do you show someone you are genuinely listening to them?","What do you do when you realize you have forgotten someone's name?","Describe how you handle meeting your partner's friends for the first time","How do you respond when someone makes a joke at your expense?","What is your approach to texting someone back when you have left them on read by accident?"],
    Medium:["How do you handle conflict with a close friend?","What is your approach to giving someone difficult feedback?","How do you set limits with people in a kind way?","Describe how you would handle a friend who constantly cancels plans","How do you say no to someone without damaging the relationship?","What do you do when someone is venting to you and you do not know what to say?","How do you reconnect with someone you have lost touch with?","What do you do when someone says something that offends you?","How do you support a friend who is going through something hard?","Describe your approach to asking someone for a significant favor","How do you handle receiving criticism in front of other people?","What do you do when a conversation becomes completely one-sided?","How do you approach building trust with someone who is naturally guarded?","How do you handle being excluded from a group without making it worse?","Describe how you would navigate a conversation that turns political at a family dinner","How do you make someone who is shy feel genuinely comfortable around you?","What do you do when you realize you have made someone feel bad unintentionally?","How do you handle someone who constantly one-ups your stories?","Describe your strategy for remembering details about people you have just met","How do you approach giving a toast at a celebration in front of people you barely know?","What do you do when someone takes credit for your idea in a group setting?","How do you handle a conversation that is escalating emotionally?","Describe how you would approach someone you need to apologize to","What do you do when you feel left out of a conversation you are physically part of?","How do you maintain friendships when your lives have gone in very different directions?"],
    Hard:["How do you navigate a friendship where your core values have fundamentally diverged?","Describe how you would mediate a serious conflict between two people you both care about","How do you maintain authenticity while adapting to very different social environments?","What do you do when someone you respect holds views you find genuinely harmful?","How do you build trust with someone who has every reason not to trust you?","Describe how you would handle discovering that a close friend has been dishonest with you for years","How do you show up for someone who is actively pushing you away during a crisis?","What do you do when your honesty could seriously damage a relationship you value?","Describe how you would give meaningful feedback to someone who is extremely defensive","How do you maintain a relationship with someone who hurt you but has never acknowledged it?","What do you do when someone confides something that puts you in a genuine ethical dilemma?","Describe how you navigate being the clear outsider in an established social group","How do you handle a situation where two people you love are asking you to choose sides?","What do you do when a group you belong to starts behaving in ways that conflict with your values?","How do you repair trust after you have been the one to break it?","Describe how you handle someone who is emotionally manipulative but does not seem to know it","How do you hold someone accountable for their behavior without it becoming a confrontation?","Describe the most complex social situation you have had to navigate and what it required of you","How do you handle being in a position of authority over someone who resents you for it?","What do you do when being kind and being honest directly contradict each other?","How do you support someone who is making a serious mistake without alienating them?","Describe how you would handle a mentor or role model who disappoints you significantly","How do you stay present in a conversation when you genuinely disagree with almost everything being said?","What does it look like to truly forgive someone and how do you get there?","How do you build a genuine connection with someone whose life experience is completely different from yours?"],
  },
  Storytelling:{
    Easy:["Tell a story about your favorite childhood birthday","Describe a funny thing that happened to you recently","Tell a story about learning to do something for the first time","Describe a time you got completely lost and what happened","Tell a story about a family holiday or tradition that means something to you","Describe the best meal you have ever eaten","Tell a story about a time you were genuinely surprised by something","Describe a funny misunderstanding you were part of","Tell a story about your first day somewhere completely new","Describe a time you made a new friend in an unexpected place","Tell a story about a pet doing something unforgettable","Describe a time when something went completely wrong but turned out fine","Tell a story about a time you received help you did not expect","Describe your most memorable teacher and one thing they said that stuck with you","Tell a story about a time you tried something new and loved it","Describe a rainy day memory that stays with you for some reason","Tell a story about a time you laughed until you cried","Describe a moment when a complete stranger was kind to you","Tell a story about your most memorable journey or road trip","Describe a time you tried to cook something and it went spectacularly wrong","Tell a story about a time you stayed up too late for a completely good reason","Describe a childhood game or activity you took very seriously","Tell a story about a time you accidentally eavesdropped on something","Describe the most unexpected thing that happened to you last year","Tell a story about a time you were completely wrong about someone"],
    Medium:["Tell a story about a moment that changed how you see the world","Describe a time you had to be brave when you did not feel ready","Tell a story about a risk you took that actually paid off","Describe a friendship that taught you something important about yourself","Tell a story about a time you failed and what you carried away from it","Describe a moment when you realized someone you admired was flawed","Tell a story about a time you had to make a genuinely hard decision","Describe a period of your life that tested you and how you came through it","Tell a story about a time you completely misjudged someone","Describe a moment when silence communicated more than words could","Tell a story about a goal you worked toward for a long time","Describe a time you had to start something over from nothing","Tell a story about a moment when you felt completely out of your depth","Describe a time you had to say goodbye to something that mattered","Tell a story about a tradition or ritual that still means a lot to you","Describe a conversation that completely shifted your perspective on something","Tell a story about a time you chose the harder but right path","Describe a moment when you were surprised by your own strength","Tell a story about a time you had to fully trust another person","Describe a moment that made you realize what actually matters to you","Tell a story about a time you were in the right place at exactly the right moment","Describe a relationship that changed you in ways you did not expect","Tell a story about a time you asked for something difficult and how it went","Describe a moment when you had to let go of something you wanted badly","Tell a story about someone who changed the direction of your life without knowing it"],
    Hard:["Tell a story about the moment your worldview fundamentally shifted and why it has never gone back","Describe a time you were confronted with your own capacity for behavior you did not think yourself capable of","Tell a story that captures the most complicated relationship in your life and what it revealed about human nature","Describe a decision you made that you will never fully know was right or wrong","Tell a story about a time when doing the right thing cost you something significant","Describe the moment you realized that your understanding of yourself had been fundamentally wrong","Tell a story about a relationship that ended in a way that still does not completely make sense to you","Describe a time when fear was the most rational response and how you handled it anyway","Tell a story about someone who believed in you before you gave them any reason to","Describe a moment when you had to let go of an identity that had defined you for years","Tell a story about a time you watched someone make a serious mistake and chose not to intervene","Describe the most important thing you have ever lost and what its absence has taught you","Tell a story about a time you were completely alone in a difficult moment and what it revealed","Describe a conversation you never had but still think about","Tell a story about a time you fought for something and lost and whether it was still worth it","Describe a moment where you had to choose between loyalty and honesty","Tell a story that reveals something true about human nature that most people prefer not to acknowledge","Describe the last time you were genuinely afraid and what it taught you about yourself","Tell a story about a time you had to hold two completely contradictory truths at the same time","Describe a moment when kindness from an unexpected source changed the direction of something important","Tell a story about a sacrifice you made and whether you would make it again knowing what you know now","Describe the hardest thing you have ever had to explain to someone you care about","Tell a story about a time you were certain you were right and turned out to be completely wrong","Describe a moment when you had to be the one who stayed calm when everything around you was not","Tell a story about the thing you are most proud of that almost no one knows about"],
  },
  Debate:{
    Easy:["Homework does more harm than good","School uniforms are a good idea","Animals should not be kept in zoos","Children should have less screen time","Junk food should not be sold in schools","Everyone should learn to cook","Sports should be mandatory in schools","Paper books are better than e-books","Fast food should be taxed more heavily","Video games can be genuinely educational","It is more important to be kind than to be right","Everyone should volunteer in their community","Children should learn a second language from the start","Recycling should be made compulsory","Pets make people's lives significantly better","Television is more harmful than helpful","Every student should have to learn a musical instrument","Public transport should be free","Going to university is not for everyone","It is better to live in a city than in the countryside","Everyone should learn basic first aid","Social media should require real names","Physical education should be the same as any academic subject","Libraries are still essential in the digital age","Children should have more unstructured free time"],
    Medium:["Social media does more harm than good","College degrees are no longer worth the cost","Working from home is better than working in an office","Cancel culture has gone too far","Standardized testing does not measure real intelligence","The four day work week should be the global standard","Nuclear energy is the best solution to the climate crisis","Children should not have smartphones before age 16","Giving to charity is a moral obligation","The rich should pay significantly higher taxes","Privacy is more important than national security","The death penalty should be abolished worldwide","Lying is sometimes the right thing to do","Climate change is the most urgent issue facing humanity","Art and music programs are just as important as STEM","Everyone should be required to do one year of community service","Online relationships can be just as meaningful as in person ones","Addiction should be treated as a health issue not a criminal one","Tourism does more harm than good","Beauty standards are genuinely harmful to society","Democracy is still the best system we have","Capitalism is the best economic system available","Athletes are paid too much","Technology is making us less human","The healthcare system should be free for everyone"],
    Hard:["Western liberal democracy is not the inevitable end point of political development","The concept of national identity does more harm than good in a globalized world","Individual liberty and collective security are fundamentally incompatible","Artificial intelligence will render human labor economically worthless within a generation","Capitalism is structurally incapable of solving the climate crisis","The internet has made people epistemically worse off despite providing access to more information","Genetic engineering of humans is not only ethical but morally required","Universal basic income would destroy more economic value than it creates","Meritocracy is a myth that legitimizes inequality rather than reduces it","Free speech absolutism is incompatible with a functioning democracy","The criminal justice system should be abolished and rebuilt from first principles","Economic growth and environmental sustainability are genuinely irreconcilable in the long run","Colonialism's legacy is the primary cause of persistent global inequality today","A post-scarcity society would eliminate much of what makes human life feel meaningful","The obligation to future generations outweighs the rights of people currently alive","Nation states should cede significant sovereignty to global institutions","Consciousness cannot be fully explained by physical processes","The philosophy of effective altruism is fundamentally flawed","Technological acceleration is outpacing our collective capacity for ethical governance","The traditional family unit is a barrier to genuine human flourishing","Social safety nets reduce the incentive to innovate and take risk","Surveillance capitalism represents a fundamental threat to human autonomy","The education system is designed to produce workers not thinkers","Organized religion has caused more harm than good across human history","Free markets consistently produce better outcomes than government planning"],
  },
  Business:{
    Easy:["What does good customer service look like to you?","Describe one business idea you have always thought could actually work","What makes a great team member?","How would you handle being assigned a task you do not know how to do?","What does professionalism mean to you?","Describe your approach to meeting a deadline under pressure","How do you handle making a mistake at work or school?","What would your ideal work environment look like?","Describe a skill that makes you valuable in any job","How do you stay organized when you have too much to do?","What is one way you would improve your school or current workplace?","How do you ask for help when you are genuinely stuck?","What does it mean to take real ownership of your work?","How would you deal with a difficult coworker?","What does it mean to be truly reliable at work?","How do you approach learning something completely new on the job?","Describe what strong leadership looks like in everyday situations","How would you motivate yourself on a day when you have no energy?","What is one quality every successful person seems to have?","How do you handle competing priorities when everything feels urgent?","Describe a time you had to figure something out without any guidance","What does it mean to go above and beyond in a role?","How do you build a good reputation in a new workplace?","Describe how you would handle being criticized for work you are proud of","What is the most important lesson you have learned from a job or internship?"],
    Medium:["How would you pitch your personal brand to a potential employer?","What is the biggest mistake entrepreneurs make and how do you avoid it?","Describe your strategy for getting your first 100 customers","How would you grow a small local business into a national brand?","What is your approach to hiring the right people?","How would you handle a difficult client who is never satisfied?","Describe how you would build trust with a new team you are leading","What makes a brand truly memorable and why?","How would you motivate a team that has lost confidence after a major failure?","Describe your approach to building a personal network from scratch","What is your strategy for retaining customers over the long term?","Describe the key elements of a compelling pitch to investors","What is the difference between a manager and a true leader?","How would you allocate a limited marketing budget for maximum impact?","What is the role of creativity in business success?","How would you respond if a direct competitor copied your product?","Describe how you would handle a product launch that completely flopped","What does it mean to build a company culture people genuinely love?","How would you negotiate a deal with someone who has significantly more leverage than you?","Describe how you would lead your team through a major organizational change","What is your strategy for entering a new market no one in your company knows well?","How would you handle discovering a serious problem that could damage your company's reputation?","Describe how you would mentor a junior employee with potential who lacks confidence","What does it take to build something that actually lasts?","How would you approach building a product for a market you know nothing about?"],
    Hard:["Your most profitable product line is also your most environmentally damaging. Walk through your complete decision-making process","You have six months of runway left. Your investors want a pivot but your team believes in the vision. What do you do and why?","Diagnose why a market leader with superior technology consistently loses to an inferior competitor","You have been asked to cut 30 percent of your workforce. Walk through how you would approach every dimension of this decision","A viral social media crisis is destroying your brand and the core allegation is partially true. Walk through your response","How would you size the global market for a product category that does not yet exist?","How would you disrupt an industry that has not meaningfully changed in three decades?","Your highest performing employee has been credibly accused of serious misconduct. Walk through your complete decision process","You have discovered your supply chain involves serious human rights violations at a third-tier supplier. What do you do?","How would you take a company that is profitable but stagnant and make it a genuine growth business again?","Your board wants to sell the company but you believe it is worth ten times the current offer. How do you make the case?","How do you price a revolutionary product when there is no comparable market reference point?","A new technology threatens to make your core business model obsolete within three years. What do you do today?","How would you design an incentive structure that aligns individual performance with long-term company health?","You are entering a market dominated by one player with vastly more resources than you. What is your strategy?","Describe how you would build trust with skeptical regulators while entering a new market","How do you build a global company while maintaining a coherent culture across radically different contexts?","Your company's growth depends on a single key partnership that is showing signs of serious deterioration. How do you respond?","How would you structure a merger between two companies with fundamentally incompatible cultures?","Describe how you would rebuild a brand that has catastrophically lost public trust","How would you handle a situation where following your company values would cost you a highly profitable contract?","What would a genuinely ethical tech company look like and how far is that from what exists today?","How do you build a business that creates real value rather than just extracting it?","Describe how you would build something significant with no money, no connections, and no track record","How would you identify and pursue an opportunity that everyone else in your industry is ignoring?"],
  },
  Motivational:{
    Easy:["What is one thing you are genuinely proud of yourself for?","Describe something you worked hard to learn this year","What keeps you going when you have a really difficult day?","Talk about something small that gives you energy","What is one goal you want to achieve in the next six months?","Describe a moment when you surprised yourself by what you could do","What is something positive you tell yourself when things are not going well?","Talk about a person in your life who genuinely makes you feel supported","What is one habit that helps you stay on track?","Describe a time you did something even though you were nervous","What does a genuinely good day look like for you?","Talk about something you are getting noticeably better at","What is one thing you would tell your younger self to stop worrying about?","Describe a recent small win that felt more meaningful than it probably looked","What is something you are grateful for that you rarely say out loud?","Talk about something you are doing right now that excites you","What is one thing that motivates you more than praise or recognition?","Describe a time you finished something you really wanted to quit","What does taking care of yourself actually look like for you in practice?","Talk about a person who has shown you what persistence looks like","What is something you said you could not do that you ended up doing?","Describe a time when things did not go to plan but you adjusted and kept going","What is one goal you have been putting off that you know you should start?","Talk about a moment when you helped someone and it meant more than you expected","Describe something you believe about yourself that most people underestimate"],
    Medium:["What drives you to get out of bed every morning?","Describe a moment when you refused to give up despite everything telling you to","Talk about a time you overcame something you genuinely thought would beat you","What is the one belief that keeps you going when things get genuinely hard?","What does resilience actually mean to you and how have you practiced it?","Talk about a person who inspires you and be specific about exactly why","Describe a turning point that made you measurably stronger","Talk about a goal you are chasing right now and why it actually matters","What does living with purpose look like in practice, not in theory?","Describe a time you chose the harder but clearly right path","What motivates you more — fear of failure or desire for success — and why?","Talk about a time a serious setback led to something better than the original plan","What does real discipline look like for you and how did you build it?","Describe a mentor who changed your path and what specifically they did differently","What is one habit that fundamentally changed your life and how long did it take?","Talk about a time you had to start over and what you chose to carry with you","Describe a moment when you deliberately chose growth over staying comfortable","What would you say to a younger version of yourself who was about to quit something important?","Describe how you keep going when nobody around you is cheering for you","Talk about a time you proved to yourself that you were more capable than you thought","What is something you sacrificed to become the person you are?","Describe a moment when you stepped up when nobody else was going to","What does courage look like in your actual daily life, not in extraordinary moments?","Talk about a time you had to be patient when everything in you wanted to act immediately","Describe the moment you decided to take something in your life seriously"],
    Hard:["How do you sustain genuine motivation when the goal is so far away that progress is completely invisible?","Describe the deepest moment of doubt you have faced and what actually kept you from stopping","What is the difference between the life you want and the life you are truly willing to build?","How do you reconcile real ambition with honest acceptance of what is beyond your control?","Talk about a time you achieved something significant and still felt empty and what that revealed","How do you think about legacy when the people you want to impact will never know your name?","Describe a belief you held about yourself that you had to completely dismantle before you could grow","What is your relationship with failure and how has that relationship changed over time?","How do you define greatness in a way that does not depend on other people's validation?","Talk about a sacrifice you made for a goal and make an honest case for whether it was worth it","How do you maintain a sense of self when everything around you is demanding you become someone else?","Describe the moment you stopped waiting for permission to be who you wanted to be","What does true courage look like as opposed to bravery that only shows up in easy moments?","How do you think about the tension between self-acceptance and the relentless drive to improve?","Talk about a time you had to trust the process when all visible evidence suggested the process was failing","What is the hardest thing you have ever done and what does it tell you about your actual capacity?","How do you build conviction in a direction when you genuinely cannot see where it leads?","Describe what it means to you to be someone that people can truly count on over the long term","What is your honest relationship with comfort and how has it shaped your most important choices?","How do you think about the relationship between discipline and freedom — are they opposites or the same thing?","What would you be doing with your life if fear played no role in any of your decisions?","Describe what rock bottom taught you that success never could","How do you stay committed to growth when the version of yourself you are becoming would be unrecognizable to who you are now?","What does it mean to lead yourself before you can lead anyone else?","Talk about the thing you most want to be remembered for and what you are actually doing about it today"],
  },
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
  const sentenceCount = sentences.length;
  // ── new-format local fallback ──────────────────────────────────────────────
  {
    const FILLERS=[
      {word:"um",re:/\bum\b/gi},{word:"uh",re:/\buh\b/gi},
      {word:"like",re:/\blike\b/gi},{word:"you know",re:/\byou\s+know\b/gi},
      {word:"basically",re:/\bbasically\b/gi},{word:"literally",re:/\bliterally\b/gi},
      {word:"right",re:/\bright\b/gi},{word:"so",re:/\bso\b/gi},
      {word:"kind of",re:/\bkind\s+of\b/gi},{word:"sort of",re:/\bsort\s+of\b/gi},
    ];
    const fillerWordList={};
    let totalFillers=0;
    for(const {word,re} of FILLERS){
      const n=(text.match(re)||[]).length;
      if(n>0){fillerWordList[word]=n;totalFillers+=n;}
    }
    const fillerRate=wordCount>0?totalFillers/wordCount:0;
    const STRUCT=["first","second","third","finally","furthermore","however","therefore","additionally","for example","in conclusion"];
    const structCount=STRUCT.filter(w=>lower.includes(w)).length;
    const HEDGE_RES=[/\bi\s+think\b/gi,/\bmaybe\b/gi,/\bi\s+guess\b/gi,/\bprobably\b/gi,/\bi\s+feel\b/gi];
    const totalHedges=HEDGE_RES.reduce((s,re)=>s+(text.match(re)||[]).length,0);
    const clarity=Math.max(5,Math.min(25,20-Math.round(fillerRate*80)+(wordCount>80?3:0)+(sentenceCount>3?2:0)));
    const structure=Math.max(5,Math.min(25,8+Math.min(structCount*4,12)+(sentenceCount>3?3:0)+(wordCount>100?2:0)));
    const fillerWordsScore=Math.max(5,Math.min(25,25-Math.round(fillerRate*160)));
    const confidence=Math.max(5,Math.min(25,22-totalHedges*3+(wordCount>100?2:0)));
    const totalScore=Math.max(20,Math.min(100,clarity+structure+fillerWordsScore+confidence));
    const topFiller=Object.entries(fillerWordList).sort((a,b)=>b[1]-a[1])[0];
    const hasFiller=totalFillers>0;
    const feedbackStr=totalScore>=80
      ?`Strong response — clear, structured, and delivered with confidence on a ${difficulty} prompt.`
      :totalScore>=60
      ?`Solid effort on a ${difficulty} prompt.${hasFiller?` Watch the "${topFiller[0]}" habit — it appeared ${topFiller[1]} time${topFiller[1]>1?"s":""}.`:""}`
      :`Keep working at it — the specifics below show exactly what to fix first.`;
    const strength=structCount>1
      ?`Used ${structCount} signpost words — your response had clear direction and was easy to follow`
      :wordCount>100
      ?`Good depth — ${wordCount} words shows you developed the idea rather than giving a surface-level answer`
      :`Completed the full response without stopping — the discipline to speak to the end builds real skill`;
    const improvement=hasFiller&&fillerRate>0.04
      ?`Cut "${topFiller[0]}" (appeared ${topFiller[1]} time${topFiller[1]>1?"s":""}) — replace it with a deliberate one-second pause instead`
      :structCount<2
      ?`Add signpost words — try opening with "I'll cover two things: first… and second…" to give your response immediate structure`
      :totalHedges>2
      ?`Remove hedging language like "I think" or "maybe" — state your points directly and they instantly sound more authoritative`
      :`Push for more depth — try hitting ${Math.min(wordCount+60,200)} words next time by adding one concrete example`;
    return{totalScore,clarity,structure,fillerWords:fillerWordsScore,confidence,fillerWordList,feedback:feedbackStr,strength,improvement};
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

// ── Share Card ───────────────────────────────────────────────────────────────
function ShareCard({score,category,difficulty,strength}){
  const [open,setOpen]=useState(false);
  const [copied,setCopied]=useState(false);
  const [previewUrl,setPreviewUrl]=useState('');

  const makeCanvas=()=>{
    const W=1080,H=1080;
    const c=document.createElement('canvas');
    c.width=W;c.height=H;
    const ctx=c.getContext('2d');
    const scoreColor=score>=80?'#2D7A4F':score>=60?'#F5C842':'#E84040';

    // Background
    ctx.fillStyle='#1A1A2E';
    ctx.fillRect(0,0,W,H);

    // Dot grid
    ctx.fillStyle='rgba(255,255,255,0.055)';
    for(let x=27;x<W;x+=54)for(let y=27;y<H;y+=54){
      ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();
    }

    // Top bar
    ctx.fillStyle='#FF6B2B';
    ctx.fillRect(0,0,W,10);

    // Logo
    ctx.fillStyle='#FF6B2B';
    ctx.font='bold 84px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillText('Orivox',W/2,115);

    // Subtitle
    ctx.fillStyle='rgba(255,255,255,0.42)';
    ctx.font='30px Arial,sans-serif';
    ctx.fillText('AI Speaking Coach',W/2,162);

    // Divider
    ctx.strokeStyle='rgba(255,107,43,0.22)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(W*0.3,186);ctx.lineTo(W*0.7,186);ctx.stroke();

    // Score ring
    const cx=W/2,cy=415,r=168;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.09)';ctx.lineWidth=22;ctx.stroke();
    const arc=(score/100)*Math.PI*2;
    ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+arc);
    ctx.strokeStyle=scoreColor;ctx.lineWidth=22;ctx.lineCap='round';ctx.stroke();

    // Score number
    ctx.fillStyle=scoreColor;
    ctx.font='bold 192px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(score.toString(),cx,cy-16);

    // /100
    ctx.fillStyle='rgba(255,255,255,0.33)';
    ctx.font='bold 54px Fredoka,"Arial Rounded MT Bold",Arial';
    ctx.fillText('/100',cx,cy+90);

    // Category · Difficulty
    ctx.fillStyle='rgba(255,255,255,0.75)';
    ctx.font='38px Arial,sans-serif';
    ctx.textBaseline='alphabetic';
    ctx.fillText(`${category} · ${difficulty}`,cx,658);

    // Strength (2-line word wrap, italic)
    ctx.fillStyle='rgba(255,255,255,0.48)';
    ctx.font='italic 29px Arial,sans-serif';
    const maxW=820;
    const words=(`"${strength}"`).split(' ');
    let line='';const lines=[];
    for(const w of words){
      const test=line+(line?' ':'')+w;
      if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w;if(lines.length>=2)break;}
      else line=test;
    }
    if(lines.length<2&&line)lines.push(line);
    if(lines.length===2){
      while(ctx.measureText(lines[1]+'…').width>maxW&&lines[1].includes(' '))
        lines[1]=lines[1].split(' ').slice(0,-1).join(' ');
      if(!(`"${strength}"`).endsWith(lines[1]))lines[1]+='…';
    }
    lines.forEach((l,i)=>ctx.fillText(l,cx,714+i*42));

    // Bottom CTA
    ctx.strokeStyle='rgba(255,107,43,0.2)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(W*0.2,822);ctx.lineTo(W*0.8,822);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.38)';
    ctx.font='27px Arial,sans-serif';
    ctx.fillText('Try it at',cx,876);
    ctx.fillStyle='#FF6B2B';
    ctx.font='bold 44px Arial,sans-serif';
    ctx.fillText('orivoxapp.vercel.app',cx,946);

    // Bottom bar
    ctx.fillStyle='#FF6B2B';
    ctx.fillRect(0,H-10,W,10);
    return c;
  };

  const getBlob=()=>new Promise(resolve=>makeCanvas().toBlob(resolve,'image/png'));

  const handleShare=async()=>{
    const text=`I scored ${score}/100 on Orivox's AI speaking coach 🎙️ Try it yourself: orivoxapp.vercel.app`;
    if(typeof navigator!=='undefined'&&navigator.share){
      try{
        const blob=await getBlob();
        const file=new File([blob],'orivox-score.png',{type:'image/png'});
        if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],text});return;}
        await navigator.share({text,url:'https://orivoxapp.vercel.app'});return;
      }catch(e){if(e.name==='AbortError')return;}
    }
    setPreviewUrl(makeCanvas().toDataURL('image/png'));
    setOpen(true);
  };

  const handleDownload=()=>{
    const a=document.createElement('a');
    a.href=makeCanvas().toDataURL('image/png');
    a.download='orivox-score.png';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
  };

  const handleCopy=async()=>{
    try{
      await navigator.clipboard.writeText(`I scored ${score}/100 on Orivox's AI speaking coach 🎙️ Try it yourself: orivoxapp.vercel.app`);
      setCopied(true);setTimeout(()=>setCopied(false),2200);
    }catch{}
  };

  const btnBase={display:'flex',alignItems:'center',justifyContent:'center',gap:8,
    padding:'14px',borderRadius:50,cursor:'pointer',
    fontFamily:'Fredoka,sans-serif',fontSize:17,fontWeight:600,
    border:'2.5px solid var(--text)',transition:'all .15s',width:'100%'};

  return(
    <>
      <button onClick={handleShare} style={{
        display:'inline-flex',alignItems:'center',gap:8,marginTop:22,
        padding:'10px 26px',borderRadius:50,cursor:'pointer',
        fontFamily:'Fredoka,sans-serif',fontSize:16,fontWeight:600,
        background:'transparent',color:'var(--text)',
        border:'2.5px solid var(--border)',boxShadow:'3px 3px 0 var(--border)',transition:'all .15s',
      }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--orange)';e.currentTarget.style.color='var(--orange)';e.currentTarget.style.boxShadow='3px 3px 0 var(--orange)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text)';e.currentTarget.style.boxShadow='3px 3px 0 var(--border)'}}>
        ↗ Share Result
      </button>

      {open&&(
        <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'var(--card)',borderRadius:24,border:'2.5px solid var(--border)',boxShadow:'8px 8px 0 rgba(0,0,0,0.22)',padding:28,maxWidth:400,width:'100%'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <span className="fredoka" style={{fontSize:22}}>Share your result</span>
              <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:24,color:'var(--muted)',padding:4,lineHeight:1}}>×</button>
            </div>
            {previewUrl&&<img src={previewUrl} alt="Score card" style={{width:'100%',borderRadius:14,marginBottom:18,border:'2px solid var(--border)'}}/>}
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <button onClick={handleDownload} style={{...btnBase,background:'var(--orange)',color:'#fff',boxShadow:'4px 4px 0 var(--text)'}}>↓ Download Image</button>
              <button onClick={handleCopy} style={{...btnBase,background:copied?'#E8F7EE':'var(--cream)',color:copied?'var(--green)':'var(--text)',borderColor:copied?'var(--green)':'var(--border)',boxShadow:`3px 3px 0 ${copied?'var(--green)':'var(--border)'}`}}>
                {copied?'✓ Copied!':'⎘ Copy Text'}
              </button>
            </div>
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
  const timerCardRef=useRef(null);
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

  const pickTopic=useCallback(()=>setTopic(rand(TOPICS[activeCat][activeDiff])),[activeCat,activeDiff]);

  const startSession=()=>{
    const resolvedCat=cat==="Random"?rand(CATS):cat;
    const resolvedDiff=diff==="Random"?rand(DIFFS):diff;
    setActiveCat(resolvedCat);setActiveDiff(resolvedDiff);
    setTopic(rand(TOPICS[resolvedCat][resolvedDiff]));
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

  const saveSession=(feedbackData)=>{
    try{
      const words=transcriptRef.current.trim().split(/\s+/).filter(Boolean).length;
      const wpm=speakTime>0?(words/speakTime)*60:0;
      const pacingRating=wpm<100?"slow":wpm<170?"good":"fast";
      const fillerWordList=feedbackData.fillerWordList||{};
      const session={
        id:Date.now().toString(),
        date:new Date().toISOString().split("T")[0],
        category:activeCat,
        difficulty:activeDiff,
        score:feedbackData.totalScore,
        fillerWordCount:Object.values(fillerWordList).reduce((a,b)=>a+b,0),
        fillerWords:Object.keys(fillerWordList),
        pacingRating,
        speakDuration:speakTime,
      };
      const existing=JSON.parse(localStorage.getItem("orivox_sessions")||"[]");
      existing.push(session);
      localStorage.setItem("orivox_sessions",JSON.stringify(existing));
    }catch{}
  };

  const analyze=async()=>{
    setLoading(true);
    const text=transcriptRef.current;
    if(!text.trim()){
      setFeedback({error:"No speech detected. Make sure your microphone is working and try again."});
      setLoading(false);return;
    }
    try{
      const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({transcript:text,topic,category:activeCat,difficulty:activeDiff})});
      if(res.ok){
        const data=await res.json();
        if(!data.error){saveSession(data);setFeedback(data);setLoading(false);return;}
      }
    }catch{}
    await new Promise(r=>setTimeout(r,800));
    const localData=analyzeTranscript(text,topic,activeDiff);
    saveSession(localData);
    setFeedback(localData);
    setLoading(false);
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
            <span className="fredoka" style={{fontSize:26,fontWeight:700,color:"var(--text)"}}>Orivox</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {screen!=="home"&&<button className="btn btn-cream" style={{fontSize:14,padding:"8px 18px"}} onClick={reset}>← Home</button>}
            <Link href="/progress" style={{display:"inline-flex",alignItems:"center",padding:"8px 18px",borderRadius:50,fontFamily:"Fredoka, sans-serif",fontSize:14,fontWeight:600,border:"2px solid var(--border)",color:"var(--muted)",background:"var(--card)",textDecoration:"none",boxShadow:"2px 2px 0 var(--border)",transition:"all .18s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.color="var(--orange)";e.currentTarget.style.boxShadow="2px 2px 0 var(--orange)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";e.currentTarget.style.boxShadow="2px 2px 0 var(--border)"}}>
              Progress
            </Link>
            <Link href="/about" style={{display:"inline-flex",alignItems:"center",padding:"8px 18px",borderRadius:50,fontFamily:"Fredoka, sans-serif",fontSize:14,fontWeight:600,border:"2px solid var(--border)",color:"var(--muted)",background:"var(--card)",textDecoration:"none",boxShadow:"2px 2px 0 var(--border)",transition:"all .18s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.color="var(--orange)";e.currentTarget.style.boxShadow="2px 2px 0 var(--orange)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";e.currentTarget.style.boxShadow="2px 2px 0 var(--border)"}}>
              About
            </Link>
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
                  <div className="card fb1" style={{textAlign:"center",padding:"48px 32px",marginBottom:20,position:"relative",overflow:"visible",borderTop:`6px solid ${feedback.totalScore>=80?"var(--green)":feedback.totalScore>=60?"var(--yellow)":"var(--red)"}`}}>
                    <Confetti active={true}/>
                    <CelebStars show={feedback.totalScore>=80}/>
                    <div style={{position:"absolute",top:16,right:16}}><Star size={32} color="#F5C842"/></div>
                    <div style={{position:"absolute",top:20,left:20}}><Sparkle size={26} color="var(--orange)"/></div>
                    <h2 className="fredoka" style={{fontSize:28,color:"var(--text)",marginBottom:16}}>
                      {feedback.totalScore>=80?"Crushed it 🔥":feedback.totalScore>=60?"Nice work 💪":"Keep going — it gets easier"}
                    </h2>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><ScoreRing score={feedback.totalScore} size={160}/></div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 24px",borderRadius:50,
                      background:feedback.totalScore>=80?"var(--green)":feedback.totalScore>=60?"var(--yellow-dim)":"var(--red-dim)",
                      border:`2px solid ${feedback.totalScore>=80?"var(--green)":feedback.totalScore>=60?"var(--yellow)":"var(--red)"}`,
                      color:feedback.totalScore>=80?"white":feedback.totalScore>=60?"#7A5500":"var(--red)",
                      fontFamily:"Fredoka",fontSize:18,fontWeight:600,marginBottom:20}}>
                      {feedback.totalScore>=80?"Excellent":feedback.totalScore>=60?"Good Job":"Keep Practicing"}
                    </div>
                    <p style={{color:"var(--muted)",fontSize:16,maxWidth:460,margin:"0 auto",lineHeight:1.8}}>{feedback.feedback}</p>
                    <ShareCard score={feedback.totalScore} category={activeCat} difficulty={activeDiff} strength={feedback.strength||""}/>
                  </div>

                  {/* Sub scores — 4 categories out of 25 */}
                  <div className="fb2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                    <SubBar label="Clarity" val={feedback.clarity} max={25} color="#3B82F6" bg="#EFF6FF"/>
                    <SubBar label="Structure" val={feedback.structure} max={25} color="var(--orange)" bg="var(--orange-dim)"/>
                    <SubBar label="Delivery" val={feedback.fillerWords} max={25} color="var(--green)" bg="#E8F7EE"/>
                    <SubBar label="Confidence" val={feedback.confidence} max={25} color="#8B5CF6" bg="#F5F3FF"/>
                  </div>

                  {/* Filler word callouts */}
                  <div className="card fb3" style={{padding:28,marginBottom:20,borderLeft:`5px solid ${Object.keys(feedback.fillerWordList||{}).length===0?"var(--green)":"var(--red)"}`}}>
                    <p className="fredoka" style={{fontSize:19,marginBottom:16}}>Filler Words</p>
                    {Object.keys(feedback.fillerWordList||{}).length===0?(
                      <p style={{color:"var(--green)",fontSize:15,fontWeight:600}}>Clean delivery — no filler words detected 🎉</p>
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

                  {/* Next session suggestion */}
                  <div className="card fb5" style={{padding:28,marginBottom:20,background:"var(--yellow-dim)",border:"2.5px solid var(--yellow)",borderRadius:22}}>
                    <p className="fredoka" style={{fontSize:18,color:"#7A5500",marginBottom:8}}>Coach's Note</p>
                    <p style={{fontSize:15,lineHeight:1.8}}>
                      {feedback.totalScore<60
                        ?"Focus on slowing down and pausing instead of filling silence — try an Easy session next"
                        :feedback.totalScore<=80
                        ?"Good foundation — try pushing to a harder difficulty next time"
                        :"Strong session — challenge yourself with Debate or Business next"}
                    </p>
                  </div>

                  {/* Transcript */}
                  {transcript&&(
                    <details className="card fb6" style={{marginBottom:20,padding:28,cursor:"pointer"}}>
                      <summary className="fredoka" style={{fontSize:16,color:"var(--muted)",userSelect:"none"}}>📝 View transcript ▾</summary>
                      <div style={{marginTop:16}}>
                        {(feedback.cleanedTranscript||transcript).split(/\n+/).map((para,i)=>(
                          <p key={i} style={{fontSize:14,lineHeight:1.9,opacity:.85,marginBottom:12}}>{para}</p>
                        ))}
                      </div>
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
