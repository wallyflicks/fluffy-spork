// ── Program Definitions ───────────────────────────────────────────────────────
// speakTime in seconds. prompt: null = pick random from category/difficulty pool.
// caseType: for Case Competition days — 'General Q&A' | 'Recommendations' | 'Risks and Mitigations' | 'Financials'
// forcePrepTime: override prepTime for all days (e.g. 0 for Quick Thinker)

export const PROGRAMS = [
  // ── BEGINNER ─────────────────────────────────────────────────────────────
  {
    id: 'filler-word-eliminator',
    name: 'Filler Word Eliminator',
    tagline: 'Seven days to cleaner, clearer speech',
    duration: 7,
    difficulty: 'Beginner',
    focus: 'Eliminating filler words',
    speakTime: 60,
    certificate: 'Filler Word Champion',
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'What is your favorite hobby and why?', focus:'Just become aware of your filler words today, do not try to fix them yet, just notice them' },
      { day:2, category:'General', difficulty:'Easy', prompt:'Describe your ideal weekend', focus:'Every time you feel the urge to say um or uh, pause silently instead' },
      { day:3, category:'General', difficulty:'Easy', prompt:'What is something you are grateful for today?', focus:'Pay attention to the word like — catch it before it comes out' },
      { day:4, category:'Interview', difficulty:'Easy', prompt:'Tell me about yourself', focus:'Slow down your pace slightly — filler words often come from speaking too fast' },
      { day:5, category:'General', difficulty:'Medium', prompt:'How do you handle stress?', focus:'Replace so and basically with a pause or just start the next sentence' },
      { day:6, category:'Interview', difficulty:'Easy', prompt:'What are your strengths?', focus:'Full clean session — apply everything from the week' },
      { day:7, category:'General', difficulty:'Medium', prompt:'What does success mean to you?', focus:'Final session — aim for your cleanest delivery yet, this is your benchmark' },
    ],
  },

  {
    id: 'first-words',
    name: 'First Words',
    tagline: 'For absolute beginners who want to start somewhere',
    duration: 7,
    difficulty: 'Beginner',
    focus: 'Getting comfortable speaking at all',
    speakTime: 30,
    certificate: 'First Words Graduate',
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'What is your name and one thing you like?', focus:'Just speak. Do not worry about anything else today.' },
      { day:2, category:'General', difficulty:'Easy', prompt:'Describe your favorite food', focus:'Try to speak for the full 30 seconds without stopping' },
      { day:3, category:'General', difficulty:'Easy', prompt:'What did you do today?', focus:'Speak in full sentences, not single words' },
      { day:4, category:'General', difficulty:'Easy', prompt:'Describe someone you admire', focus:'Try to make eye contact with the camera if you are on a device with one' },
      { day:5, category:'General', difficulty:'Easy', prompt:'What is something you are looking forward to?', focus:'Add one detail or example to whatever you say' },
      { day:6, category:'General', difficulty:'Easy', prompt:'What would you do on a perfect day?', focus:'Try to have a beginning, middle, and end to your answer' },
      { day:7, category:'General', difficulty:'Easy', prompt:'Tell me one thing about yourself that most people do not know', focus:'Deliver it with confidence — own your words' },
    ],
  },

  {
    id: 'quick-thinker',
    name: 'Quick Thinker',
    tagline: 'Train your brain to respond instantly under pressure',
    duration: 7,
    difficulty: 'Beginner',
    focus: 'Reducing response latency and thinking on your feet',
    speakTime: 30,
    certificate: 'Quick Thinker',
    forcePrepTime: 0,
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'What is your favorite movie?', focus:'Start speaking within 2 seconds of seeing the prompt, do not plan' },
      { day:2, category:'Interview', difficulty:'Easy', prompt:'Tell me about yourself', focus:'Have your first sentence out before your brain catches up' },
      { day:3, category:'General', difficulty:'Easy', prompt:'What would you change about your school?', focus:'Do not pause to think — let your thoughts form as you speak' },
      { day:4, category:'Debate', difficulty:'Easy', prompt:'Is social media harmful?', focus:'Pick a side immediately and commit to it without second guessing' },
      { day:5, category:'General', difficulty:'Medium', prompt:'How do you handle conflict?', focus:'Start with a direct answer then explain — never start with I think or well' },
      { day:6, category:'Interview', difficulty:'Medium', prompt:'What is your biggest weakness?', focus:'Answer and move on — do not over explain or apologize' },
      { day:7, category:'Debate', difficulty:'Medium', prompt:'Should the voting age be lowered?', focus:'Full speed, no hesitation, clean start to finish' },
    ],
  },

  {
    id: 'confidence-starter',
    name: 'Confidence Starter',
    tagline: 'Go from hesitant to heard in 10 days',
    duration: 10,
    difficulty: 'Beginner',
    focus: 'Building vocal confidence and commitment to ideas',
    speakTime: 60,
    certificate: 'Confidence Starter',
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'Describe your ideal day', focus:'Speak louder than you think you need to' },
      { day:2, category:'General', difficulty:'Easy', prompt:'What is something you are proud of?', focus:'Do not apologize for your opinions — state them directly' },
      { day:3, category:'Interview', difficulty:'Easy', prompt:'What are your strengths?', focus:'Remove all hedging language — no I think, I guess, maybe, or perhaps' },
      { day:4, category:'Motivational', difficulty:'Easy', prompt:'What gets you out of bed in the morning?', focus:'Speak like you believe every word you are saying' },
      { day:5, category:'General', difficulty:'Medium', prompt:'What does success mean to you?', focus:'Make your first sentence the strongest sentence' },
      { day:6, category:'Interview', difficulty:'Easy', prompt:'Why should we hire you?', focus:'No qualifiers — not sort of, kind of, or basically' },
      { day:7, category:'Debate', difficulty:'Easy', prompt:'Is competition healthy?', focus:'Take a strong position immediately and hold it' },
      { day:8, category:'General', difficulty:'Medium', prompt:'How do you make difficult decisions?', focus:'End every answer with a clear concluding statement' },
      { day:9, category:'Interview', difficulty:'Medium', prompt:'What is your greatest achievement?', focus:'Full confident delivery — no backing down from your claims' },
      { day:10, category:'Interview', difficulty:'Easy', prompt:'Tell me about yourself', focus:'Final benchmark — compare this to Day 1 and see how far you have come' },
    ],
  },

  // ── INTERMEDIATE ─────────────────────────────────────────────────────────
  {
    id: 'structure-master',
    name: 'Structure Master',
    tagline: 'Learn to organize your thoughts under any pressure',
    duration: 14,
    difficulty: 'Intermediate',
    focus: 'Building clear logical structure in responses',
    speakTime: 90,
    certificate: 'Structure Master',
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'What is your favorite hobby?', focus:'Use this structure — Point, Reason, Example. Nothing else today.' },
      { day:2, category:'General', difficulty:'Medium', prompt:'How do you handle stress?', focus:'Start with your conclusion, then explain why' },
      { day:3, category:'Interview', difficulty:'Easy', prompt:'What are your strengths?', focus:'Give exactly two points and label them — first and second' },
      { day:4, category:'Debate', difficulty:'Easy', prompt:'Should phones be banned in classrooms?', focus:'Pick a side, give three reasons, conclude' },
      { day:5, category:'General', difficulty:'Medium', prompt:'What does friendship mean to you?', focus:'Use a story structure — situation, what happened, what you learned' },
      { day:6, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you faced a challenge', focus:'Use the STAR structure — Situation, Task, Action, Result' },
      { day:7, category:'Debate', difficulty:'Medium', prompt:'Is college worth the cost?', focus:'Acknowledge the other side, then explain why your side is stronger' },
      { day:8, category:'General', difficulty:'Hard', prompt:'What is your philosophy on life?', focus:'Define your terms first, then build your argument' },
      { day:9, category:'Business', difficulty:'Easy', prompt:'What makes a good leader?', focus:'Make a claim, support it with evidence, close with an implication' },
      { day:10, category:'Interview', difficulty:'Medium', prompt:'How do you prioritize tasks?', focus:'Walk through your logic step by step — let the listener follow your thinking' },
      { day:11, category:'Debate', difficulty:'Medium', prompt:'Should the voting age be lowered?', focus:'Open with a hook, build the argument, land the conclusion hard' },
      { day:12, category:'General', difficulty:'Hard', prompt:'What does it mean to live meaningfully?', focus:'Structure your answer in three parts without explicitly labeling them' },
      { day:13, category:'Business', difficulty:'Medium', prompt:'How would you turn around a struggling business?', focus:'Problem, options, recommendation, next steps' },
      { day:14, category:'Interview', difficulty:'Hard', prompt:'Tell me about the most complex problem you have solved', focus:'Full benchmark — show everything you have learned about structure' },
    ],
  },

  {
    id: 'interview-ready',
    name: 'Interview Ready',
    tagline: 'Three weeks to interview confidence',
    duration: 21,
    difficulty: 'Intermediate',
    focus: 'Mastering professional interview responses',
    speakTime: 90,
    certificate: 'Interview Ready',
    days: [
      { day:1, category:'Interview', difficulty:'Easy', prompt:'Tell me about yourself', focus:'Have a 90 second version of your story ready — who you are, what you have done, what you want' },
      { day:2, category:'Interview', difficulty:'Easy', prompt:'What are your strengths?', focus:'Give a strength, give an example, explain the impact' },
      { day:3, category:'Interview', difficulty:'Easy', prompt:'What are your weaknesses?', focus:'Name a real weakness, show what you are doing about it, do not fake it' },
      { day:4, category:'Interview', difficulty:'Easy', prompt:'Why do you want this job?', focus:'Connect your goals to the role specifically' },
      { day:5, category:'Interview', difficulty:'Easy', prompt:'Where do you see yourself in 5 years?', focus:'Be ambitious but grounded — show direction not just ambition' },
      { day:6, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you failed', focus:'Own the failure fully, explain what changed, show the growth' },
      { day:7, category:'Interview', difficulty:'Medium', prompt:'Describe a time you led a team', focus:'Use STAR — make the result specific and measurable' },
      { day:8, category:'Interview', difficulty:'Medium', prompt:'How do you handle conflict?', focus:'Show both self-awareness and professionalism' },
      { day:9, category:'Interview', difficulty:'Easy', prompt:'What motivates you?', focus:'Be specific — not just passion, but what kind of work energizes you specifically' },
      { day:10, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you had to learn something quickly', focus:'Show the process of learning not just the outcome' },
      { day:11, category:'Interview', difficulty:'Hard', prompt:'Tell me about a time you made a decision with limited information', focus:'Show your reasoning process clearly' },
      { day:12, category:'Interview', difficulty:'Medium', prompt:'How do you prioritize when everything is urgent?', focus:'Give a concrete framework you actually use' },
      { day:13, category:'Interview', difficulty:'Easy', prompt:'Describe your work style', focus:'Be honest and specific — what conditions bring out your best' },
      { day:14, category:'Interview', difficulty:'Hard', prompt:'Tell me about the most complex problem you have solved', focus:'Take your time with the setup so the solution lands properly' },
      { day:15, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you disagreed with your manager', focus:'Show respect and principle at the same time' },
      { day:16, category:'Interview', difficulty:'Hard', prompt:'What would you do in your first 90 days?', focus:'Show you think in specifics not generalities' },
      { day:17, category:'Interview', difficulty:'Medium', prompt:'How do you handle feedback?', focus:'Show genuine openness not performed openness' },
      { day:18, category:'Interview', difficulty:'Hard', prompt:'Why should we hire you over other candidates?', focus:'Be direct — this is not the time for modesty' },
      { day:19, category:'Interview', difficulty:'Hard', prompt:'What is your greatest professional failure?', focus:'Go deep — surface answers do not land in tough interviews' },
      { day:20, category:'Interview', difficulty:'Easy', prompt:'Do you have any questions for us?', focus:'Prepare 3 strong questions that show you have done your research' },
      { day:21, category:'Interview', difficulty:'Hard', prompt:'Tell me about yourself', focus:'Final benchmark — this should sound completely different from Day 1' },
    ],
  },

  {
    id: 'debate-foundations',
    name: 'Debate Foundations',
    tagline: 'Learn to argue any side of any issue',
    duration: 14,
    difficulty: 'Intermediate',
    focus: 'Building argumentation and persuasion skills',
    speakTime: 90,
    certificate: 'Debate Foundations Graduate',
    days: [
      { day:1, category:'Debate', difficulty:'Easy', prompt:'Is social media harmful?', focus:'State your position in the first sentence — do not bury it' },
      { day:2, category:'Debate', difficulty:'Easy', prompt:'Should school uniforms be mandatory?', focus:'Give three distinct reasons, not variations of the same reason' },
      { day:3, category:'Debate', difficulty:'Easy', prompt:'Is competition healthy?', focus:'Acknowledge the strongest counterargument before dismissing it' },
      { day:4, category:'Debate', difficulty:'Medium', prompt:'Should the voting age be lowered?', focus:'Use evidence or examples to support each point' },
      { day:5, category:'Debate', difficulty:'Easy', prompt:'Is it better to be honest or kind?', focus:'Define your key terms before arguing — it prevents people from talking past you' },
      { day:6, category:'Debate', difficulty:'Medium', prompt:'Is social media doing more harm than good?', focus:'Start with the most surprising or counterintuitive point first' },
      { day:7, category:'Debate', difficulty:'Medium', prompt:'Should standardized testing be abolished?', focus:'Argue the side you personally disagree with' },
      { day:8, category:'Debate', difficulty:'Medium', prompt:'Is cancel culture harmful or necessary?', focus:'Show you understand the strongest version of the opposing argument' },
      { day:9, category:'Debate', difficulty:'Hard', prompt:'Should billionaires exist?', focus:'Make an economic argument, a moral argument, and a practical argument' },
      { day:10, category:'Debate', difficulty:'Medium', prompt:'Should the death penalty be abolished?', focus:'Ground every claim in a principle, not just an emotion' },
      { day:11, category:'Debate', difficulty:'Hard', prompt:'Is democracy the best form of government?', focus:'Acknowledge democracy\'s weaknesses before defending it' },
      { day:12, category:'Debate', difficulty:'Hard', prompt:'Is it ever justified to break the law?', focus:'Use a specific scenario to anchor your abstract argument' },
      { day:13, category:'Debate', difficulty:'Medium', prompt:'Is privacy more important than security?', focus:'End with a clear, memorable concluding line' },
      { day:14, category:'Debate', difficulty:'Hard', prompt:'Should there be limits on free speech?', focus:'Full benchmark — show everything you have learned about argumentation' },
    ],
  },

  {
    id: 'storytelling-basics',
    name: 'Storytelling Basics',
    tagline: 'Make people actually want to listen to you',
    duration: 10,
    difficulty: 'Intermediate',
    focus: 'Narrative structure, detail, and emotional connection',
    speakTime: 90,
    certificate: 'Storyteller',
    days: [
      { day:1, category:'Storytelling', difficulty:'Easy', prompt:'Tell a story about a funny thing that happened to you', focus:'Set the scene first — where, when, who' },
      { day:2, category:'Storytelling', difficulty:'Easy', prompt:'Describe your most memorable birthday', focus:'Include one specific sensory detail — what you saw, heard, or felt' },
      { day:3, category:'Storytelling', difficulty:'Easy', prompt:'Tell a story about a time you got lost', focus:'Build tension before the resolution — do not jump straight to what happened' },
      { day:4, category:'Storytelling', difficulty:'Medium', prompt:'Tell a story about a time a friendship changed your life', focus:'Show do not tell — describe actions and moments, not just feelings' },
      { day:5, category:'Storytelling', difficulty:'Easy', prompt:'Tell a story about a time something unexpectedly went right', focus:'Include dialogue if possible — it makes stories come alive' },
      { day:6, category:'Storytelling', difficulty:'Medium', prompt:'Describe a moment that made you see the world differently', focus:'End with what it meant — the lesson or the shift, not just what happened' },
      { day:7, category:'Storytelling', difficulty:'Medium', prompt:'Tell a story about a time you had to be brave', focus:'Slow down the most important moment — give it space' },
      { day:8, category:'Storytelling', difficulty:'Hard', prompt:'Tell a story that captures who you are as a person', focus:'Every detail should reveal character, not just describe events' },
      { day:9, category:'Storytelling', difficulty:'Medium', prompt:'Describe a turning point in your life', focus:'Make the stakes clear early — why did this matter?' },
      { day:10, category:'Storytelling', difficulty:'Hard', prompt:'Tell a story about a time joy and grief existed at the same time', focus:'Full benchmark — emotional truth, specific detail, clear arc' },
    ],
  },

  {
    id: 'business-communication',
    name: 'Business Communication',
    tagline: 'Speak like you belong in the room',
    duration: 21,
    difficulty: 'Intermediate',
    focus: 'Professional communication, pitching, and persuasion',
    speakTime: 90,
    certificate: 'Business Communicator',
    days: [
      { day:1, category:'Business', difficulty:'Easy', prompt:'What makes a good leader?', focus:'Start with a clear definition, then support it' },
      { day:2, category:'Business', difficulty:'Easy', prompt:'Describe a business you would start with $1000', focus:'Lead with the problem you are solving, not the solution' },
      { day:3, category:'Interview', difficulty:'Easy', prompt:'Tell me about yourself', focus:'Give the professional version — clear, concise, compelling' },
      { day:4, category:'Business', difficulty:'Easy', prompt:'What makes a product truly useful?', focus:'Think from the customer\'s perspective, not the builder\'s' },
      { day:5, category:'Business', difficulty:'Medium', prompt:'How would you get your first 10 customers?', focus:'Be specific — no vague strategies, real tactics' },
      { day:6, category:'Business', difficulty:'Easy', prompt:'What is the difference between a manager and a leader?', focus:'Use a concrete example to illustrate the difference' },
      { day:7, category:'Business', difficulty:'Medium', prompt:'You are pitching your startup to investors — go', focus:'Problem, solution, market, traction, ask — in that order' },
      { day:8, category:'Business', difficulty:'Medium', prompt:'How would you turn around a struggling business?', focus:'Diagnose before you prescribe — identify the root cause first' },
      { day:9, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you led a team', focus:'Quantify the result if possible' },
      { day:10, category:'Business', difficulty:'Medium', prompt:'What is your strategy for entering a competitive market?', focus:'Show you have done your homework on the competition' },
      { day:11, category:'Business', difficulty:'Hard', prompt:'How would you disrupt an industry that has not changed in 50 years?', focus:'Challenge the assumptions the industry takes for granted' },
      { day:12, category:'Business', difficulty:'Medium', prompt:'How do you build a loyal customer base?', focus:'Talk about retention not just acquisition' },
      { day:13, category:'Interview', difficulty:'Hard', prompt:'Tell me about a time you had to influence without authority', focus:'Show political intelligence not just technical skill' },
      { day:14, category:'Business', difficulty:'Hard', prompt:'You have 90 seconds to convince a board of directors', focus:'Lead with the outcome, not the process' },
      { day:15, category:'Business', difficulty:'Medium', prompt:'How do you handle a customer complaint?', focus:'Empathy first, solution second' },
      { day:16, category:'Business', difficulty:'Hard', prompt:'How do you build a company culture that survives rapid growth?', focus:'Give concrete mechanisms not just values' },
      { day:17, category:'Interview', difficulty:'Hard', prompt:'Describe your biggest professional failure', focus:'Own it fully — no deflecting to external factors' },
      { day:18, category:'Business', difficulty:'Hard', prompt:'What is your vision for where your industry will be in 10 years?', focus:'Show bold thinking backed by real trends' },
      { day:19, category:'Business', difficulty:'Hard', prompt:'Pitch yourself as the CEO of a company you would run', focus:'Vision, credibility, and differentiation' },
      { day:20, category:'Interview', difficulty:'Hard', prompt:'Why should we hire you?', focus:'Make a direct, specific, confident case' },
      { day:21, category:'Business', difficulty:'Hard', prompt:'You have 90 seconds to convince a board of directors', focus:'Final benchmark — compare to Day 14 and see the growth' },
    ],
  },

  // ── ADVANCED ─────────────────────────────────────────────────────────────
  {
    id: 'case-competition-mastery',
    name: 'Case Competition Mastery',
    tagline: 'Train like you are going to nationals',
    duration: 30,
    difficulty: 'Advanced',
    focus: 'Full case competition preparation — analysis, structure, Q&A',
    speakTime: 120,
    certificate: 'Case Competition Champion',
    days: [
      { day:1, category:'Case Competition', difficulty:'Easy', prompt:null, caseType:'Recommendations', focus:'Lead with your recommendation, then support it' },
      { day:2, category:'Case Competition', difficulty:'Easy', prompt:null, caseType:'General Q&A', focus:'Answer directly in your first sentence' },
      { day:3, category:'Case Competition', difficulty:'Easy', prompt:null, caseType:'Risks and Mitigations', focus:'Name the risk, explain why it matters, propose the mitigation' },
      { day:4, category:'Case Competition', difficulty:'Easy', prompt:null, caseType:'Financials', focus:'Speak in ranges not false precision — show you understand uncertainty' },
      { day:5, category:'General', difficulty:'Hard', prompt:'What is your philosophy on life?', focus:'Structure — this is training your logical flow for case presentations' },
      { day:6, category:'Case Competition', difficulty:'Medium', prompt:null, caseType:'Recommendations', focus:'Give your recommendation AND the alternative you rejected' },
      { day:7, category:'Case Competition', difficulty:'Medium', prompt:null, caseType:'General Q&A', focus:'Start every answer with a direct response, never a preamble' },
      { day:8, category:'Debate', difficulty:'Hard', prompt:'Should billionaires exist?', focus:'Argumentation training — make your case airtight' },
      { day:9, category:'Case Competition', difficulty:'Medium', prompt:null, caseType:'Risks and Mitigations', focus:'Prioritize risks by severity and probability, not just list them' },
      { day:10, category:'Case Competition', difficulty:'Medium', prompt:null, caseType:'Financials', focus:'Connect every financial point back to the strategic recommendation' },
      { day:11, category:'Interview', difficulty:'Hard', prompt:'Tell me about the most complex problem you have solved', focus:'This is your case Q&A practice — structured, clear, confident' },
      { day:12, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Recommendations', focus:'Anticipate pushback and address it before they ask' },
      { day:13, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'General Q&A', focus:'If you do not know the answer, show your reasoning process instead' },
      { day:14, category:'Business', difficulty:'Hard', prompt:'How would you disrupt an industry?', focus:'Creative thinking under pressure — key case competition skill' },
      { day:15, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Risks and Mitigations', focus:'Show second and third order consequences not just immediate risks' },
      { day:16, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Financials', focus:'Be confident about uncertainty — judges respect calibrated honesty' },
      { day:17, category:'Debate', difficulty:'Hard', prompt:'Is capitalism compatible with solving climate change?', focus:'Multi-stakeholder thinking — essential for complex cases' },
      { day:18, category:'Case Competition', difficulty:'Hard', prompt:'Your entire recommendation hinges on a partnership — defend your strategy', focus:'Hold your position under pressure' },
      { day:19, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Recommendations', focus:'Time your answer — aim for 90 seconds, sharp and complete' },
      { day:20, category:'Interview', difficulty:'Hard', prompt:'How would you handle a situation where the ethical choice and profitable choice conflict?', focus:'Values under pressure — judges test this' },
      { day:21, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'General Q&A', focus:'Flow state — everything you have learned, applied naturally' },
      { day:22, category:'Business', difficulty:'Hard', prompt:'You have 90 seconds to convince a board of directors', focus:'Compression — the hardest skill in case competitions' },
      { day:23, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Risks and Mitigations', focus:'Comprehensive risk framework — legal, financial, operational, reputational' },
      { day:24, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Financials', focus:'Tell the financial story — not just numbers but what they mean' },
      { day:25, category:'Debate', difficulty:'Hard', prompt:'Is it ever justified to break the law?', focus:'Moral reasoning under pressure' },
      { day:26, category:'Case Competition', difficulty:'Hard', prompt:'A judge believes your team lacks domain expertise — respond', focus:'Credibility under attack' },
      { day:27, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'Recommendations', focus:'The full package — structure, confidence, depth, zero filler words' },
      { day:28, category:'Business', difficulty:'Hard', prompt:'Pitch yourself as the CEO of a company you would run', focus:'Personal brand under pressure' },
      { day:29, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'General Q&A', focus:'Your hardest session — push yourself' },
      { day:30, category:'Case Competition', difficulty:'Hard', prompt:'You have 3 minutes with the CEO in an elevator — what do you say?', focus:'Final benchmark — everything you have built over 30 days in one answer' },
    ],
  },

  {
    id: 'filler-word-advanced',
    name: 'Filler Word Advanced',
    tagline: 'Zero tolerance for filler words — serious edition',
    duration: 14,
    difficulty: 'Advanced',
    focus: 'Completely eliminating filler words even under pressure',
    speakTime: 120,
    certificate: 'Filler Free',
    days: [
      { day:1, category:'General', difficulty:'Medium', prompt:'What does success mean to you?', focus:'Baseline — speak normally and note every filler word after' },
      { day:2, category:'Interview', difficulty:'Medium', prompt:'Tell me about yourself', focus:'Pause for a full second instead of every filler word — embrace the silence' },
      { day:3, category:'Debate', difficulty:'Medium', prompt:'Is social media harmful?', focus:'Slow your speaking rate by 20% — filler words come from rushing' },
      { day:4, category:'General', difficulty:'Hard', prompt:'What is your philosophy on life?', focus:'Plan your first and last sentence before speaking — filler words cluster at transitions' },
      { day:5, category:'Business', difficulty:'Medium', prompt:'You are pitching your startup', focus:'High pressure test — maintain clean delivery under stress' },
      { day:6, category:'Interview', difficulty:'Hard', prompt:'Tell me about the most complex problem you have solved', focus:'The hardest filler word scenario — complex topic, no fillers' },
      { day:7, category:'Debate', difficulty:'Hard', prompt:'Should billionaires exist?', focus:'Strong opinions breed filler words — stay clean while being passionate' },
      { day:8, category:'General', difficulty:'Hard', prompt:'How do you think AI will change humanity?', focus:'Unfamiliar topic — filler words spike when you are uncertain' },
      { day:9, category:'Business', difficulty:'Hard', prompt:'Pitch yourself as CEO', focus:'High stakes, long answer, zero filler words' },
      { day:10, category:'Interview', difficulty:'Hard', prompt:'Why should we hire you?', focus:'Practice the most common interview answer perfectly' },
      { day:11, category:'Debate', difficulty:'Hard', prompt:'Is democracy the best form of government?', focus:'Complex topic, strong position, clean delivery' },
      { day:12, category:'General', difficulty:'Hard', prompt:'What does it mean to live meaningfully?', focus:'Philosophical depth without verbal crutches' },
      { day:13, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'General Q&A', focus:'The ultimate pressure test — case competition with zero filler words' },
      { day:14, category:'Interview', difficulty:'Hard', prompt:'Tell me about yourself', focus:'Final benchmark — your cleanest delivery ever' },
    ],
  },

  {
    id: 'vocabulary-builder',
    name: 'Vocabulary Builder',
    tagline: 'Sound as smart as you actually are',
    duration: 14,
    difficulty: 'Advanced',
    focus: 'Using more varied, precise, and sophisticated vocabulary',
    speakTime: 90,
    certificate: 'Wordsmith',
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'What is your favorite hobby?', focus:'Replace any repeated word with a synonym — notice your default vocabulary' },
      { day:2, category:'General', difficulty:'Medium', prompt:'How do you handle stress?', focus:'Use at least one word today that you would not normally use in conversation' },
      { day:3, category:'Interview', difficulty:'Easy', prompt:'What are your strengths?', focus:'Replace vague words like good, nice, thing, stuff with precise alternatives' },
      { day:4, category:'Debate', difficulty:'Easy', prompt:'Is social media harmful?', focus:'Use one analogy or metaphor to explain your point' },
      { day:5, category:'General', difficulty:'Medium', prompt:'What does friendship mean to you?', focus:'Choose words for their precision — say exactly what you mean' },
      { day:6, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you faced a challenge', focus:'Use vivid verbs instead of weak ones — not said but argued, not helped but transformed' },
      { day:7, category:'Debate', difficulty:'Medium', prompt:'Should standardized testing be abolished?', focus:'Use one piece of evidence or data point even if approximate' },
      { day:8, category:'Business', difficulty:'Medium', prompt:'What makes a great company culture?', focus:'Avoid jargon — explain complex ideas in plain precise language' },
      { day:9, category:'General', difficulty:'Hard', prompt:'What is your philosophy on life?', focus:'Use language that creates imagery — make your listener see what you are describing' },
      { day:10, category:'Interview', difficulty:'Hard', prompt:'What is your greatest professional failure?', focus:'Emotional precision — find the exact word for what you felt' },
      { day:11, category:'Debate', difficulty:'Hard', prompt:'Is democracy the best form of government?', focus:'Use technical vocabulary correctly — legitimacy, sovereignty, representation' },
      { day:12, category:'Business', difficulty:'Hard', prompt:'How would you disrupt an industry?', focus:'Every sentence should add a new idea — no repetition' },
      { day:13, category:'General', difficulty:'Hard', prompt:'What does it mean to be truly free?', focus:'Philosophical precision — define your terms with care' },
      { day:14, category:'Interview', difficulty:'Hard', prompt:'Tell me about yourself', focus:'Final benchmark — richest, most precise language you have ever used' },
    ],
  },

  {
    id: 'pressure-training',
    name: 'Pressure Training',
    tagline: 'Get comfortable being uncomfortable',
    duration: 21,
    difficulty: 'Advanced',
    focus: 'Performing well under high-pressure speaking conditions',
    speakTime: 60,
    certificate: 'Pressure Tested',
    days: [
      { day:1, category:'General', difficulty:'Easy', prompt:'What is your favorite hobby?', speakTime:60, focus:'Easy start — build your baseline' },
      { day:2, category:'Debate', difficulty:'Easy', prompt:'Is social media harmful?', speakTime:60, focus:'Take an immediate strong position — no hedging' },
      { day:3, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you failed', speakTime:90, focus:'Vulnerable topic under slight pressure' },
      { day:4, category:'General', difficulty:'Hard', prompt:'What is your philosophy on life?', speakTime:90, focus:'Deep question, limited time' },
      { day:5, category:'Business', difficulty:'Medium', prompt:'Pitch your startup to investors', speakTime:90, focus:'High stakes framing — imagine real investors watching' },
      { day:6, category:'Case Competition', difficulty:'Easy', prompt:null, caseType:'General Q&A', speakTime:90, focus:'New format under pressure' },
      { day:7, category:'Debate', difficulty:'Hard', prompt:'Should billionaires exist?', speakTime:120, focus:'Complex topic, longer time, sustained argument' },
      { day:8, category:'Interview', difficulty:'Hard', prompt:'Tell me about the most complex problem you solved', speakTime:120, focus:'Structured complexity under pressure' },
      { day:9, category:'General', difficulty:'Hard', prompt:'How will AI change humanity?', speakTime:120, focus:'Unfamiliar territory — trust your thinking' },
      { day:10, category:'Business', difficulty:'Hard', prompt:'How would you disrupt an industry?', speakTime:120, focus:'Creative thinking under time pressure' },
      { day:11, category:'Case Competition', difficulty:'Medium', prompt:null, caseType:'Recommendations', speakTime:120, focus:'Decision making under pressure' },
      { day:12, category:'Debate', difficulty:'Hard', prompt:'Is democracy the best form of government?', speakTime:120, focus:'Defend a complex position for the full 2 minutes' },
      { day:13, category:'Interview', difficulty:'Hard', prompt:'Why should we hire you?', speakTime:120, focus:'Self-advocacy under pressure' },
      { day:14, category:'General', difficulty:'Hard', prompt:'What does it mean to live meaningfully?', speakTime:120, focus:'Half way point — notice how much stronger you are than Day 1' },
      { day:15, category:'Business', difficulty:'Hard', prompt:'Pitch yourself as CEO', speakTime:150, focus:'Extended pitch — fill the time with substance' },
      { day:16, category:'Case Competition', difficulty:'Hard', prompt:null, caseType:'General Q&A', speakTime:150, focus:'Extended case answer' },
      { day:17, category:'Debate', difficulty:'Hard', prompt:'Should there be limits on free speech?', speakTime:150, focus:'Nuanced position held for 2:30' },
      { day:18, category:'Interview', difficulty:'Hard', prompt:'Tell me about the most important decision you ever made', speakTime:150, focus:'Personal depth under extended pressure' },
      { day:19, category:'General', difficulty:'Hard', prompt:'What is your philosophy on life?', speakTime:180, focus:'Your longest session — fill every second with meaning' },
      { day:20, category:'Business', difficulty:'Hard', prompt:'You have 90 seconds — pitch to the board', speakTime:180, focus:'The irony — 3 minutes to practice a 90 second pitch' },
      { day:21, category:'Case Competition', difficulty:'Hard', prompt:'You are 6 months into implementation and results are below expectations', speakTime:180, focus:'Final benchmark — your hardest, longest, most pressurized session' },
    ],
  },

  {
    id: 'leadership-voice',
    name: 'Leadership Voice',
    tagline: 'Sound like someone worth following',
    duration: 21,
    difficulty: 'Advanced',
    focus: 'Executive presence, vision communication, inspiring language',
    speakTime: 120,
    certificate: 'Leadership Voice',
    days: [
      { day:1, category:'Business', difficulty:'Easy', prompt:'What makes a good leader?', focus:'Speak about leadership as if you already are one' },
      { day:2, category:'Motivational', difficulty:'Medium', prompt:'How do you stay motivated when you do not see results?', focus:'Inspire yourself first — authentic motivation is contagious' },
      { day:3, category:'Business', difficulty:'Medium', prompt:'How would you build a team from scratch?', focus:'Talk about people as your most important resource' },
      { day:4, category:'Interview', difficulty:'Medium', prompt:'Tell me about a time you led through uncertainty', focus:'Show calm and direction even when you did not have all the answers' },
      { day:5, category:'Motivational', difficulty:'Hard', prompt:'Give a speech to someone who has completely given up', focus:'Find the language that actually moves people' },
      { day:6, category:'Business', difficulty:'Hard', prompt:'How do you maintain innovation as a company grows?', focus:'Visionary thinking — see further than the immediate problem' },
      { day:7, category:'Business', difficulty:'Medium', prompt:'How do you keep employees motivated?', focus:'Show you understand what people actually need' },
      { day:8, category:'Interview', difficulty:'Hard', prompt:'How would you turn around a team with low morale?', focus:'Empathy and direction at the same time' },
      { day:9, category:'Motivational', difficulty:'Hard', prompt:'What would you say to a room of people who feel like they are not enough?', focus:'The hardest leadership speech — speak to the person, not the crowd' },
      { day:10, category:'Business', difficulty:'Hard', prompt:'How do you build a culture that survives rapid growth?', focus:'Concrete mechanisms not just values' },
      { day:11, category:'Interview', difficulty:'Hard', prompt:'Describe a time you had to make an unpopular decision and stand by it', focus:'Courage of conviction — leaders do not fold under pressure' },
      { day:12, category:'Motivational', difficulty:'Hard', prompt:'Give a speech about why failure is not the opposite of success', focus:'Reframe — the best leaders change how people see things' },
      { day:13, category:'Business', difficulty:'Hard', prompt:'What is your vision for where your industry will be in 10 years?', focus:'Speak with conviction about an uncertain future' },
      { day:14, category:'Interview', difficulty:'Hard', prompt:'How would you build trust with a team burned by poor leadership?', focus:'Repair and rebuild — a critical leadership skill' },
      { day:15, category:'Motivational', difficulty:'Hard', prompt:'Speak about the relationship between discipline and freedom', focus:'Paradox resolution — great leaders explain what seems contradictory' },
      { day:16, category:'Business', difficulty:'Hard', prompt:'How do you create alignment across competing interests?', focus:'Coalition building — the unglamorous core of leadership' },
      { day:17, category:'Interview', difficulty:'Hard', prompt:'Tell me about a time you drove meaningful change', focus:'Change agent framing — leaders make things different' },
      { day:18, category:'Motivational', difficulty:'Hard', prompt:'What would you say to someone who is afraid to be seen?', focus:'Permission giving — the most human leadership speech' },
      { day:19, category:'Business', difficulty:'Hard', prompt:'Pitch yourself as the CEO of a company you would run', focus:'Full leadership presence — vision, credibility, humanity' },
      { day:20, category:'Motivational', difficulty:'Hard', prompt:'Give a speech about why the world needs people who refuse to give up', focus:'Inspire a room — forget the scoring, just move people' },
      { day:21, category:'Business', difficulty:'Hard', prompt:'What is the most important thing you know about building something that lasts?', focus:'Final benchmark — your most complete expression of leadership voice' },
    ],
  },

  {
    id: 'political-speaker',
    name: 'Political Speaker',
    tagline: 'Argue policy, defend positions, and think like a statesperson',
    duration: 14,
    difficulty: 'Advanced',
    focus: 'Political argumentation, policy analysis, and civic communication',
    speakTime: 120,
    certificate: 'Political Speaker',
    days: [
      { day:1, category:'Politics', difficulty:'Easy', prompt:'What is the role of a president?', focus:'Define before you argue — establish the framework' },
      { day:2, category:'Politics', difficulty:'Medium', prompt:'Should voting be mandatory?', focus:'Balance individual freedom with civic obligation' },
      { day:3, category:'Debate', difficulty:'Medium', prompt:'Should the voting age be lowered?', focus:'Use demographic and developmental evidence' },
      { day:4, category:'Politics', difficulty:'Medium', prompt:'How does social media change politics?', focus:'Multi-directional effects — show nuance' },
      { day:5, category:'Law', difficulty:'Medium', prompt:'Should drugs be decriminalized?', focus:'Policy argument — social, economic, and moral dimensions' },
      { day:6, category:'Politics', difficulty:'Hard', prompt:'Is liberal democracy in decline?', focus:'Historical framing — situate the present in a longer arc' },
      { day:7, category:'Debate', difficulty:'Hard', prompt:'Should there be limits on free speech?', focus:'Rights in tension — show you understand both sides deeply' },
      { day:8, category:'Politics', difficulty:'Hard', prompt:'Is the nation state still the right unit of political organization?', focus:'Structural critique — argue about the system itself' },
      { day:9, category:'Law', difficulty:'Hard', prompt:'How should the law balance free speech with preventing harm?', focus:'Legal and political reasoning together' },
      { day:10, category:'Politics', difficulty:'Hard', prompt:'How should democracies handle existential risks like AI and climate change?', focus:'Institutional design — how do we make better collective decisions' },
      { day:11, category:'Debate', difficulty:'Hard', prompt:'Is capitalism compatible with solving climate change?', focus:'Economic and political systems in tension' },
      { day:12, category:'Politics', difficulty:'Hard', prompt:'Is there a point at which economic inequality becomes incompatible with political equality?', focus:'The deepest political question — power and distribution' },
      { day:13, category:'Law', difficulty:'Hard', prompt:'Is civil disobedience ever legally or morally justified?', focus:'When law and justice conflict' },
      { day:14, category:'Politics', difficulty:'Hard', prompt:'What is the most important political reform no mainstream party will advocate for?', focus:'Final benchmark — your most complete political argument' },
    ],
  },
]

// ── Recommendation Logic ───────────────────────────────────────────────────────
// answers: { goal: string, level: string, time: string, mainGoal: string }
export function getRecommendations(answers) {
  const { goal, level } = answers
  const isAdv = level === 'advanced'
  const isInt = level === 'intermediate'
  const isBeg = level === 'beginner' || level === 'getting-started'

  const score = {}
  PROGRAMS.forEach(p => { score[p.id] = 0 })

  // Primary goal signal (strongest weight)
  if (goal === 'filler') {
    if (isBeg) score['filler-word-eliminator'] += 10
    else score['filler-word-advanced'] += 10
  } else if (goal === 'confidence') {
    if (isBeg) score['confidence-starter'] += 10
    else score['leadership-voice'] += 10
  } else if (goal === 'structure') {
    score['structure-master'] += 10
  } else if (goal === 'quick-thinking') {
    score['quick-thinker'] += 10
  } else if (goal === 'interview') {
    score['interview-ready'] += 10
  } else if (goal === 'business') {
    score['business-communication'] += 10
  } else if (goal === 'case-competition') {
    score['case-competition-mastery'] += 10
  } else if (goal === 'debate') {
    if (isAdv) score['political-speaker'] += 10
    else score['debate-foundations'] += 10
  }

  // Level modifier
  if (level === 'beginner') {
    score['first-words'] += 6
    score['confidence-starter'] += 4
    score['filler-word-eliminator'] += 3
    score['quick-thinker'] += 3
  } else if (level === 'getting-started') {
    score['filler-word-eliminator'] += 4
    score['confidence-starter'] += 4
    score['quick-thinker'] += 4
    score['first-words'] += 2
  } else if (level === 'intermediate') {
    score['structure-master'] += 4
    score['interview-ready'] += 4
    score['debate-foundations'] += 3
    score['storytelling-basics'] += 3
    score['vocabulary-builder'] += 3
  } else if (level === 'advanced') {
    score['case-competition-mastery'] += 4
    score['pressure-training'] += 4
    score['leadership-voice'] += 3
    score['political-speaker'] += 3
    score['filler-word-advanced'] += 3
  }

  // Sort by score and return top 3
  const ranked = PROGRAMS
    .map(p => ({ program: p, score: score[p.id] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.program)

  return ranked
}

// ── Recommendation reason strings ─────────────────────────────────────────────
export function getRecommendationReason(programId, answers) {
  const reasons = {
    'filler-word-eliminator': 'You\'re at the right level to build clean speech habits from the ground up — 7 focused days that rewire your filler word instincts.',
    'filler-word-advanced': 'You\'re ready for zero tolerance — this program puts you in high-pressure situations where filler words are hardest to control.',
    'first-words': 'This program meets you exactly where you are and builds speaking confidence through short, achievable daily sessions.',
    'quick-thinker': 'Training instant response is the fastest way to sound more confident — no prep time, just speak.',
    'confidence-starter': 'Ten focused days of directness and commitment will transform how you come across in any conversation.',
    'structure-master': 'Organized thinking is the single biggest upgrade most speakers can make — this program gives you the framework.',
    'interview-ready': 'Three weeks of deliberate interview practice across every question type you will face — nothing left to chance.',
    'debate-foundations': 'Learning to argue any side of any issue is the fastest path to becoming a genuinely persuasive speaker.',
    'storytelling-basics': 'Great stories are the difference between forgettable and unforgettable — this program teaches you the structure.',
    'business-communication': 'Speaking like you belong in the room is a learnable skill — this program builds it systematically.',
    'case-competition-mastery': '30 days of intense case prep across every format judges use — structure, Q&A, financials, and pressure.',
    'filler-word-advanced': 'Advanced filler word elimination under pressure — the standard for polished professional delivery.',
    'vocabulary-builder': 'Your ideas deserve better words — this program sharpens your language to match the quality of your thinking.',
    'pressure-training': 'Progressive overload for your speaking muscles — each week gets harder and you get stronger.',
    'leadership-voice': 'Executive presence is developed, not born — 21 days of deliberate practice in the language of leadership.',
    'political-speaker': 'Political argumentation is the highest difficulty setting for public speaking — this program prepares you for it.',
  }
  return reasons[programId] || 'A great match for your current goals and speaking level.'
}

// ── Helper ────────────────────────────────────────────────────────────────────
export function getProgram(id) {
  return PROGRAMS.find(p => p.id === id) || null
}

export function getProgramsByDifficulty(diff) {
  return PROGRAMS.filter(p => p.difficulty === diff)
}

export const DIFFICULTY_ORDER = ['Beginner', 'Intermediate', 'Advanced']
