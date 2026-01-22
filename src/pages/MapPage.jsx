// src/pages/MapPage.jsx
import { useState, useMemo } from 'react';
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

// цвета для каждого района по id
const DISTRICT_COLORS = {
  'north-west': '#f97316', // оранжевый
  north: '#22c55e', // зелёный
  'north-east': '#a855f7', // фиолетовый
  'west-far': '#0ea5e9', // голубой
  'south-west': '#eab308', // жёлтый
  south: '#f43f5e', // розовый
  'center-west': '#6366f1', // синий
  'center-east': '#10b981', // бирюзовый
  east: '#ec4899',
  'south-center': '#14b8a6',
  'far-east': '#8b5cf6',
  'far-east-south': '#f97316',
  'center-north': '#3b82f6',
};

// карьеры с дополнительной инфой
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

// временный список исполнителей – потом заменишь на реальные данные
const EXECUTERS = [
  {
    id: 'drv-1',
    name: 'Иванов Сергей, самосвал',
    notes: 'Может возить в северные районы',
    districtIds: ['north-west', 'center-north', 'north'],
  },
  {
    id: 'drv-2',
    name: 'ООО «УралЛогистик»',
    notes: 'Работают по всему городу и ближайшим пригородам',
    districtIds: [
      'north-west',
      'north',
      'north-east',
      'west-far',
      'south-west',
      'south',
      'center-west',
      'center-east',
      'east',
      'south-center',
      'far-east',
      'far-east-south',
      'center-north',
    ],
  },
  {
    id: 'drv-3',
    name: 'Петров Андрей, манипулятор',
    notes: 'Восток и Юго‑Восток',
    districtIds: ['east', 'far-east', 'far-east-south'],
  },
];

export default function MapPage() {
  const center = [56.838011, 60.597465];

  const [selectedId, setSelectedId] = useState(null);

  const selectedDistrict = useMemo(() => {
    if (!selectedId) return null;
    return districtsData.features.find(
      (f) => f.properties && f.properties.id === selectedId
    );
  }, [selectedId]);

  const executersForDistrict = useMemo(() => {
    if (!selectedId) return [];
    return EXECUTERS.filter((ex) => ex.districtIds.includes(selectedId));
  }, [selectedId]);

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
        На карте отмечены карьеры и районы доставки. Наведи на район, чтобы
        подсветить его, а кликни по району, чтобы увидеть исполнителей, которые
        сюда доставляют материал.
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
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON
            data={districtsData}
            style={styleFn}
            onEachFeature={onEachDistrict}
          />

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

            {executersForDistrict.length === 0 ? (
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Для этого района пока не указаны исполнители.
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
                {executersForDistrict.map((ex) => (
                  <li
                    key={ex.id}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 8,
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                      {ex.name}
                    </div>
                    {ex.notes && (
                      <div style={{ color: '#4b5563' }}>{ex.notes}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            Выбери район на карте, чтобы увидеть исполнителей, которые могут
            доставить туда материал.
          </div>
        )}
      </div>
    </div>
  );
}
