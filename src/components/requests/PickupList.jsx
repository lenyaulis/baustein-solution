// src/components/requests/PickupList.jsx
import Tag from '../ui/Tag';

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

function EditIcon() {
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
      <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

function PickupList({ items, onEdit, onDelete }) {
  return (
    <ul className="list">
      {items.map((r) => (
        <li
          key={r.id}
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
            <Tag variant="pickup">Самовывоз</Tag>
            <div>
              {r.date} — Самовывоз — {r.quarry}
            </div>
            <div>{r.material}</div>
            <div>Клиент: {r.clientName || '—'}</div>
            <div>
              Объем: {r.volume} {r.clientUnit}
            </div>
            <div>
              Водитель: {r.driverLastName || '—'}; {r.truckBrand}{' '}
              {r.truckNumber}
            </div>

            {/* НОВЫЙ БЛОК: цены */}
            {(r.buyPrice != null || r.sellPrice != null) && (
              <div>
                {r.buyPrice != null && (
                  <span>
                    Покупка: {r.buyPrice} ₽ за {r.clientUnit}{' '}
                  </span>
                )}
                {r.sellPrice != null && (
                  <span>
                    Продажа: {r.sellPrice} ₽ за {r.clientUnit}
                  </span>
                )}
              </div>
            )}
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
              onClick={() => onEdit(r)}
              title="Редактировать"
              style={{
                width: 28,
                height: 28,
                borderRadius: '999px',
                border: '1px solid #fde68a',
                background: '#fffbeb',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <EditIcon />
            </button>

            <button
              type="button"
              onClick={() => onDelete(r.id)}
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

export default PickupList;
