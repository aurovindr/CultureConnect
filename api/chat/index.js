import { supabase } from '../_lib/supabase.js'
import { answerQuestion } from '../_lib/claude.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question, language = 'en' } = req.body
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required' })

  try {
    const { data: stories } = await supabase
      .from('stories')
      .select('text, translations, categories, location, language')
      .order('created_at', { ascending: false })
      .limit(15)

    const answer = await answerQuestion(question, language, stories || [])
    return res.json({ answer, storyCount: stories?.length || 0 })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
