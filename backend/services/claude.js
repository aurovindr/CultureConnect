const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGES = { en: 'English', fr: 'French', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada' }

const SYSTEM_PROMPT = `You are a knowledgeable cultural guide specializing in global cultures, traditions, festivals, food, and history.
Respond with simplified, accurate, and engaging insights. Keep answers concise (2-4 sentences for simple facts, up to a short paragraph for complex topics).
Use friendly, accessible language suitable for a general audience. When relevant, highlight what makes the cultural element unique or why it matters.`

async function translateStory(text, sourceLang) {
  const targets = Object.entries(LANGUAGES).filter(([code]) => code !== sourceLang)
  const targetList = targets.map(([, name]) => name).join(', ')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: { type: 'text', text: 'You are a cultural translator. Translate accurately while preserving cultural nuance and tone. Return a JSON object only.', cache_control: { type: 'ephemeral' } },
    messages: [{
      role: 'user',
      content: `Translate this cultural story from ${LANGUAGES[sourceLang]} into ${targetList}.
Return ONLY a JSON object with language codes as keys: ${targets.map(([c]) => c).join(', ')}.

Story: "${text}"`,
    }],
  })

  const raw = response.content[0].text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(raw)
}

async function simplifyStory(text, lang) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    messages: [{ role: 'user', content: `Simplify this cultural story into 2-3 clear, engaging sentences in ${LANGUAGES[lang]}: "${text}"` }],
  })
  return response.content[0].text.trim()
}

async function answerQuestion(question, lang) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    messages: [{ role: 'user', content: `Answer this cultural question in ${LANGUAGES[lang]}: ${question}` }],
  })
  return response.content[0].text.trim()
}

module.exports = { translateStory, simplifyStory, answerQuestion }
