import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { lang = 'en' } = req.query
  try {
    const { data: stories } = await supabase
      .from('stories')
      .select('text, translations, categories, location')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!stories?.length) return res.json([])

    const seen = new Set()
    const suggestions = []

    for (const story of stories) {
      const cat = story.categories?.[0]
      if (!cat || seen.has(cat)) continue
      seen.add(cat)
      const text = story.translations?.[lang] || story.translations?.en || story.text
      const snippet = text.slice(0, 80).trim()
      suggestions.push({ category: cat, snippet, location: story.location })
      if (suggestions.length >= 4) break
    }

    return res.json(suggestions)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
