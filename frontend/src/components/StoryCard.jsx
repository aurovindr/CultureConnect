import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const CAT_EMOJI = { food: '🍛', culture: '🎭', tourist: '🏛️', events: '🎉', traditions: '🪔', art: '🎨', music: '🎵', nature: '🌿', other: '✨' }

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function StoryCard({ story, animDelay = 0, currentUserId }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const lang = i18n.language

  const text      = story.translations?.[lang] || story.translations?.en || story.text || ''
  const cat       = story.categories?.[0] || story.cat || 'other'
  const catEmoji  = CAT_EMOJI[cat] || '✨'
  const isOwner   = currentUserId && story.user_id && currentUserId === story.user_id
  const isTranslated = lang !== (story.language || 'en')

  function handleShare(e) {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title: 'CultureConnect', text, url: window.location.href })
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
      {/* Media */}
      {story.media_url ? (
        <img src={story.media_url} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
          {catEmoji}
        </div>
      )}

      <div style={{ padding: '0.9rem 1rem 1rem' }}>
        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#e94560' }}>
            {catEmoji} {t(`cat_${cat}`)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
              {story.created_at ? timeAgo(story.created_at) : story.time}
            </span>
            {isOwner && (
              <button
                onClick={e => { e.stopPropagation(); navigate(`/post?id=${story.id}`) }}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.4rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', padding: '0.2rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', minHeight: 28 }}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </div>

        {/* Text */}
        <div style={{
          fontSize: '0.88rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.85)',
          display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{text}</div>

        {isTranslated && (
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.35rem' }}>
            🌐 {t('translatedByClaude')}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>📍 {story.location}</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={e => { e.stopPropagation(); setLiked(l => !l) }} style={{ background: 'none', border: 'none', color: liked ? '#e94560' : 'rgba(255,255,255,0.45)', fontSize: '0.8rem', cursor: 'pointer', minHeight: 36, padding: '0.3rem 0.4rem' }}>
              {liked ? '❤️' : '🤍'}
            </button>
            <button onClick={handleShare} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', cursor: 'pointer', minHeight: 36, padding: '0.3rem 0.4rem' }}>
              ↗️
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}
