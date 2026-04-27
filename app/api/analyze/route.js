import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

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
        totalScore: 12, clarity: 4, structure: 2, fillerWords: 25, confidence: 3,
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

    const isCaseComp = category === 'Case Competition';

    const scoringBlock = isCaseComp
      ? `This is a case competition judge Q&A round. The user was given a mini business case and a specific judge question. Evaluate using the following criteria:

Score across these four categories:
- Clarity (0-25): Were ideas expressed clearly and concisely? Could a senior executive follow the argument without effort? Penalize for vague generalizations without supporting reasoning.
- Structure (0-25): Did they directly answer the judge question? Did they show structured logical reasoning (direct answer → supporting reasoning → clear takeaway) and business judgment? This is the most heavily weighted category. Penalize heavily for not answering the question asked, wandering without getting to a point, or lacking a clear conclusion.
- Filler words (0-25): Standard filler word detection and count. Weighted less than structure and clarity in the final score.
- Confidence & delivery (0-25): Did they sound credible and confident under pressure? Did they commit to a clear position? Penalize heavily for hedging excessively, trailing off, or sounding uncertain about their own recommendation.

CASE COMPETITION SCORING — use this exact formula for totalScore:
totalScore = round((structure × 1.2) + (clarity × 1.2) + confidence + (fillerWords × 0.6))
This weights structure at 30%, clarity at 30%, confidence at 25%, filler words at 15%.

Penalize heavily for: not directly answering the judge question, vague generalizations without supporting logic, hedging excessively, or trailing off without a clear conclusion. A great answer leads with a direct answer, follows with reasoning, and closes with a clear takeaway.${lengthNote}`

      : `Score across these four categories:
- Clarity (0-25): Can the listener easily follow the message? Are ideas expressed clearly or muddled?
- Structure (0-25): Does the response have a clear sense of direction and flow? A well-structured response does NOT have to use "first, second, third" signposting. Award full marks for ANY of these valid structures: Problem → Solution → Example; Story arc (setup, conflict, resolution); Opinion → Reasoning → Evidence → Conclusion; What → Why → How; Past → Present → Future; numbered signposting; or any other coherent logical flow where the listener can follow the progression of ideas. Penalize structure ONLY when: the response jumps between unrelated ideas with no connection; there is no clear beginning or ending — it just starts mid-thought or trails off; the same point is repeated multiple times without development; or the response is purely stream of consciousness with no discernible logic. Do NOT penalize for: using a narrative or story structure instead of a list structure; not using signpost words explicitly (flow can be implicit); short responses that make one clear point well; or conversational transitions like "and the reason for that is" or "which means that". A response that tells a coherent story, makes a clear argument, or walks through a logical progression should score 18-25 even without explicit signposting.
- Filler words (0-25): Penalize for um, uh, like, you know, sort of, kind of, basically, literally, right, so, actually, honestly. List every filler word and exact count.
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
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are an expert speaking coach with years of experience helping people communicate clearly and confidently. Analyze the following speech transcript in detail and provide genuinely useful, specific coaching.

${scoringBlock}

For the feedback field, write 3-4 sentences of SPECIFIC coaching based on what they actually said. Reference their actual words, ideas, or patterns. Do not write generic advice. If they rambled about a specific topic, name it. If their structure was weak, explain exactly where it broke down. If they had a strong opening, acknowledge it specifically.${isCaseComp ? ' For case competition specifically: did they answer the judge question directly? Did they show business judgment? Did they sound credible?' : ''}

For strength: write one specific thing they did well, referencing their actual content.
For improvement: write the single most important thing to work on, with a concrete tip for how to do it next time.

Also produce a "cleanedTranscript": take the raw transcript and add punctuation, capitalize sentences, and break into paragraphs at natural pauses. Do NOT change, remove, or reorder any spoken words — every word must appear exactly as said, just made readable.

Return ONLY this JSON with no extra text:
{
  "totalScore": 74,
  "clarity": 18,
  "structure": 17,
  "fillerWords": 20,
  "confidence": 19,
  "fillerWordList": {"um": 3, "like": 5},
  "feedback": "Your specific 3-4 sentence coaching here based on what they actually said",
  "strength": "One specific thing they did well referencing their actual content",
  "improvement": "The single most important thing to work on with a concrete actionable tip",
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
    return Response.json(data);

  } catch (err) {
    console.error('analyze error:', err);
    return Response.json(
      { error: err.message || 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
