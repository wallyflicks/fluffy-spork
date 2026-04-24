import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Try with full columns first; fall back to minimal if columns don't exist
    let scores = []
    const { data: fullData, error: fullErr } = await supabase
      .from('scores')
      .select('id, player_name, score, category, difficulty, date, created_at')
      .order('score', { ascending: false })
      .limit(20)

    if (!fullErr) {
      scores = fullData || []
    } else {
      const { data: minData } = await supabase
        .from('scores')
        .select('id, player_name, score, created_at')
        .order('score', { ascending: false })
        .limit(20)
      scores = minData || []
    }

    return Response.json({ top20: scores })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
