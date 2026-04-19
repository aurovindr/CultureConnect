import { supabase } from '../_lib/supabase.js'
import { translateToAllLanguages } from '../_lib/translate.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' })

  const user = await requireAuth(req, res)
  if (!user) return

  const { id } = req.query
  const { text, categories, language, location, mediaUrl } = req.body

  const { data: existing, error: fetchErr } = await supabase
    .from('stories').select('user_id, text').eq('id', id).single()

  if (fetchErr || !existing) return res.status(404).json({ error: 'Story not found' })
  if (existing.user_id !== user.id) return res.status(403).json({ error: 'Not authorised to edit this story' })

  try {
    const updates = { categories, location, media_url: mediaUrl || null }

    if (text && text !== existing.text) {
      updates.text = text
      updates.translations = await translateToAllLanguages(text, language)
      updates.language = language
    }

    const { data, error } = await supabase
      .from('stories').update(updates).eq('id', id).select().single()

    if (error) throw error
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
