import { supabase } from '../../../lib/supabase'
import { containsInappropriateContent } from '../../../lib/contentFilter'

export async function POST(req) {
  try {
    const { rating, comment, name } = await req.json()

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return Response.json({ error: 'A rating between 1 and 5 is required' }, { status: 400 })
    }

    const cleanName    = (name    || 'Anonymous').trim()
    const cleanComment = (comment || '').trim()

    // Server-side content filter — catches any bypass of the frontend check
    if (containsInappropriateContent(cleanName) || containsInappropriateContent(cleanComment)) {
      return Response.json({ error: 'Inappropriate content detected' }, { status: 400 })
    }

    const { error } = await supabase.from('Reviews').insert({
      rating,
      comment: cleanComment || null,
      Name: cleanName,
    })

    if (error) {
      console.error('Review insert error:', error.message)
      return Response.json({ error: 'Couldn\'t submit — please try again.' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
