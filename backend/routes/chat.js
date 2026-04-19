const express = require('express')
const router = express.Router()
const { supabase } = require('../services/supabase')
const { answerQuestion } = require('../services/claude')

// POST /api/chat
router.post('/', async (req, res) => {
  const { question, language = 'en' } = req.body
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required' })

  try {
    // Fetch recent stories from DB to use as grounding context for Claude
    const { data: stories } = await supabase
      .from('stories')
      .select('text, translations, categories, location, language')
      .order('created_at', { ascending: false })
      .limit(15)

    const answer = await answerQuestion(question, language, stories || [])
    res.json({ answer, storyCount: stories?.length || 0 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/chat/suggestions — returns one story snippet per category as suggestions
router.get('/suggestions', async (req, res) => {
  const { lang = 'en' } = req.query
  try {
    const { data: stories } = await supabase
      .from('stories')
      .select('text, translations, categories, location')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!stories?.length) return res.json([])

    // Pick one story per category, build a suggestion question from it
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

    res.json(suggestions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
