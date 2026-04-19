import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StoryCard from '../components/StoryCard'
import DidYouKnow from '../components/DidYouKnow'
import CategoryChip from '../components/CategoryChip'

const CATEGORIES = [
  { value: 'all', emoji: '✨', key: 'all' },
  { value: 'food', emoji: '🍛', key: 'cat_food' },
  { value: 'culture', emoji: '🎭', key: 'cat_culture' },
  { value: 'tourist', emoji: '🏛️', key: 'cat_tourist' },
  { value: 'events', emoji: '🎉', key: 'cat_events' },
  { value: 'traditions', emoji: '🪔', key: 'cat_traditions' },
  { value: 'art', emoji: '🎨', key: 'cat_art' },
  { value: 'music', emoji: '🎵', key: 'cat_music' },
  { value: 'nature', emoji: '🌿', key: 'cat_nature' },
]

// Sample stories — replaced by Supabase fetch once tables are set up
const SAMPLE = [
  { id: 1, cat: 'food', emoji: '🍲', catEmoji: '🍛', title: { en: 'The Magic of Bisi Bele Bath', hi: 'बिसी बेले बाथ का जादू', fr: 'La Magie du Bisi Bele Bath', ta: 'பிசி பேல் பாத்தின் மாயம்', kn: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್‌ನ ಮಾಯೆ' }, text: { en: 'A piping hot Karnataka dish made with rice, lentils, and aromatic spices — a complete meal in a bowl, loved across generations.', hi: 'चावल, दाल और मसालों से बना कर्नाटक का यह गरम व्यंजन पीढ़ियों से प्रिय है।', fr: 'Un plat chaud du Karnataka à base de riz, lentilles et épices aromatiques.', ta: 'அரிசி, பருப்பு மற்றும் மணமான மசாலாவால் செய்யப்பட்ட கர்நாடகாவின் சூடான உணவு.', kn: 'ಅನ್ನ, ಬೇಳೆ ಮತ್ತು ಸುಗಂಧ ಮಸಾಲೆಗಳಿಂದ ತಯಾರಿಸಿದ ಕರ್ನಾಟಕದ ಬಿಸಿ ಖಾದ್ಯ.' }, author: 'Rohan M', location: 'Bengaluru, India', time: '2h ago', likes: 124, translated: true },
  { id: 2, cat: 'traditions', emoji: '🪔', catEmoji: '🪔', title: { en: 'Kolam — Art at the Doorstep', hi: 'कोलम — दहलीज पर कला', fr: "Kolam — L'Art au Seuil", ta: 'கோலம் — வாசலில் கலை', kn: 'ಕೋಲಮ್ — ಬಾಗಿಲ ಬಳಿ ಕಲೆ' }, text: { en: 'Every morning in Tamil Nadu, women draw intricate geometric patterns with rice flour at their doorsteps — welcoming prosperity and warding off evil.', hi: 'तमिलनाडु में हर सुबह महिलाएं चावल के आटे से जटिल चित्र बनाती हैं।', fr: 'Chaque matin au Tamil Nadu, les femmes dessinent des motifs géométriques à la farine de riz devant leur porte.', ta: 'தமிழ்நாட்டில் தினமும் காலையில் பெண்கள் வீட்டு வாசலில் கோலம் போடுகிறார்கள்.', kn: 'ತಮಿಳುನಾಡಿನಲ್ಲಿ ಪ್ರತಿ ಬೆಳಿಗ್ಗೆ ಮಹಿಳೆಯರು ಮನೆಯ ಮುಂದೆ ಕೋಲಮ್ ಬಿಡಿಸುತ್ತಾರೆ.' }, author: 'Priya S', location: 'Chennai, India', time: '5h ago', likes: 89, translated: true },
  { id: 3, cat: 'events', emoji: '🎉', catEmoji: '🎉', title: { en: 'Mysuru Dasara — A Royal Spectacle', hi: 'मैसूर दशहरा — एक शाही दृश्य', fr: 'Mysuru Dasara — Un Spectacle Royal', ta: 'மைசூரு தசரா — ஒரு அரச காட்சி', kn: 'ಮೈಸೂರು ದಸರಾ — ಒಂದು ರಾಜವೈಭವ' }, text: { en: 'For 10 days every October, Mysuru transforms into a city of lights. The Dasara procession draws millions worldwide.', hi: 'हर अक्टूबर में 10 दिनों के लिए मैसूर रोशनी के शहर में बदल जाता है।', fr: 'Pendant 10 jours chaque octobre, Mysuru se transforme en cité lumineuse.', ta: 'ஒவ்வொரு அக்டோபரிலும் 10 நாட்கள் மைசூரு விளக்குகளின் நகரமாக மாறுகிறது.', kn: 'ಪ್ರತಿ ಅಕ್ಟೋಬರ್‌ನಲ್ಲಿ ಮೈಸೂರು ಬೆಳಕಿನ ನಗರವಾಗಿ ಮಾರ್ಪಡುತ್ತದೆ.' }, author: 'Kavya R', location: 'Mysuru, India', time: '1d ago', likes: 312, translated: false },
  { id: 4, cat: 'food', emoji: '🥐', catEmoji: '🍛', title: { en: 'The French Art of the Croissant', hi: 'क्रोइसां की फ्रांसीसी कला', fr: "L'Art Français du Croissant", ta: 'குரோசன்னின் பிரெஞ்சு கலை', kn: 'ಕ್ರೊಯಸ್ಸಾನ್‌ನ ಫ್ರೆಂಚ್ ಕಲೆ' }, text: { en: 'A perfect croissant takes three days to make — 27 layers of butter-laminated dough. In France, it is more than breakfast; it is ritual.', hi: 'एक परफेक्ट क्रोइसां बनाने में तीन दिन लगते हैं। फ्रांस में यह सिर्फ नाश्ता नहीं, एक परंपरा है।', fr: "Un croissant parfait demande trois jours — 27 couches de pâte beurrée. En France, c'est un rituel.", ta: 'ஒரு சரியான குரோசன் தயாரிக்க மூன்று நாட்கள் ஆகும்.', kn: 'ಒಂದು ಪರಿಪೂರ್ಣ ಕ್ರೊಯಸ್ಸಾನ್ ತಯಾರಿಸಲು ಮೂರು ದಿನಗಳು ಬೇಕು.' }, author: 'Marie D', location: 'Paris, France', time: '2d ago', likes: 201, translated: true },
  { id: 5, cat: 'tourist', emoji: '🏛️', catEmoji: '🏛️', title: { en: 'Hampi — Ruins That Whisper History', hi: 'हम्पी — इतिहास की फुसफुसाती खंडहरें', fr: "Hampi — Des Ruines qui Murmurent l'Histoire", ta: 'ஹம்பி — வரலாற்றை கிசுகிசுக்கும் இடிபாடுகள்', kn: 'ಹಂಪಿ — ಇತಿಹಾಸ ಪಿಸುಗುಟ್ಟುವ ಅವಶೇಷಗಳು' }, text: { en: "Once the capital of the Vijayanagara Empire, Hampi's boulder-strewn landscape is a UNESCO World Heritage Site.", hi: 'कभी विजयनगर साम्राज्य की राजधानी रहा हम्पी अब यूनेस्को विश्व धरोहर स्थल है।', fr: "Ancienne capitale de l'Empire Vijayanagara, Hampi est un site du patrimoine mondial.", ta: 'விஜயநகர பேரரசின் தலைநகராக இருந்த ஹம்பி யுனெஸ்கோ தளமாகும்.', kn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯಾಗಿದ್ದ ಹಂಪಿ ಯುನೆಸ್ಕೋ ತಾಣ.' }, author: 'Arjun K', location: 'Hampi, India', time: '3d ago', likes: 445, translated: false },
]

export default function ExploreFeed() {
  const { t } = useTranslation()
  const [cat, setCat] = useState('all')
  const [stories, setStories] = useState(SAMPLE)

  useEffect(() => {
    // Replace with: supabase.from('stories').select('*').order('created_at', { ascending: false })
  }, [])

  const filtered = cat === 'all' ? stories : stories.filter(s => s.cat === cat)

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom,0px))' }}>
      <TopBar
        title="🌍 CultureConnect"
        showBack={false}
        showLang={true}
        filterStrip={
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(c => (
              <CategoryChip key={c.value} label={`${c.emoji} ${c.value === 'all' ? 'All' : t(c.key)}`} selected={cat === c.value} onClick={() => setCat(c.value)} small />
            ))}
          </div>
        }
      />

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '1rem 1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DidYouKnow />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{t('storiesForYou')}</h2>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{filtered.length} stories</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
            {t('noStoriesYet')}
          </div>
        ) : (
          filtered.map((s, i) => <StoryCard key={s.id} story={s} animDelay={i * 0.05} />)
        )}
      </div>

      <BottomNav />
    </div>
  )
}
