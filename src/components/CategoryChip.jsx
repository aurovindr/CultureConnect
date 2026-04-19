export default function CategoryChip({ label, selected, onClick, small = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: small ? '0.38rem 0.85rem' : '0.5rem 0.9rem',
        minHeight: small ? 36 : 40,
        display: 'inline-flex', alignItems: 'center',
        borderRadius: '2rem',
        border: `1.5px solid ${selected ? '#e94560' : 'rgba(255,255,255,0.2)'}`,
        background: selected ? '#e94560' : 'transparent',
        color: selected ? '#fff' : 'rgba(255,255,255,0.6)',
        fontSize: small ? '0.8rem' : '0.84rem',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  )
}
