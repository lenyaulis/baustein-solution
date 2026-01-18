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

      <Card>
        <div
          className="form-section"
          style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}
        >
          <div className="form-section-title">Дата</div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'flex-end',
            }}
          >
            <div className="form-row" style={{ maxWidth: 220 }}>
              <label className="form-label">Показать заявки за дату</label>
              <input
                type="date"
                className="form-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Заявки исполнителю */}
      <h2 style={{ fontSize: 15, marginBottom: 8 }}>Заявки исполнителю</h2>
      <ul className="list">
        {mat.map((r) => (
          <li
            key={`mat-${r.id}`}
            style={{
              marginBottom: 8,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 13,
            }}
          >
            <Tag variant="material">Материал</Tag>
            <div>
              {r.date} — {r.quarry}
            </div>
            <div>{r.address}</div>
            <div>
              {r.material} — {r.volume} {r.unit} — {r.fromTime}-{r.toTime}
            </div>
            <div>Принимающий: {r.receiver}</div>
            <div>Клиент: {r.clientName || '—'}</div>
            <div>Исполнитель: {r.executor || 'Не определен'}</div>
          </li>
        ))}

        {srv.map((r) => (
          <li
            key={`srv-${r.id}`}
            style={{
              marginBottom: 8,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 13,
            }}
          >
            <Tag variant="service">Услуга</Tag>
            <div>{r.date}</div>
            <div>{r.serviceName}</div>
            <div>{r.address}</div>
            <div>Принимающий: {r.receiver}</div>
            <div>Клиент: {r.clientName || '—'}</div>
            <div>
              {r.countType === 'hours'
                ? `${r.hours} ч`
                : `${r.trips} рейсов`}
            </div>
            <div>Исполнитель: {r.executor || 'Не определен'}</div>
          </li>
        ))}

        {pik.map((r) => (
          <li
            key={`pik-${r.id}`}
            style={{
              marginBottom: 8,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 13,
            }}
          >
            <Tag variant="pickup">Самовывоз</Tag>
            <div>
              {r.date} — {r.quarry}
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
          </li>
        ))}

        {mat.length === 0 &&
          srv.length === 0 &&
          pik.length === 0 && (
            <li style={{ fontSize: 13, color: '#9ca3af' }}>
              На эту дату заявок исполнителю нет.
            </li>
          )}
      </ul>

      {/* Заявки карьерам */}
      <h2 style={{ fontSize: 15, margin: '12px 0 8px' }}>Заявки карьерам</h2>
      <ul className="list">
        {qrr.map((q) => (
          <li
            key={`qr-${q.id}`}
            style={{
              marginBottom: 8,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
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
          </li>
        ))}

        {qrr.length === 0 && (
          <li style={{ fontSize: 13, color: '#9ca3af' }}>
            На эту дату заявок карьерам нет.
          </li>
        )}
      </ul>
    </div>
  );
}

export default AllRequestsPage;
