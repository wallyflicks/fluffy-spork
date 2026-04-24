import { supabase } from '../../../lib/supabase'

export async function POST(req) {
  try {
    const { player_name, score, category, difficulty, date } = await req.json()

    if (typeof score !== 'number') {
      return Response.json({ error: 'score is required' }, { status: 400 })
    }

    const name = (player_name || 'Anonymous').trim()

    // Try full insert with all columns first
    const { error: fullErr } = await supabase
      .from('scores')
      .insert({ player_name: name, score, category: category || null, difficulty: difficulty || null, date: date || null })

    if (!fullErr) return Response.json({ ok: true })

    // If that failed (columns might not exist in table), fall back to minimal insert
    const { error: minErr } = await supabase
      .from('scores')
      .insert({ player_name: name, score })

    if (!minErr) return Response.json({ ok: true })

    return Response.json({ error: minErr.message }, { status: 500 })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
