const { Translate } = require('@google-cloud/translate').v2

const translator = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY })

const TARGET_LANGS = ['en', 'fr', 'hi', 'ta', 'kn']

async function translateToAllLanguages(text, sourceLang) {
  const targets = TARGET_LANGS.filter(l => l !== sourceLang)

  const results = await Promise.all(
    targets.map(async lang => {
      const [translated] = await translator.translate(text, { from: sourceLang, to: lang })
      return [lang, translated]
    })
  )

  // Include original text for source language
  return Object.fromEntries([[sourceLang, text], ...results])
}

module.exports = { translateToAllLanguages }
