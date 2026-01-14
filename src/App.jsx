import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import * as XLSX from 'xlsx-js-style';
import DriverForm from './components/DriverForm';
import ServiceForm from './components/ServiceForm';
import QuarryForm from './components/QuarryForm';
import QuarryRegistriesPage from './pages/QuarryRegistriesPage';
import PickupForm from './components/PickupForm';
import HelpPage from './pages/HelpPage';

// ===== Telegram контакты карьеров =====

const QUARRY_TELEGRAM = {
  'Северка': 'marya_avtor_zhizni',
  'Шабры (УралНеруд)': 'Tatuna111',
  'Шитовской (УралНеруд)': 'Tatuna111',
  'Билимбай (УралДоломит)': 'KseniiaOk',
  'Паритет': 'koptyakizm',
};

// ===== исполнители и их Telegram =====

const EXECUTORS = [
  'Не определен',
  'Доломит',
  'Инвест',
  'Мун-Групп',
  'Мира Строй',
  'ИП Алексеев',
  'ИП Ледянкин',
  'Быков Алексей',
  'Крашенинников Сергей',
  'Кайгородов Виталий',
  'Ильдыбаев Юрий',
  'ТК УралТранс',
  'ЦентрШина',
  'ИП Майер',
  'Майер Виктор',
];

const EXECUTOR_TELEGRAM = {
  'Мира Строй': 'kamazekat',
  'ТК УралТранс': 'allex300880',
  'ИП Майер': 'MaksimMaier',
};

// ===== иконки =====

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

// ===== форматирование =====

function capitalizeWords(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
}

function formatDayMonth(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  });
}

function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// единица измерения для карьера/поставщика по названию
function getQuarryUnitByName(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('северка')) return 'тонны';
  if (n.includes('шабры')) return 'м3';
  if (n.includes('шитовской')) return 'м3';
  if (n.includes('горнощит')) return 'тонны';
  if (n.includes('седельник')) return 'тонны';
  if (n.includes('билимбай')) return 'тонны';
  if (n.includes('паритет')) return 'м3';
  if (n.includes('светлая речка')) return 'м3';
  return '';
}

// ===== шаблоны текста =====

function formatQuarryRequestText(raw) {
  const q = {
    ...raw,
    quarry: capitalizeWords(raw.quarry),
    material: capitalizeWords(raw.material),
    driverLastName: capitalizeWords(raw.driverLastName),
    truckBrand: capitalizeWords(raw.truckBrand),
    truckNumber: raw.truckNumber,
  };

  const name = q.quarry.toLowerCase();
  const manyTrips = q.trips > 1 ? 'по ' : '';
  const dateForTemplate = name.includes('светлая речка')
    ? q.date
    : formatDayMonth(q.date);

  if (name === 'северка') {
    return `
${dateForTemplate} Заявка #
От ТК Бауштайн
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material}
${manyTrips}${q.volume} ${q.unit}
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('шабры')) {
    return `
${dateForTemplate}
ТК Бауштайн
Шабры
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material}
${manyTrips}${q.volume} м3
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('шитовской')) {
    return `
${dateForTemplate}
ТК Бауштайн
Шитовской
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material}
${manyTrips}${q.volume} м3
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('горнощит')) {
    return `
${dateForTemplate}
ТК Бауштайн
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material} ${manyTrips}${q.volume} т
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('седельник')) {
    return `
${dateForTemplate} Заявка
ТК Бауштайн
${q.material}
${manyTrips}${q.volume} ${q.unit}
${q.truckBrand} ${q.truckNumber}
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('билимбай')) {
    return `
${dateForTemplate} Заявка #
От ТК Бауштайн
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material}
${manyTrips}${q.volume} т
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('паритет')) {
    return `
${dateForTemplate}
ТК Бауштайн
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material}
${manyTrips}${q.volume} м3
${q.trips} рейсов
Спасибо
`.trim();
  }

  if (name.includes('светлая речка')) {
    return `
Дата : ${q.date}
От:  ИП Меликян 
Для: ТК Бауштайн, самовывоз
ТС: ${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
Обьем: ${q.trips} рейсов, ${manyTrips}${q.volume} м3
Мат: ${q.material}
`.trim();
  }

  return `
${dateForTemplate} Заявка #
От ТК Бауштайн
${q.truckBrand} ${q.truckNumber}
${q.driverLastName}
${q.material}
${manyTrips}${q.volume} ${q.unit}
${q.trips} рейсов
Карьер: ${q.quarry}
Спасибо
`.trim();
}

function formatDriverMaterialText(raw) {
  const r = {
    ...raw,
    material: capitalizeWords(raw.material),
    address: capitalizeWords(raw.address),
    receiver: capitalizeWords(raw.receiver),
    quarry: capitalizeWords(raw.quarry),
  };

  const date = formatDayMonth(r.date);
  const times = `С ${r.fromTime} и до ${r.toTime}`;

  return `
${date}
${times}
${r.material} ${r.volume} ${r.unit} ${r.quarry}
${r.address}
Принимающий:
${r.receiver}
Сдаем по накладной Бауштайн
Безнал
${r.pricePerTrip} рейс
${r.trips} рейс
Спасибо
`.trim();
}

function formatDriverServiceText(r) {
  const data = {
    ...r,
    serviceName: capitalizeWords(r.serviceName),
    address: capitalizeWords(r.address),
    receiver: capitalizeWords(r.receiver),
  };

  const date = formatDayMonth(data.date);
  const lineCount =
    data.countType === 'hours'
      ? `${data.hours} часов`
      : `${data.trips} рейс`;

  const priceLine =
    data.unit === 'часов'
      ? `${data.price} р/час`
      : `${data.price} р/рейс`;

  return `
${date}
К ${data.toTime}
${data.serviceName}
${data.address}
Принимающий: 
${data.receiver}
Сдаем по накладной Бауштайн
Безнал
${priceLine}
${lineCount}
Спасибо
`.trim();
}

// ===== копирование / Telegram =====

async function copyTextToClipboard(text) {
  try {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
    alert('Заявка скопирована');
  } catch (e) {
    alert('Не удалось скопировать заявку');
  }
}

function openTelegram(username) {
  if (!username) {
    alert('Для этого контакта нет Telegram');
    return;
  }
  const clean = username.replace('@', '').trim();
  const url = `https://t.me/${clean}`;
  window.open(url, '_blank');
}

// ===== RequestsPage =====

function RequestsPage({
  driverMaterialRequests,
  setDriverMaterialRequests,
  driverServiceRequests,
  setDriverServiceRequests,
  quarryRequests,
  setQuarryRequests,
  pickupRequests,
  setPickupRequests,
}) {
  const [driverMode, setDriverMode] = useState('material');
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [editingMaterialData, setEditingMaterialData] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingServiceData, setEditingServiceData] = useState(null);
  const [editingPickupId, setEditingPickupId] = useState(null);
  const [editingPickupData, setEditingPickupData] = useState(null);

  const deleteDriverMaterial = (id) => {
    setDriverMaterialRequests((prev) => prev.filter((r) => r.id !== id));
    if (editingMaterialId === id) {
      setEditingMaterialId(null);
      setEditingMaterialData(null);
    }
  };

  const deleteDriverService = (id) => {
    setDriverServiceRequests((prev) => prev.filter((r) => r.id !== id));
    if (editingServiceId === id) {
      setEditingServiceId(null);
      setEditingServiceData(null);
    }
  };

  const deleteQuarryRequest = (id) => {
    setQuarryRequests((prev) => prev.filter((q) => q.id !== id));
  };

  const deletePickup = (id) => {
    setPickupRequests((prev) => prev.filter((r) => r.id !== id));
    if (editingPickupId === id) {
      setEditingPickupId(null);
      setEditingPickupData(null);
    }
  };

  const openExecutorTelegram = (executorName) => {
    const username = EXECUTOR_TELEGRAM[executorName];
    if (!username) {
      alert('Для этого исполнителя нет Telegram-контакта');
      return;
    }
    openTelegram(username);
  };

  const openTelegramChatQuarry = (quarryName) => {
    const username = QUARRY_TELEGRAM[quarryName];
    if (!username) {
      alert('Для этого карьера нет Telegram-контакта');
      return;
    }
    openTelegram(username);
  };

  const handleAddMaterial = (req) => {
    if (editingMaterialId) {
      setDriverMaterialRequests((prev) =>
        prev.map((r) => (r.id === editingMaterialId ? { ...req, id: r.id } : r))
      );
      setEditingMaterialId(null);
      setEditingMaterialData(null);
    } else {
      setDriverMaterialRequests((prev) => [...prev, req]);
    }
  };

  const handleAddService = (req) => {
    if (editingServiceId) {
      setDriverServiceRequests((prev) =>
        prev.map((r) => (r.id === editingServiceId ? { ...req, id: r.id } : r))
      );
      setEditingServiceId(null);
      setEditingServiceData(null);
    } else {
      setDriverServiceRequests((prev) => [...prev, req]);
    }
  };

  const handleAddPickup = (req) => {
    if (editingPickupId) {
      setPickupRequests((prev) =>
        prev.map((r) => (r.id === editingPickupId ? { ...req, id: r.id } : r))
      );
      setEditingPickupId(null);
      setEditingPickupData(null);
    } else {
      setPickupRequests((prev) => [...prev, req]);
    }
  };

  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 20 }}>Заявки</h1>

      <div className="chips-row">
        <NavLink
          to="/requests/drivers"
          className={({ isActive }) =>
            'chip' + (isActive ? ' chip-active' : '')
          }
        >
          Заявки исполнителю
        </NavLink>
        <NavLink
          to="/requests/quarries"
          className={({ isActive }) =>
            'chip' + (isActive ? ' chip-active' : '')
          }
        >
          Заявки карьерам
        </NavLink>
      </div>

      <Routes>
        <Route
          path="drivers"
          element={
            <>
              <div className="chips-row" style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  className={
                    'chip' + (driverMode === 'material' ? ' chip-active' : '')
                  }
                  onClick={() => {
                    setDriverMode('material');
                    setEditingServiceId(null);
                    setEditingServiceData(null);
                    setEditingPickupId(null);
                    setEditingPickupData(null);
                  }}
                >
                  Материал
                </button>
                <button
                  type="button"
                  className={
                    'chip' + (driverMode === 'service' ? ' chip-active' : '')
                  }
                  onClick={() => {
                    setDriverMode('service');
                    setEditingMaterialId(null);
                    setEditingMaterialData(null);
                    setEditingPickupId(null);
                    setEditingPickupData(null);
                  }}
                >
                  Услуга
                </button>
                <button
                  type="button"
                  className={
                    'chip' + (driverMode === 'pickup' ? ' chip-active' : '')
                  }
                  onClick={() => {
                    setDriverMode('pickup');
                    setEditingMaterialId(null);
                    setEditingMaterialData(null);
                    setEditingServiceId(null);
                    setEditingServiceData(null);
                  }}
                >
                  Самовывоз
                </button>
              </div>

              {driverMode === 'material' && (
                <>
                  <DriverForm
                    executors={EXECUTORS}
                    mode={editingMaterialId ? 'edit' : 'create'}
                    initialValues={editingMaterialData || undefined}
                    onAdd={handleAddMaterial}
                  />
                  <ul className="list">
                    {driverMaterialRequests.map((r) => (
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
                          <div>
                            {r.date} — {r.quarry}
                          </div>
                          <div>{r.address}</div>
                          <div>
                            {r.material} — {r.volume} {r.unit} —{' '}
                            {r.fromTime}-{r.toTime}
                          </div>
                          <div>Принимающий: {r.receiver}</div>
                          <div>Клиент: {r.clientName || '—'}</div>
                          <div>
                            Исполнитель: {r.executor || 'Не определен'}
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
                            onClick={() =>
                              copyTextToClipboard(formatDriverMaterialText(r))
                            }
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

                          {r.executor &&
                          r.executor !== 'Не определен' &&
                          EXECUTOR_TELEGRAM[r.executor] ? (
                            <button
                              type="button"
                              onClick={() =>
                                openExecutorTelegram(r.executor)
                              }
                              title="Открыть Telegram исполнителя"
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
                            onClick={() => {
                              setEditingMaterialId(r.id);
                              setEditingMaterialData(r);
                            }}
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
                            onClick={() => deleteDriverMaterial(r.id)}
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
                </>
              )}

              {driverMode === 'service' && (
                <>
                  <ServiceForm
                    executors={EXECUTORS}
                    mode={editingServiceId ? 'edit' : 'create'}
                    initialValues={editingServiceData || undefined}
                    onAdd={handleAddService}
                  />
                  <ul className="list">
                    {driverServiceRequests.map((r) => (
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
                          <div>
                            Исполнитель: {r.executor || 'Не определен'}
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
                            onClick={() =>
                              copyTextToClipboard(formatDriverServiceText(r))
                            }
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

                          {r.executor &&
                          r.executor !== 'Не определен' &&
                          EXECUTOR_TELEGRAM[r.executor] ? (
                            <button
                              type="button"
                              onClick={() =>
                                openExecutorTelegram(r.executor)
                              }
                              title="Открыть Telegram исполнителя"
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
                            onClick={() => {
                              setEditingServiceId(r.id);
                              setEditingServiceData(r);
                            }}
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
                            onClick={() => deleteDriverService(r.id)}
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
                </>
              )}

              {driverMode === 'pickup' && (
                <>
                  <PickupForm
                    mode={editingPickupId ? 'edit' : 'create'}
                    initialValues={editingPickupData || undefined}
                    onAdd={handleAddPickup}
                  />
                  <ul className="list">
                    {pickupRequests.map((r) => (
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
                          <div>{r.date} — Самовывоз — {r.quarry}</div>
                          <div>{r.material}</div>
                          <div>Клиент: {r.clientName || '—'}</div>
                          <div>
                            Объем: {r.volume} {r.clientUnit}
                          </div>
                          <div>
                            Водитель: {r.driverLastName || '—'}; {r.truckBrand}{' '}
                            {r.truckNumber}
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
                            onClick={() => {
                              setEditingPickupId(r.id);
                              setEditingPickupData(r);
                            }}
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
                            onClick={() => deletePickup(r.id)}
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
                </>
              )}
            </>
          }
        />

        <Route
          path="quarries"
          element={
            <div className="card">
              <h2 className="card-title">Заявка карьера</h2>
              <QuarryForm
                onAdd={(req) => setQuarryRequests((prev) => [...prev, req])}
              />
              <ul className="list">
                {quarryRequests.map((q) => (
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
                        onClick={() =>
                          copyTextToClipboard(formatQuarryRequestText(q))
                        }
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

                      {QUARRY_TELEGRAM[q.quarry] ? (
                        <button
                          type="button"
                          onClick={() => openTelegramChatQuarry(q.quarry)}
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
                        onClick={() => deleteQuarryRequest(q.id)}
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
            </div>
          }
        />
      </Routes>
    </div>
  );
}

// ===== ReportsPageInner =====

function ReportsPageInner({
  driverMaterialRequests,
  driverServiceRequests,
  pickupRequests,
}) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const weekAgoISO = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(weekAgoISO);
  const [endDate, setEndDate] = useState(todayISO);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      alert('Выбери дату "с" и "по"');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      alert('Дата "с" не может быть позже даты "по"');
      return;
    }

    setIsGenerating(true);

    try {
      const inRange = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return false;
        return d >= start && d <= end;
      };

      const materialInRange = driverMaterialRequests.filter((r) =>
        inRange(r.date)
      );
      const serviceInRange = driverServiceRequests.filter((r) =>
        inRange(r.date)
      );
      const pickupInRange = pickupRequests.filter((r) => inRange(r.date));

      const rows = [];

      // Материал
      materialInRange.forEach((r) => {
        const dateFormatted = formatDateDDMMYYYY(r.date);
        const client = r.clientName || '';
        const clientVolume = r.volume || 0;
        const clientUnit =
          r.unit === 'т' || r.unit === 'тонн' || r.unit === 'тонны'
            ? 'тонны'
            : r.unit || '';
        const clientPricePerUnit = r.clientPrice || 0;
        const clientTotal =
          clientPricePerUnit && clientVolume
            ? clientPricePerUnit * clientVolume
            : 0;

        const executor = r.executor || 'Не определен';
        const truckNumberExec = '';
        const truckBrandExec = '';
        const execCount = r.trips || 0;
        const execUnit = 'рейс';
        const execPricePerUnit = r.pricePerTrip || 0;
        const execTotal =
          execCount && execPricePerUnit ? execCount * execPricePerUnit : 0;

        const quarryName = r.quarry || '';
        const quarryVolume = r.volume || 0;
        const quarryUnit = getQuarryUnitByName(r.quarry);
        const quarryPricePerUnit = r.quarryPrice || 0;
        const quarryTotal =
          quarryPricePerUnit && quarryVolume
            ? quarryPricePerUnit * quarryVolume
            : 0;

        const profit = clientTotal - (execTotal + quarryTotal);

        rows.push([
          dateFormatted,
          r.material || '',
          r.address || '',
          client,
          clientVolume || '',
          clientUnit,
          clientPricePerUnit || '',
          clientTotal || '',
          executor,
          truckNumberExec,
          truckBrandExec,
          execCount || '',
          execUnit,
          execPricePerUnit || '',
          execTotal || '',
          quarryName,
          quarryVolume || '',
          quarryUnit,
          quarryPricePerUnit || '',
          quarryTotal || '',
          profit || '',
        ]);
      });

      // Самовывоз
      pickupInRange.forEach((r) => {
        const dateFormatted = formatDateDDMMYYYY(r.date);
        const client = r.clientName || '';

        const clientVolume = Number(r.volume) || 0;
        const clientUnit =
          r.clientUnit === 'т' ||
          r.clientUnit === 'тонн' ||
          r.clientUnit === 'тонны'
            ? 'тонны'
            : r.clientUnit || '';
        const clientPricePerUnit = Number(r.clientPrice) || 0;
        const clientTotal = clientPricePerUnit * clientVolume;

        const executor = '';
        const truckNumberExec = r.truckNumber || '';
        const truckBrandExec = r.truckBrand || '';
        const execCount = '';
        const execUnit = '';
        const execPricePerUnit = 0;
        const execTotal = 0;

        const quarryName = r.quarry || '';
        const quarryVolume = clientVolume;
        const quarryUnit = r.quarryUnit || getQuarryUnitByName(r.quarry);
        const quarryPricePerUnit = Number(r.quarryPrice) || 0;
        const quarryTotal = quarryPricePerUnit * quarryVolume;

        const profit = clientTotal - quarryTotal;

        rows.push([
          dateFormatted,
          r.material || '',
          'Самовывоз',
          client,
          clientVolume || '',
          clientUnit,
          clientPricePerUnit || '',
          clientTotal || '',
          executor,
          truckNumberExec,
          truckBrandExec,
          execCount,
          execUnit,
          execPricePerUnit,
          execTotal || '',
          quarryName,
          quarryVolume || '',
          quarryUnit,
          quarryPricePerUnit || '',
          quarryTotal || '',
          profit || '',
        ]);
      });

      // Услуга
      serviceInRange.forEach((r) => {
        const dateFormatted = formatDateDDMMYYYY(r.date);
        const client = r.clientName || '';

        let clientVolume = 0;
        let clientUnit = '';

        if (r.countType === 'hours') {
          clientVolume = Number(r.hours) || 0;
          clientUnit = 'час';
        } else {
          clientVolume = Number(r.trips) || 0;
          clientUnit = 'рейс';
        }

        const clientPricePerUnit = Number(r.clientPrice) || 0;
        const clientTotal = clientPricePerUnit * clientVolume;

        const executor = r.executor || 'Не определен';
        const truckNumberExec = '';
        const truckBrandExec = '';
        const execCount =
          r.countType === 'hours'
            ? Number(r.hours) || 0
            : Number(r.trips) || 0;
        const execUnit = r.countType === 'hours' ? 'час' : 'рейс';
        const execPricePerUnit = Number(r.price) || 0;
        const execTotal = execCount * execPricePerUnit;

        const quarryName = '';
        const quarryVolume = '';
        const quarryUnit = '';
        const quarryPricePerUnit = 0;
        const quarryTotal = '';

        const profit = clientTotal - execTotal;

        rows.push([
          dateFormatted,
          r.serviceName || '',
          r.address || '',
          client,
          clientVolume || '',
          clientUnit,
          clientPricePerUnit || '',
          clientTotal || '',
          executor,
          truckNumberExec,
          truckBrandExec,
          execCount || '',
          execUnit,
          execPricePerUnit || '',
          execTotal || '',
          quarryName,
          quarryVolume,
          quarryUnit,
          quarryPricePerUnit,
          quarryTotal,
          profit || '',
        ]);
      });

      const header = [
        'Дата',
        'Материал/Услуга',
        'Адрес',
        'Клиент',
        'Объем',
        'Ед. изм. клиента',
        'Цена за ед. клиенту',
        'Итог клиенту',
        'Исполнитель',
        'Номер ТС',
        'Марка ТС',
        'Кол-во рейсов/часов',
        'Ед. изм. исполнителя',
        'Цена за ед. исполнителю',
        'Итог исполнителю',
        'Карьер/Поставщик',
        'Объем карьера',
        'Ед. изм. карьера',
        'Цена за ед. карьеру',
        'Итог карьеру',
        'Прибыль',
      ];

      const aoa = [header, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(aoa);

      const range = XLSX.utils.decode_range(ws['!ref']);
      const yellow = { fill: { patternType: 'solid', fgColor: { rgb: 'FFFDE9' } } };
      const turquoise = { fill: { patternType: 'solid', fgColor: { rgb: 'E0FFFF' } } };
      const green = { fill: { patternType: 'solid', fgColor: { rgb: 'E8F5E9' } } };
      const orange = { fill: { patternType: 'solid', fgColor: { rgb: 'FFEFD5' } } };

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;

          if (C === 0) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...yellow };
          }
          if (C >= 8 && C <= 14) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...turquoise };
          }
          if (C >= 15 && C <= 19) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...green };
          }
          if (C === 20) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...orange };
          }
        }
      }

      const startLabel = formatDateDDMMYYYY(startDate);
      const endLabel = formatDateDDMMYYYY(endDate);
      const fileName = `report_${startLabel}-${endLabel}.xlsx`;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Отчет');
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error(e);
      alert('Не удалось сформировать отчет');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 20 }}>Отчеты</h1>

      <div
        className="card"
        style={{
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          className="form-section"
          style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}
        >
          <div className="form-section-title">Период отчета</div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'flex-end',
            }}
          >
            <div className="form-row" style={{ maxWidth: 220 }}>
              <label className="form-label">Дата с</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-row" style={{ maxWidth: 220 }}>
              <label className="form-label">Дата по</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="primary-btn"
              style={{ marginTop: 0 }}
            >
              {isGenerating ? 'Формируется...' : 'Сформировать отчет'}
            </button>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#6b7280' }}>
        В отчет попадают заявки исполнителю (материал, самовывоз и услуга) за выбранный период.
      </p>
    </div>
  );
}

// ===== AllRequestsPage =====

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

      <div
        className="card"
        style={{
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
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
      </div>

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
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: '#eff6ff',
                color: '#1d4ed8',
                marginBottom: 2,
              }}
            >
              Материал
            </div>
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
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: '#ecfdf5',
                color: '#15803d',
                marginBottom: 2,
              }}
            >
              Услуга
            </div>
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
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: '#fffbeb',
                color: '#92400e',
                marginBottom: 2,
              }}
            >
              Самовывоз
            </div>
            <div>{r.date} — {r.quarry}</div>
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
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: '#f5f3ff',
                color: '#6d28d9',
                marginBottom: 2,
              }}
            >
              Карьер
            </div>
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

// ===== App (layout: шапка + сайдбар + контент + плашка) =====

// вспомогательная функция для чтения localStorage
const loadRequestsFromStorage = () => {
  try {
    const stored = localStorage.getItem('baust_requests_v1');
    if (!stored) {
      return {
        driverMaterialRequests: [],
        driverServiceRequests: [],
        quarryRequests: [],
        pickupRequests: [],
      };
    }
    const parsed = JSON.parse(stored);
    return {
      driverMaterialRequests: parsed.driverMaterialRequests || [],
      driverServiceRequests: parsed.driverServiceRequests || [],
      quarryRequests: parsed.quarryRequests || [],
      pickupRequests: parsed.pickupRequests || [],
    };
  } catch (e) {
    console.error('Ошибка чтения localStorage', e);
    return {
      driverMaterialRequests: [],
      driverServiceRequests: [],
      quarryRequests: [],
      pickupRequests: [],
    };
  }
};

function App() {
  // сразу инициализируем стейт из localStorage (ленивая инициализация)
  const [driverMaterialRequests, setDriverMaterialRequests] = useState(
    () => loadRequestsFromStorage().driverMaterialRequests
  );
  const [driverServiceRequests, setDriverServiceRequests] = useState(
    () => loadRequestsFromStorage().driverServiceRequests
  );
  const [quarryRequests, setQuarryRequests] = useState(
    () => loadRequestsFromStorage().quarryRequests
  );
  const [pickupRequests, setPickupRequests] = useState(
    () => loadRequestsFromStorage().pickupRequests
  );

  // сохранение при изменениях
  useEffect(() => {
    try {
      const payload = {
        driverMaterialRequests,
        driverServiceRequests,
        quarryRequests,
        pickupRequests,
      };
      localStorage.setItem('baust_requests_v1', JSON.stringify(payload));
    } catch (e) {
      console.error('Ошибка записи localStorage', e);
    }
  }, [
    driverMaterialRequests,
    driverServiceRequests,
    quarryRequests,
    pickupRequests,
  ]);

return (
  <div className="app-root">
    {/* Шапка */}
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-logo-block">
          <div className="app-header-title">
            <div className="app-header-title-main">Бауштайн.Решения</div>
          </div>
        </div>
      </div>
    </header>

    {/* Контент + сайдбар */}
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-title">Меню</div>
        <nav className="sidebar-nav">
          <NavLink
            to="/requests/drivers"
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            Заявки
          </NavLink>
          <NavLink
            to="/all-requests"
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            Все заявки
          </NavLink>
          <NavLink
            to="/registries/quarries"
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            Реестры карьеров
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            Отчеты
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
            }
          >
            Справка
          </NavLink>
        </nav>
      </aside>

      <main className="main-area">
        <Routes>
          {/* редирект с корня на Заявки исполнителю */}
          <Route
            path="/"
            element={<Navigate to="/requests/drivers" replace />}
          />

          <Route
            path="/requests/*"
            element={
              <RequestsPage
                driverMaterialRequests={driverMaterialRequests}
                setDriverMaterialRequests={setDriverMaterialRequests}
                driverServiceRequests={driverServiceRequests}
                setDriverServiceRequests={setDriverServiceRequests}
                quarryRequests={quarryRequests}
                setQuarryRequests={setQuarryRequests}
                pickupRequests={pickupRequests}
                setPickupRequests={setPickupRequests}
              />
            }
          />

          <Route
            path="/all-requests"
            element={
              <AllRequestsPage
                driverMaterialRequests={driverMaterialRequests}
                driverServiceRequests={driverServiceRequests}
                pickupRequests={pickupRequests}
                quarryRequests={quarryRequests}
              />
            }
          />

          <Route
            path="/registries/quarries"
            element={<QuarryRegistriesPage />}
          />

          <Route
            path="/reports"
            element={
              <ReportsPageInner
                driverMaterialRequests={driverMaterialRequests}
                driverServiceRequests={driverServiceRequests}
                pickupRequests={pickupRequests}
              />
            }
          />

          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </main>
    </div>

    {/* Плашка снизу */}
    <footer className="app-footer">
      <div className="app-footer-inner">
        Приложение еще в разработке. Разработано by Ulis. Почта:{' '}
        <a href="mailto:s3ko2000@yandex.ru">s3ko2000@yandex.ru</a>. 13.01.2026
      </div>
    </footer>
  </div>
);
}
export default App;
