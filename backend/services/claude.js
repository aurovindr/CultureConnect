const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGES = { en: 'English', fr: 'French', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada' }

const SYSTEM_PROMPT = `You are a knowledgeable cultural guide specializing in global cultures, traditions, festivals, food, and history.
Respond with simplified, accurate, and engaging insights. Keep answers concise (2-4 sentences for simple facts, up to a short paragraph for complex topics).
Use friendly, accessible language suitable for a general audience. When relevant, highlight what makes the cultural element unique or why it matters.`

async function answerQuestion(question, lang) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `Answer this cultural question in ${LANGUAGES[lang] || 'English'}: ${question}` }],
  })
  return response.content[0].text.trim()
}

module.exports = { answerQuestion }
