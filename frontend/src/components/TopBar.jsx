import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
]

export default function TopBar({ title, subtitle, showBack = true, showLang = true, showLogout = false, filterStrip }) {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(15,52,96,0.88)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: `calc(env(safe-area-inset-top, 0px) + 0.7rem) 1rem ${filterStrip ? '0.5rem' : '0.7rem'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {showBack && (
          <button onClick={() => navigate(-1)} style={{
            minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.5rem', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0,
          }}>&#8592;</button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{subtitle}</p>}
        </div>
        {showLang && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: '2rem', padding: '0.35rem 0.7rem', minHeight: 36, flexShrink: 0,
          }}>
            <span>🌐</span>
            <select
              value={i18n.language}
              onChange={e => i18n.changeLanguage(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: '#1a1a2e' }}>{l.label}</option>)}
            </select>
          </div>
        )}
        {showLogout && (
          <button onClick={handleLogout} style={{
            minWidth: 44, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
            background: 'rgba(233,69,96,0.12)', border: '1px solid rgba(233,69,96,0.3)',
            borderRadius: '0.5rem', color: '#e94560', fontSize: '0.78rem', fontWeight: 600,
            cursor: 'pointer', flexShrink: 0, padding: '0 0.65rem',
            WebkitTapHighlightColor: 'transparent',
          }}>
            ⏻ Logout
          </button>
        )}
      </div>
      {filterStrip && <div style={{ marginTop: '0.5rem' }}>{filterStrip}</div>}
    </div>
  )
}
