import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    const [topRes, hallRes, highRes] = await Promise.all([
      supabase
        .from('scores')
        .select('id, player_name, score, category, difficulty, date, created_at')
        .order('score', { ascending: false })
        .limit(20),

      supabase
        .from('hall_of_fame')
        .select('id, player_name, score, won_on')
        .order('won_on', { ascending: false })
        .limit(30),

      supabase
        .from('hall_of_fame')
        .select('player_name, score, won_on')
        .order('score', { ascending: false })
        .limit(1)
        .single(),
    ])

    return Response.json({
      top20: topRes.data || [],
      hallOfFame: hallRes.data || [],
      allTimeHigh: highRes.data || null,
    })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
