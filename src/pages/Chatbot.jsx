import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'

const CAT_EMOJI = { food: '🍛', culture: '🎭', tourist: '🏛️', events: '🎉', traditions: '🪔', art: '🎨', music: '🎵', nature: '🌿', other: '✨' }

export default function Chatbot() {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [storyCount, setStoryCount] = useState(null)
  const bottomRef = useRef()
  const textareaRef = useRef()
  const lang = i18n.language

  // Load suggestions from DB stories
  useEffect(() => {
    fetch(`/api/chat/suggestions?lang=${lang}`)
      .then(r => r.json())
      .then(data => setSuggestions(Array.isArray(data) ? data : []))
      .catch(() => setSuggestions([]))
  }, [lang])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function autoResize(el) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  async function sendMessage(text) {
    const q = (text || input).trim()
    if (!q) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setMessages(prev => [...prev, { role: 'user', text: q, time: now() }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language: lang }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStoryCount(data.storyCount)
      setMessages(prev => [...prev, { role: 'bot', text: data.answer, time: now(), translated: lang !== 'en' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: `⚠️ ${err.message || 'Could not reach the server.'}`, time: now() }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const bubble = role => ({
    maxWidth: 'calc(100% - 80px)', padding: '0.7rem 0.9rem', borderRadius: '1rem',
    fontSize: '0.9rem', lineHeight: 1.55,
    background: role === 'user' ? '#e94560' : 'rgba(255,255,255,0.07)',
    border: role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
    borderTopRightRadius: role === 'user' ? '0.2rem' : '1rem',
    borderTopLeftRadius: role === 'bot'  ? '0.2rem' : '1rem',
  })

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={`🌍 ${t('askCultures')}`} subtitle={t('poweredByClaude')} showLang />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', WebkitOverflowScrolling: 'touch' }}>

        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', gap: '1rem', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3.5rem' }}>🤖</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{t('welcomeChat')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, maxWidth: 300 }}>
              {t('welcomeChatSub')}
            </p>

            {storyCount !== null && storyCount > 0 && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', padding: '0.3rem 0.8rem' }}>
                📚 Grounded in {storyCount} community stories
              </div>
            )}

            {/* Dynamic suggestions from DB */}
            {suggestions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: 360 }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => sendMessage(`Tell me about ${s.snippet}`)} style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '0.75rem', padding: '0.65rem 0.9rem', fontSize: '0.84rem',
                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                  }}>
                    <span style={{ flexShrink: 0 }}>{CAT_EMOJI[s.category] || '✨'}</span>
                    <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {s.snippet}…
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}> · {s.location}</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // Fallback static suggestions if DB is empty
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: 360 }}>
                {['🎉 What is the significance of Diwali?', '🍛 What makes South Indian food unique?', '🏛️ Tell me about Mysuru Dasara.', '🎨 What is Kolam?'].map((s, i) => (
                  <div key={i} onClick={() => sendMessage(s)} style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '0.75rem', padding: '0.65rem 0.9rem', fontSize: '0.84rem',
                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer', textAlign: 'left',
                  }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.6rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', animation: 'fadeUp 0.25s ease both' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: m.role === 'bot' ? '1rem' : '0.8rem', background: m.role === 'bot' ? 'linear-gradient(135deg,#e94560,#0f3460)' : 'rgba(255,255,255,0.12)' }}>
              {m.role === 'bot' ? '🤖' : '👤'}
            </div>
            <div>
              <div style={bubble(m.role)} dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') }} />
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem', display: 'flex', gap: '0.35rem', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.translated && <span>🌐 {t('translatedByClaude')} ·</span>}
                <span>{m.time}</span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', animation: 'fadeUp 0.25s ease both' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#e94560,#0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🤖</div>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', borderBottomLeftRadius: '0.2rem', padding: '0.75rem 1rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              {[0, 1, 2].map(n => <div key={n} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', animation: `bounce 1.2s ease-in-out ${n * 0.18}s infinite` }} />)}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ background: 'rgba(15,52,96,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: `0.65rem 0.75rem calc(0.65rem + env(safe-area-inset-bottom,0px))`, display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1.25rem', display: 'flex', alignItems: 'flex-end', padding: '0.5rem 0.75rem' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(e.target) }}
            onKeyDown={handleKey}
            placeholder={t('askPlaceholder')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none', resize: 'none', lineHeight: 1.45, maxHeight: 100, overflowY: 'auto', fontFamily: 'inherit' }}
          />
        </div>
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: 44, height: 44, flexShrink: 0, background: input.trim() && !loading ? '#e94560' : 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '1.2rem', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
          &#9658;
        </button>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-6px);opacity:1} }
      `}</style>

      <BottomNav />
    </div>
  )
}
