// src/pages/AdminResetMap.jsx
import { useState } from 'react';
import { db } from '../firebase/client';
import {
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
  setDoc,
} from 'firebase/firestore';

// ИМЕНА – те же, что и на карте
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

// РАСПРЕДЕЛЕНИЕ ПО РАЙОНАМ
const INITIAL_DISTRICTS_BY_NAME = {
  'west-far': [
    'Ирек',
    'Сергей Крашенинников',
    'Алексей Быков',
    'Сергей Алексеев',
    'Антон Яговцев',
    'Доломит',
  ],
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
  'far-east-south': ['Виталий Кайгородов', 'Доломит'],
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
  east: [
    'Виталий Кайгородов',
    'Юрий Ильдыбаев',
    'Сергей Алексеев',
    'Алексей Быков',
    'Виктор Майер',
    'Доломит',
    'Ренат МираСтрой',
  ],
  'north-east': [
    'Саша Митяев',
    'Доломит',
    'Юрий Ильдыбаев',
    'Виталий Кайгородов',
    'Ольга',
    'Андрей Аникин',
  ],
  north: [
    'Саша Митяев',
    'Ольга',
    'Алексей Быков',
    'Сергей Крашенинников',
    'Юрий Ильдыбаев',
    'Андрей Аникин',
  ],
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
  'center-east': INITIAL_CARRIERS.map((c) => c.name),
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

export default function AdminResetMap() {
  const [status, setStatus] = useState('Готов к сбросу');

  const handleReset = async () => {
    if (!window.confirm('Точно полностью пересобрать перевозчиков и районы?')) {
      return;
    }

    try {
      setStatus('Удаляем старые данные...');
      // 1) удалить всех из carriers
      const carriersCol = collection(db, 'carriers');
      const snap = await getDocs(carriersCol);
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

      setStatus('Создаём перевозчиков...');
      // 2) создать новых из INITIAL_CARRIERS
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

      setStatus('Заполняем районы...');
      // 3) собрать districtCarriers
      const districtCarriers = {};
      for (const [districtId, carrierNames] of Object.entries(
        INITIAL_DISTRICTS_BY_NAME,
      )) {
        const ids = [];
        for (const nm of carrierNames) {
          const trimmed = nm.trim();
          const id = nameToId.get(trimmed);
          if (!id) {
            console.warn('[RESET] нет id для имени:', trimmed);
            continue;
          }
          if (!ids.includes(id)) ids.push(id);
        }
        if (ids.length > 0) {
          districtCarriers[districtId] = ids;
        }
      }

      // 4) перезаписать mapConfig
      const cfgRef = doc(db, 'districtConfigs', 'mapConfig');
      await setDoc(cfgRef, { districtCarriers });

      setStatus('Готово! Можно идти смотреть карту.');
    } catch (e) {
      console.error(e);
      setStatus('Ошибка, смотри консоль');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Админ: сброс карты</h1>
      <p style={{ marginBottom: 12 }}>
        Кнопка удалит всех перевозчиков в Firestore и создаст их заново по
        зашитому списку, а также заново заполнит районы.
      </p>
      <button
        type="button"
        onClick={handleReset}
        style={{
          padding: '8px 14px',
          borderRadius: 8,
          border: 'none',
          background: '#ef4444',
          color: 'white',
          cursor: 'pointer',
          marginBottom: 12,
        }}
      >
        Полный сброс и пересоздание
      </button>
      <div style={{ fontSize: 13, color: '#4b5563' }}>{status}</div>
    </div>
  );
}
