// src/components/contacts/CarriersSection.jsx
import { useState, useMemo } from 'react';
import AccordionSection from './AccordionSection';
import FilterChip from './FilterChip';
import { INITIAL_CARRIERS, CAPACITIES } from '../../data/contacts/carriersMock';
import { groupCarriersByCapacity } from '../../utils/groupCarriersByCapacity';

export default function CarriersSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCapacity, setSelectedCapacity] = useState(null);

  const [carriers, setCarriers] = useState(INITIAL_CARRIERS);

  const [editingCarrierId, setEditingCarrierId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCapacities, setFormCapacities] = useState([]);
  const [showCarrierForm, setShowCarrierForm] = useState(false);

  const carriersByCapacity = useMemo(
    () => groupCarriersByCapacity(carriers),
    [carriers]
  );

  const handleToggle = () => setIsOpen((prev) => !prev);

  // CRUD

  const resetCarrierForm = () => {
    setEditingCarrierId(null);
    setFormName('');
    setFormPhone('');
    setFormCapacities([]);
  };

  const handleSubmitCarrier = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCarrierId) {
      setCarriers((prev) =>
        prev.map((c) =>
          c.id === editingCarrierId
            ? {
                ...c,
                name: formName.trim(),
                phone: formPhone.trim(),
                capacities: formCapacities,
              }
            : c
        )
      );
    } else {
      const newCarrier = {
        id: `c_${Date.now()}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        capacities: formCapacities,
      };
      setCarriers((prev) => [...prev, newCarrier]);
    }

    resetCarrierForm();
    setShowCarrierForm(false);
  };

  const handleEditCarrier = (carrier) => {
    setEditingCarrierId(carrier.id);
    setFormName(carrier.name);
    setFormPhone(carrier.phone || '');
    setFormCapacities(carrier.capacities || []);
    setShowCarrierForm(true);
  };

  const handleDeleteCarrier = (id) => {
    if (!window.confirm('Удалить перевозчика?')) return;
    setCarriers((prev) => prev.filter((c) => c.id !== id));
    if (editingCarrierId === id) {
      resetCarrierForm();
      setShowCarrierForm(false);
    }
  };

  const toggleCapacityInForm = (cap) => {
    setFormCapacities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const handleNewCarrierClick = () => {
    resetCarrierForm();
    setShowCarrierForm((prev) => !prev);
  };

  return (
    <AccordionSection
      id="carriers"
      title="Перевозчики"
      isOpen={isOpen}
      onToggle={handleToggle}
    >
      {/* Кнопка "Новая форма" */}
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={handleNewCarrierClick}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #2563eb',
            background: showCarrierForm ? '#eff6ff' : '#ffffff',
            color: '#1d4ed8',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {showCarrierForm ? 'Скрыть форму' : 'Новая форма'}
        </button>
      </div>

      {/* Форма добавления/редактирования перевозчика */}
      {showCarrierForm && (
        <form
          onSubmit={handleSubmitCarrier}
          style={{
            marginBottom: 12,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#f9fafb',
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {editingCarrierId ? 'Редактировать перевозчика' : 'Добавить перевозчика'}
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ marginBottom: 2 }}>Имя / организация</div>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Например, Быков или Мирастрой"
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ marginBottom: 2 }}>Телефон</div>
            <input
              type="text"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="+7 ..."
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>Объёмы машин (тонн)</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CAPACITIES.map((cap) => {
                const active = formCapacities.includes(cap);
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => toggleCapacityInForm(cap)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      border: active ? '1px solid #2563eb' : '1px solid #d1d5db',
                      background: active ? '#eff6ff' : '#ffffff',
                      color: active ? '#1d4ed8' : '#374151',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {cap} т
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="submit"
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {editingCarrierId ? 'Сохранить' : 'Добавить'}
            </button>

            {editingCarrierId && (
              <button
                type="button"
                onClick={() => {
                  resetCarrierForm();
                  setShowCarrierForm(false);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#374151',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      )}

      {/* Фильтр по объёму */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <FilterChip
          label="Все объёмы"
          active={selectedCapacity === null}
          onClick={() => setSelectedCapacity(null)}
        />
        {CAPACITIES.map((cap) => (
          <FilterChip
            key={cap}
            label={`${cap} т`}
            active={selectedCapacity === cap}
            onClick={() => setSelectedCapacity(cap)}
          />
        ))}
      </div>

      {CAPACITIES.map((cap) => {
        const list = carriersByCapacity[cap] || [];
        if (list.length === 0) return null;
        if (selectedCapacity !== null && selectedCapacity !== cap) return null;

        return (
          <div
            key={cap}
            style={{
              marginBottom: 10,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Машина {cap} тонн
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                fontSize: 13,
              }}
            >
              {list.map((c) => (
                <li
                  key={c.id}
                  style={{
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span>
                    • {c.name}
                    {c.phone ? `, ${c.phone}` : ''}
                  </span>

                  <span style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => handleEditCarrier(c)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCarrier(c.id)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 999,
                        border: '1px solid #f97373',
                        background: '#fef2f2',
                        color: '#b91c1c',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      Удалить
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </AccordionSection>
  );
}
