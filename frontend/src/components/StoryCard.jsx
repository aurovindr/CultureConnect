import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function StoryCard({ story, animDelay = 0 }) {
  const { t, i18n } = useTranslation()
  const [liked, setLiked] = useState(false)
  const lang = i18n.language

  const title = story.title?.[lang] || story.title?.en || story.title || ''
  const text  = story.text?.[lang]  || story.text?.en  || story.text  || ''
  const isTranslated = story.translated && lang !== 'en'

  function handleShare(e) {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title: 'CultureConnect', text: title, url: window.location.href })
    } else {
      navigator.clipboard?.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer',
      animation: `fadeUp 0.35s ease ${animDelay}s both`,
    }}>
      {/* Media placeholder */}
      <div style={{
        width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
      }}>
        {story.emoji}
      </div>

      <div style={{ padding: '0.9rem 1rem 1rem' }}>
        {/* Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#e94560' }}>
            {story.catEmoji} {t(`cat_${story.cat}`)}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{story.time}</span>
        </div>

        <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.4rem' }}>{title}</div>

        <div style={{
          fontSize: '0.88rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.7)',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{text}</div>

        {isTranslated && (
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.35rem' }}>
            🤖 {t('translatedByClaude')}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg,#e94560,#0f3460)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
            }}>{story.author?.[0]}</div>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{story.author}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>📍 {story.location}</span>
            <button onClick={e => { e.stopPropagation(); setLiked(l => !l) }} style={{
              background: 'none', border: 'none', color: liked ? '#e94560' : 'rgba(255,255,255,0.45)',
              fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
              minHeight: 36, padding: '0.3rem 0.4rem',
            }}>
              {liked ? '❤️' : '🤍'} {story.likes + (liked ? 1 : 0)}
            </button>
            <button onClick={handleShare} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
              fontSize: '0.8rem', cursor: 'pointer', minHeight: 36, padding: '0.3rem 0.4rem',
            }}>↗️</button>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}
