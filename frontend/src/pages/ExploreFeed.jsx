import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import StoryCard from '../components/StoryCard'
import DidYouKnow from '../components/DidYouKnow'
import CategoryChip from '../components/CategoryChip'

const CATEGORIES = [
  { value: 'all',        emoji: '✨', key: 'all' },
  { value: 'food',       emoji: '🍛', key: 'cat_food' },
  { value: 'culture',    emoji: '🎭', key: 'cat_culture' },
  { value: 'tourist',    emoji: '🏛️', key: 'cat_tourist' },
  { value: 'events',     emoji: '🎉', key: 'cat_events' },
  { value: 'traditions', emoji: '🪔', key: 'cat_traditions' },
  { value: 'art',        emoji: '🎨', key: 'cat_art' },
  { value: 'music',      emoji: '🎵', key: 'cat_music' },
  { value: 'nature',     emoji: '🌿', key: 'cat_nature' },
]

function Skeleton() {
  const box = (w, h) => (
    <div style={{ width: w, height: h, borderRadius: '0.4rem', background: 'rgba(255,255,255,0.08)', animation: 'pulse 1.4s ease-in-out infinite' }} />
  )
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', overflow: 'hidden' }}>
      <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.08)', animation: 'pulse 1.4s ease-in-out infinite' }} />
      <div style={{ padding: '0.9rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {box('40%', 10)}{box('100%', 12)}{box('100%', 12)}{box('70%', 12)}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}

export default function ExploreFeed() {
  const { t, i18n } = useTranslation()
  const [cat, setCat] = useState('all')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStories = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ lang: i18n.language })
      if (cat !== 'all') params.append('cat', cat)
      const res = await fetch(`/api/stories?${params}`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setStories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [i18n.language, cat])

  useEffect(() => { fetchStories() }, [fetchStories])

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom,0px))' }}>
      <TopBar
        title="🌍 CultureConnect"
        showBack={false}
        showLang
        filterStrip={
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(c => (
              <CategoryChip
                key={c.value}
                label={`${c.emoji} ${c.value === 'all' ? 'All' : t(c.key)}`}
                selected={cat === c.value}
                onClick={() => setCat(c.value)}
                small
              />
            ))}
          </div>
        }
      />

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '1rem 1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DidYouKnow />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{t('storiesForYou')}</h2>
          {!loading && <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{stories.length} stories</span>}
        </div>

        {loading && [1, 2, 3].map(n => <Skeleton key={n} />)}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#e94560', fontSize: '0.88rem' }}>
            ⚠️ {error}
            <br />
            <button onClick={fetchStories} style={{ marginTop: '0.75rem', background: 'none', border: '1px solid #e94560', color: '#e94560', borderRadius: '0.5rem', padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
            {t('noStoriesYet')}
          </div>
        )}

        {!loading && !error && stories.map((s, i) => (
          <StoryCard key={s.id} story={s} animDelay={i * 0.05} />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
