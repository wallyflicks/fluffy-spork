import { supabase } from '../../../lib/supabase'

export async function POST(req) {
  try {
    const { player_name, score } = await req.json()

    if (!player_name?.trim() || typeof score !== 'number') {
      return Response.json({ error: 'player_name and score are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('scores')
      .insert({ player_name: player_name.trim(), score })

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
