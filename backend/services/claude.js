const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGES = { en: 'English', fr: 'French', hi: 'Hindi', ta: 'Tamil', kn: 'Kannada' }

const SYSTEM_PROMPT = `You are a knowledgeable and friendly cultural guide for CultureConnect — a platform where people share cultural stories from around the world.

When answering questions:
- Draw on the community stories provided as context whenever relevant
- Give simplified, accurate, and engaging insights
- Keep answers concise (2-4 sentences for simple facts, a short paragraph for complex topics)
- Use friendly, accessible language for a general audience
- Highlight what makes the cultural element unique or why it matters
- If community stories are relevant, naturally reference them (e.g. "As shared by our community from Chennai...")
- Respond in the language requested`

async function answerQuestion(question, lang, stories = []) {
  // Build context block from DB stories
  let contextBlock = ''
  if (stories.length > 0) {
    const storyLines = stories.map(s => {
      const text = s.translations?.[lang] || s.translations?.en || s.text
      return `- [${(s.categories || []).join(', ')} | ${s.location}]: ${text}`
    }).join('\n')
    contextBlock = `\n\nCommunity stories from our platform (use as context if relevant):\n${storyLines}`
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: `Answer this cultural question in ${LANGUAGES[lang] || 'English'}: ${question}${contextBlock}`,
    }],
  })

  return response.content[0].text.trim()
}

module.exports = { answerQuestion }
