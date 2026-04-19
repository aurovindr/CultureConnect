const express = require('express')
const router = express.Router()
const { supabase } = require('../services/supabase')
const { translateStory, simplifyStory } = require('../services/claude')

// GET /api/stories?lang=en&cat=food
router.get('/', async (req, res) => {
  const { lang = 'en', cat } = req.query
  let query = supabase.from('stories').select('*').order('created_at', { ascending: false })
  if (cat && cat !== 'all') query = query.contains('categories', [cat])

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  // Serve text in requested language, fall back to English
  const stories = data.map(s => ({
    ...s,
    title: s.translations?.[lang]?.title || s.title,
    text: s.translations?.[lang]?.text || s.text,
  }))

  res.json(stories)
})

// POST /api/stories
router.post('/', async (req, res) => {
  const { text, categories, language, location, mediaUrl } = req.body
  if (!text || !categories?.length || !location) return res.status(400).json({ error: 'Missing required fields' })

  try {
    // Run translation and simplification in parallel
    const [translations, simplified] = await Promise.all([
      translateStory(text, language),
      simplifyStory(text, language),
    ])

    const { data, error } = await supabase.from('stories').insert({
      text,
      simplified,
      categories,
      language,
      location,
      media_url: mediaUrl || null,
      translations,   // { fr: {...}, hi: {...}, ta: {...}, kn: {...} }
    }).select().single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
