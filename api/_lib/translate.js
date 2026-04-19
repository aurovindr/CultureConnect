import { v2 } from '@google-cloud/translate'

const translator = new v2.Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY })

const TARGET_LANGS = ['en', 'fr', 'hi', 'ta', 'kn']

export async function translateToAllLanguages(text, sourceLang) {
  const targets = TARGET_LANGS.filter(l => l !== sourceLang)

  const results = await Promise.all(
    targets.map(async lang => {
      const [translated] = await translator.translate(text, { from: sourceLang, to: lang })
      return [lang, translated]
    })
  )

  return Object.fromEntries([[sourceLang, text], ...results])
}
