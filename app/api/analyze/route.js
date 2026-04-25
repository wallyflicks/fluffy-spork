import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req) {
  try {
    const { transcript, topic, category, difficulty } = await req.json();

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
