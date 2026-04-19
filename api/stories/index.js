import { supabase } from '../_lib/supabase.js'
import { translateToAllLanguages } from '../_lib/translate.js'
import { requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { lang = 'en', cat } = req.query
    let query = supabase.from('stories').select('*').order('created_at', { ascending: false })
    if (cat && cat !== 'all') query = query.contains('categories', [cat])

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    const stories = data.map(s => ({
      ...s,
      text: s.translations?.[lang] || s.translations?.en || s.text,
    }))
    return res.json(stories)
  }

  if (req.method === 'POST') {
    const user = await requireAuth(req, res)
    if (!user) return

    const { text, categories, language, location, mediaUrl } = req.body
    if (!text || !categories?.length || !location)
      return res.status(400).json({ error: 'Missing required fields' })

    try {
      const translations = await translateToAllLanguages(text, language)
      const { data, error } = await supabase.from('stories').insert({
        text, categories, language, location,
        media_url: mediaUrl || null,
        translations,
        user_id: user.id,
      }).select().single()

      if (error) throw error
      return res.status(201).json(data)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
