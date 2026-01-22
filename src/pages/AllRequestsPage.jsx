// src/pages/AllRequestsPage.jsx
import { useState } from 'react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';

function AllRequestsPage({
  driverMaterialRequests,
  driverServiceRequests,
  pickupRequests,
  quarryRequests,
}) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const [dateFilter, setDateFilter] = useState(todayISO);

  const sameDay = (dateStr) => {
    if (!dateStr || !dateFilter) return false;
    const d1 = new Date(dateStr);
    const d2 = new Date(dateFilter);
    if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const mat = driverMaterialRequests.filter((r) => sameDay(r.date));
  const srv = driverServiceRequests.filter((r) => sameDay(r.date));
  const pik = pickupRequests.filter((r) => sameDay(r.date));
  const qrr = quarryRequests.filter((r) => sameDay(r.date));

  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 20 }}>Все заявки</h1>

      {/* Блок выбора даты — узкая карточка с отступами */}
      <div
        style={{
          marginBottom: 16,
          maxWidth: 360,
        }}
      >
        <Card>
          <div
            className="form-section"
            style={{
              borderTop: 'none',
              paddingTop: 8,
              marginTop: 0,
              paddingLeft: 12,
              paddingRight: 12,
              paddingBottom: 12,
            }}
          >
            <div className="form-section-title">Дата</div>

            <div
              className="form-row"
              style={{
                maxWidth: 160,          // поле в 2 раза уже
              }}
            >
              <label className="form-label">Показать заявки за дату</label>
              <input
                type="date"
                className="form-input"
                style={{
                  width: '100%',
                }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </Card>
      </div>


      {/* Заявки исполнителю */}
      <h2 style={{ fontSize: 15, marginBottom: 8 }}>Заявки исполнителю</h2>

      <div
        className="requests-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 10,
          marginBottom: 16,
        }}
      >
        {mat.map((r) => (
          <div
            key={`mat-${r.id}`}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
            }}
          >
            <Tag variant="material">Материал</Tag>
            <div style={{ fontWeight: 500 }}>
              {r.date} — {r.quarry}
            </div>
            <div style={{ color: '#4b5563' }}>{r.address}</div>
            <div style={{ color: '#374151' }}>
              {r.material} — {r.volume} {r.unit}
            </div>
            <div style={{ color: '#6b7280' }}>
              Окно: {r.fromTime}-{r.toTime}
            </div>
            <div style={{ color: '#6b7280' }}>Принимающий: {r.receiver}</div>
            <div style={{ color: '#6b7280' }}>
              Клиент: {r.clientName || '—'}
            </div>
            <div style={{ color: '#6b7280' }}>
              Исполнитель: {r.executor || 'Не определен'}
            </div>
          </div>
        ))}

        {srv.map((r) => (
          <div
            key={`srv-${r.id}`}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
            }}
          >
            <Tag variant="service">Услуга</Tag>
            <div style={{ fontWeight: 500 }}>{r.date}</div>
            <div style={{ color: '#374151' }}>{r.serviceName}</div>
            <div style={{ color: '#4b5563' }}>{r.address}</div>
            <div style={{ color: '#6b7280' }}>Принимающий: {r.receiver}</div>
            <div style={{ color: '#6b7280' }}>
              Клиент: {r.clientName || '—'}
            </div>
            <div style={{ color: '#374151' }}>
              {r.countType === 'hours'
                ? `${r.hours} ч`
                : `${r.trips} рейсов`}
            </div>
            <div style={{ color: '#6b7280' }}>
              Исполнитель: {r.executor || 'Не определен'}
            </div>
          </div>
        ))}

        {pik.map((r) => (
          <div
            key={`pik-${r.id}`}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
            }}
          >
            <Tag variant="pickup">Самовывоз</Tag>
            <div style={{ fontWeight: 500 }}>
              {r.date} — {r.quarry}
            </div>
            <div style={{ color: '#374151' }}>{r.material}</div>
            <div style={{ color: '#6b7280' }}>
              Клиент: {r.clientName || '—'}
            </div>
            <div style={{ color: '#374151' }}>
              Объем: {r.volume} {r.clientUnit}
            </div>
            <div style={{ color: '#6b7280' }}>
              Водитель: {r.driverLastName || '—'}; {r.truckBrand}{' '}
              {r.truckNumber}
            </div>
          </div>
        ))}

        {mat.length === 0 && srv.length === 0 && pik.length === 0 && (
          <div
            style={{
              fontSize: 13,
              color: '#9ca3af',
              padding: 8,
            }}
          >
            На эту дату заявок исполнителю нет.
          </div>
        )}
      </div>

      {/* Заявки карьерам */}
      <h2 style={{ fontSize: 15, margin: '12px 0 8px' }}>
        Заявки карьерам
      </h2>

      <div
        className="requests-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 10,
        }}
      >
        {qrr.map((q) => (
          <div
            key={`qr-${q.id}`}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
            }}
          >
            <Tag variant="quarry">Карьер</Tag>
            <div style={{ fontWeight: 500 }}>
              {q.date} — {q.quarry}
            </div>
            <div style={{ color: '#374151' }}>
              {q.material} — {q.driverLastName}
            </div>
            <div style={{ color: '#6b7280' }}>
              {q.truckNumber} ({q.truckBrand}) — {q.volume} {q.unit} —{' '}
              {q.trips} рейсов
            </div>
          </div>
        ))}

        {qrr.length === 0 && (
          <div
            style={{
              fontSize: 13,
              color: '#9ca3af',
              padding: 8,
            }}
          >
            На эту дату заявок карьерам нет.
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRequestsPage;
