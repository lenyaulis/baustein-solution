// src/pages/RequestsPage.jsx
import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
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
  Северка: 'marya_avtor_zhizni',
  'Шабры (УралНеруд)': 'Tatuna111',
  'Шитовской (УралНеруд)': 'Tatuna111',
  'Билимбай (УралДоломит)': 'KseniiaOk',
  Паритет: 'koptyakизм',
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
    data.countType === 'hours' ? `${data.hours} часов` : `${data.trips} рейс`;

  const priceLine =
    data.unit === 'часов' ? `${data.price} р/час` : `${data.price} р/рейс`;

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
  addDriverMaterial,
  addDriverService,
  addQuarry,
  addPickup,
  removeRequest,
  updateRequest,
}) {
  const [driverMode, setDriverMode] = useState('material');

  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [editingMaterialData, setEditingMaterialData] = useState(null);

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingServiceData, setEditingServiceData] = useState(null);

  const [editingPickupId, setEditingPickupId] = useState(null);
  const [editingPickupData, setEditingPickupData] = useState(null);

  const [busyId, setBusyId] = useState(null);
  const [busyType, setBusyType] = useState(null); // 'delete' | 'update' | 'create' | null

  const [target, setTarget] = useState('drivers');
  const navigate = useNavigate();

  const handleGoDrivers = () => {
    setTarget('drivers');
    navigate('/requests/drivers');
  };

  const handleGoQuarries = () => {
    setTarget('quarries');
    navigate('/requests/quarries');
  };

  // материальщики
  const deleteDriverMaterial = async (id) => {
    const ok = window.confirm('Удалить эту заявку?');
    if (!ok) return;

    try {
      setBusyId(id);
      setBusyType('delete');
      await removeRequest(id);
      setEditingMaterialId(null);
      setEditingMaterialData(null);
    } catch (e) {
      alert('Не удалось удалить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleCreateMaterial = async (payload) => {
    try {
      setBusyId(null);
      setBusyType('create');
      await addDriverMaterial(payload);
    } catch (e) {
      alert('Не удалось сохранить заявку (облако)');
    } finally {
      setBusyType(null);
    }
  };

  const handleUpdateMaterial = async (updated) => {
    try {
      setBusyId(updated.id);
      setBusyType('update');
      await updateRequest(updated.id, updated);
      setDriverMaterialRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
      );
      setEditingMaterialId(null);
      setEditingMaterialData(null);
    } catch (e) {
      alert('Не удалось обновить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleEditMaterial = (req) => {
    setEditingMaterialId(req.id);
    setEditingMaterialData(req);
  };

  const handleCopyMaterial = (req) => {
    const text = formatDriverMaterialText(req);
    copyTextToClipboard(text);
  };

  // услуги
  const deleteDriverService = async (id) => {
    const ok = window.confirm('Удалить эту заявку?');
    if (!ok) return;

    try {
      setBusyId(id);
      setBusyType('delete');
      await removeRequest(id);
      setEditingServiceId(null);
      setEditingServiceData(null);
    } catch (e) {
      alert('Не удалось удалить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleCreateService = async (payload) => {
    try {
      setBusyId(null);
      setBusyType('create');
      await addDriverService(payload);
    } catch (e) {
      alert('Не удалось сохранить заявку (облако)');
    } finally {
      setBusyType(null);
    }
  };

  const handleUpdateService = async (updated) => {
    try {
      setBusyId(updated.id);
      setBusyType('update');
      await updateRequest(updated.id, updated);
      setDriverServiceRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
      );
      setEditingServiceId(null);
      setEditingServiceData(null);
    } catch (e) {
      alert('Не удалось обновить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleEditService = (req) => {
    setEditingServiceId(req.id);
    setEditingServiceData(req);
  };

  const handleCopyService = (req) => {
    const text = formatDriverServiceText(req);
    copyTextToClipboard(text);
  };

  // самовывоз
  const deletePickup = async (id) => {
    const ok = window.confirm('Удалить эту заявку?');
    if (!ok) return;

    try {
      setBusyId(id);
      setBusyType('delete');
      await removeRequest(id);
      setEditingPickupId(null);
      setEditingPickupData(null);
    } catch (e) {
      alert('Не удалось удалить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleCreatePickup = async (payload) => {
    try {
      setBusyId(null);
      setBusyType('create');
      await addPickup(payload);
    } catch (e) {
      alert('Не удалось сохранить заявку (облако)');
    } finally {
      setBusyType(null);
    }
  };

  const handleUpdatePickup = async (updated) => {
    try {
      setBusyId(updated.id);
      setBusyType('update');
      await updateRequest(updated.id, updated);
      setPickupRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
      );
      setEditingPickupId(null);
      setEditingPickupData(null);
    } catch (e) {
      alert('Не удалось обновить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleEditPickup = (req) => {
    setEditingPickupId(req.id);
    setEditingPickupData(req);
  };

  // заявки карьерам
  const deleteQuarryRequest = async (id) => {
    const ok = window.confirm('Удалить эту заявку?');
    if (!ok) return;

    try {
      setBusyId(id);
      setBusyType('delete');
      await removeRequest(id);
    } catch (e) {
      alert('Не удалось удалить заявку (облако)');
    } finally {
      setBusyId(null);
      setBusyType(null);
    }
  };

  const handleCreateQuarryRequest = async (payload) => {
    try {
      setBusyId(null);
      setBusyType('create');
      await addQuarry(payload);
    } catch (e) {
      alert('Не удалось сохранить заявку (облако)');
    } finally {
      setBusyType(null);
    }
  };

  const handleCopyQuarryRequest = (q) => {
    const text = formatQuarryRequestText(q);
    copyTextToClipboard(text);
  };

  const hasTelegramForExecutor = (executor) =>
    Boolean(EXECUTOR_TELEGRAM[executor]);

  const hasTelegramForQuarry = (quarryName) =>
    Boolean(QUARRY_TELEGRAM[quarryName]);

  return (
    <div className="page">
      {/* верхние табы: Водителям / Карьерам */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        <button
          type="button"
          className={'tab' + (target === 'drivers' ? ' tab-active' : '')}
          onClick={handleGoDrivers}
        >
          Водителям
        </button>
        <button
          type="button"
          className={'tab' + (target === 'quarries' ? ' tab-active' : '')}
          onClick={handleGoQuarries}
        >
          Карьерам
        </button>
      </div>

      <Routes>
        <Route
          path="drivers"
          element={
            <>
              <div className="page-header">
                <h1 className="page-title">Заявки для водителей</h1>
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={
                    'tab' +
                    (driverMode === 'material' ? ' tab-active' : '')
                  }
                  onClick={() => setDriverMode('material')}
                >
                  Материал
                </button>
                <button
                  type="button"
                  className={
                    'tab' +
                    (driverMode === 'service' ? ' tab-active' : '')
                  }
                  onClick={() => setDriverMode('service')}
                >
                  Услуга
                </button>
                <button
                  type="button"
                  className={
                    'tab' +
                    (driverMode === 'pickup' ? ' tab-active' : '')
                  }
                  onClick={() => setDriverMode('pickup')}
                >
                  Самовывоз
                </button>
              </div>

              {driverMode === 'material' && (
                <div className="page-grid">
                  <Card title="Новая заявка (материал)">
                    <DriverForm
                      executors={EXECUTORS}
                      onSubmit={handleCreateMaterial}
                      editingId={editingMaterialId}
                      initialData={editingMaterialData}
                      onUpdate={handleUpdateMaterial}
                      onCancelEdit={() => {
                        setEditingMaterialId(null);
                        setEditingMaterialData(null);
                      }}
                    />
                  </Card>

                  <Card title="Список заявок (материал)">
                    <DriverMaterialList
                      items={driverMaterialRequests}
                      onCopy={handleCopyMaterial}
                      onEdit={handleEditMaterial}
                      onDelete={deleteDriverMaterial}
                      onOpenTelegram={(executor) =>
                        openTelegram(EXECUTOR_TELEGRAM[executor])
                      }
                      hasTelegram={hasTelegramForExecutor}
                      busyId={busyId}
                      busyType={busyType}
                    />
                  </Card>
                </div>
              )}

              {driverMode === 'service' && (
                <div className="page-grid">
                  <Card title="Новая заявка (услуга)">
                    <ServiceForm
                      executors={EXECUTORS}
                      onSubmit={handleCreateService}
                      editingId={editingServiceId}
                      initialData={editingServiceData}
                      onUpdate={handleUpdateService}
                      onCancelEdit={() => {
                        setEditingServiceId(null);
                        setEditingServiceData(null);
                      }}
                    />
                  </Card>

                  <Card title="Список заявок (услуга)">
                    <DriverServiceList
                      items={driverServiceRequests}
                      onCopy={handleCopyService}
                      onEdit={handleEditService}
                      onDelete={deleteDriverService}
                      onOpenTelegram={(executor) =>
                        openTelegram(EXECUTOR_TELEGRAM[executor])
                      }
                      hasTelegram={hasTelegramForExecutor}
                      busyId={busyId}
                      busyType={busyType}
                    />
                  </Card>
                </div>
              )}

              {driverMode === 'pickup' && (
                <div className="page-grid">
                  <Card title="Новая заявка (самовывоз)">
                    <PickupForm
                      onSubmit={handleCreatePickup}
                      editingId={editingPickupId}
                      initialData={editingPickupData}
                      onUpdate={handleUpdatePickup}
                      onCancelEdit={() => {
                        setEditingPickupId(null);
                        setEditingPickupData(null);
                      }}
                    />
                  </Card>

                  <Card title="Список заявок (самовывоз)">
                    <PickupList
                      items={pickupRequests}
                      onEdit={handleEditPickup}
                      onDelete={deletePickup}
                      busyId={busyId}
                      busyType={busyType}
                    />
                  </Card>
                </div>
              )}
            </>
          }
        />

        <Route
          path="quarries"
          element={
            <>
              <div className="page-header">
                <h1 className="page-title">Заявки карьерам</h1>
              </div>

              <div className="page-grid">
                <Card title="Новая заявка в карьер">
                  <QuarryForm onSubmit={handleCreateQuarryRequest} />
                </Card>

                <Card title="Список заявок в карьеры">
                  <QuarryRequestList
                    items={quarryRequests}
                    onCopy={handleCopyQuarryRequest}
                    onDelete={deleteQuarryRequest}
                    onOpenTelegram={(quarryName) =>
                      openTelegram(QUARRY_TELEGRAM[quarryName])
                    }
                    hasTelegram={hasTelegramForQuarry}
                    busyId={busyId}
                    busyType={busyType}
                  />
                </Card>
              </div>
            </>
          }
        />

        <Route
          path="*"
          element={<NavLink to="/requests/drivers">К заявкам</NavLink>}
        />
      </Routes>
    </div>
  );
}

export default RequestsPage;
