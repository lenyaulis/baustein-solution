// src/components/ui/Tag.jsx

const TAG_STYLES = {
  material: {
    background: '#eff6ff',
    color: '#1d4ed8',
  },
  service: {
    background: '#ecfdf5',
    color: '#15803d',
  },
  pickup: {
    background: '#fffbeb',
    color: '#92400e',
  },
  quarry: {
    background: '#f5f3ff',
    color: '#6d28d9',
  },
  default: {
    background: '#e5e7eb',
    color: '#374151',
  },
};

function Tag({ children, variant = 'default', style }) {
  const colors = TAG_STYLES[variant] || TAG_STYLES.default;

  return (
    <div
      style={{
        alignSelf: 'flex-start',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 2,
        ...colors,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Tag;
