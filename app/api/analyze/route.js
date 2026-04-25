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

    // ── Normal / Roast analysis ──────────────────────────────────────────────
    const { transcript, topic, category, difficulty, roastMode } = body;

    if (!transcript?.trim()) {
      return Response.json(
        { error: 'No speech detected. Try speaking louder or check microphone permissions.' },
        { status: 400 }
      );
    }

    const prompt = roastMode
      ? `You are a brutally honest, comedically savage debate coach who has seen it all and is deeply unimpressed. Your job is to roast the speaker's performance in a way that is funny, specific, and cutting — but never mean-spirited or personal. You are roasting the SPEECH, not the person. Think Simon Cowell meets a sarcastic speech teacher.

Analyze the transcript and return scores the same way as normal, but make ALL text fields (feedback, strength, improvement) funny and roast-style. Reference their actual words and specific mistakes. The more specific the roast, the funnier it is.

Examples of the tone:
- "You said 'um' 11 times. That's not a speech, that's a percussion solo."
- "Your structure had a beginning and an end but completely forgot the middle, like a sandwich with no filling."
- "Good news: you spoke for 90 seconds. Bad news: you said the same thing 4 different ways."
- "The word 'like' appeared 8 times. Like, why though?"

For the strength field: find something genuinely good but frame it with backhanded praise. Example: "Surprisingly, you did not completely lose the thread — which, given everything else, is an achievement."
For the improvement field: give real actionable advice but deliver it with a sharp edge. Example: "Pick ONE point and commit to it. You are not a jazz musician — improvising in circles does not count as structure."
For the feedback field: write 3-4 sentences of specific, funny, cutting commentary on what they actually said. Reference their real words and topics.

Scores should still be accurate and honest — the roast is in the text fields only, not in artificially lowering numbers.

Also produce a "cleanedTranscript": add punctuation and paragraph breaks. Do NOT change any spoken words.

Return ONLY this JSON:
{
  "totalScore": 74,
  "clarity": 18,
  "structure": 17,
  "fillerWords": 20,
  "confidence": 19,
  "fillerWordList": {"um": 3, "like": 5},
  "feedback": "Roast-style 3-4 sentence feedback here",
  "strength": "Backhanded compliment here",
  "improvement": "Sharp but actionable advice here",
  "cleanedTranscript": "The full transcript with punctuation added, words unchanged."
}

Category: ${category}
Difficulty: ${difficulty}
Topic: ${topic}
Transcript:
${transcript}`
      : `You are an expert speaking coach with years of experience helping people communicate clearly and confidently. Analyze the following speech transcript in detail and provide genuinely useful, specific coaching.

Score across these four categories:
- Clarity (0-25): Can the listener easily follow the message? Are ideas expressed clearly or muddled?
- Structure (0-25): Is there a clear beginning, middle, and end? Does it flow logically?
- Filler words (0-25): Penalize for um, uh, like, you know, sort of, kind of, basically, literally, right, so, actually, honestly. List every filler word and exact count.
- Confidence & delivery (0-25): Does it sound assured and natural? Any rambling, trailing off, or lack of commitment to ideas?

Scoring must be honest and calibrated:
- 0-50: Significant issues with clarity or structure
- 51-65: Basic communication but noticeable weaknesses
- 66-79: Solid with clear areas to improve
- 80-89: Strong delivery with minor issues
- 90-100: Exceptional — only for truly outstanding responses

For the feedback field, write 3-4 sentences of SPECIFIC coaching based on what they actually said. Reference their actual words, ideas, or patterns. Do not write generic advice. If they rambled about a specific topic, name it. If their structure was weak, explain exactly where it broke down. If they had a strong opening, acknowledge it specifically.

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
${transcript}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
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
