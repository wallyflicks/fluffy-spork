import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const THRESHOLDS = {
  Easy:   { filler: '10%', structure: 1, words: 60  },
  Medium: { filler: '6%',  structure: 2, words: 100 },
  Hard:   { filler: '3%',  structure: 3, words: 150 },
};

export async function POST(req) {
  try {
    const { transcript, topic, category, difficulty } = await req.json();

    if (!transcript?.trim()) {
      return Response.json(
        { error: 'No speech detected. Try speaking louder or check microphone permissions.' },
        { status: 400 }
      );
    }

    const t = THRESHOLDS[difficulty] || THRESHOLDS.Medium;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a professional public speaking coach giving calibrated feedback based on difficulty level. Return ONLY valid JSON with no markdown.

Topic: "${topic}"
Category: "${category}"
Difficulty: "${difficulty}"
Difficulty expectations: filler rate under ${t.filler}, at least ${t.structure} signpost word(s), at least ${t.words} words spoken.
Transcript: "${transcript}"

Score everything RELATIVE to the difficulty level — the same speech should score higher on Easy than on Hard.

Return exactly this JSON:
{
  "score": <overall 0-100, difficulty-calibrated>,
  "clarity": <0-100>,
  "structure": <0-100>,
  "confidence": <0-100>,
  "filler_count": <exact total>,
  "filler_words": ["each unique filler word found"],
  "strengths": [
    "<5-6 items — each must quote specific words from transcript as evidence, mention exact counts or metrics, and reference the difficulty level where relevant>"
  ],
  "improvements": [
    "<5-6 items — each must include: exact filler word counts like 'actually ×4', quote specific unclear sentences, name missing structural elements, count hedges, note vocabulary weaknesses with specific replacement suggestions>"
  ],
  "overall_feedback": "<Explain the score: 'Score of X breaks down as: Clarity Y (reason), Structure Y (reason), Confidence Y (reason). One sentence on overall impression referencing the difficulty level.'>",
  "one_tip": "<A specific step-by-step drill referencing their actual words and topic. Never generic. Include numbered steps.>"
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
