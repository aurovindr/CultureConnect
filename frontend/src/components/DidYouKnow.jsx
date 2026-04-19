import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const snippets = {
  en: [
    'The Indian festival Pongal is celebrated for four days to thank the Sun God for a good harvest.',
    'Kannada is one of the oldest languages in the world, with a literary history spanning over 2,000 years.',
    'Tamil Nadu has more UNESCO-listed temples than any other state in India.',
    'The French tradition of Poisson d\'Avril (April Fish) dates back to the 16th century.',
    'Kolam — geometric patterns drawn with rice flour — is a daily ritual in millions of South Indian homes.',
  ],
  hi: [
    'पोंगल त्योहार चार दिनों तक सूर्य देव को धन्यवाद देने के लिए मनाया जाता है।',
    'कन्नड़ भाषा की साहित्यिक परंपरा 2,000 वर्षों से अधिक पुरानी है।',
    'तमिलनाडु में भारत के किसी भी राज्य से अधिक यूनेस्को-सूचीबद्ध मंदिर हैं।',
    'कोलम — चावल के आटे से बनाए गए चित्र — दक्षिण भारत में एक दैनिक परंपरा है।',
    'दीवाली सिर्फ रोशनी का त्योहार नहीं, बुराई पर अच्छाई की जीत का प्रतीक है।',
  ],
  fr: [
    'Le festival Pongal est célébré pendant quatre jours pour remercier le Dieu Soleil.',
    'Le kannada est l\'une des langues les plus anciennes du monde, avec plus de 2 000 ans d\'histoire.',
    'Le Tamil Nadu possède plus de temples classés par l\'UNESCO que tout autre État indien.',
    'La tradition du Poisson d\'Avril remonte au XVIe siècle.',
    'Le Kolam — motifs géométriques tracés à la farine de riz — est un rituel quotidien en Inde du Sud.',
  ],
  ta: [
    'பொங்கல் விழா நான்கு நாட்கள் சூரிய பகவானுக்கு நன்றி தெரிவிக்க கொண்டாடப்படுகிறது.',
    'கன்னட மொழியின் இலக்கிய வரலாறு 2,000 ஆண்டுகளுக்கும் மேலானது.',
    'தமிழ்நாட்டில் இந்தியாவின் வேறு எந்த மாநிலத்தையும் விட அதிக யுனெஸ்கோ கோவில்கள் உள்ளன.',
    'கோலம் — அரிசி மாவால் வரையப்படும் வடிவங்கள் — தென்னிந்தியாவில் ஒரு அன்றாட சடங்கு.',
    'தீபாவளி இருளை வெல்லும் ஒளியின் திருநாள்.',
  ],
  kn: [
    'ಪೊಂಗಲ್ ಹಬ್ಬವನ್ನು ನಾಲ್ಕು ದಿನಗಳ ಕಾಲ ಸೂರ್ಯ ದೇವರಿಗೆ ಕೃತಜ್ಞತೆ ಸಲ್ಲಿಸಲು ಆಚರಿಸಲಾಗುತ್ತದೆ.',
    'ಕನ್ನಡ ಭಾಷೆಯ ಸಾಹಿತ್ಯ ಇತಿಹಾಸ 2,000 ವರ್ಷಗಳಿಗಿಂತ ಹಳೆಯದು.',
    'ತಮಿಳುನಾಡಿನಲ್ಲಿ ಭಾರತದ ಇತರ ಯಾವ ರಾಜ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ಯುನೆಸ್ಕೋ ದೇವಾಲಯಗಳಿವೆ.',
    'ಕೋಲಮ್ — ಅಕ್ಕಿ ಹಿಟ್ಟಿನಿಂದ ಎಳೆಯಲಾದ ಚಿತ್ರಗಳು — ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ ದೈನಂದಿನ ಆಚರಣೆ.',
    'ದೀಪಾವಳಿ ಕೆಡುಕಿನ ಮೇಲೆ ಒಳಿತಿನ ವಿಜಯದ ಸಂಕೇತ.',
  ],
}

export default function DidYouKnow() {
  const { t, i18n } = useTranslation()
  const [idx, setIdx] = useState(0)
  const lang = i18n.language
  const list = snippets[lang] || snippets.en

  return (
    <div style={{
      background: 'linear-gradient(120deg,rgba(233,69,96,0.22) 0%,rgba(15,52,96,0.4) 100%)',
      border: '1px solid rgba(233,69,96,0.35)', borderRadius: '1rem',
      padding: '1rem 1.1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
    }}>
      <div style={{ fontSize: '1.6rem', flexShrink: 0, marginTop: 2 }}>💡</div>
      <div>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e94560', marginBottom: '0.25rem' }}>
          {t('didYouKnow')}
        </div>
        <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.88)' }}>
          {list[idx % list.length]}
        </div>
        <button onClick={() => setIdx(i => i + 1)} style={{
          marginTop: '0.5rem', background: 'none', border: 'none', color: '#e94560',
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: 0,
        }}>
          {t('nextSnippet')}
        </button>
      </div>
    </div>
  )
}
