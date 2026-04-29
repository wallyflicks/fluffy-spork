import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// ── Local filler + hedge detection ───────────────────────────────────────────
const FILLER_DEFS = [
  { word: 'um',        re: /\bum\b/gi },
  { word: 'uh',        re: /\buh\b/gi },
  { word: 'like',      re: /\blike\b/gi },
  { word: 'you know',  re: /\byou\s+know\b/gi },
  { word: 'sort of',   re: /\bsort\s+of\b/gi },
  { word: 'kind of',   re: /\bkind\s+of\b/gi },
  { word: 'basically', re: /\bbasically\b/gi },
  { word: 'literally', re: /\bliterally\b/gi },
  { word: 'right',     re: /\bright\b/gi },
  { word: 'so',        re: /\bso\b/gi },
  { word: 'actually',  re: /\bactually\b/gi },
  { word: 'honestly',  re: /\bhonestly\b/gi },
];
const HEDGE_RES = [
  /\bi\s+think\b/gi, /\bi\s+guess\b/gi, /\bmaybe\b/gi,
  /\bprobably\b/gi, /\bi\s+feel\s+like\b/gi, /\bi'?m\s+not\s+sure\b/gi,
];

function extractMetrics(transcript) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 3);
  const sentenceCount = sentences.length;
  const avgWPS = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;

  const fillerWordList = {};
  let totalFillers = 0;
  for (const { word, re } of FILLER_DEFS) {
    const n = (transcript.match(re) || []).length;
    if (n > 0) { fillerWordList[word] = n; totalFillers += n; }
  }
  const topFiller = Object.entries(fillerWordList).sort((a, b) => b[1] - a[1])[0];
  const totalHedges = HEDGE_RES.reduce((s, re) => s + (transcript.match(re) || []).length, 0);

  return { wordCount, sentenceCount, avgWPS, fillerWordList, totalFillers, topFiller, totalHedges };
}

function generateStrength(scores) {
  const highest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const msgs = {
    fillerWords: 'Clean delivery — you kept filler words to a minimum which makes your speech much easier to follow',
    clarity:     'Your sentences were clear and well-paced making your ideas easy to understand',
    structure:   'Good use of connective language — your response had a clear flow from point to point',
    confidence:  'Strong commitment to your answer — you spoke with length and conviction',
  };
  return msgs[highest];
}

function generateImprovement(scores, metrics) {
  const lowest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const { totalFillers, topFiller, wordCount, avgWPS, totalHedges } = metrics;

  if (lowest === 'fillerWords') {
    return `You used ${totalFillers} filler word${totalFillers !== 1 ? 's' : ''} — the most common was "${topFiller?.[0] || 'um'}". Try pausing silently instead of filling the gap with sound`;
  }
  if (lowest === 'clarity') {
    return avgWPS > 20
      ? `Your average sentence was ${Math.round(avgWPS)} words long — try breaking your ideas into shorter cleaner sentences`
      : 'You repeated similar words a lot — try varying your vocabulary to keep your listener engaged';
  }
  if (lowest === 'structure') {
    return 'Your response lacked connecting words — try using phrases like because, therefore, or for example to link your ideas';
  }
  // confidence
  return wordCount < 100
    ? `Your response was only ${wordCount} words — aim for at least 100 words to fully develop your answer`
    : `You used hedging phrases like I think and I guess ${totalHedges} time${totalHedges !== 1 ? 's' : ''} — try committing more directly to your statements`;
}

function generateFeedback(strength, improvement, lowestCategory) {
  const tips = {
    fillerWords: 'Next time, replace that word with a deliberate pause — silence sounds more confident than a filler.',
    clarity:     'Aim to keep each sentence to one clear idea — if you need a breath mid-sentence, split it in two.',
    structure:   "Try opening your next answer with 'There are two key points — first... and second...' to anchor your listener from the start.",
    confidence:  "Use 'for example' as a trigger — each time you make a point, follow it immediately with one specific real-world example.",
  };
  return `${strength}. ${improvement}. ${tips[lowestCategory]}`;
}

export async function POST(req) {
  try {
    const body = await req.json();

    // ── Voice-type classification ────────────────────────────────────────────
    if (body.classifyVoiceType) {
      if (!body.sessions?.length) return Response.json({ error: 'No sessions provided' }, { status: 400 });
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: `Based on the following speaking session history, identify the user's speaking archetype. Choose exactly one from these options:

- "The Rambler" — talks a lot but loses the thread, low structure scores, high word count, many filler words
- "The Robot" — very flat delivery, low confidence scores, good clarity but sounds rehearsed and stiff
- "The Closer" — strong confident delivery, good scores overall, occasionally rushes or skips nuance
- "The Storyteller" — strong on engagement and flow, sometimes sacrifices structure for narrative
- "The Overthinker" — lots of filler words and hedging language ("I think", "maybe", "sort of"), good ideas but lacks commitment
- "The Natural" — consistently well-rounded scores, speaks conversationally and clearly

Return ONLY this JSON:
{
  "type": "The Rambler",
  "tagline": "You have a lot to say — now say it in order.",
  "strengths": "One sentence about what this type does well",
  "weakness": "One sentence about the main thing to work on",
  "tip": "One specific actionable tip tailored to this type"
}

Session history: ${JSON.stringify(body.sessions)}`
        }]
      });
      const raw = msg.content[0].text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
      return Response.json(JSON.parse(raw));
    }

    // ── Normal analysis ──────────────────────────────────────────────────────
    const { transcript, topic, category, difficulty } = body;

    if (!transcript?.trim()) {
      return Response.json(
        { error: 'No speech detected. Try speaking louder or check microphone permissions.' },
        { status: 400 }
      );
    }

    const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

    // Under 10 words — skip AI entirely
    if (wordCount < 10) {
      return Response.json({
        totalScore: 14, clarity: 4, structure: 2, fillerWords: 5, confidence: 3,
        fillerWordList: {},
        feedback: "Your response was too short to evaluate properly. A meaningful answer needs at least a few sentences — try to speak for the full time given.",
        strength: "You did start speaking, which is the first step.",
        improvement: "Aim for at least 5-6 full sentences. Use the prep time to plan what you want to say before you start recording.",
        cleanedTranscript: transcript,
      });
    }

    let lengthNote = '';
    if (wordCount <= 25) {
      lengthNote = `\nCRITICAL: This response is VERY SHORT — only ${wordCount} words. Score it harshly. It cannot score above 45 regardless of quality. Clarity, structure, and confidence should all be low.`;
    } else if (wordCount <= 50) {
      lengthNote = `\nIMPORTANT: This response is short — only ${wordCount} words. It cannot score above 62. Penalize structure and confidence accordingly.`;
    } else if (wordCount <= 80) {
      lengthNote = `\nNOTE: This response is below average length — ${wordCount} words. Maximum possible score is 75. Apply appropriate penalties.`;
    }

    // Coherence pre-screening
    const wordArr = transcript.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const uniqueRatio = wordArr.length > 0 ? new Set(wordArr).size / wordArr.length : 1;
    const NOISE_WORDS = new Set(['yada','ya','yeah','yep','boo','hey','yo','hmm','hm','ha','haha','woah','wow','whoa','dunno','nah','nope','ugh','buddy','dude','whatever','lol','huh']);
    const noiseCount = wordArr.filter(w => NOISE_WORDS.has(w)).length;
    const noiseRate = wordArr.length > 0 ? noiseCount / wordArr.length : 0;
    const freqMap = {}; wordArr.forEach(w => { freqMap[w] = (freqMap[w]||0)+1; });
    const maxFreq = Object.values(freqMap).length ? Math.max(...Object.values(freqMap)) : 0;
    const incoherentFlagCount = [
      uniqueRatio < 0.4 && wordCount < 60,
      noiseRate > 0.3,
      wordCount < 50 && maxFreq > 4,
    ].filter(Boolean).length;

    if (incoherentFlagCount >= 2) {
      return Response.json({
        totalScore: 16, clarity: 3, structure: 1, fillerWords: 8, confidence: 4,
        fillerWordList: {},
        feedback: "This response did not contain a meaningful answer to the prompt. Real feedback requires real sentences.",
        strength: "You attempted to speak — that is the first step.",
        improvement: "Give a real answer next time. Even 3-4 clear sentences directly addressing the prompt will score much higher.",
        cleanedTranscript: transcript,
      });
    }

    // Extract metrics for rule-based feedback
    const metrics = extractMetrics(transcript);

    const coherenceAlert = `COHERENCE RULE: Before scoring, ask yourself — did this person actually say something meaningful? If the transcript is mostly filler words, repeated sounds, gibberish, or does not form real sentences that address the prompt, the total score cannot exceed 25 regardless of any other factor. A real response requires real words forming real ideas.\n\n`;

    const isCaseComp = category === 'Case Competition';

    const scoringBlock = isCaseComp
      ? `This is a case competition judge Q&A round. The user was given a mini business case and a specific judge question. Evaluate using the following criteria:

Score across these four categories:
- Clarity (0-25): Were ideas expressed clearly and concisely? Could a senior executive follow the argument without effort? Penalize for vague generalizations without supporting reasoning.
- Structure (0-25): Did they directly answer the judge question? Did they show structured logical reasoning (direct answer → supporting reasoning → clear takeaway) and business judgment? This is the most heavily weighted category. Penalize heavily for not answering the question asked, wandering without getting to a point, or lacking a clear conclusion.
- Filler words (0-25): Standard filler word detection. Weighted less than structure and clarity in the final score.
- Confidence & delivery (0-25): Did they sound credible and confident under pressure? Did they commit to a clear position? Penalize heavily for hedging excessively, trailing off, or sounding uncertain about their own recommendation.

CASE COMPETITION SCORING — use this exact formula for totalScore:
totalScore = round((structure × 1.2) + (clarity × 1.2) + confidence + (fillerWords × 0.6))
This weights structure at 30%, clarity at 30%, confidence at 25%, filler words at 15%.

Penalize heavily for: not directly answering the judge question, vague generalizations without supporting logic, hedging excessively, or trailing off without a clear conclusion. A great answer leads with a direct answer, follows with reasoning, and closes with a clear takeaway.${lengthNote}`

      : `Score across these four categories:
- Clarity (0-25): Can the listener easily follow the message? Are ideas expressed clearly or muddled?
- Structure (0-25): STRUCTURE SCORING — FINAL VERSION: A score of 10/25 means the response was nearly incoherent with no logical flow. Do NOT give 10/25 to a response that states a clear position, gives at least one supporting reason, provides an example or evidence, and reaches a conclusion — that is a complete argument and must score 18-22/25 minimum regardless of whether they said "first" or "second." Reserve scores below 15/25 ONLY for responses where you genuinely cannot follow what point the person is trying to make — contradicting ideas, no conclusion, or pure stream of consciousness. A conversational argument that makes a clear point and supports it deserves 18+ on structure. Period. ANY valid flow qualifies: problem-solution, story arc, point-evidence-conclusion, what-why-how, or any logical progression. Do NOT penalize for lack of signpost words.
- Filler words (0-25): Penalize for um, uh, like, you know, sort of, kind of, basically, literally, right, so, actually, honestly.
- Confidence & delivery (0-25): Does it sound assured and natural? Any rambling, trailing off, or lack of commitment to ideas?

Scoring must be honest and calibrated:
- 0-50: Significant issues with clarity or structure
- 51-65: Basic communication but noticeable weaknesses
- 66-79: Solid with clear areas to improve
- 80-89: Strong delivery with minor issues
- 90-100: Exceptional — only for truly outstanding responses

IMPORTANT LENGTH RULES — these are hard limits, never exceed them:
- Under 10 words: score 0-15 maximum
- 10-25 words: score 0-45 maximum
- 26-50 words: score 0-62 maximum
- 51-80 words: score 0-75 maximum
- 81+ words: score based purely on quality, no length cap${lengthNote}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `${coherenceAlert}You are an expert speaking coach. Analyze the following speech transcript and score it.

CRITICAL MATH RULE: The totalScore field must ALWAYS equal exactly the sum of clarity + structure + fillerWords + confidence. Double check your addition before returning.

${scoringBlock}

Also produce a "cleanedTranscript": take the raw transcript and add punctuation, capitalize sentences, and break into paragraphs at natural pauses. Do NOT change, remove, or reorder any spoken words — every word must appear exactly as said, just made readable.

Return ONLY this JSON with no extra text:
{
  "totalScore": 74,
  "clarity": 18,
  "structure": 17,
  "fillerWords": 20,
  "confidence": 19,
  "cleanedTranscript": "The full transcript with punctuation and paragraphs added, words unchanged."
}

Category: ${category}
Difficulty: ${difficulty}
Topic: ${topic}
Transcript:
${transcript}`
      }]
    });

    const raw = message.content[0].text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const data = JSON.parse(raw);

    const scores = {
      fillerWords: data.fillerWords,
      clarity:     data.clarity,
      structure:   data.structure,
      confidence:  data.confidence,
    };
    const lowestCat  = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
    const strength   = generateStrength(scores);
    const improvement = generateImprovement(scores, metrics);
    const feedback   = generateFeedback(strength, improvement, lowestCat);

    return Response.json({
      ...data,
      fillerWordList: metrics.fillerWordList,
      strength,
      improvement,
      feedback,
    });

  } catch (err) {
    console.error('analyze error:', err);
    return Response.json(
      { error: err.message || 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
