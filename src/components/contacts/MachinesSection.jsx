// src/components/contacts/MachinesSection.jsx
import { useState } from 'react';
import AccordionSection from './AccordionSection';
import INITIAL_MACHINES from '../../data/contacts/machinesMock';

export default function MachinesSection() {
  const [isOpen, setIsOpen] = useState(true);

  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [machineName, setMachineName] = useState('');
  const [machineNotes, setMachineNotes] = useState('');
  const [showMachineForm, setShowMachineForm] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const resetMachineForm = () => {
    setEditingMachineId(null);
    setMachineName('');
    setMachineNotes('');
  };

  const handleSubmitMachine = (e) => {
    e.preventDefault();
    if (!machineName.trim()) return;

    if (editingMachineId) {
      setMachines((prev) =>
        prev.map((m) =>
          m.id === editingMachineId
            ? { ...m, name: machineName.trim(), notes: machineNotes.trim() }
            : m
        )
      );
    } else {
      const newMachine = {
        id: `m_${Date.now()}`,
        name: machineName.trim(),
        notes: machineNotes.trim(),
      };
      setMachines((prev) => [...prev, newMachine]);
    }

    resetMachineForm();
    setShowMachineForm(false);
  };

  const handleEditMachine = (machine) => {
    setEditingMachineId(machine.id);
    setMachineName(machine.name);
    setMachineNotes(machine.notes || '');
    setShowMachineForm(true);
  };

  const handleDeleteMachine = (id) => {
    if (!window.confirm('Удалить технику?')) return;
    setMachines((prev) => prev.filter((m) => m.id !== id));
    if (editingMachineId === id) {
      resetMachineForm();
      setShowMachineForm(false);
    }
  };

  const handleNewMachineClick = () => {
    resetMachineForm();
    setShowMachineForm((prev) => !prev);
  };

  return (
    <AccordionSection
      id="machines"
      title="Техника"
      isOpen={isOpen}
      onToggle={handleToggle}
    >
      {/* Кнопка "Новая форма" */}
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={handleNewMachineClick}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #2563eb',
            background: showMachineForm ? '#eff6ff' : '#ffffff',
            color: '#1d4ed8',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {showMachineForm ? 'Скрыть форму' : 'Новая форма'}
        </button>
      </div>

      {/* Форма добавления/редактирования техники */}
      {showMachineForm && (
        <form
          onSubmit={handleSubmitMachine}
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
            {editingMachineId ? 'Редактировать технику' : 'Добавить технику'}
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ marginBottom: 2 }}>Название</div>
            <input
              type="text"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              placeholder="Экскаватор, погрузчик и т.п."
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
            <div style={{ marginBottom: 2 }}>Комментарий</div>
            <input
              type="text"
              value={machineNotes}
              onChange={(e) => setMachineNotes(e.target.value)}
              placeholder="Например, погрузка в карьере"
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                fontSize: 13,
              }}
            />
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
              {editingMachineId ? 'Сохранить' : 'Добавить'}
            </button>

            {editingMachineId && (
              <button
                type="button"
                onClick={() => {
                  resetMachineForm();
                  setShowMachineForm(false);
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

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: 13,
        }}
      >
        {machines.map((m) => (
          <li
            key={m.id}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
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
                {m.name}
              </div>
              {m.notes && (
                <div style={{ color: '#4b5563' }}>{m.notes}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => handleEditMachine(m)}
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
                onClick={() => handleDeleteMachine(m.id)}
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
            </div>
          </li>
        ))}
      </ul>
    </AccordionSection>
  );
}
