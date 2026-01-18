// src/components/requests/QuarryRequestList.jsx
import Tag from '../ui/Tag';

function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4L22 2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function QuarryRequestList({
  items,
  onCopy,
  onDelete,
  onOpenTelegram,
  hasTelegram,
}) {
  return (
    <ul className="list">
      {items.map((q) => (
        <li
          key={q.id}
          style={{
            marginBottom: 8,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              fontSize: 13,
            }}
          >
            <Tag variant="quarry">Карьер</Tag>
            <div>
              {q.date} — {q.quarry}
            </div>
            <div>
              {q.material} — {q.driverLastName}
            </div>
            <div>
              {q.truckNumber} ({q.truckBrand}) — {q.volume} {q.unit} —{' '}
              {q.trips} рейсов
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              marginLeft: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => onCopy(q)}
              title="Скопировать"
              style={{
                width: 28,
                height: 28,
                borderRadius: '999px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <CopyIcon />
            </button>

            {hasTelegram(q.quarry) ? (
              <button
                type="button"
                onClick={() => onOpenTelegram(q.quarry)}
                title="Открыть Telegram карьера"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '999px',
                  border: '1px solid #bbf7d0',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <SendIcon />
              </button>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                }}
              >
                Нет Telegram
              </span>
            )}

            <button
              type="button"
              onClick={() => onDelete(q.id)}
              style={{
                padding: '4px 10px',
                fontSize: 12,
                borderRadius: 6,
                border: 'none',
                background: '#b91c1c',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <TrashIcon />
                Удалить
              </span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default QuarryRequestList;
