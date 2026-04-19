import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const item = (icon, label, path) => {
    const active = pathname === path
    return (
      <button key={path} onClick={() => navigate(path)} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '0.2rem', minHeight: 52, background: 'none', border: 'none', cursor: 'pointer',
        color: active ? '#e94560' : 'rgba(255,255,255,0.4)', WebkitTapHighlightColor: 'transparent',
        transition: 'color 0.15s',
      }}>
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{icon}</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{label}</span>
      </button>
    )
  }

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: 'rgba(15,52,96,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center',
      padding: `0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom, 0px))`,
    }}>
      {item('🏠', t('explore'), '/explore')}
      {item('🔍', t('search'), '/search')}
      <button onClick={() => navigate('/post')} style={{
        flex: 'none', margin: '0 0.5rem', background: 'none', border: 'none', cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <div style={{
          background: '#e94560', borderRadius: '50%', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', marginTop: -18, border: '3px solid #1a1a2e',
          boxShadow: '0 4px 12px rgba(233,69,96,0.45)',
        }}>＋</div>
      </button>
      {item('🤖', 'Ask', '/chat')}
      {item('👤', t('profile'), '/profile')}
    </nav>
  )
}
