import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // Fetch enough rows to deduplicate per player server-side
    let rows = []
    const { data: fullData, error: fullErr } = await supabase
      .from('scores')
      .select('id, player_name, score, category, difficulty, date, created_at')
      .order('score', { ascending: false })
      .limit(500)

    if (!fullErr) {
      rows = fullData || []
    } else {
      const { data: minData } = await supabase
        .from('scores')
        .select('id, player_name, score, created_at')
        .order('score', { ascending: false })
        .limit(500)
      rows = minData || []
    }

    // Keep only the highest score per player (rows already sorted desc)
    const seen = new Set()
    const top20 = rows
      .filter(s => {
        const key = (s.player_name || 'Anonymous').toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .slice(0, 20)

    return Response.json({ top20 })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
