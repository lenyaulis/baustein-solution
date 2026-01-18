// src/pages/RequestsPage.jsx
import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import DriverForm from '../components/DriverForm';
import ServiceForm from '../components/ServiceForm';
import QuarryForm from '../components/QuarryForm';
import PickupForm from '../components/PickupForm';
import Card from '../components/ui/Card';
import DriverMaterialList from '../components/requests/DriverMaterialList';
import DriverServiceList from '../components/requests/DriverServiceList';
import PickupList from '../components/requests/PickupList';
import QuarryRequestList from '../components/requests/QuarryRequestList';

// контакты
const QUARRY_TELEGRAM = {
  'Северка': 'marya_avtor_zhizni',
  'Шабры (УралНеруд)': 'Tatuna111',
  'Шитовской (УралНеруд)': 'Tatuna111',
  'Билимбай (УралДоломит)': 'KseniiaOk',
  'Паритет': 'koptyakизм',
};

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

// форматирующие функции
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

  const hasExecutorTelegram = (name) => !!EXECUTOR_TELEGRAM[name];
  const hasQuarryTelegram = (name) => !!QUARRY_TELEGRAM[name];

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

  const handleCopyMaterial = (r) => {
    copyTextToClipboard(formatDriverMaterialText(r));
  };

  const handleCopyService = (r) => {
    copyTextToClipboard(formatDriverServiceText(r));
  };

  const handleCopyQuarry = (q) => {
    copyTextToClipboard(formatQuarryRequestText(q));
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
                  <DriverMaterialList
                    items={driverMaterialRequests}
                    onCopy={handleCopyMaterial}
                    onEdit={(r) => {
                      setEditingMaterialId(r.id);
                      setEditingMaterialData(r);
                    }}
                    onDelete={deleteDriverMaterial}
                    onOpenTelegram={openExecutorTelegram}
                    hasTelegram={hasExecutorTelegram}
                  />
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
                  <DriverServiceList
                    items={driverServiceRequests}
                    onCopy={handleCopyService}
                    onEdit={(r) => {
                      setEditingServiceId(r.id);
                      setEditingServiceData(r);
                    }}
                    onDelete={deleteDriverService}
                    onOpenTelegram={openExecutorTelegram}
                    hasTelegram={hasExecutorTelegram}
                  />
                </>
              )}

              {driverMode === 'pickup' && (
                <>
                  <PickupForm
                    mode={editingPickupId ? 'edit' : 'create'}
                    initialValues={editingPickupData || undefined}
                    onAdd={handleAddPickup}
                  />
                  <PickupList
                    items={pickupRequests}
                    onEdit={(r) => {
                      setEditingPickupId(r.id);
                      setEditingPickupData(r);
                    }}
                    onDelete={deletePickup}
                  />
                </>
              )}
            </>
          }
        />

        <Route
          path="quarries"
          element={
            <Card style={{ padding: '12px 10px', gap: 8 }}>
              <h2 className="card-title">Заявка карьера</h2>
              <QuarryForm
                onAdd={(req) => setQuarryRequests((prev) => [...prev, req])}
              />
              <QuarryRequestList
                items={quarryRequests}
                onCopy={handleCopyQuarry}
                onDelete={deleteQuarryRequest}
                onOpenTelegram={openTelegramChatQuarry}
                hasTelegram={hasQuarryTelegram}
              />
            </Card>
          }
        />
      </Routes>
    </div>
  );
}

export default RequestsPage;
