import { supabase } from '../../../lib/supabase'

export async function GET(req) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find today's top scorer
    const { data: top } = await supabase
      .from('scores')
      .select('player_name, score')
      .order('score', { ascending: false })
      .limit(1)
      .single()

    if (top) {
      const won_on = new Date().toISOString().split('T')[0]
      await supabase.from('hall_of_fame').insert({
        player_name: top.player_name,
        score: top.score,
        won_on,
      })
    }

    // Clear the scores table
    await supabase.from('scores').delete().neq('id', 0)

    return Response.json({ ok: true, saved: top || null })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
