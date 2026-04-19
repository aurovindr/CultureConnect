const express = require('express')
const router = express.Router()
const { answerQuestion } = require('../services/claude')

// POST /api/chat
router.post('/', async (req, res) => {
  const { question, language = 'en' } = req.body
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required' })

  try {
    const answer = await answerQuestion(question, language)
    res.json({ answer })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
