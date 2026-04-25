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

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are an expert speaking coach with years of experience helping people communicate clearly and confidently. Analyze the following speech transcript in detail and provide genuinely useful, specific coaching.

Score across these four categories:
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
