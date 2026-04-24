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
      max_tokens: 1536,
      messages: [{
        role: 'user',
        content: `You are a strict but encouraging speaking coach. Analyze the following speech transcript and score it across these four categories:

- Clarity (0-25): Is the message easy to understand? Are sentences complete and logical?
- Structure (0-25): Does it have a clear opening, middle, and end? Does it stay on topic?
- Filler words (0-25): Penalize for um, uh, like, you know, sort of, kind of, basically, literally, right, so. List every filler word found and how many times it appeared.
- Confidence & pacing (0-25): Does it sound confident? Are there signs of rambling or trailing off?

Total score is out of 100. Be honest — do not inflate scores. A mediocre response should score 50-65, a good one 70-85, and an excellent one 85+. Only give 90+ for truly exceptional delivery.

Also produce a "cleanedTranscript": take the raw transcript and add punctuation, capitalize sentences, and break into paragraphs at natural pauses. Do NOT change, remove, or reorder any spoken words — every word must appear exactly as said, just made readable.

Return your response in this exact JSON format with no extra text:
{
  "totalScore": 74,
  "clarity": 18,
  "structure": 17,
  "fillerWords": 20,
  "confidence": 19,
  "fillerWordList": {"um": 3, "like": 5},
  "feedback": "One sentence of specific feedback here",
  "strength": "One thing they did well",
  "improvement": "The single most important thing to work on",
  "cleanedTranscript": "The full transcript with punctuation and paragraphs added, words unchanged."
}

Transcript to analyze:
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
