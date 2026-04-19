const express = require('express')
const router = express.Router()
const { supabase } = require('../services/supabase')
const { translateToAllLanguages } = require('../services/translate')
const { requireAuth } = require('../services/auth')

// GET /api/stories?lang=en&cat=food
router.get('/', async (req, res) => {
  const { lang = 'en', cat } = req.query
  let query = supabase.from('stories').select('*').order('created_at', { ascending: false })
  if (cat && cat !== 'all') query = query.contains('categories', [cat])

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  const stories = data.map(s => ({
    ...s,
    text: s.translations?.[lang] || s.translations?.en || s.text,
  }))

  res.json(stories)
})

// POST /api/stories
router.post('/', requireAuth, async (req, res) => {
  const { text, categories, language, location, mediaUrl } = req.body
  if (!text || !categories?.length || !location)
    return res.status(400).json({ error: 'Missing required fields' })

  try {
    const translations = await translateToAllLanguages(text, language)

    const { data, error } = await supabase.from('stories').insert({
      text, categories, language, location,
      media_url: mediaUrl || null,
      translations,
      user_id: req.user.id,
    }).select().single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/stories/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { text, categories, language, location, mediaUrl } = req.body

  // Verify ownership
  const { data: existing, error: fetchErr } = await supabase
    .from('stories').select('user_id, text').eq('id', id).single()

  if (fetchErr || !existing) return res.status(404).json({ error: 'Story not found' })
  if (existing.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorised to edit this story' })

  try {
    const updates = { categories, location, media_url: mediaUrl || null }

    // Re-translate only if text changed
    if (text && text !== existing.text) {
      updates.text = text
      updates.translations = await translateToAllLanguages(text, language)
      updates.language = language
    }

    const { data, error } = await supabase
      .from('stories').update(updates).eq('id', id).select().single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
