import { supabase } from '../../../lib/supabase'

export async function POST(req) {
  try {
    const { player_name, score, category, difficulty, date } = await req.json()

    if (typeof score !== 'number') {
      return Response.json({ error: 'score is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('scores')
      .insert({
        player_name: (player_name || 'Anonymous').trim(),
        score,
        category: category || null,
        difficulty: difficulty || null,
        date: date || null,
      })

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
