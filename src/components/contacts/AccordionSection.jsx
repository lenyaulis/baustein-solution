// src/components/contacts/AccordionSection.jsx

export default function AccordionSection({ id, title, isOpen, onToggle, children }) {
  return (
    <div
      style={{
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '10px 12px',
          background: '#f9fafb',
          border: 'none',
          borderBottom: isOpen ? '1px solid #e5e7eb' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 16, color: '#9ca3af' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '10px 12px', background: '#ffffff' }}>
          {children}
        </div>
      )}
    </div>
  );
}
