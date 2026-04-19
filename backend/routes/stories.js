const express = require('express')
const router = express.Router()
const { supabase } = require('../services/supabase')
const { translateToAllLanguages } = require('../services/translate')

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
    title: s.translations?.[lang] || s.translations?.en || s.text,
    text:  s.translations?.[lang] || s.translations?.en || s.text,
  }))

  res.json(stories)
})

// POST /api/stories
router.post('/', async (req, res) => {
  const { text, categories, language, location, mediaUrl } = req.body
  if (!text || !categories?.length || !location) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Translate into all 5 languages once and store
    const translations = await translateToAllLanguages(text, language)

    const { data, error } = await supabase.from('stories').insert({
      text,
      categories,
      language,
      location,
      media_url: mediaUrl || null,
      translations,   // { en, fr, hi, ta, kn }
    }).select().single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
