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
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an expert public speaking coach. Analyze this speech transcript and return ONLY a valid JSON object with no markdown, no code blocks, no extra text — just the raw JSON.

Topic: "${topic}"
Category: "${category}"
Difficulty: "${difficulty}"
Transcript: "${transcript}"

Return exactly this JSON structure with values based strictly on the actual transcript:
{
  "score": <overall score 0-100>,
  "clarity": <clarity score 0-100>,
  "structure": <structure score 0-100>,
  "confidence": <confidence score 0-100>,
  "filler_count": <total count of filler word occurrences>,
  "filler_words": [<unique filler words actually found, e.g. "um", "uh", "like", "you know", "basically", "I mean", "sort of", "kind of">],
  "strengths": [<2-3 specific strengths from this transcript>],
  "improvements": [<2-3 specific improvements for this transcript>],
  "overall_feedback": "<2-3 sentences of honest feedback about the actual content>",
  "one_tip": "<one specific actionable tip for this speaker>"
}`
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
