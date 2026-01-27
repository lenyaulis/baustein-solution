// src/pages/MapPage.jsx
import { useState, useMemo, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
} from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import districtsData from '../data/districts';

import { db } from '../firebase/client';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ============== ТВОИ ПОЛНЫЕ ИМЕНА ==============

const INITIAL_CARRIERS = [
  { name: 'Ирек' },
  { name: 'Сергей Крашенинников' },
  { name: 'Алексей Быков' },
  { name: 'Сергей Алексеев' },
  { name: 'Антон Яговцев' },
  { name: 'Доломит' },
  { name: 'Марат ИП Кожевников' },
  { name: 'Виктор Майер' },
  { name: 'Виталий Кайгородов' },
  { name: 'Юрий Ильдыбаев' },
  { name: 'Сергей Калиничев' },
  { name: 'Ренат МираСтрой' },
  { name: 'Артур Маргорян' },
  { name: 'Саша Митяев' },
  { name: 'Ольга' },
  { name: 'Андрей Аникин' },
];

// id районов из GeoJSON:
// 'west-far', 'south-west', 'south', 'far-east-south', 'far-east',
// 'east', 'north-east', 'north', 'center-west',
// 'south-center', 'center-east', 'north-west', 'center-north'

// РАСПРЕДЕЛЕНИЕ ПЕРЕВОЗЧИКОВ ПО РАЙОНАМ (ТОЛЬКО ПОЛНЫЕ ИМЕНА)
const INITIAL_DISTRICTS_BY_NAME = {
  // 1. Западный удаленный сектор -> west-far
  'west-far': [
    'Ирек',
    'Сергей Крашенинников',
    'Алексей Быков',
    'Сергей Алексеев',
    'Антон Яговцев',
    'Доломит',
  ],

  // 2. Юго-Западный сектор -> south-west
  'south-west': [
    'Марат ИП Кожевников',
    'Ирек',
    'Алексей Быков',
    'Сергей Алексеев',
    'Доломит',
    'Виктор Майер',
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Сергей Калиничев',
    'Ренат МираСтрой',
    'Артур Маргорян',
  ],

  // 3. Южный сектор -> south
  south: [
    'Виктор Майер',
    'Алексей Быков',
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Сергей Калиничев',
    'Сергей Алексеев',
    'Доломит',
    'Артур Маргорян',
  ],

  // 4. Дальний Юго-Восток -> far-east-south
  'far-east-south': ['Виталий Кайгородов', 'Доломит'],

  // 5. Дальний Восточный Сектор -> far-east
  'far-east': [
    'Марат ИП Кожевников',
    'Алексей Быков',
    'Юрий Ильдыбаев',
    'Виталий Кайгородов',
    'Сергей Алексеев',
    'Виктор Майер',
    'Доломит',
    'Артур Маргорян',
  ],

  // 6. Восточный сектор -> east
  east: [
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Сергей Алексеев',
    'Алексей Быков',
    'Виктор Майер',
    'Доломит',
    'Ренат МираСтрой',
  ],

  // 7. Северо-Восточный Сектор -> north-east
  'north-east': [
    'Саша Митяев',
    'Доломит',
    'Юрий Ильдыбаев',
    'Виталий Кайгородов',
    'Ольга',
    'Андрей Аникин',
  ],

  // 8. Северный сектор -> north
  north: [
    'Саша Митяев',
    'Ольга',
    'Алексей Быков',
    'Сергей Крашенинников',
    'Юрий Ильдыбаев',
    'Андрей Аникин',
  ],

  // 9. Центр-Запад -> center-west
  'center-west': [
    'Виктор Майер',
    'Алексей Быков',
    'Сергей Крашенинников',
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Доломит',
    'Сергей Алексеев',
    'Ренат МираСтрой',
    'Ирек',
    'Марат ИП Кожевников',
  ],

  // 10. Южный-Центр -> south-center
  'south-center': [
    'Ренат МираСтрой',
    'Марат ИП Кожевников',
    'Сергей Алексеев',
    'Артур Маргорян',
    'Алексей Быков',
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Доломит',
    'Виктор Майер',
  ],

  // 11. Центр-Восток: все перевозчики -> center-east
  'center-east': INITIAL_CARRIERS.map((c) => c.name),

  // 12. Северо-Западный сектор -> north-west
  'north-west': [
    'Сергей Крашенинников',
    'Доломит',
    'Алексей Быков',
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Саша Митяев',
    'Ольга',
    'Виктор Майер',
    'Андрей Аникин',
  ],

  // 13. Центр-Север -> center-north
  'center-north': [
    'Ольга',
    'Сергей Крашенинников',
    'Алексей Быков',
    'Юрий Ильдыбаев',
    'Виталий Кайгородов',
    'Саша Митяев',
    'Виктор Майер',
    'Андрей Аникин',
  ],
};

// =========== ЖЁСТКИЙ ОДНОКРАТНЫЙ РЕСЕТ БАЗЫ ===========

async function runInitOnce() {
  const FLAG_KEY = 'carriers_districts_init_done_RESET_1';

  if (typeof window !== 'undefined') {
    const flag = window.localStorage.getItem(FLAG_KEY);
    if (flag === 'yes') {
      return;
    }
  }

  console.log('[INIT] ЖЁСТКИЙ РЕСЕТ carriers + mapConfig');

  // 1) Удаляем всех из carriers
  const carriersCol = collection(db, 'carriers');
  const snap = await getDocs(carriersCol);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

  // 2) Пересоздаём carriers по INITIAL_CARRIERS
  const nameToId = new Map();
  for (const c of INITIAL_CARRIERS) {
    const name = c.name?.trim();
    if (!name) continue;
    const docRef = await addDoc(carriersCol, {
      name,
      capacityTons: null,
      contacts: [],
      createdAt: new Date(),
    });
    nameToId.set(name, docRef.id);
  }

  console.log('[INIT] carriers recreated, count =', nameToId.size);

  // 3) Собираем districtCarriers
  const districtCarriers = {};
  for (const [districtId, carrierNames] of Object.entries(
    INITIAL_DISTRICTS_BY_NAME,
  )) {
    const ids = [];
    for (const nm of carrierNames) {
      const trimmed = nm.trim();
      const id = nameToId.get(trimmed);
      if (!id) {
        console.warn('[INIT] нет id для имени:', trimmed);
        continue;
      }
      if (!ids.includes(id)) ids.push(id);
    }
    if (ids.length > 0) {
      districtCarriers[districtId] = ids;
    }
  }

  // 4) Полностью перезаписываем mapConfig
  const cfgRef = doc(db, 'districtConfigs', 'mapConfig');
  await setDoc(cfgRef, { districtCarriers });

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(FLAG_KEY, 'yes');
  }

  console.log('[INIT] Готово, жёсткий ресет завершён');
}

// ===== КАРТА И UI (как было) =====

const DISTRICT_COLORS = {
  'north-west': '#f97316',
  north: '#22c55e',
  'north-east': '#a855f7',
  'west-far': '#0ea5e9',
  'south-west': '#eab308',
  south: '#f43f5e',
  'center-west': '#6366f1',
  'center-east': '#10b981',
  east: '#ec4899',
  'south-center': '#14b8a6',
  'far-east': '#8b5cf6',
  'far-east-south': '#f97316',
  'center-north': '#3b82f6',
};

const QUARRIES = [
  {
    id: 1,
    name: 'Северка',
    org: 'ООО «ТД СГК»',
    rock: 'Гранит',
    contact: 'Марья',
    phone: '+7 (905) 805-41-51',
    lat: 56.866768,
    lng: 60.310175,
  },
  {
    id: 2,
    name: 'Горнощитский',
    org: 'ООО «Горнощитский щебень»',
    rock: 'Серпентинит',
    contact: 'Михаил',
    phone: '+7 (912) 256-68-88',
    lat: 56.660317,
    lng: 60.472855,
  },
  {
    id: 3,
    name: 'Шабры',
    org: 'ООО «УралНеруд»',
    rock: 'Гранит',
    contact: 'Татьяна',
    phone: '+7 (912) 244-64-31',
    lat: 56.649352,
    lng: 60.594092,
  },
  {
    id: 4,
    name: 'Седельники',
    org: 'ООО «ТД СЩК»',
    rock: 'Гранит',
    contact: 'Евгений',
    phone: '+7 (953) 602-22-06',
    lat: 56.672124,
    lng: 60.715814,
  },
  {
    id: 5,
    name: 'Шитовской',
    org: 'ООО «УралНеруд»',
    rock: 'Гранит',
    contact: 'Татьяна',
    phone: '+7 (912) 244-64-31',
    lat: 57.112141,
    lng: 60.350318,
  },
  {
    id: 6,
    name: 'Сагра',
    org: 'ООО «УралНеруд»',
    rock: 'Гранит',
    contact: 'Татьяна',
    phone: '+7 (912) 244-64-31',
    lat: 57.05855,
    lng: 60.346091,
  },
  {
    id: 7,
    name: 'Паритет',
    org: 'ООО «Паритет-М»',
    rock: 'Гранит',
    contact: 'Михаил',
    phone: '+7 (950) 200-84-01',
    lat: 57.106353,
    lng: 60.319042,
  },
  {
    id: 8,
    name: 'Светлая речка',
    org: 'ИП Меликян',
    rock: 'Гранит',
    contact: 'Николай',
    phone: '+7 (912) 656-60-26',
    lat: 56.814321,
    lng: 60.353788,
  },
  {
    id: 9,
    name: 'Гора Хрустальная',
    org: 'ООО «Гора Хрустальная»',
    rock: 'Диорит, кварц',
    contact: 'Олег',
    phone: '+7 (963) 855-15-05',
    lat: 56.824641,
    lng: 60.382193,
  },
  {
    id: 10,
    name: 'Билимбай',
    org: 'ООО «ТД УралДоломит»',
    rock: 'Доломит',
    contact: 'Ксения',
    phone: '+7 (912) 605-59-12',
    lat: 56.949387,
    lng: 59.762751,
  },
  {
    id: 11,
    name: 'Косово',
    org: 'ООО «ТД УралДоломит»',
    rock: 'Известняк',
    contact: 'Ксения',
    phone: '+7 (912) 605-59-12',
    lat: 56.95034,
    lng: 59.663298,
  },
  {
    id: 12,
    name: 'Становая',
    org: 'ООО «АС Фарта»',
    rock: 'Песок, гравий',
    contact: 'Евгений',
    phone: '+7 (932) 611-20-15',
    lat: 56.909643,
    lng: 60.994219,
  },
  {
    id: 13,
    name: 'Брусяны',
    org: 'ООО «ИнертСнаб»',
    rock: 'Гранит',
    contact: 'Наталья',
    phone: '+7 (912) 050-92-64',
    lat: 56.649153,
    lng: 61.25842,
  },
  {
    id: 14,
    name: 'Фианит',
    org: 'ООО «Фианит»',
    rock: 'Мрамор',
    contact: 'Марина/Наталья',
    phone: '+7 (912) 289-88-06',
    lat: 56.861031,
    lng: 60.994417,
  },
];

export default function MapPage() {
  const center = [56.838011, 60.597465];

  const [selectedId, setSelectedId] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [carriersLoading, setCarriersLoading] = useState(true);
  const [districtCarriers, setDistrictCarriers] = useState({});
  const [districtConfigLoading, setDistrictConfigLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ЖЁСТКИЙ init
  useEffect(() => {
    runInitOnce().catch((e) => console.error('Init error:', e));
  }, []);

  // Основная загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const carriersSnap = await getDocs(collection(db, 'carriers'));
        const carriersItems = carriersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setCarriers(carriersItems);

        const cfgRef = doc(db, 'districtConfigs', 'mapConfig');
        const cfgSnap = await getDoc(cfgRef);

        if (!cfgSnap.exists()) {
          await setDoc(cfgRef, { districtCarriers: {} });
          setDistrictCarriers({});
        } else {
          const data = cfgSnap.data() || {};
          setDistrictCarriers(data.districtCarriers || {});
        }
      } catch (e) {
        console.error(e);
        alert('Не удалось загрузить данные для карты (перевозчики/районы).');
      } finally {
        setCarriersLoading(false);
        setDistrictConfigLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedDistrict = useMemo(() => {
    if (!selectedId) return null;
    return districtsData.features.find(
      (f) => f.properties && f.properties.id === selectedId,
    );
  }, [selectedId]);

  const carriersForDistrict = useMemo(() => {
    if (!selectedId) return [];
    const ids = districtCarriers[selectedId] || [];
    return carriers.filter((c) => ids.includes(c.id));
  }, [selectedId, districtCarriers, carriers]);

  const getBaseColor = (id) => DISTRICT_COLORS[id] || '#93c5fd';

  const defaultStyleObj = (id) => ({
    color: getBaseColor(id),
    weight: 1.2,
    fillColor: getBaseColor(id),
    fillOpacity: 0.22,
  });

  const highlightStyleObj = (id) => ({
    color: getBaseColor(id),
    weight: 2.5,
    fillColor: getBaseColor(id),
    fillOpacity: 0.4,
  });

  const selectedStyleObj = (id) => ({
    color: getBaseColor(id),
    weight: 2.5,
    fillColor: getBaseColor(id),
    fillOpacity: 0.32,
  });

  const styleFn = (feature) => {
    const id = feature.properties?.id;
    if (!id) return defaultStyleObj(id);
    if (id === selectedId) return selectedStyleObj(id);
    return defaultStyleObj(id);
  };

  const onEachDistrict = (feature, layer) => {
    const id = feature.properties?.id;
    const name = feature.properties?.name;
    if (!id) return;

    const applyDefault = () => {
      if (id !== selectedId) {
        layer.setStyle(defaultStyleObj(id));
      } else {
        layer.setStyle(selectedStyleObj(id));
      }
    };

    layer.on({
      mouseover: () => {
        layer.setStyle(highlightStyleObj(id));
      },
      mouseout: () => {
        applyDefault();
      },
      click: () => {
        setSelectedId((prev) => (prev === id ? null : id));
      },
    });

    if (name) {
      layer.bindTooltip(name, {
        direction: 'center',
        permanent: false,
        opacity: 0.9,
        className: 'district-tooltip',
      });
    }
  };

  const addCarrierToSelectedDistrict = async () => {
    if (!selectedId) {
      alert('Сначала выбери район на карте.');
      return;
    }

    const name = window.prompt('Имя/название нового перевозчика');
    if (!name) return;

    const capacityStr = window.prompt(
      'Грузоподъёмность (тонн), можно оставить пустым',
    );
    const capacityTons = capacityStr
      ? Number.parseFloat(capacityStr.replace(',', '.'))
      : null;

    const phone = window.prompt(
      'Телефон (необязательно, можно оставить пустым)',
    );

    try {
      setSaving(true);

      const carrierDoc = await addDoc(collection(db, 'carriers'), {
        name,
        capacityTons: Number.isFinite(capacityTons) ? capacityTons : null,
        contacts: phone
          ? [
              {
                raw: `${name} ${phone}`.trim(),
                name,
                phones: [phone],
              },
            ]
          : [],
        createdAt: new Date(),
      });

      const newCarrierId = carrierDoc.id;

      const cfgRef = doc(db, 'districtConfigs', 'mapConfig');
      const currentIds = districtCarriers[selectedId] || [];
      const updatedIds = currentIds.includes(newCarrierId)
        ? currentIds
        : [...currentIds, newCarrierId];

      const newDistrictCarriers = {
        ...districtCarriers,
        [selectedId]: updatedIds,
      };

      await updateDoc(cfgRef, { districtCarriers: newDistrictCarriers });

      setDistrictCarriers(newDistrictCarriers);

      setCarriers((prev) => [
        ...prev,
        {
          id: newCarrierId,
          name,
          capacityTons: Number.isFinite(capacityTons) ? capacityTons : null,
          contacts: phone
            ? [
                {
                  raw: `${name} ${phone}`.trim(),
                  name,
                  phones: [phone],
                },
              ]
            : [],
        },
      ]);
    } catch (e) {
      console.error(e);
      alert('Не удалось создать перевозчика и привязать к району.');
    } finally {
      setSaving(false);
    }
  };

  const removeCarrierFromSelectedDistrict = async (carrierId) => {
    if (!selectedId) return;

    const ok = window.confirm(
      'Убрать этого перевозчика из выбранного района?',
    );
    if (!ok) return;

    try {
      setSaving(true);

      const cfgRef = doc(db, 'districtConfigs', 'mapConfig');
      const currentIds = districtCarriers[selectedId] || [];
      const updatedIds = currentIds.filter((id) => id !== carrierId);

      const newDistrictCarriers = {
        ...districtCarriers,
        [selectedId]: updatedIds,
      };

      await updateDoc(cfgRef, { districtCarriers: newDistrictCarriers });

      setDistrictCarriers(newDistrictCarriers);
    } catch (e) {
      console.error(e);
      alert('Не удалось обновить список перевозчиков для района.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-root">
      <h1 className="page-title" style={{ marginBottom: 4 }}>
        Карта карьеров и районов
      </h1>
      <p
        style={{
          marginTop: 0,
          marginBottom: 16,
          fontSize: 13,
          color: '#6b7280',
          maxWidth: 620,
        }}
      >
        На карте отмечены карьеры и районы доставки. Нажимай на район, чтобы
        увидеть привязанных перевозчиков и добавлять новых прямо отсюда.
      </p>

      <div
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
          marginBottom: 16,
        }}
      >
        <MapContainer
          center={center}
          zoom={9}
          style={{ height: '520px', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON data={districtsData} style={styleFn} onEachFeature={onEachDistrict} />

          {QUARRIES.map((q) => (
            <Marker key={q.id} position={[q.lat, q.lng]}>
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {q.name}
                  </div>

                  {q.org && <div>{q.org}</div>}
                  {q.rock && <div>{q.rock}</div>}

                  {(q.contact || q.phone) && (
                    <div style={{ marginTop: 2 }}>
                      {q.contact}
                      {q.phone ? `, ${q.phone}` : ''}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 4,
                      color: '#6b7280',
                      fontSize: 12,
                    }}
                  >
                    {q.lat.toFixed(5)}, {q.lng.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div
        style={{
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 12,
          background: '#f9fafb',
          marginBottom: 12,
        }}
      >
        {selectedDistrict ? (
          <>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
                color: '#111827',
              }}
            >
              Район: {selectedDistrict.properties.name}
            </div>

            {districtConfigLoading || carriersLoading ? (
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Загружаем данные...
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={addCarrierToSelectedDistrict}
                  disabled={saving}
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#22c55e',
                    color: 'white',
                    cursor: saving ? 'default' : 'pointer',
                    marginBottom: 8,
                  }}
                >
                  Добавить перевозчика в этот район
                </button>

                {carriersForDistrict.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    Для этого района пока нет привязанных перевозчиков.
                  </div>
                ) : (
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      fontSize: 13,
                    }}
                  >
                    {carriersForDistrict.map((c) => {
                      const phone =
                        c.contacts && c.contacts[0]?.phones?.[0]
                          ? c.contacts[0].phones[0]
                          : null;

                      return (
                        <li
                          key={c.id}
                          style={{
                            padding: '6px 8px',
                            borderRadius: 8,
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            marginBottom: 6,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 2 }}>
                              {c.name}
                            </div>
                            <div
                              style={{ color: '#4b5563', fontSize: 12 }}
                            >
                              Объём:{' '}
                              {c.capacityTons
                                ? `${c.capacityTons} т`
                                : 'не указан'}
                              {phone ? ` • ${phone}` : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeCarrierFromSelectedDistrict(c.id)
                            }
                            disabled={saving}
                            style={{
                              fontSize: 11,
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid #ef4444',
                              background: '#fee2e2',
                              color: '#b91c1c',
                              cursor: saving ? 'default' : 'pointer',
                            }}
                          >
                            Удалить из района
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            Выбери район на карте, чтобы увидеть и настроить перевозчиков,
            которые могут доставить туда материал.
          </div>
        )}
      </div>
    </div>
  );
}
