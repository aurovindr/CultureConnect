import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
]

const field = { marginBottom: '1.1rem' }
const label = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.45rem', letterSpacing: '0.04em', textTransform: 'uppercase' }
const input = { width: '100%', fontSize: 16, padding: '0.75rem 0.9rem', minHeight: 48, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.65rem', color: '#fff', outline: 'none', WebkitAppearance: 'none', appearance: 'none' }

export default function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', language: 'en' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { username: form.username, preferred_language: form.language } },
        })
        if (err) throw err
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        if (err) throw err
      }
      i18n.changeLanguage(form.language)
      navigate('/explore')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'env(safe-area-inset-top,1rem) 1rem env(safe-area-inset-bottom,1rem)',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: '1.25rem',
        padding: '2.5rem 1.75rem', width: '100%', maxWidth: 420,
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>🌍</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>{t('appName')}</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>{t('tagline')}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '0.65rem', padding: 3, marginBottom: '1.75rem' }}>
          {['login', 'register'].map(m => (
            <div key={m} onClick={() => setMode(m)} style={{
              flex: 1, textAlign: 'center', padding: '0.65rem 0.5rem', minHeight: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: mode === m ? 600 : 500,
              cursor: 'pointer', userSelect: 'none',
              background: mode === m ? '#e94560' : 'transparent',
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s',
            }}>
              {t(m)}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={field}>
              <label style={label}>{t('username')}</label>
              <input style={input} type="text" placeholder="e.g. sakura_tokyo" value={form.username} onChange={e => set('username', e.target.value)} autoComplete="username" />
            </div>
          )}
          <div style={field}>
            <label style={label}>{t('email')}</label>
            <input style={input} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" />
          </div>
          <div style={field}>
            <label style={label}>{t('password')}</label>
            <input style={input} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required autoComplete="current-password" />
          </div>
          <div style={field}>
            <label style={label}>{t('preferredLanguage')}</label>
            <select style={{ ...input, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='rgba(255,255,255,0.5)' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.9rem center', paddingRight: '2.5rem', cursor: 'pointer' }} value={form.language} onChange={e => set('language', e.target.value)} required>
              <option value="" disabled>{t('selectLanguage')}</option>
              {LANGUAGES.map(l => <option key={l.code} value={l.code} style={{ background: '#1a1a2e' }}>{l.label}</option>)}
            </select>
          </div>

          {error && <p style={{ color: '#e94560', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.9rem', minHeight: 52, marginTop: '0.25rem',
            background: loading ? 'rgba(255,255,255,0.12)' : '#e94560',
            border: 'none', borderRadius: '0.65rem', color: '#fff',
            fontSize: '1rem', fontWeight: 600, cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s',
          }}>
            {loading ? '…' : mode === 'login' ? t('login') : t('createAccount')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'login' ? t('noAccount') : t('haveAccount')}{' '}
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: '#e94560', fontWeight: 600, cursor: 'pointer' }}>
            {mode === 'login' ? t('register') : t('login')}
          </span>
        </p>
      </div>
    </div>
  )
}
