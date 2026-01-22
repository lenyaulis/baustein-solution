// src/components/contacts/FilterChip.jsx

export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: 999,
        border: active ? '1px solid #2563eb' : '1px solid #d1d5db',
        background: active ? '#eff6ff' : '#ffffff',
        color: active ? '#1d4ed8' : '#374151',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
