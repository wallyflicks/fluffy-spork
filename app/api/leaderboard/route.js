import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    const [top10Res, hallRes, highRes] = await Promise.all([
      supabase
        .from('scores')
        .select('id, player_name, score, created_at')
        .order('score', { ascending: false })
        .limit(10),

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
      top10: top10Res.data || [],
      hallOfFame: hallRes.data || [],
      allTimeHigh: highRes.data || null,
    })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
