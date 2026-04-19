import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import CategoryChip from '../components/CategoryChip'

const CATEGORIES = [
  { value: 'food', emoji: '🍛' },
  { value: 'culture', emoji: '🎭' },
  { value: 'tourist', emoji: '🏛️' },
  { value: 'events', emoji: '🎉' },
  { value: 'traditions', emoji: '🪔' },
  { value: 'art', emoji: '🎨' },
  { value: 'music', emoji: '🎵' },
  { value: 'nature', emoji: '🌿' },
  { value: 'other', emoji: '✨' },
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
]

const lbl = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.45rem' }
const inp = { width: '100%', fontSize: 16, padding: '0.75rem 0.9rem', minHeight: 48, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.65rem', color: '#fff', outline: 'none', WebkitAppearance: 'none', appearance: 'none' }

export default function PostStory() {
  const { t, i18n } = useTranslation()
  const fileRef = useRef()

  const [text, setText] = useState('')
  const [cats, setCats] = useState(new Set())
  const [lang, setLang] = useState(i18n.language || 'en')
  const [location, setLocation] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  function toggleCat(val) {
    setCats(prev => { const s = new Set(prev); s.has(val) ? s.delete(val) : s.add(val); return s })
  }

  function handleMedia(e) {
    const file = e.target.files[0]
    if (!file) return
    setMediaFile(file)
    setMediaPreview({ url: URL.createObjectURL(file), type: file.type })
  }

  function removeMedia() { setMediaFile(null); setMediaPreview(null); if (fileRef.current) fileRef.current.value = '' }

  async function submit() {
    if (!text.trim()) { alert(t('pleaseWriteStory')); return }
    if (cats.size === 0) { alert(t('pleaseSelectCategory')); return }
    if (!location.trim()) { alert(t('pleaseEnterLocation')); return }
    setLoading(true)
    try {
      let mediaUrl = null
      if (mediaFile) {
        const ext = mediaFile.name.split('.').pop()
        const path = `stories/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, mediaFile)
        if (upErr) throw upErr
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        mediaUrl = data.publicUrl
      }
      // POST to backend — Claude translates and stores all language versions
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), categories: [...cats], language: lang, location: location.trim(), mediaUrl }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert(t('postStory') + ' ✅')
      setText(''); setCats(new Set()); setLocation(''); removeMedia()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  function saveDraft() {
    localStorage.setItem('story_draft', JSON.stringify({ text, cats: [...cats], lang, location }))
    alert(t('draftSaved'))
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 'calc(72px + env(safe-area-inset-bottom,0px))' }}>
      <TopBar title={t('shareStory')} subtitle={t('shareSubtitle')} showLang={false} />

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '1.25rem 1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '1.25rem', padding: '1.5rem 1.25rem' }}>

          {/* Story text */}
          <div style={{ marginBottom: '1.35rem' }}>
            <label style={lbl}>{t('yourStory')} <span style={{ color: '#e94560' }}>*</span></label>
            <textarea value={text} onChange={e => setText(e.target.value)} maxLength={500} placeholder={t('storyPlaceholder')}
              style={{ ...inp, minHeight: 120, resize: 'none', lineHeight: 1.55 }} />
            <div style={{ textAlign: 'right', fontSize: '0.73rem', color: text.length > 450 ? '#e94560' : 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>
              {text.length} / 500
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '1.35rem' }}>
            <label style={lbl}>{t('category')} <span style={{ color: '#e94560' }}>*</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {CATEGORIES.map(c => (
                <CategoryChip key={c.value} label={`${c.emoji} ${t(`cat_${c.value}`)}`} selected={cats.has(c.value)} onClick={() => toggleCat(c.value)} />
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.35rem 0' }} />

          {/* Media */}
          <div style={{ marginBottom: '1.35rem' }}>
            <label style={lbl}>{t('photoVideo')} <span style={{ color: 'rgba(255,255,255,0.3)' }}>({t('optional')})</span></label>
            {!mediaPreview ? (
              <div onClick={() => fileRef.current?.click()} style={{
                border: '2px dashed rgba(255,255,255,0.18)', borderRadius: '0.75rem', padding: '2rem 1rem',
                textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
              }}>
                <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleMedia} style={{ display: 'none' }} />
                <div style={{ fontSize: '2rem' }}>📷</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{t('tapToAdd')}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)' }}>{t('mediaHint')}</p>
              </div>
            ) : (
              <div style={{ position: 'relative', borderRadius: '0.65rem', overflow: 'hidden' }}>
                {mediaPreview.type.startsWith('image/') ? (
                  <img src={mediaPreview.url} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                ) : (
                  <video src={mediaPreview.url} controls style={{ width: '100%', maxHeight: 200, display: 'block' }} />
                )}
                <button onClick={removeMedia} style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: 'rgba(0,0,0,0.65)', border: 'none', color: '#fff',
                  borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '0.9rem',
                }}>✕</button>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '1.35rem 0' }} />

          {/* Language + Location */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 130, marginBottom: '1.35rem' }}>
              <label style={lbl}>{t('language')}</label>
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ ...inp, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='rgba(255,255,255,0.5)' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.9rem center', paddingRight: '2.5rem', cursor: 'pointer' }}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: '#1a1a2e' }}>{l.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 130, marginBottom: '1.35rem' }}>
              <label style={lbl}>{t('location')} <span style={{ color: '#e94560' }}>*</span></label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder={t('locationPlaceholder')} required style={inp} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={saveDraft} style={{ flex: 1, padding: '0.85rem', minHeight: 52, borderRadius: '0.65rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }}>
              {t('saveDraft')}
            </button>
            <button onClick={submit} disabled={loading} style={{ flex: 1, padding: '0.85rem', minHeight: 52, borderRadius: '0.65rem', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'default' : 'pointer', background: loading ? 'rgba(255,255,255,0.12)' : '#e94560', border: 'none', color: '#fff', transition: 'background 0.2s' }}>
              {loading ? '…' : `${t('postStory')} ✈️`}
            </button>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  )
}
